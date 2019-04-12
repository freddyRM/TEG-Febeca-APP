var createViewModel = require('./menu-view-model').createViewModel;
var frameModule = require('ui/frame');
var page;
exports.onNavigatingTo = function(args){
	page = args.object;
	var id_categoria = page.navigationContext.id_categoria;
	page.bindingContext = createViewModel(id_categoria);
}

exports.onVideoTap = function(args){
	var model = page.bindingContext;
	frameModule.topmost().navigate({
		moduleName: 'videos/videos',
		context: {
			id_categoria: model.id_categoria
		}
	});
}

exports.onDocumentoTap = function(args){
	var model = page.bindingContext;
	frameModule.topmost().navigate({
		moduleName: 'videos/docs',
		context: {
			id_categoria: model.id_categoria
		}
	});
}