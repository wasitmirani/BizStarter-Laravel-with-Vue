<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('billing:sync')->dailyAt('01:00');
Schedule::command('crm:send-scheduled-campaigns')->everyMinute()->withoutOverlapping();
