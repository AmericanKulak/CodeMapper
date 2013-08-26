var ProcessesDAO = require('../processes').ProcessesDAO;

/* The ProcessHandler must be constructed with a connected db */
module.exports = ProcessHandler = function (db) {
    "use strict";

    var processes = new ProcessesDAO(db);



    this.processStart = function(req, res, next) {

        var project = req.params.projectName;
        var process = req.params.processName;

        var optionsRestMap = function(el){
            var query = "";
            var argKeys = [];
            if(typeof el.Arguments === "object" )
                argKeys = Object.keys(el.Arguments);


            for (var i = 0; i < argKeys.length; i++) {
                query += (i==0?"":"&") + argKeys[i] + "=" + el.Arguments[argKeys[i]];
            };

            if( typeof el.CallbackStep !== undefined && el.CallbackStep !== null ) 
                query += "callbackStep=" + el.CallbackStep;

            el.href = "http://localhost:8108/" + project + "/" + process + "/" + el.Step + "?" + query;
            return el;
        }

        processes.getStartingStep( project, process, function(err, doc){
            if(err) throw err;

            doc.Options.map(optionsRestMap);
            return res.json(doc);
        });
    }

    this.processStep = function(req, res, next) {

        var project = req.params.projectName;
        var process = req.params.processName;
        var step    = req.params.stepName;
        var inputArgs = req.query;

        var optionsRestMap = function(el){
            var query = "";
            var argKeys = [];
            if( typeof el.Arguments === "object" )
                argKeys = Object.keys(el.Arguments);

            for (var i = 0; i < argKeys.length; i++) {
                query += (i==0?"":"&") + argKeys[i] + "=" + el.Arguments[argKeys[i]];
            };

            if( typeof el.CallbackStep !== undefined  && el.CallbackStep !== null ) 
                query += "callbackStep=" + el.CallbackStep;

            if(el.Step == "{{callback}}")
                el.Step = inputArgs["callbackStep"];

            el.href = "http://localhost:8108/" + project + "/" + process + "/" + el.Step + "?" + query;
            return el;
        }

        processes.getStep( project, process, step, function(err, doc){
            if(err) throw err;

            doc.InputArgs = inputArgs;
            doc.Options.map(optionsRestMap);
            return res.json(doc);
        });
    }


    

    
}

