var createViewModel = require('./player-view-model').createViewModel;
var Toast = require('nativescript-toast');
var application = require('application');
var page;
// captura de sesion
var cap_log = require('../repository/capture');
var appSettings = require('application-settings');

exports.onNavigatingTo = function(args){
	page = args.object;
	var video = { src: "" };
	if (typeof page.navigationContext != "undefined"){
		video = page.navigationContext.video;
	}	
    
	page.bindingContext = createViewModel(video);	
}

exports.onLoaded = function(args){
    if (args.object.android){
        Toast.makeText("Cargando video...", "long").show();
    }
}

exports.createVideoView = function(args){
	console.log("android native video component");
	var model = page.bindingContext;
	//create videoview    
    var mVideoView = new android.widget.VideoView(args.context);
    var mMediaController = new android.widget.MediaController(args.context);
    mMediaController.setAnchorView(mVideoView);
         
    // parse the uri
    console.log(model.src);
    var videoLink = model.src;    
    var mVideoURL = android.net.Uri.parse(videoLink);
    mVideoView.setVideoURI(mVideoURL);
    mVideoView.setMediaController(mMediaController);
    mVideoView.setZOrderMediaOverlay(true);
    mVideoView.setZOrderOnTop(true);
    mVideoView.requestFocus();
    //mVideoView.start();
 
    args.view = mVideoView;
    //model.set('busy', false); 	
    // Create our Complete Listener - this is triggered once a video reaches the end
    var completionListener = new android.media.MediaPlayer.OnCompletionListener({
        onCompletion: function(args) {
            console.log('Video Done');
            mVideoView.seekTo(1);

            // captura datos de video
            var id_usuario = appSettings.getString("id_usuario", "");
            cap_log.captureVideo(id_usuario,model.id_video,model.video.nombre,model.video.descripcion,1, function(error, data){
            if (error){
                // Toast.makeText(error).show();
            }
            else{
                // Toast.makeText("se envio la captura de data","long").show();
            }});
        }
    });

    var preparedListener = new android.media.MediaPlayer.OnPreparedListener({
        onPrepared: function(args){
            console.log('Video Prepared');
            console.log(model);

            // captura datos de video
            var id_usuario = appSettings.getString("id_usuario", "");
            cap_log.captureVideo(id_usuario,model.id_video,model.video.nombre,model.video.descripcion,0, function(error, data){
            if (error){
                // Toast.makeText(error).show();
            }
            else{
                // Toast.makeText("se envio la captura de data","long").show();
            }});

            //model.set('busy', false);
            mVideoView.start();
            console.log("va reproduciendo: " + mVideoView.getDuration());
        }
    });

    mVideoView.setOnCompletionListener(completionListener);
    mVideoView.setOnPreparedListener(preparedListener);
}

exports.onNavigatingFrom = function(args){
    var page = args.object;
    var video = page.getViewById('video');
    if (application.ios){        
        video.pause();
    }
    else{
        video.android.pause();
    }
}