var createViewModel = require('./login-view-model').createViewModel;
var appSettings = require('application-settings');

exports.onNavigatingTo = function(args){
	var page = args.object;
	appSettings.clear();
	page.bindingContext = createViewModel();
}