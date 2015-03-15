var express = require('express'),
    router = express.Router();

router.get('/url', function(req, res) {
    res.send(process.env.FIREBASE_URL);
});

module.exports = router;