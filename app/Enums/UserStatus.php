<?php

namespace App\Enums;

enum UserStatus : string
{

    case Active = 'active';
    case Pending = 'pending';
    case Inactive = 'inactive';
    case Suspended = 'suspended';
    case Banned = 'banned';
    case Deleted = 'deleted';

}
