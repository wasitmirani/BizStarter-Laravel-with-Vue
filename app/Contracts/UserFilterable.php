<?php

namespace App\Contracts;


interface UserFilterable
{
    public const ALLOWED_FILTERS = [
        'id',
        'search',
        'email',
        'phone',
        'status',
        'role',
        'uuid',
        'is_active',
        'created_from',
        'created_between',
    ];

    
}
