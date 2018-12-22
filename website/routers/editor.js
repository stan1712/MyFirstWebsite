/*
	-- CODES ET MODULES --
*/
// Express and middleware
var express = require("express");
var router = express.Router();
var session = require('express-session');

// File modification
var fs = require("fs");
var bodyParser = require("body-parser");

// MongoDb
var MongoClient = require("mongodb");
var mongoose = require("mongoose");

var parauser = require("../modules/parauser.js"); // Paramètres d'encryptage/décryptage utilisateur

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

var db = mongoose.connection;
var Usersdb = db.model('users');

router.get("/", function (req, res) {
	res.render("editor/editor.ejs");
});

router.get("/preview", function (req, res) {
	res.render("editor/preview.ejs");
});

/* PAGE MODIFICATION DU PROFIL */
router.get("/profile", function (req, res) {
	Usersdb.find({}, function (err, user) {
		res.render("editor/profile.ejs", { db: user[1] });
	});
});

router.post("/profile", urlencodedParser, function (req, res) {
	if(!req.body.password){
		var query = { email: req.body.email };
		var newvalues = { $set: { email: req.body.email, firstname: req.body.firstname, lastname: req.body.lastname } };
		Usersdb.updateOne(query, newvalues, function (err, res) {
			console.log("Profil de " + req.body.email + " mis à jour !");
		});
		setTimeout(function () {
			Usersdb.find({}, function (err, user) {
				res.render("editor/profile.ejs", { db: user[1] });
			});
		}, 1000);
	}
	else{
		var encrypted = parauser.encrypt(req.body.password);

		var query = { email: req.body.email };
		var newvalues = { $set: { email: req.body.email, firstname: req.body.firstname, lastname: req.body.lastname, password: encrypted } };
		Usersdb.updateOne(query, newvalues, function (err, res) {
			console.log("Profil de " + req.body.email + " mis à jour !");
		});
		setTimeout(function () {
			Usersdb.find({}, function (err, user) {
				res.render("editor/profile.ejs", { db: user[1] });
			});
		}, 1000);
	}
});

module.exports = router;