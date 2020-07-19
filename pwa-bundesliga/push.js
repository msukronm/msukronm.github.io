let webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BCSBBEXwXTJsjc3nqr4zeDVeI_c4cV40_ejkrbtxK8kee7kxq45Xn-28O3CFV9VWqijdQnnTRbTGrXyWegFFDE8",
    "privateKey": "W_d-bhwDihA5sU8aUkaREsf_4aUqIxMyjNk2u9ot7Z4"
 };

 const setEndpoint = "https://fcm.googleapis.com/fcm/send/d7Z_KBIfN4Y:APA91bGi8j70_8e_kR46cRLUGYxnK6qUCVvfSmhTjuQo1u4vbEHTzPpKZMVLSYplmXfJE77RvlT1wC561az0TetkiXd1axEedNP3UIeGxfro2lLejhtt0D9d1iR7t03WxGtYDeisNJwA";
 const keysP256dh = "BAm/kkUkVWEqZlKIHVmuVswmOy/ztjMpA5YP85Hdzi7DoHvjeUm3+qhdoEp1ZFfLcqL0srOXUhtTT1PwHDGPJ+A=";
 const keysAuth = "W9LTiDgAIntOkkdQPzZxNQ==";

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