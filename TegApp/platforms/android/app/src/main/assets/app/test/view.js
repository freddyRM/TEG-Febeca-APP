exports.createVideoView = function(args){
	console.log("android native video component");
	
	//create videoview    
    var mVideoView = new android.widget.VideoView(args.context);
    var mMediaController = new android.widget.MediaController(args.context);
    mMediaController.setAnchorView(mVideoView);
         
    // parse the uri    
    var videoLink = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
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
        }
    });

    var preparedListener = new android.media.MediaPlayer.OnPreparedListener({
    	onPrepared: function(args){
    		console.log('Video Prepared');
    		mVideoView.start();
    	}
    });
    // Set the listener using the correct method
    mVideoView.setOnCompletionListener(completionListener);
    mVideoView.setOnPreparedListener(preparedListener);
}