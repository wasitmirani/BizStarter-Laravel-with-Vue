<?php

use App\Models\OfficialSource;
use App\Models\Program;
use App\Models\SourceSnapshot;
use App\Models\University;
use App\Models\User;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;

function syncUser(): User
{
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    return $user;
}

function syncUniversity(array $attributes = []): University
{
    return University::create(array_merge([
        'name' => 'Technical University of Munich',
        'slug' => 'technical-university-of-munich',
        'type' => 'public',
        'country' => 'DE',
        'city' => 'Munich',
        'region' => 'Bavaria',
        'official_website' => 'https://www.tum.de',
    ], $attributes));
}

function syncSource(University $university, array $attributes = []): OfficialSource
{
    return OfficialSource::create(array_merge([
        'name' => $university->name.' — Programme catalogue',
        'url' => 'https://www.tum.de/en/studies/degree-programs',
        'type' => 'university',
        'university_id' => $university->id,
    ], $attributes));
}

it('checks an official source and stores a snapshot', function () {
    syncUser();
    $university = syncUniversity();
    $source = syncSource($university);

    Http::fake([
        '*' => Http::response(
            '<html><head><title>Master’s programmes</title><meta name="description" content="Official catalogue"></head><body>Programmes</body></html>',
            200,
        ),
    ]);

    $this->postJson('/api/v1/catalog/sync')
        ->assertOk()
        ->assertJsonPath('result.checked', 1)
        ->assertJsonPath('result.ok', 1)
        ->assertJsonPath('result.failed', 0)
        ->assertJsonPath('result.sources.0.status', 'ok')
        ->assertJsonPath('result.sources.0.http_status', 200)
        ->assertJsonPath('result.sources.0.changed', false);

    $source->refresh();

    expect($source->last_status)->toBe('ok')
        ->and($source->last_checked_at)->not->toBeNull()
        ->and(SourceSnapshot::where('official_source_id', $source->id)->count())->toBe(1);

    $snapshot = SourceSnapshot::where('official_source_id', $source->id)->first();
    expect($snapshot->payload_excerpt)->toContain('Master’s programmes')
        ->and($snapshot->payload_excerpt)->toContain('Official catalogue')
        ->and($snapshot->changed)->toBeFalse();
});

it('flags a source as changed when the content hash differs', function () {
    syncUser();
    $university = syncUniversity();
    $source = syncSource($university);

    Http::fake([
        '*' => Http::sequence()
            ->push('<html><head><title>Version one</title></head></html>', 200)
            ->push('<html><head><title>Version two</title></head></html>', 200),
    ]);

    $this->postJson('/api/v1/catalog/sync')->assertOk();
    $this->postJson('/api/v1/catalog/sync')
        ->assertOk()
        ->assertJsonPath('result.sources.0.changed', true);

    $snapshots = SourceSnapshot::where('official_source_id', $source->id)->orderBy('id')->get();

    expect($snapshots)->toHaveCount(2)
        ->and($snapshots->last()->changed)->toBeTrue()
        ->and($snapshots->first()->content_hash)->not->toBe($snapshots->last()->content_hash);
});

it('records http and connection failures without throwing', function () {
    syncUser();
    $university = syncUniversity();
    $missing = syncSource($university);
    $offline = syncSource($university, ['url' => 'https://www.tum.de/offline']);

    Http::fake([
        'https://www.tum.de/en/studies/degree-programs' => Http::response('Not found', 404),
        'https://www.tum.de/offline' => fn () => throw new ConnectionException('Connection refused'),
    ]);

    $response = $this->postJson('/api/v1/catalog/sync')->assertOk();

    expect($response->json('result.checked'))->toBe(2)
        ->and($response->json('result.ok'))->toBe(0)
        ->and($response->json('result.failed'))->toBe(2);

    $statuses = collect($response->json('result.sources'))->pluck('status', 'id');

    expect($statuses[$missing->id])->toBe('http_404')
        ->and($statuses[$offline->id])->toBe('error')
        ->and($missing->refresh()->last_status)->toBe('http_404')
        ->and($offline->refresh()->last_status)->toBe('error');
});

it('blocks non-public source urls without making a request', function () {
    syncUser();
    $university = syncUniversity();
    $source = syncSource($university, ['url' => 'http://localhost/internal-catalogue']);

    Http::fake();

    $this->postJson('/api/v1/catalog/sync')
        ->assertOk()
        ->assertJsonPath('result.checked', 1)
        ->assertJsonPath('result.failed', 1)
        ->assertJsonPath('result.sources.0.status', 'blocked');

    Http::assertNothingSent();
    expect($source->refresh()->last_status)->toBe('blocked');
});

it('can limit a sync to one university', function () {
    syncUser();
    $munich = syncUniversity();
    $budapest = syncUniversity([
        'name' => 'Eötvös Loránd University',
        'slug' => 'eotvos-lorand-university',
        'country' => 'HU',
        'city' => 'Budapest',
        'region' => 'Central Hungary',
        'official_website' => 'https://www.elte.hu',
    ]);

    syncSource($munich);
    $other = syncSource($budapest, ['url' => 'https://www.elte.hu/en/find-degree-program']);

    Http::fake(['*' => Http::response('<html><head><title>Programmes</title></head></html>', 200)]);

    $this->postJson('/api/v1/catalog/sync', ['university_id' => $munich->id])
        ->assertOk()
        ->assertJsonPath('result.checked', 1)
        ->assertJsonPath('result.sources.0.university_id', $munich->id);

    expect($other->refresh()->last_checked_at)->toBeNull();
});

it('filters the catalog by country and exposes country facets', function () {
    syncUser();

    $germany = syncUniversity();
    $hungary = syncUniversity([
        'name' => 'Eötvös Loránd University',
        'slug' => 'eotvos-lorand-university',
        'country' => 'HU',
        'city' => 'Budapest',
        'region' => 'Central Hungary',
    ]);
    syncUniversity([
        'name' => 'University of Milan',
        'slug' => 'university-of-milan',
        'country' => 'IT',
        'city' => 'Milan',
        'region' => 'Lombardy',
    ]);

    Program::create([
        'university_id' => $hungary->id,
        'title' => 'MSc in Computer Science',
        'slug' => 'msc-computer-science-elte',
        'subject_area' => 'Computer Science',
        'language' => 'en',
        'verification_status' => 'unverified',
        'is_sample' => false,
    ]);

    $response = $this->getJson('/api/v1/universities?country=DE')->assertOk();

    $response->assertJsonPath('result.meta.total', 1)
        ->assertJsonPath('result.universities.0.id', $germany->id)
        ->assertJsonPath('result.universities.0.country', 'DE')
        ->assertJsonPath('result.universities.0.country_name', 'Germany');

    $countries = collect($response->json('result.facets.countries'))->pluck('name', 'code');

    expect($countries['DE'])->toBe('Germany')
        ->and($countries['HU'])->toBe('Hungary')
        ->and($countries['IT'])->toBe('Italy');

    $this->getJson('/api/v1/programs?country=HU')
        ->assertOk()
        ->assertJsonPath('result.meta.total', 1)
        ->assertJsonPath('result.programs.0.title', 'MSc in Computer Science');
});

it('requires authentication to run a sync', function () {
    $this->postJson('/api/v1/catalog/sync')->assertUnauthorized();
});
