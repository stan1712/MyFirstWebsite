/*
	-- CODES ET MODULES --
*/
// Express and middleware
var express = require("express");
var session = require('express-session');

// File modification
var fs = require("fs");
var bodyParser = require("body-parser");

// MongoDb
var mongoose = require("mongoose");

var servlog = require("./modules/connect.js"); // Log pour le lancement
var parauser = require("./modules/parauser.js"); // Paramètres d'encryptage/décryptage utilisateur

// Parameter for express()
var app = express();
app.set("view engine", "ejs");
app.set('trust proxy', 1);

var mongoDB = "mongodb://localhost:27017/infographart";

mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
/*
	CREATION DU SERVEUR WEB ET CONNEXION A LA DB
*/
try {
	app.listen(7748);
	try {
		var db = mongoose.connection;
		console.log("Connexion à la DB effectuée !");
	}
	catch(e) {
		db.on("error", console.error.bind(console, "Erreur lors de la connexion à la DB :"));
		console.log(e);
	}
	servlog.Ok();
}
catch (e) {
	servlog.Nope();
	console.log(e);
}


/*
	-- SCHEMA POUR LA DB --
*/
var schema = mongoose.Schema(
	{
		firstname: String,
		lastname: String,
		email: String,
		company: String,

		ownerof: String,
		cart: Number,

		password: String,
		last_update: {type: Date, default: Date.now},
	}
);


/*
	-- DEFINITION DES PAGES WEB --
*/
var index = require('./routers/index');
var connect = require('./routers/connect');
var editor = require('./routers/editor');

/* index => '/' */
app.use("/", index);

/* logup => '/logup' */
app.use("/logup", connect);

/* editor => '/editor' */
app.use("/editor", editor);

app.get("/test", function (req, res, next) {
	res.render("react.jsx");
});

app.use('/assets', express.static('assets'));

// Erreur 404
app.use(function (req, res, next) {
	// Affichage de la page 404
	res.render("404"); 
});