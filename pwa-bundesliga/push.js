let webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BCSBBEXwXTJsjc3nqr4zeDVeI_c4cV40_ejkrbtxK8kee7kxq45Xn-28O3CFV9VWqijdQnnTRbTGrXyWegFFDE8",
    "privateKey": "W_d-bhwDihA5sU8aUkaREsf_4aUqIxMyjNk2u9ot7Z4"
 };

 const setEndpoint = "https://fcm.googleapis.com/fcm/send/f5Mnrfn8Y6A:APA91bFeWRGL5JRVLF17JEMrqkB1RwZoAPrCNvHsrU4t-yBj6yH77UlHAmvDfey0oAbyJK2CYZn_u3hUh1k6IK146anooVdX-XB51FadmZrBSV_BFrvZclcdCQIqioRx3jtN7Pv0DGek";
 const keysP256dh = "BBrCYjp/ItPT6OXg02hV6C2Dem7XN4zl82JqUO5iQ38XMvcZ2Kq1wWO9eojsjldgvJWMp7nLM75sbcF0Awnrjdo=";
 const keysAuth = "0ubTqQ6UvCRBJZOIgdeFlA==";

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