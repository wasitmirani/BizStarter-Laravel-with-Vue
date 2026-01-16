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

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id', 'id');
    }

    public function getRoles(){

        return DB::table('roles')->orderBy('name', 'ASC')->get();
    }

    // Your service's properties and methods

    // public function createUser(array $data)
    // {
    //     // Logic to create a user
    //     // $this->logActivity('Creating a new user', ['data' => $data]);
    // }
}
