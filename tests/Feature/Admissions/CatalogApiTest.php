<?php

use App\Models\Program;
use App\Models\University;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

function catalogUser(): User
{
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    return $user;
}

function catalogUniversity(array $attributes): University
{
    return University::create(array_merge([
        'slug' => str($attributes['name'])->slug()->value(),
        'type' => 'public',
        'official_website' => 'https://example.edu',
    ], $attributes));
}

function catalogProgram(University $university, array $attributes): Program
{
    return Program::create(array_merge([
        'university_id' => $university->id,
        'slug' => str($attributes['title'])->slug()->value(),
        'subject_area' => 'Computer Science',
        'language' => 'en',
        'verification_status' => 'unverified',
        'is_sample' => true,
    ], $attributes));
}

it('searches universities case-insensitively and returns catalog facets', function () {
    catalogUser();

    catalogUniversity(['name' => 'Bocconi University', 'city' => 'Milano', 'region' => 'Lombardy', 'type' => 'private']);
    catalogUniversity(['name' => 'University of Padova', 'city' => 'Padova', 'region' => 'Veneto']);

    $byName = $this->getJson('/api/v1/universities?search=BOC');

    $byName->assertOk()
        ->assertJsonPath('result.meta.total', 1)
        ->assertJsonPath('result.universities.0.name', 'Bocconi University')
        ->assertJsonPath('result.universities.0.initials', 'BO')
        ->assertJsonPath('result.universities.0.programs_count', 0)
        ->assertJsonStructure(['result' => ['universities' => [['id', 'name', 'initials', 'updated_at']], 'facets' => ['regions', 'types']]]);

    expect($byName->json('result.facets.regions'))->toBe(['Lombardy', 'Veneto'])
        ->and($byName->json('result.facets.types'))->toBe(['private', 'public']);

    $this->getJson('/api/v1/universities?search=veneto')
        ->assertOk()
        ->assertJsonPath('result.meta.total', 1)
        ->assertJsonPath('result.universities.0.name', 'University of Padova');

    $this->getJson('/api/v1/universities?search=padova')
        ->assertOk()
        ->assertJsonPath('result.meta.total', 1);
});

it('searches programs case-insensitively by title, subject and university', function () {
    $user = catalogUser();

    $bocconi = catalogUniversity(['name' => 'Bocconi University', 'city' => 'Milano', 'region' => 'Lombardy', 'type' => 'private']);
    catalogProgram($bocconi, ['title' => 'MSc Data Science', 'subject_area' => 'Data Science', 'language' => 'en']);
    catalogProgram($bocconi, ['title' => 'MSc Economics', 'subject_area' => 'Economics', 'language' => 'it']);

    $this->getJson('/api/v1/programs?search=data')
        ->assertOk()
        ->assertJsonPath('result.meta.total', 1)
        ->assertJsonPath('result.programs.0.title', 'MSc Data Science')
        ->assertJsonPath('result.programs.0.bookmarked', false);

    $this->getJson('/api/v1/programs?search=BOC')
        ->assertOk()
        ->assertJsonPath('result.meta.total', 2);

    $facets = $this->getJson('/api/v1/programs');
    expect($facets->json('result.facets.subject_areas'))->toContain('Data Science', 'Economics')
        ->and($facets->json('result.facets.languages'))->toContain('en', 'it');
});

it('searches universities by a program title and filters by region and type', function () {
    catalogUser();

    $bocconi = catalogUniversity(['name' => 'Bocconi University', 'city' => 'Milano', 'region' => 'Lombardy', 'type' => 'private']);
    catalogUniversity(['name' => 'University of Padova', 'city' => 'Padova', 'region' => 'Veneto']);

    catalogProgram($bocconi, ['title' => 'MSc Artificial Intelligence']);

    $this->getJson('/api/v1/universities?search=artificial')
        ->assertOk()
        ->assertJsonPath('result.meta.total', 1)
        ->assertJsonPath('result.universities.0.name', 'Bocconi University')
        ->assertJsonPath('result.universities.0.programs_count', 1);

    $this->getJson('/api/v1/universities?region=Veneto&type=public')
        ->assertOk()
        ->assertJsonPath('result.meta.total', 1)
        ->assertJsonPath('result.universities.0.name', 'University of Padova');

    $this->getJson('/api/v1/universities?sort=programs')
        ->assertOk()
        ->assertJsonPath('result.universities.0.name', 'Bocconi University');
});

