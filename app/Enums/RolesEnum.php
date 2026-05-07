<?php

namespace App\Enums;

enum RolesEnum : string
{

    case SUPER_ADMIN = 'super-admin';
    case ADMIN = 'admin';
    case DEVELOPER = 'developer';
    case MANAGER = "manager";

}
