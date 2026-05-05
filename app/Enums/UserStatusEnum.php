<?php

namespace App\Enums;

enum UserStatusEnum : string
{

    case Active = 'active';
    case Pending = 'pending';
    case Inactive = 'inactive';
    case Suspended = 'suspended';
    case Banned = 'banned';
    case Deleted = 'deleted';

}
