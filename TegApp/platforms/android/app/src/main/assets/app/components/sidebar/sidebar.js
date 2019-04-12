var frameModule = require("ui/frame");
var appSettings = require("application-settings");
var repository = require('../../repository/authentication');
var Toast = require('nativescript-toast');
var dialogs = require('ui/dialogs');

exports.usernames = function(args){	
	var label = args.object;	
	var first_name = appSettings.getString("first_name", "");
	var last_name = appSettings.getString("last_name", "");
	label.text = "Welcome,  " + first_name  + " " + last_name;	
}

exports.profileLoaded = function(args){
	var guest = appSettings.getBoolean("isGuest", false);
	if (guest){
		args.object.visibility = "collapse";
	}
}

exports.mainMenu = function(){
	frameModule.topmost().navigate({
		moduleName: 'main-page/main-model'
	});
}

exports.profile = function(){
	frameModule.topmost().navigate({
		moduleName: 'profile/profilest'
	});
}

exports.myProjects = function(){
	frameModule.topmost().navigate({
		moduleName: 'my-project/my-project'
	});
}

exports.newEstimate = function(){
	var guest = appSettings.getBoolean("isGuest", false);
	var hasProperty = appSettings.getBoolean("guestProperty", false);

	if (guest && hasProperty){
		dialogs.confirm({
            title: "Sign into Kukun",
            message: "Please sign up to continue using this FREE estimator",
            okButtonText: "Yes",
            cancelButtonText: "No"
        }).then(function(result){
            if (result){
                authRepository.signOut(token, function(error, data){
                    if (!error){
                        appSettings.clear();
                        frameModule.topmost().navigate({
                            moduleName: 'sign-in/main-page'
                        });
                    }
                });
            }
        });
		return;
	}
	
	//if it's a new estimate, place default property ID
	frameModule.topmost().navigate({
		moduleName: 'estimate-parameters/select-room',
		clearHistory: true,
		context: { property_id: 1 }
	});
}

exports.signIn = function(){
	frameModule.topmost().navigate('sign-in/main-page');
}

exports.signOut = function(){
	var token = appSettings.getString("token", "");
	repository.signOut(token, function(error, message){
		if (error){
			Toast.makeText(error).show();
		}
		else{
			appSettings.clear();
			frameModule.topmost().navigate({
				moduleName: 'sign-in/main-page',
				clearHistory: true
			});
		}
	});
}

exports.findPro = function(){
	frameModule.topmost().navigate({
        moduleName: 'find-a-pro/find-a-pro',
        context: { address: "" }
    });
}

exports.requestQuote = function(args){
	frameModule.topmost().currentPage.showModal("modal/coming-soon/message", "context", function(){});
}

exports.closeDrawer = function(){
    var sideDrawer = (frameModule.topmost().getViewById("sideDrawer"));
    sideDrawer.closeDrawer();
}

