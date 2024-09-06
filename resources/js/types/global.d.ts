import { AxiosInstance } from 'axios';
import Echo from 'laravel-echo';
import { route as ziggyRoute } from 'ziggy-js';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        axios: AxiosInstance;
        Echo: Echo;
        Pusher: typeof Pusher;
        app_form_dialog: {
            showModal: () => void;
            close: () => void;
        };
    }

    var route: typeof ziggyRoute;
}
