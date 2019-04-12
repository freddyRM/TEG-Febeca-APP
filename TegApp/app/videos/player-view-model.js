var Observable = require('data/observable').Observable;
var frameModule = require('ui/frame');
var appSettings = require('application-settings');

function comentar(args){
	var model = this;
	var page = frameModule.topmost().currentPage;
	page.showModal('modal/comentario/comentario', { id_video: model.id_video }, function(){}, false); 
}

function createViewModel(video){	
	var viewModel = new Observable();
	viewModel.cssClass = appSettings.getString("cssClass", "actionbar");
	viewModel.video = video;
	viewModel.id_video = video.id_video;
	viewModel.src = video.src;
	viewModel.busy = true;
	viewModel.comentar = comentar;
	viewModel.videoReady = function(args){
		var model = this;
		model.set('busy', false);	
		if (args.object.android){
			
		}	
	}
	return viewModel;
}

exports.createViewModel = createViewModel;