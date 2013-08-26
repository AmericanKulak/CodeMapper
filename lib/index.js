var express = require('express')
  , app     = express()
  , MongoClient = require('mongodb').MongoClient
  , router  = require('./router')
  , path    = require('path');



(function(){

	var httpPort = 8000;
	var connectionString = "mongodb://localhost:27017/test";

	exports.set = function set(key,value) {

		switch(key)
		{
			case 'httpPort':
				httpPort = value;
				break;

			case 'connectionString' :
				connectionString = value;
				break;

		}

		return this;

	}

	exports.start = function start() {

		MongoClient.connect(connectionString , function(err, db) {

			"use strict";

			if(err) throw err;

			console.log("Loading configs!");

			app.configure(function(){
				app.set('port', process.env.PORT || httpPort );
				app.set('views', __dirname + '/views');
				app.set('view engine', 'jade');
				app.use(express.favicon());
				app.use(express.logger('dev'));
				app.use(express.bodyParser());
				app.use(express.methodOverride());
				app.use(express.cookieParser('the most secret phrase'));
				app.use(express.session({secret:'fudge monkeys'}));
				app.use(app.router);
				app.use(express.static(path.join(__dirname, 'public')));
			});

			console.log("Loading Dev Error Logger");
			app.configure('development', function(){
				app.use(express.errorHandler());
			});

			console.log("Loading routes...");
			router(app, db);
		

			app.listen(httpPort);
			console.log("Ready to Go!");
		});

	}

})();