var ProcessesDAO = require('../processes').ProcessesDAO;

/* The SelectorHandler must be constructed with a connected db */
module.exports = SelectorHandler = function (db) {
    "use strict";

    var processes = new ProcessesDAO(db);

    this.projectSelection = function(req, res, next) {

        var projectRestMap = function( el ){
            return {
                name: el,
                href: "http://localhost:8108" + "/" + el
            };
        }

        processes.getProjects(function(err, docs){
            if(err) throw err;

            return res.json({"projects" : docs.map(projectRestMap)});
        })
    }

    

    this.processSelection = function(req, res, next) {
        var project = req.params.projectName;

        var processRestMap = function( el ){
            return {
                name: el,
                href: "http://localhost:8108/" + project + "/" + el
            };
        }

        processes.getProcesses(project, function(err, docs){
            if(err) throw err;

            return res.json({"processes" : docs.map(processRestMap)});
        })
    }
}

