<?php

namespace App\Services;

use App\Models\User;
use function Laravel\Prompts\search;
use App\Contracts\BaseFilterable;
use App\Services\LoggerService;
use Illuminate\Support\Facades\Hash;
use App\Enums\UserEnum ;

class UserService extends BaseService implements BaseFilterable
{

    protected LoggerService $logger;
    protected function model(): ?string
    {
        return User::class;
    }
    public function generateUsername(string $firstName, string $lastName): string
    {
        // Create base slug from first and last name
        $base = mapFirstNameLastSlug($firstName, $lastName);

        // Remove any non-alphanumeric characters, including removing dashes
        $base = preg_replace('/[^a-zA-Z0-9]/', '', $base);

        // Lowercase the base for consistency
        $base = strtolower($base);

        // Add a random 3-digit number to the end (e.g., wasit001) for uniqueness
        $randomNumber = str_pad(random_int(1, 999), 3, '0', STR_PAD_LEFT);
        $username = $base . $randomNumber;

        // If that username exists, increment until a free one is found
        while ($this->model->where('user_name', $username)->exists()) {
            $randomNumber = str_pad(random_int(1, 9999), 3, '0', STR_PAD_LEFT);
            $username = $base . $randomNumber;
        }

        return $username;
    }
    public function users($params)
    {

        return $this->model
            ->with('roles:id,name')
            ->when(!isset($params['sort_by']), function ($query) {
                $query->latest();
            })
            ->when(isset($params['sort_by']), function ($query) use ($params) {
                $query->sortingBy(
                    $params['sort_by'],
                    $params['sort_dir'] ?? 'asc'
                );
            })
            ->when(isset($params['status']) && $params['status'] !== '', function ($query) use ($params) {
                $query->where('status', $params['status']);
            })
            ->when(isset($params['role']) && $params['role'] !== '', function ($query) use ($params) {
                $query->whereHas('roles', function ($q) use ($params) {
                    $q->where('name', $params['role']);
                });
            })
             ->search($params['search'] ?? $params['query'] ?? null)
            ->filters($params)
            ->retrieve($params['paginated'] ?? true, $this->resolvePerPage($params));
    }

    public function saveUser(array $data = [])
    {
        $role = $data['role'] ?? null;
        unset(
            $data['role'],
            $data['password_confirmation'],
            $data['timezone_id'],
            $data['language_id'],
            $data['name'],
        );

        $firstName = trim((string) ($data['first_name'] ?? ''));
        $lastName = trim((string) ($data['last_name'] ?? ''));

        $data = array_merge($data, [
            'first_name' => $firstName,
            'last_name' => $lastName !== '' ? $lastName : null,
            'name' => trim($firstName . ' ' . $lastName),
            'user_name' => $this->generateUsername($firstName, $lastName),
            'slug' => mapFirstNameLastSlug($firstName, $lastName),
            'uuid' => genUUID(),
        ]);

        $user = $this->model->create($data);

        if (!empty($role)) {
            $user->syncRoles([$role]);
        }

        return $user->load('roles:id,name');
    }

    /**
     * Resolve a user by uuid, falling back to their numeric id.
     */
    public function findByIdentifier(int|string $identifier): ?User
    {
        $query = $this->model->with('roles:id,name');

        if (is_numeric($identifier)) {
            return $query->find((int) $identifier);
        }

        return $query->where('uuid', $identifier)->first();
    }

    public function updatePassword(){
        $user= request()->user();
       // Check if the current password matches
       if (!Hash::check(request('current_password'), $user->password)) {
           return responseMessage('Current password is incorrect.',422);
       }

       // Update the user's password
       $user->password = Hash::make(request('new_password'));
       $user->save();
       LoggerService::info("Password updated successfully", ['user'=>$user]);
       return responseMessage('Password updated successfully.',201,status:true);
    }

    public function fetch(string $column,int|string $val){
        // fetch user info
        return $this->model->with('roles:id,name')->filters([$column =>$val])->first();
    }

    public function updateUser(int|string $identifier, array $data)
    {
        $user = $this->findByIdentifier($identifier);

        if (!$user) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException('User not found');
        }

        $role = $data['role'] ?? null;

        unset(
            $data['role'],
            $data['password_confirmation'],
            $data['id'],
            $data['uuid'],
            $data['user_name'],
            $data['slug'],
            $data['email_verified_at'],
            $data['created_at'],
            $data['updated_at'],
            $data['roles'],
            $data['timezone_id'],
            $data['language_id'],
        );

        if (array_key_exists('first_name', $data) || array_key_exists('last_name', $data)) {
            $firstName = trim((string) ($data['first_name'] ?? $user->first_name ?? ''));
            $lastName = trim((string) ($data['last_name'] ?? $user->last_name ?? ''));

            $user->first_name = $firstName;
            $user->last_name = $lastName !== '' ? $lastName : null;
            $user->name = trim($firstName . ' ' . $lastName);
        }

        $profileFields = [
            'email',
            'phone',
            'address',
            'city',
            'state',
            'zip_code',
            'dob',
            'gender',
            'marital_status',
            'country_id',
            'is_active',
        ];

        foreach ($profileFields as $field) {
            if (array_key_exists($field, $data)) {
                $user->{$field} = $data[$field];
            }
        }

        if (array_key_exists('thumbnail', $data)) {
            $thumbnail = trim((string) ($data['thumbnail'] ?? ''));
            $user->thumbnail = $thumbnail !== ''
                ? basename(parse_url($thumbnail, PHP_URL_PATH) ?: $thumbnail)
                : 'default.png';
        }

        if (!empty($data['password'])) {
            $user->password = $data['password'];
        }

        $user->save();

        if ($role !== null && $role !== '') {
            $user->syncRoles([$role]);
        }

        return $user->load('roles:id,name');
    }
}
