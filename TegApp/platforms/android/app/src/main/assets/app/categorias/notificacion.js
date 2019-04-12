var createViewModel = require('./comentario-view-model').createViewModel;
exports.onShownModally = function(args){
	var context = args.context;
	var page = args.object;
	page.bindingContext = createViewModel(context.id_video, args.closeCallback);
}