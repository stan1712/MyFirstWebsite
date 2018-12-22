var express = require('express');
var router = express.Router();
var session = require('express-session');

var app = express();

app.use(session({
	secret: "coucou",
	name: 'user_session',
	saveUninitialized: true,
	resave: false,
	keys: [/* secret keys */],
	cookie: { expires: new Date(new Date().getTime() + 43800 * 60 * 1000) }
}));

router.get("/", function (req, res) {
	res.render("index");
});

module.exports = router;