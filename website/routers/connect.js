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
var schema = mongoose.Schema(
	{
		firstname: String,
		lastname: String,
		email: String,
		company: String,

		ownerof: String,
		cart: Number,

		password: String,
		account_birthday: { type: Date, default: Date.now },
	}
);
var Usersdb = db.model('users', schema);

router.get("/", function (req, res) {
	res.render("editor/connect");
});

router.post('/', urlencodedParser, function (req, res, next) {
	var userok = false;

	Usersdb.find({}, { _id: 1, email: 1 }, function (err, user) {
		for (i = 0; i < user.length; i++) {
			if (req.body.iemail == user[i].email) {
				console.log("[UsersDB n°" + reqid + "] Erreur de duplication, le champ 'email' existe déjà !");
				userok = false;
				break;
			}
			else {
				userok = true;
				continue;
			}
		}
	});

	if (req.body.iemail != undefined){
		var reqid = Math.floor((Math.random()) * (100 - 1)) + 1;
		console.log("[UsersDB n°" + reqid + "] Requete de génération d'une table d'utilisateur vierge pour " + req.body.ifirstname + " " + req.body.ilastname);
		setTimeout(function () {
			if (userok == true) {
				Usersdb.find({}, { _id: 1, email: 1 }, function (err, user) {
					// Cryptage du mot de passe
					var encrypted = parauser.encrypt(req.body.ipassword);
					console.log("[UsersDB n°" + reqid + "] Cryptage du mot de passe");

					// Création de l'utilisateur dans la DB
					var NewUser = new Usersdb(
						{
							firstname: req.body.ifirstname,
							lastname: req.body.ilastname,
							email: req.body.iemail,

							ownerof: "Nothing",
							cart: 0,

							password: encrypted,
						}
					);
					NewUser.save(function (err) {
						if (err) {
							console.log("[UsersDB n°" + reqid + "] Erreur dans la création de la table ", err);
						}
					});
					console.log("[UsersDB n°" + reqid + "] Génération d'une table d'utilisateur effectuée avec succès");
					res.redirect("/editor");
				});
			}
			else {
				res.redirect("/logup");
			}
		}, 1000);
	}
	else if (req.body.cemail && req.body.cpassword != undefined){
		Usersdb.find({ email: req.body.cemail }, "email password", function(err, users){
			if (err) return handleError(err);
			var encrypted = parauser.encrypt(req.body.cpassword);

			if(encrypted == users[0].password){
				res.redirect("/editor");
			}
			else{
				res.redirect("/logup");
			}
		});
	}
	else{
		res.redirect("/logup");
	}
});

module.exports = router;