<?php

namespace App\Services;

use App\Models\User;
use function Laravel\Prompts\search;
use App\Contracts\UserFilterable;
use App\Services\LoggerService;
use Illuminate\Support\Facades\Hash;
use UserEnum;

class UserService extends BaseService implements UserFilterable
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
        $perPage = (int)($params['per_page'] ?? 15);
        $perPage = $perPage > 0 ? $perPage : 15;

        return $this->model
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
             // ->search($params['search'] ?? $params['query'] ?? null)
            // ->filters(self::ALLOWED_FILTERS)
            ->retrieve($params['paginated'] ?? true, $perPage);
    }

    public function saveUser(array $data = [])
    {
        // Optionally, you may want to handle additional logic here (validation, password hashing, events, etc.)
        // Merge extradata into $data before creating the user
        $data = array_merge($data, [
            'user_name' => $this->generateUsername($data['first_name'], $data['last_name']),
            'slug' => mapFirstNameLastSlug($data['first_name'], $data['last_name']),
            'uuid' => genUUID(),
        ]);
        return $this->model->create($data);
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
       return responseMessage('Password updated successfully.',201,status:true);
    }

    public function fetch(string $column,int|string $val){
        // fetch user info
        return $this->model->filters([$column =>$val])->first();
    }

    public function updateUser(int  $id, array $data){
        $user = $this->model->find($id);
        if(!$user){
        return responseMessage('User not found',404);
        }
        $user->name = $data['name'];
        $user->address = $data['address'];
        $user->dob = $data['dob'];
        $user->gender = $data['gender'];
        $user->save();

      return $user;
    }
}
