var createViewModel = require('./categorias-view-model').createViewModel;
var frameModule = require('ui/frame');
// agregado
var Toast = require('nativescript-toast');

exports.onNavigatingTo = function(args){
	var page = args.object;
	page.bindingContext = createViewModel();
}

exports.onItemTap = function(args){
	var categoria = args.object.bindingContext;
	frameModule.topmost().navigate({
		moduleName: 'categorias/menu',
		context: {
			id_categoria: categoria.id_categoria
		}
	});
}

exports.notification = function(args){
	var model = this;
	var page = frameModule.topmost().currentPage;
	page.showModal('test/view', { id_video: model.id_video }, function(){}, false);
}