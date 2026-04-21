<?php

namespace App\Enums;

enum RoleScope : string
{

    case SYSTEM = 'system';
    case TENANT = 'tenant';
    case CUSTOM = 'custom';


}
