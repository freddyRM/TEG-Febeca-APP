var Observable = require('data/observable').Observable;
var frameModule = require('ui/frame');
var repo = require('../repository/videos');
var Toast = require('nativescript-toast');
var appSettings = require('application-settings');
var lista;

function selectImage(){
	var sucursal = appSettings.getString("nombre_sucursal", "").toLowerCase();
	if (sucursal == "sillaca"){
		return "res://document_sillaca";
	}
	else if (sucursal == "febeca" || sucursal == "cofersa"){
		return "res://document_febeca";	
	}
	else if (sucursal == "beval"){
		return "res://document_beval";
	}
	else if (sucursal == "prisma sistema de información"){
		return "res://document_prisma";
	}
	else if (sucursal == "mundipartes"){
		return "res://document_mundipartes";
	}
	else{
		return "res://document";	
	}
}

function loadData(model){
	model.set('busy', true);
	repo.obtenerDocumentos(model.id_categoria, function(error, data){
		if (error){

		}
		else{
			var imageSrc = selectImage();
			console.log("----listar Documentos---");
			console.log(data);
			for (var i=0, n=data.length; i<n; i++){
				data[i]["imageSrc"] = imageSrc;
			}
			lista = data;
			model.set('documentos', data);
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
	viewModel.buscarDocumentos = function(args){
		var model = this;
		if (model.busqueda.trim() != ""){
			model.set("documentos", filtrarLista(lista, model.busqueda.toLowerCase()));
		}
		else{
			model.set("documentos", lista);
		}
		
		
	}
	loadData(viewModel);
	return viewModel;	
}

exports.createViewModel = createViewModel;