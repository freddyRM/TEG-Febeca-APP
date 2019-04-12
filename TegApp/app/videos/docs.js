var createViewModel = require('./docs-view-model').createViewModel;
var frameModule = require('ui/frame');
var http = require('http');
var Toast = require('nativescript-toast');
var fileSystem = require('file-system');
var application = require('application');
var utilModule = require('utils/utils');
var permissions = require('nativescript-permissions');
//captura de sesion
var cap_log = require('../repository/capture');
var appSettings = require('application-settings');

exports.onNavigatingTo = function(args){
	var page = args.object;
	var id_categoria = 0;
	if (typeof page.navigationContext != "undefined"){
		id_categoria = page.navigationContext.id_categoria;
	}
	page.bindingContext = createViewModel(id_categoria);
}

function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  // return filename.split('.').pop();
}

function getOpenExtension(filename){
	
	var ext;
	var file = getFileExtension(filename);
	switch (file.toLowerCase()){
       case 'png': ext = "image/png";
       break;
    
       case 'pdf': ext = "application/pdf";
       break;
    
       case 'doc': ext = "application/msword";
       break;
    
       case 'docx': ext = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
       break;
    
       case 'txt': ext = "text/plain";
       break;

       case 'xls': ext = "application/vnd.ms-excel";
       break;
       
       case 'xlsx': ext = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
       break;

       default:  ext = "application/pdf";
    }
    return (ext);
}

function abrirDocumento(documento, path){

	// captura datos de documento
	var id_usuario = appSettings.getString("id_usuario", "");
	cap_log.captureDocumento(id_usuario,documento.id_documento,documento.nombre,documento.descripcion, function(error, data){
	if (error){
		// Toast.makeText(error).show();
	}
	else{
		// Toast.makeText("se envio la captura de data","long").show();
	}});

	if (application.android){
		try
		{	
			console.log(getOpenExtension(path));			
			var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
			intent.setDataAndType(android.net.Uri.fromFile(new java.io.File(path)),getOpenExtension(path));				
			application.android.currentContext.startActivity(android.content.Intent.createChooser(intent, "Abrir "+getFileExtension(path).toUpperCase()+"..."));
		}
		catch (e)
		{
			console.log("Se requiere un lector "+getFileExtension(path).toUpperCase());
			Toast.makeText("Se requiere un lector "+getFileExtension(path).toUpperCase()).show();
		}
	}
	else if (application.ios){			
		var opened = utilModule.ios.openFile(path);
		console.log(opened);		
	}
}

function descargarDocumento(documento, path){
	console.log("Descargando");
	Toast.makeText("Descargando...").show();		
	http.getFile(documento.src, path).then(function (file) {   
		if (file){
			abrirDocumento(documento,file.path);
		}
	}, function (e) {
		console.log(e);
		Toast.makeText(e.message).show();
	});
}

exports.onItemTap = function(args){
	var documento = args.object.bindingContext;
	var path;	
	if (application.ios){
		path = fileSystem.path.join(fileSystem.knownFolders.documents().path, documento.archivo_mostrar.replace(/ /g, "_") );
		if (fileSystem.File.exists(path)){
			abrirDocumento(documento, path);
		}
		else{
			descargarDocumento(documento, path);
		}
	}	
	else{

		permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, "Los documentos se descargarán en la memoria de su teléfono").then(function(){
			var androidPath = android.os.Environment.getExternalStorageState() != null ? android.os.Environment.getExternalStorageDirectory().toString() + "/AppFV/" : android.os.Environment.getDataDirectory() + "/AppFV/";
			var folder = fileSystem.Folder.fromPath(androidPath);
			path = fileSystem.path.join(folder.path, documento.archivo_mostrar.replace(/ /g, "_") );
			if (fileSystem.File.exists(path)){
				abrirDocumento(documento, path);
			}
			else{
				descargarDocumento(documento, path);
			}
		});
	}	
	
}