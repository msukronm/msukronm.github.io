let webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BCSBBEXwXTJsjc3nqr4zeDVeI_c4cV40_ejkrbtxK8kee7kxq45Xn-28O3CFV9VWqijdQnnTRbTGrXyWegFFDE8",
    "privateKey": "W_d-bhwDihA5sU8aUkaREsf_4aUqIxMyjNk2u9ot7Z4"
 };

const setEndpoint = "https://fcm.googleapis.com/fcm/send/fS0WDy80ktk:APA91bE6mYBtKgeMz0_Rh3mbY1WDClX0ZYC7KastOs7CUn5hcV6S_rEAYpIFk9O8f_TYtAt75jVq9q8CSSzIyWzUIEeOF4b_kPrh8Se0A_dxbKOQX1TLPGnL-oyVBnI7xWb81lAKB-3a";
const keysP256dh = "BEF3IonNayA89B7+77MdkfH/TVcY0KRrKHlscSRz2/g3cxKyW720LVmRCmzAjFF9de+w13lRsRfLyuxfpwNwivY=";
const keysAuth = "VCV8VAg61UnE79L0EwrYBw==";

const payload = 'Update terus informasi Bundesliga disini!';
const options = {
   gcmAPIKey: '634384659703',
   TTL: 60
};

webPush.setVapidDetails(
   'mailto:moh.surkronmakmun@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)

let pushSubscription = {
   "endpoint": setEndpoint,
   "keys": {
       "p256dh": keysP256dh,
       "auth": keysAuth
   }
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
).catch(function(err){
    console.error(err);
});