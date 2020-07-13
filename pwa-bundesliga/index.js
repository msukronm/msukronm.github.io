import ApiFootballData from './js/api-football-data.js';
import initComponent from './js/init-components.js';
import {requestPermission, showBrowserNotification} from './js/push-notification.js';

const apiFootball = new ApiFootballData();
apiFootball.set_id_competition('2002');
apiFootball.set_seasion_competition('2019');

initComponent();

// Periksa fitur Notification API
if ("Notification" in window) {
    requestPermission();
} else {
    console.error("Browser tidak mendukung notifikasi.");
}