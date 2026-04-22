<?php

namespace App\Models;

use App\Models\Concerns\InteractsWithListQuery;
use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    use InteractsWithListQuery;
}
