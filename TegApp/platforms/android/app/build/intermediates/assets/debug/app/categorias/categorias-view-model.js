var Observable = require('data/observable').Observable;
var frameModule = require('ui/frame');
var repo = require('../repository/videos');
var Toast = require('nativescript-toast');
var appSettings = require('application-settings');

function selectImage(){
	var sucursal = appSettings.getString("nombre_sucursal", "").toLowerCase();
	if (sucursal == "sillaca"){
		return "res://cat_sillaca";
	}
	else if (sucursal == "febeca" || sucursal == "cofersa"){
		return "res://cat_febeca";	
	}
	else if (sucursal == "beval"){
		return "res://cat_beval";
	}
	else if (sucursal == "prisma sistema de información"){
		return "res://cat_prisma";
	}
	else if (sucursal == "mundipartes"){
		return "res://cat_mundipartes";
	}
	else{
		return "res://cat";	
	}
}

function loadData(model){
	model.set('busy', true);		
	repo.obtenerCategorias(function(error, data){
		if (error){
			Toast.makeText(error).show();
		}
		else{
			var imageSrc = selectImage();
			console.log("----listar Categorias---");
			console.log(data);
			for (var i=0, n=data.length; i<n; i++){
				data[i]["imageSrc"] = imageSrc;
			}
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