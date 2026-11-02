<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('billing:sync')->dailyAt('01:00');
