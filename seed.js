var MongoClient = require('mongodb').MongoClient;
var ProcessesDAO = require('./lib/processes').ProcessesDAO;

MongoClient.connect('mongodb://localhost:27017/codeMapper' , function(err, db) {

	"use strict";

	var doc = 
	{
		Project : "CodeMapper",
		Process : "GetProjects",
		StartStep : "GET /",
		Steps : [
		{
			Name : "GET /",
			Description : "A get request is made to '/'",
			Options : [
			{
				"Description" : "Request a list of distinct projects from the database.",
				"Arguments" : {},
				"CallbackStep" : "Return to Browser",
				"Step" : "Database Request"
			}]
		},
		{
			Name : "Database Request",
			Description : "Return a list of projects.",
			Options : [
			{
				"Description" : "Callback",
				"Arguments" : {"result" : "list of projects"},
				"CallbackStep" : null,
				"Step" : "{{callback}}"
			}]
		},
		{
			Name : "Return to Browser",
			Description : "Return Mapped List to Browser. Expects {{result}}.",
			Options : []
		}]

	}

	var processes = new ProcessesDAO(db);

	processes.addProcess(doc, function(err,doc){
		if(err) throw err;
		console.dir(doc);

		db.close();
	});

	
});