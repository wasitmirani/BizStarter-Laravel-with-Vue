<?php

namespace App\Models;

use App\Models\Concerns\InteractsWithListQuery;
use App\Models\Country;
use App\Models\Tenant;
use App\Traits\HasThumbnail;
use App\Traits\LogsActivity;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Lab404\Impersonate\Models\Impersonate;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Impersonate, HasRoles, HasThumbnail, InteractsWithListQuery, LogsActivity, Notifiable;
    protected array $guard_name = ['api', 'web'];
    protected $guarded = [];
    protected $prefix ="UR00";

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // protected $fillable = [
    //     'name',
    //     'email',
    //     'password',
    // ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's thumbnail path.
     *
     * @return string|null
     */
    public function getThumbnailAttribute($value)
    {
        $default = config('images.defaults.user');
        $backendPath = config('images.paths.backend');

        if ($value && $value !== 'default.png' && Storage::disk('public')->exists('images/user/' . $value)) {
            return asset('storage/images/user/' . $value);
        }

        return asset($backendPath . 'users/' . $default);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }
    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }
        $search = trim($search);
        $id = str_replace($this->prefix, '', $search);

        return $query->where(function ($q) use ($search, $id) {
            $q->where('name', 'LIKE', "%{$search}%")
              ->orWhere('first_name', 'LIKE', "%{$search}%")
              ->orWhere('last_name', 'LIKE', "%{$search}%");

            if (is_numeric($id)) {
                $q->orWhere('id', $id);
            }
        });
    }
    public function scopeFilters($query, array $filters)
    {
        return $query
            ->when($filters['id'] ?? null, fn($q, $id) =>
                $q->where('id', $id)
                  ->orWhere('id', str_replace($this->prefix, '', $id))
            )
            ->when($filters['uuid'] ?? null, fn($q, $uuid) =>
                $q->where('uuid', $uuid)
            )
            ->when($filters['is_active'] ?? null, fn($q, $active) =>
                $active ? $q->active() : $q->inactive()
            )
            ->when($filters['search'] ?? null, fn($q, $search) =>
                $q->search($search)
            )
            ->when($filters['email'] ?? null, fn($q, $email) =>
                $q->where('email', $email)
            )
            ->when($filters['phone'] ?? null, fn($q, $phone) =>
                $q->where('phone', $phone)
            )
            ->when($filters['date_range'] ?? null, fn($q, $days) =>
            $q->where('created_at', '>=', now()->subDays((int) $days)->startOfDay())
            )
            ->when($filters['role'] ?? null, fn($q, $role) =>
                $q->whereHas('roles', fn($r) => $r->where('name', $role))
            )
            ->when($filters['created_from'] ?? null, fn($q, $from) =>
                $q->whereDate('created_at', '>=', $from)
            )
            ->when($filters['created_between'] ?? null, fn($q, $range) =>
                $q->whereBetween('created_at', explode(',', $range))
            );
    }
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id', 'id');
    }

    public function getRoles(){

        return DB::table('roles')->orderBy('name', 'ASC')->get();
    }

    public function canImpersonate()
    {
        return $this->hasRole('admin') ?? false; // or whatever role you want
    }

    public function canBeImpersonated()
    {
        return !$this->hasRole('admin') ?? true;  // admins can't be impersonated by other admins
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }




}
