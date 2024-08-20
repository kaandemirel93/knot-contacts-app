<?php
return [
    'default' => env('BROADCAST_DRIVER', 'log'),
    'connections' => [
        'pusher' => [
            'driver' => 'pusher',
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'app_id' => env('PUSHER_APP_ID'),
            'options' => [
                'cluster' => 'us2',
                'useTLS' => true,
            ],
        ],
    ],
];
