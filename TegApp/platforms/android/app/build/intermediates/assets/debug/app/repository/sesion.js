var http = require('http');
var base_url = require('./config.json').base_url;


exports.iniciarSesion = function(login, pass, callback){
	var data = {};
	console.log('login='+login+"&clave="+pass);
	http.request({
		url: base_url + 'login.php',
		method: 'POST',
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		content: 'login='+login+"&clave="+pass
	}).then(function(response){		
		var result = response.content.toJSON();		
		if (result.logstatus == 1){	
			if ( result.estatus == 0){
				callback("Usuario no válido", data);
			}		
			else{
				callback(false, result);
			}
		}
		else{
			callback("Credenciales incorrectas", data);
		}
		
	}, function(error){
		console.log(error);
		callback(error.message, data);
	});
}