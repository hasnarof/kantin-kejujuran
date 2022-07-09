var firebase = require('firebase')

var config = {
    apiKey: "AIzaSyBtdhnDHmk_GKnp5TgOPD697ttU_xGXsC8",
    authDomain: "kantin-kejujuran-7a6c8.firebaseapp.com",
    projectId: "kantin-kejujuran-7a6c8",
    storageBucket: "kantin-kejujuran-7a6c8.appspot.com",
    messagingSenderId: "588396050240",
    appId: "1:588396050240:web:c1639816cfb350fc64eca5",
    measurementId: "G-JCEZFW96F4"
};

var fire = firebase.initializeApp(config);
module.exports = fire