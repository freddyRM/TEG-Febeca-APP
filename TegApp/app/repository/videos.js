var http = require('http');
var base_url = require('./config.json').base_url;
var appSettings = require('application-settings');

exports.obtenerCategorias = function(callback){
	var data = {};
	var id_sucursal = appSettings.getString("id_sucursal", "0");
	http.request({
		url: base_url + 'categorias.php',
		method: 'POST',
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		content: 'id_sucursal='+id_sucursal
		
	}).then(function(response){
		var result = response.content.toJSON();		
		callback(false, result);
	}, function(error){
		console.log(error);
		callback(error.message, data);
	});
}

exports.obtenerVideos = function(id_categoria, callback){
	var data = {};
	var id_sucursal = appSettings.getString("id_sucursal", "0");
	var id_usuario = appSettings.getString("id_usuario", "");
	console.log("id_categoria="+id_categoria+"&id_sucursal="+id_sucursal+"&id_usuario="+id_usuario);
	http.request({
		url: base_url + 'videos.php',
		method: 'POST',
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		content: "id_categoria="+id_categoria+"&id_sucursal="+id_sucursal+"&id_usuario="+id_usuario
	}).then(function(response){
		var result = response.content.toJSON();
		callback(false, result);
	}, function(error){
		console.log(error);
		callback(error.message, data);
	});
}

exports.obtenerDocumentos = function(id_categoria, callback){
	var data = {};
	var id_sucursal = appSettings.getString("id_sucursal", "0");
	var id_usuario = appSettings.getString("id_usuario", "");
	console.log("id_categoria="+id_categoria+"&id_sucursal="+id_sucursal+"&id_usuario="+id_usuario);
	http.request({
		url: base_url + 'documentos.php',
		method: 'POST',
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		content: "id_categoria="+id_categoria+"&id_sucursal="+id_sucursal+"&id_usuario="+id_usuario
	}).then(function(response){
		var result = response.content.toJSON();
		callback(false, result);
	}, function(error){
		console.log(error);
		callback(error.message, data);
	});
}

exports.comentar = function(id_video, comentario, valoracion, fecha, callback){
	var id_usuario = appSettings.getString("id_usuario", "");
	var data = {};
	console.log('id_video='+id_video+"&comentario="+comentario+"&valoracion="+valoracion+"&id_usuario="+id_usuario+"&fecha="+fecha);
	http.request({
		url: base_url + 'comentar.php',
		method: 'POST',
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		content: 'id_video='+id_video+"&comentario="+comentario+"&valoracion="+valoracion+"&id_usuario="+id_usuario+"&fecha="+fecha
	}).then(function(response){
		var result = response.content.toJSON();
		if (result.estatus == 1){
			callback(false, data);
		}
		else{
			callback("Error al guardar comentario", data);
		}
	}, function(error){
		console.log(error);
		callback(error.message, data);
	});
}