<?php

namespace App\Models;

use App\Models\Country;
use App\Traits\LogsActivity;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Storage;
use App\Traits\HasThumbnail;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, LogsActivity,Notifiable,HasRoles,HasThumbnail;
    protected array $guard_name = ['api', 'web'];
    protected $guarded = [];

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

        if ($value && $value !== 'default.png' && Storage::exists('users/' . $value)) {
            return asset(config('images.paths.storage') . 'users/' . $value);
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
       return $search ?  $query->whereAny(['name','first_name', 'last_name', 'email', 'phone'], 'LIKE', $search) : $query;

    }
    public function scopeSortingBy($query, $column, $direction = 'asc')
    {
        return $query->orderBy($column, $direction);
    }

    public function scopeFilters($query, array $filters)
    {
        return $query
        ->when($filters['id'] ?? false, function ($query, $id) {
            return $query->where('id', $id);
        })
        ->when($filters['uuid'] ?? false, function ($query, $uuid) {
       
            return $query->where('uuid', $uuid);
        })
        ->when($filters['is_active'] ?? false, function ($query, $isActive) {
            return $isActive ? $query->active() : $query->inactive();
        })
        ->when($filters['search'] ?? false, function ($query, $search) {
            return $query->search($search);
        })
        ->when($filters['email'] ?? false, function ($query, $email) {
            return $query->where('email', $email);
        })
        ->when($filters['phone'] ?? false, function ($query, $phone) {
            return $query->where('phone', $phone);
        })
        ->when($filters['role'] ?? false, function ($query, $role) {
            return $query->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            });
        })->when($filters['created_from'] ?? false, function ($query, $createdFrom) {
            return $query->whereDate('created_at', '>=', $createdFrom);
        })->when($filters['created_between'] ?? false, function ($query, $range) {
            [$start, $end] = explode(',', $range);
            return $query->whereBetween('created_at', [$start, $end]);
        });

    }
    public function scopeLimit($query, $limit)
    {
        return $query->take($limit);
    }

    public function scopeRetrieve($query,$paginated  = false, $perPage = 15)
    {
       $paginated = filter_var($paginated, FILTER_VALIDATE_BOOLEAN);
       return $query->when($paginated,
        fn($q) => $q->paginate($perPage),
        fn($q) => $q->get()
       );
    }
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id', 'id');
    }

    public function getRoles(){

        return DB::table('roles')->orderBy('name', 'ASC')->get();
    }


}
