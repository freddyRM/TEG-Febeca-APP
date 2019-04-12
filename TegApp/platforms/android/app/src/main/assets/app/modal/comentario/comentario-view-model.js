var Observable = require('data/observable').Observable;
var repo = require('../../repository/videos');
var Toast = require('nativescript-toast');
// Datos para el tiempo
var date;

function time(date){
	date = new Date;
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var year = date.getFullYear();
	var AMPM = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // si la hora es cero deberia mostrar las 12
	minutes = minutes < 10 ? '0'+minutes : minutes;
	// hours = hours < 10 ? '0'+hours : hours;
	month = month < 10 ? '0'+month : month;
	day = day < 10 ? '0'+day : day;
	var strTime = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes + ' ' + AMPM;
	return strTime;
}

function comentar(args){
	var model = this;
	Toast.makeText("Enviando...");
	repo.comentar(model.id_video, model.comentario, model.valoracion,time(date), function(error, data){
		if (error){
			Toast.makeText(error).show();
		}
		else{
			Toast.makeText("Comentario enviado con éxito").show();
			model.closeCallback();
		}
	});
}

function rateTap(args){
	var model = this;
	if (args.object.id == "happy"){
		model.set('valoracion', 1);
	}
	else if (args.object.id == "neutral"){
		model.set('valoracion', 0);
	}
	else if (args.object.id == "sad"){
		model.set('valoracion', -1);
	}
}

function createViewModel(id_video, closeCallback){
	var viewModel = new Observable();
	viewModel.id_video = id_video;
	viewModel.closeCallback = closeCallback;
	viewModel.comentario = "";
	viewModel.valoracion = 0;
	viewModel.comentar = comentar;
	viewModel.rateTap = rateTap;
	viewModel.closeModal = function(args){
		this.closeCallback();
	}
	return viewModel;
}

exports.createViewModel = createViewModel;