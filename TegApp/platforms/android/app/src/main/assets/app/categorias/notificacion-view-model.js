var Observable = require('data/observable').Observable;
var frameModule = require('ui/frame');
var repo = require('../repository/videos');
var Toast = require('nativescript-toast');
var appSettings = require('application-settings');

function loadData(model){
	model.set('busy', true);		
	repo.obtenerCategorias(function(error, data){
		if (error){
			Toast.makeText(error).show();
		}
		else{
			model.set('categorias', data);
		}
		model.set('busy', false);
	});
}

function createViewModel(){
	var viewModel = new Observable();
	viewModel.busy = false;
	viewModel.logo = appSettings.getString("logo_url");
	viewModel.cssClass = appSettings.getString("cssClass", "actionbar");
	viewModel.categorias = [];
	loadData(viewModel);
	return viewModel;	
}

exports.createViewModel = createViewModel;