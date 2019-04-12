var createViewModel = require('./videos-view-model').createViewModel;
var frameModule = require('ui/frame');

exports.onNavigatingTo = function(args){
	var page = args.object;
	var id_categoria = 0;
	if (typeof page.navigationContext != "undefined"){
		id_categoria = page.navigationContext.id_categoria;
	}
	page.bindingContext = createViewModel(id_categoria);
}

exports.onItemTap = function(args){
	var video = args.object.bindingContext;
	frameModule.topmost().navigate({
		moduleName: 'videos/player',
		context: {
			video: video
		}
	});
}