var Observable = require('data/observable').Observable;
var frameModule = require('ui/frame');
var repo = require('../repository/videos');
var Toast = require('nativescript-toast');
var appSettings = require('application-settings');
var lista;

function selectImage(){
	var sucursal = appSettings.getString("nombre_sucursal", "").toLowerCase();
	if (sucursal == "sillaca"){
		return "res://video_sillaca";
	}
	else if (sucursal == "febeca" || sucursal == "cofersa"){
		return "res://video_febeca";	
	}
	else if (sucursal == "beval"){
		return "res://video_beval";
	}
	else if (sucursal == "prisma sistema de información"){
		return "res://video_prisma";
	}
	else if (sucursal == "mundipartes"){
		return "res://video_mundipartes";
	}
	else{
		return "res://video";	
	}
}

function loadData(model){
	model.set('busy', true);
	repo.obtenerVideos(model.id_categoria, function(error, data){
		if (error){

		}
		else{
			console.log("----listar videos---");
			console.log(data);
			var imageSrc = selectImage();
			for (var i=0, n=data.length; i<n; i++){
				data[i]["imageSrc"] = imageSrc;
			}
			lista = data;
			model.set('videos', data);
		}
		model.set('busy', false);
	});
}

function filtrarLista(v, texto){
	var resultados = [];
	
	for (var i=0, n=v.length; i<n; i++){
		
		if (v[i].nombre.toLowerCase().includes(texto) || v[i].descripcion.toLowerCase().includes(texto)){
			resultados.push(v[i]);
		}
	}
	return resultados;
}

function createViewModel(id_categoria){	
	var viewModel = new Observable();
	lista = [];
	viewModel.cssClass = appSettings.getString("cssClass", "actionbar");
	viewModel.id_categoria = id_categoria;
	viewModel.videos = [];
	viewModel.busy = false;
	viewModel.busqueda = "";
	viewModel.buscarVideos = function(args){
		var model = this;
		if (model.busqueda.trim() != ""){
			model.set("videos", filtrarLista(lista, model.busqueda.toLowerCase()));
		}
		else{
			model.set("videos", lista);
		}
		
		
	}
	loadData(viewModel);
	return viewModel;	
}

exports.createViewModel = createViewModel;