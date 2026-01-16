<?php

namespace App\Services;

use App\Models\User;

class UserService
{

    public function __construct(protected User $user) {
    }


    public function store(array $data)
    {
        return $this->user->create($data);
    }

    public function update($id,array $data)
    {
        $user = $this->user->find($id);
        if (!$user) {
            return null;
        }
        $user->fill($data);
        $user->save();
        return $user;
    }

    public function delete($uuid)
    {

        $user = $this->user->where('uuid', $uuid)->first();
        if (!$user) {
            return false;
        }
        return (bool) $user->delete();
    }

    public function all($is_paginate)
    {

        if ((bool)$is_paginate) {
            return $this->user->paginate();
        }

        return $this->user->all();
    }

    public function find($id)
    {
        return $this->user->find($id);
    }

    public function findByUUIDOrEmail($val){
        return $this->user->where('uuid', $val)->orWhere('email', $val)->first();
    }


}
