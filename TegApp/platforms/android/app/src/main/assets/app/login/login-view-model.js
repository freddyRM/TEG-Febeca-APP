var Observable = require('data/observable').Observable;
var frameModule = require('ui/frame');
var repo = require('../repository/sesion');
// captura de sesion
var cap_log = require('../repository/capture');
var Toast = require('nativescript-toast');
var appSettings = require('application-settings');
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

function inicioSesion(args){
	var model = this;

	if (!model.login || !model.clave) {
		Toast.makeText("Por favor rellene los campos vacios").show();
	}else{

		Toast.makeText("Autenticando...").show();
		repo.iniciarSesion(model.login, model.clave, function(error, data){
		if (error){
			Toast.makeText(error).show();
		}
		else{
			appSettings.setString("id_usuario", data.id_usuario);
			appSettings.setString("id_sucursal", data.id_sucursal);
			appSettings.setString("nombre_sucursal", data.nombre_sucursal);
			appSettings.setString("logo_url", data.logo_url);			
			var sucursal = data.nombre_sucursal.trim().toLowerCase();
			var cssClass = "actionbar";
			
			if (sucursal == "sillaca"){
				cssClass = cssClass + "-" + sucursal;
			}			
			else if (sucursal == "beval"){
				cssClass = cssClass + "-" + sucursal;
			}
			else if (sucursal == "febeca" || sucursal == "cofersa"){
				cssClass = cssClass + "-" + "febeca";
			}
			else if (sucursal == "prisma sistema de información"){
				cssClass = cssClass + "-" + "prisma";
			}
			else if (sucursal == "mundipartes"){
				cssClass = cssClass + "-" + sucursal;
			}

			console.log(data);

			cap_log.captureSesion(data.id_usuario,data.id_sucursal,data.nombre,data.apellido,data.cedula,data.telefono,data.correo,time(date),time(date), function(error, data){
			if (error){
				// Toast.makeText(error).show();
			}
			else{
				// Toast.makeText("se envio la captura de data","long").show();
			}});

			appSettings.setString("cssClass", cssClass); 
			frameModule.topmost().navigate({
				moduleName: 'categorias/categorias',
				clearHistory: true
			});		
		}
		});
	}
}

function test(args){
	frameModule.topmost().navigate({
		moduleName: 'test/view'
	});
}

function createViewModel(){
	var viewModel = new Observable();
	viewModel.login = "";
	viewModel.clave = "";
	viewModel.inicioSesion = inicioSesion;
	//viewModel.inicioSesion = test;
	return viewModel;	
}

exports.createViewModel = createViewModel;