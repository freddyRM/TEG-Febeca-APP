"use strict";
var common = require("./vidplayer.common");
var app = require("application");
var platform = require("platform");
var screenOrientation = require("nativescript-screen-orientation");
function onSrcPropertyChanged(data) {
    var player = data.object;
    if (!player.android) {
        return;
    }
    if (player.autoPlay) {
        player.vidPlayer.setShouldAutoplay(true);
    }
    player.vidPlayer.setVideoURI(android.net.Uri.parse(data.newValue));
}
common.VidPlayer.srcProperty.metadata.onSetNativeValue = onSrcPropertyChanged;
require("utils/module-merge").merge(common, module.exports);
var Vidplayer = (function (_super) {
    __extends(Vidplayer, _super);
    function Vidplayer() {
        _super.apply(this, arguments);
        this.autoPlay = false;
        this._fullScreen = true;
    }
    Object.defineProperty(Vidplayer.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vidplayer.prototype, "vidPlayer", {
        get: function () {
            return this._vidPlayer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vidplayer.prototype, "fullScreen", {
        get: function () {
            return this._fullScreen;
        },
        set: function (val) {
            if (val !== this._fullScreen) {
                this._fullScreen = val;
                this.notifyPropertyChange('fullScreen', val);
                if (this._fullScreenBtn) {
                    if (val) {
                        this._fullScreenBtn.setVisibility(android.view.View.VISIBLE);
                    }
                    else {
                        this._fullScreenBtn.setVisibility(android.view.View.INVISIBLE);
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vidplayer.prototype, "isFullScreen", {
        get: function () {
            return this._vidPlayer.isFullscreen();
        },
        enumerable: true,
        configurable: true
    });
    Vidplayer.prototype._createUI = function () {
        var _this = this;
        var context = app.android.currentContext;
        var FullscreenVideoLayout = com.github.rtoshiro.view.video.FullscreenVideoLayout;
        this._vidPlayer = new FullscreenVideoLayout(context);
        this._vidPlayer.setActivity(context);
        var f = this._vidPlayer.getClass().getDeclaredField("imgfullscreen");
        f.setAccessible(true);
        this._fullScreenBtn = f.get(this._vidPlayer);
        if (this.fullScreen) {
            this._fullScreenBtn.setOnClickListener(new android.view.View.OnClickListener({
                onClick: function (view) {
                    var toggleFullScreen = !_this._vidPlayer.isFullscreen();
                    _this.goFullScreen(toggleFullScreen);
                }
            }));
        }
        else {
            this._fullScreenBtn.setVisibility(android.view.View.INVISIBLE);
        }
        this._vidPlayer.setOnCompletionListener(new android.media.MediaPlayer.OnCompletionListener({
            onCompletion: function (mp) {
                if (typeof (_this.onComplete) === 'function') {
                    _this.onComplete();
                }
            }
        }));
        this._vidPlayer.setOnErrorListener(new android.media.MediaPlayer.OnErrorListener({
            onError: function (mp, what, extra) {
                if (typeof (_this.onError) === 'function') {
                    _this.onError();
                    return true;
                }
                return false;
            }
        }));
        f = this._vidPlayer.getClass().getDeclaredField("videoControlsView");
        f.setAccessible(true);
        var videoControlsView = f.get(this._vidPlayer);
        this._vidPlayer.setOnPreparedListener(new android.media.MediaPlayer.OnPreparedListener({
            onPrepared: function (mediaPlayer) {
                if (videoControlsView != null) {
                    setTimeout(function () {
                        _this._vidPlayer.hideControls();
                    }, 4000);
                }
            }
        }));
        this._vidPlayer.setOnTouchListener(new android.view.View.OnTouchListener({
            onTouch: function (view, motionEvent) {
                if (motionEvent.getAction() == android.view.MotionEvent.ACTION_DOWN) {
                    if (videoControlsView != null) {
                        setTimeout(function () {
                            _this._vidPlayer.hideControls();
                        }, 4000);
                    }
                }
                return true;
            }
        }));
        this._android = this._vidPlayer;
    };
    Vidplayer.prototype.goFullScreen = function (isFullScreen) {
        var _this = this;
        this._vidPlayer.setFullscreen(isFullScreen);
        var View = android.view.View;
        if (isFullScreen) {
            if (app.android && platform.device.sdkVersion < '16') {
                app.android.foregroundActivity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
            }
            else if (app.android && platform.device.sdkVersion >= '21') {
                var window = app.android.foregroundActivity.getWindow();
                var decorView = window.getDecorView();
                var uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
                decorView.setSystemUiVisibility(uiOptions);
            }
            else {
                var window = app.android.foregroundActivity.getWindow();
                var decorView = window.getDecorView();
                var uiOptions = View.SYSTEM_UI_FLAG_FULLSCREEN;
                decorView.setSystemUiVisibility(uiOptions);
            }
            screenOrientation.setCurrentOrientation("landscape", function () {
                _this._portraitWidth = _this.width;
                _this._portraitHeight = _this.height;
                var sdkVer = platform.device.sdkVersion;
                if (sdkVer >= 17) {
                    var wm = app.android.context.getSystemService(android.content.Context.WINDOW_SERVICE);
                    var display = wm.getDefaultDisplay();
                    var screenSize = new android.graphics.Point();
                    display.getRealSize(screenSize);
                    _this.height = _this.convertPxToDp(screenSize.y);
                    _this.width = _this.convertPxToDp(screenSize.x);
                }
                else {
                    _this.height = platform.screen.mainScreen.widthDIPs;
                    _this.width = platform.screen.mainScreen.heightDIPs;
                }
            });
        }
        else {
            if (app.android && platform.device.sdkVersion < '16') {
                app.android.foregroundActivity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
            }
            else if (app.android && platform.device.sdkVersion >= '21') {
                var window = app.android.foregroundActivity.getWindow();
                var decorView = window.getDecorView();
                var uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
                decorView.setSystemUiVisibility(uiOptions);
            }
            screenOrientation.setCurrentOrientation("portrait", function () {
                _this.height = _this._portraitHeight;
                _this.width = _this._portraitWidth;
            });
        }
    };
    Vidplayer.prototype.convertPxToDp = function (pixel) {
        var metrics = new android.util.DisplayMetrics();
        var wm = app.android.context.getSystemService(android.content.Context.WINDOW_SERVICE);
        wm.getDefaultDisplay().getMetrics(metrics);
        var logicalDensity = metrics.density;
        return java.lang.Math.ceil(pixel / logicalDensity);
    };
    return Vidplayer;
}(common.VidPlayer));
exports.Vidplayer = Vidplayer;
