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
    public function users($params)
    {
        return $this->model->search($params['search'] ?? $params['query'] ?? null)
            ->sortingBy($params['sort_by'] ?? 'name', $params['sort_dir'] ?? 'asc')
            ->filters(self::ALLOWED_FILTERS)
            ->retrieve($params['paginated'] ?? false, $params['per_page'] ?? 15);
    }

    public function saveUser($data = [])
    {
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
