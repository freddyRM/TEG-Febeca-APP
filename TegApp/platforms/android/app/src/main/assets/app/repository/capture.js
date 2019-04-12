var http = require('http');
var base_url = require('./config.json').base_url;

exports.captureSesion = function(id_usuario,id_sucursal,nombre,apellido,cedula,telefono,correo,preview_date,last_date,callback){
	if(id_usuario.trim().toLowerCase()=="admin"){
		this.id_sucursal=10;
	}
	console.log("-Captura de datos Inicio de Sesion-");
	console.log('id_usuario= '+id_usuario);
	console.log("id_sucursal= "+id_sucursal);
	console.log("nombre= "+nombre);
	console.log("apellido= "+apellido);
	console.log("cedula= "+cedula);
	console.log("telefono= "+telefono);
	console.log("correo= "+correo); 
	console.log("preview_date= "+preview_date);
	console.log("last_date= "+last_date);
	// console.log(base_url + 'captura_sesion.php');
	// console.log('id_usuario='+id_usuario+"&id_sucursal="+id_sucursal+"&nombre="+nombre+"&apellido="+apellido+"&cedula="+cedula+"&telefono="+telefono+"&correo="+correo+"&preview_date="+preview_date+"&last_date="+last_date);
	var data = {};
	http.request({
		url: base_url + 'captura_sesion.php',
		method: 'POST',
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		content: 'id_usuario='+id_usuario+"&id_sucursal="+id_sucursal+"&nombre="+nombre+"&apellido="+apellido+"&cedula="+cedula+"&telefono="+telefono+"&correo="+correo+"&preview_date="+preview_date+"&last_date="+last_date
	}).then(function(response){
		var result = response.content.toJSON();
		if (result.estatus == 1){
			callback(false, data);
		}
		else{
			callback("Error al guardar la informacion del usuario", data);
		}
	}, function(error){
		console.log(error);
		callback(error.message, data);
	});
}

exports.captureDocumento = function(id_usuario,id_documento,nombre,descripcion,callback){
	var data = {};
	console.log("-Captura de datos Vista Documento-");
	console.log('id_usuario= '+id_usuario);
	console.log("id_documento= "+id_documento);
	console.log("nombre= "+nombre);
	console.log("descripcion= "+descripcion);
	// console.log('id_usuario='+id_usuario+"&id_documento="+id_documento+"&nombre="+nombre+"&descripcion="+descripcion);
	// console.log(base_url + 'captura_documento.php');
	http.request({
		url: base_url + 'captura_documento.php',
		method: 'POST',
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		content: 'id_usuario='+id_usuario+"&id_documento="+id_documento+"&nombre="+nombre+"&descripcion="+descripcion
	}).then(function(response){
		var result = response.content.toJSON();
		if (result.estatus == 1){
			callback(false, data);
		}
		else{
			callback("Error al guardar la informacion del usuario", data);
		}
	}, function(error){
		console.log(error);
		callback(error.message, data);
	});
}

exports.captureVideo = function(id_usuario,id_video,nombre,descripcion,vistas,callback){
	var data = {};
	console.log("-Captura de datos Vista Videos-");
	console.log('id_usuario= '+id_usuario);
	console.log("id_video= "+id_video);
	console.log("nombre= "+nombre);
	console.log("descripcion= "+descripcion);
	console.log("vistas= "+vistas);
	// console.log('id_usuario='+id_usuario+"&id_video="+id_video+"&nombre="+nombre+"&descripcion="+descripcion+"&vistas="+vistas);
	// console.log(base_url + 'captura_video.php');
	http.request({
		url: base_url + 'captura_video.php',
		method: 'POST',
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		content: 'id_usuario='+id_usuario+"&id_video="+id_video+"&nombre="+nombre+"&descripcion="+descripcion+"&vistas="+vistas
	}).then(function(response){
		var result = response.content.toJSON();
		if (result.estatus == 1){
			callback(false, data);
		}
		else{
			callback("Error al guardar la informacion del usuario", data);
		}
	}, function(error){
		console.log(error);
		callback(error.message, data);
	});
}