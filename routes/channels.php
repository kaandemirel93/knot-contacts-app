<?php
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('knot-test', function ($user) {
    return true;
});
