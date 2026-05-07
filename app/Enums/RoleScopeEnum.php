<?php

namespace App\Enums;

enum RoleScopeEnum : string
{

    case SYSTEM = 'system';
    case TENANT = 'tenant';
    case CUSTOM = 'custom';


}
