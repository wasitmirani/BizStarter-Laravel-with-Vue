<?php

namespace App\Contracts;


interface UserFilterable
{
    public const ALLOWED_FILTERS = [
        'id' => 'id',
        'search' => 'search',
        'query' => 'query',
        'email' => 'email',
        'phone' => 'phone',
        'status' => 'status',
        'per_page' => 'per_page',
        'sort_by' => 'sort_by',
        'sort_dir' => 'sort_dir',
        'role' => 'role',
        'uuid' => 'uuid',
        'is_active' => 'is_active',
        'date_range' => 'date_range',
        'paginated' => 'paginated',
        'created_from' => 'created_from',
        'created_between' => 'created_between',
    ];


}
