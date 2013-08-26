module.exports.ProcessesDAO = ProcessesDAO = function(db){
	"use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ProcessesDAO)) {
        console.log('Warning: ProcessesDAO constructor called without "new" operator');
        return new ProcessesDAO(db);
    }

    var processes = db.collection("processes");

    this.addProcess = function( doc, callback ){

    	processes.insert( doc, { safe : true }, function( err, doc ){

    		if(err) throw err;

    		console.dir( doc[0] );

    		callback( err, doc[0] );

    	});
    }

    this.getProjects = function( callback ){
    	var query = {};
    	var field =  'Project';
    	processes.distinct(field, query, callback);
    }

    this.getProcesses = function( projectName, callback ) {
    	var query = { 'Project' : projectName };
    	var field = 'Process';
    	processes.distinct(field, query, callback);
    }

    this.getStartingStep = function( projectName, processName, callback) {
    	var query = { 'Project' : projectName, 'Process' : processName };
    	var projection = { "_id" : false, "StartStep" : true, "Steps" : true };

    	processes.findOne(query, projection, function(err, doc)
    	{
    		if(err) callback(err, doc);

    		for (var i = 0; i < doc.Steps.length; i++) {
    			if(doc.Steps[i].Name == doc.StartStep)
    			{
    				return callback(err, doc.Steps[i]);
    			}
    		};

    		callback(Error("No Starting Step found!"), null);

    	});
    }

    this.getStep = function( projectName, processName, stepName, callback ) {
    	var query = { 'Project' : projectName, 'Process' : processName };
    	var projection = { "_id" : false, "Steps" : true }; 

    	processes.findOne(query, projection, function(err, doc)
    	{
    		if(err) callback(err, doc);

    		for (var i = 0; i < doc.Steps.length; i++) {
    			if(doc.Steps[i].Name == stepName)
    			{
    				return callback(err, doc.Steps[i]);
    			}
    		};

    		callback(Error("No Step found!"), null);

    	});
    }
}