<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;

trait HasThumbnail
{
    public function getThumbnailAttribute($value)
    {
        return $this->getThumbnailUrl($value);
    }

    protected function getThumbnailUrl($filename, $folder = 'users', $default = 'user-5.jpg')
    {
        if ($filename && $filename !== 'default.png' && Storage::exists($folder . '/' . $filename)) {
            return asset('storage/' . $folder . '/' . $filename);
        }

        return asset('backend/images/users/' . $default);
    }
}
