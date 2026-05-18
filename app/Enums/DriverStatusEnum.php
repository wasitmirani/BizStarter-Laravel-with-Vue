<?php

namespace App\Enums;

enum DriverStatusEnum: string
{
    case Active = 'active';
    case Inactive = 'inactive';
    case Suspended = 'suspended';
    case OnLeave = 'on-leave';
}
