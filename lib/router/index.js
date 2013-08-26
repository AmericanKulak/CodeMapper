var SelectorHandler = require('./selector')
  , ProcessHandler = require('./process');

module.exports = exports = function(app, db) {
	var processHandler = new ProcessHandler(db);
	var selectorHandler = new SelectorHandler(db);

	app.get('/', selectorHandler.projectSelection);

	app.get('/:projectName', selectorHandler.processSelection)

	app.get('/:projectName/:processName', processHandler.processStart);

	app.get('/:projectName/:processName/:stepName', processHandler.processStep)
	app.post('/:projectName/:processName/:stepName', processHandler.processStep);
}