it('returns a university with its programs and source metadata', function () {
    catalogUser();

    $university = catalogUniversity(['name' => 'Politecnico di Milano', 'city' => 'Milano', 'region' => 'Lombardy']);
    $program = catalogProgram($university, ['title' => 'MSc Cybersecurity', 'subject_area' => 'Cybersecurity']);

    $this->getJson("/api/v1/universities/{$university->id}")
        ->assertOk()
        ->assertJsonPath('result.university.id', $university->id)
        ->assertJsonPath('result.university.initials', 'PM')
        ->assertJsonPath('result.university.programs_count', 1)
        ->assertJsonPath('result.programs.0.id', $program->id)
        ->assertJsonPath('result.programs.0.is_sample', true);
});

it('exposes city facets and filters universities by city', function () {
    catalogUser();

    catalogUniversity(['name' => 'Bocconi University', 'city' => 'Milano', 'region' => 'Lombardy']);
    catalogUniversity(['name' => 'University of Padova', 'city' => 'Padova', 'region' => 'Veneto']);

    $response = $this->getJson('/api/v1/universities');

    $response->assertOk();
    expect($response->json('result.facets.cities'))->toBe(['Milano', 'Padova']);

    $this->getJson('/api/v1/universities?city=Padova')
        ->assertOk()
        ->assertJsonPath('result.meta.total', 1)
        ->assertJsonPath('result.universities.0.name', 'University of Padova');
});

it('returns catalog-derived stats on the university detail endpoint', function () {
    catalogUser();

    $university = catalogUniversity(['name' => 'University of Milan', 'city' => 'Milano', 'region' => 'Lombardy']);
    $program = catalogProgram($university, ['title' => 'MSc Data Science', 'subject_area' => 'Data Science']);
    catalogProgram($university, ['title' => 'MSc Economics', 'subject_area' => 'Economics', 'language' => 'it']);

    \App\Models\AdmissionCall::create([
        'program_id' => $program->id,
        'intake_year' => 2026,
        'intake_label' => '2026/27 intake',
        'deadline' => now()->addDays(20)->toDateString(),
        'verification_status' => 'unverified',
        'is_sample' => true,
    ]);

    $this->getJson("/api/v1/universities/{$university->id}")
        ->assertOk()
        ->assertJsonPath('result.stats.programs', 2)
        ->assertJsonPath('result.stats.open_calls', 1)
        ->assertJsonPath('result.stats.languages.0', 'en')
        ->assertJsonPath('result.stats.currency', 'EUR');

    expect($this->getJson("/api/v1/universities/{$university->id}")->json('result.stats.subject_areas'))
        ->toBe(['Data Science', 'Economics'])
        ->and($this->getJson("/api/v1/universities/{$university->id}")->json('result.stats.next_deadline'))
        ->toBe(now()->addDays(20)->toDateString());
});

it('returns related programs on the program detail endpoint', function () {
    catalogUser();

    $university = catalogUniversity(['name' => 'Bocconi University', 'city' => 'Milano', 'region' => 'Lombardy']);
    $program = catalogProgram($university, ['title' => 'MSc Data Science', 'subject_area' => 'Data Science']);
    $sibling = catalogProgram($university, ['title' => 'MSc Economics', 'subject_area' => 'Economics']);
    $other = catalogProgram(
        catalogUniversity(['name' => 'University of Padova', 'city' => 'Padova', 'region' => 'Veneto']),
        ['title' => 'MSc Applied Data Science', 'subject_area' => 'Data Science'],
    );

    $response = $this->getJson("/api/v1/programs/{$program->id}")->assertOk();
    $relatedIds = collect($response->json('result.related'))->pluck('id');

    expect($relatedIds)->toContain($sibling->id)
        ->and($relatedIds)->toContain($other->id)
        ->and($relatedIds)->not->toContain($program->id);
});

it('treats a call without a deadline as an open call and flags it as deadline TBC', function () {
    catalogUser();

    $university = catalogUniversity(['name' => 'University of Turin', 'city' => 'Torino', 'region' => 'Piedmont']);
    $program = catalogProgram($university, ['title' => 'MSc Stochastics and Data Science', 'subject_area' => 'Data Science']);

    \App\Models\AdmissionCall::create([
        'program_id' => $program->id,
        'intake_year' => 2026,
        'intake_label' => '2026/27 intake — deadline to be confirmed',
        'deadline' => null,
        'verification_status' => 'unverified',
        'is_sample' => false,
    ]);

    $this->getJson('/api/v1/programs?has_open_call=1')
        ->assertOk()
        ->assertJsonPath('result.meta.total', 1)
        ->assertJsonPath('result.programs.0.next_call.deadline', null)
        ->assertJsonPath('result.programs.0.next_call.days_left', null);
});
