import React from 'react';
import ContactList from './components/ContactList';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export const echo = new Echo({
    broadcaster: 'pusher',
    key: '43ab1ced3c98f76a2079',
    cluster: 'us2',
    forceTLS: true
});


const App = () => {
    return (
        <div>
            <ContactList />
        </div>
    );
};

export default App;
