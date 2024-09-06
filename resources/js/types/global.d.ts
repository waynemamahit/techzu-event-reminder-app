import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';

declare global {
    interface Window {
        axios: AxiosInstance;
        app_form_dialog: {
            showModal: () => void;
            close: () => void;
        };
    }

    var route: typeof ziggyRoute;
}
