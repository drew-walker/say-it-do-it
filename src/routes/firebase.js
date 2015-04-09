/* autoWireDependencies */
module.exports = function(express) {
    if (!process.env.FIREBASE_URL) {
        throw new Error('Your must specify process.env.FIREBASE_URL.');
    }

    router = express.Router();

    router.get('/url', function(req, res) {
        res.send(process.env.FIREBASE_URL);
    });

    return router;
};