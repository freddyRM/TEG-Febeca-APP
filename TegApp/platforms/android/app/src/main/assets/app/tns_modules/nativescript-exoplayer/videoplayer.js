"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var videoCommon = require("./videoplayer-common");
var videoplayer_common_1 = require("./videoplayer-common");
var videoplayer_common_2 = require("./videoplayer-common");
var utils = require("utils/utils");
var application = require('application');
__export(require("./videoplayer-common"));
var STATE_IDLE = 1;
var STATE_BUFFERING = 2;
var STATE_READY = 3;
var STATE_ENDED = 4;
var SURFACE_WAITING = 0;
var SURFACE_READY = 1;
var Video = (function (_super) {
    __extends(Video, _super);
    function Video() {
        var _this = _super.call(this) || this;
        _this._boundStart = _this.resumeEvent.bind(_this);
        _this._boundStop = _this.suspendEvent.bind(_this);
        _this.enableSubtitles = false;
        _this.TYPE = { DETECT: 0, SS: 1, DASH: 2, HLS: 3, OTHER: 4 };
        _this._textureView = null;
        _this.nativeView = null;
        _this.videoWidth = 0;
        _this.videoHeight = 0;
        _this._onReadyEmitEvent = [];
        _this._suspendLocation = null;
        _this._src = null;
        _this.mediaState = SURFACE_WAITING;
        _this.textureSurface = null;
        _this.textureSurfaceSet = false;
        _this.mediaPlayer = null;
        _this.mediaController = null;
        _this.preSeekTime = -1;
        _this.videoOpened = false;
        _this.eventPlaybackReady = false;
        _this.eventPlaybackStart = false;
        _this.lastTimerUpdate = -1;
        _this.interval = null;
        return _this;
    }
    Object.defineProperty(Video.prototype, "playState", {
        get: function () {
            if (!this.mediaPlayer) {
                return STATE_IDLE;
            }
            return this.mediaPlayer.getPlaybackState();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Video.prototype, "android", {
        get: function () {
            return this.nativeView;
        },
        enumerable: true,
        configurable: true
    });
    Video.prototype[videoplayer_common_1.videoSourceProperty.setNative] = function (value) {
        this._setNativeVideo(value ? value.android : null);
    };
    Video.prototype[videoplayer_common_2.subtitleSourceProperty.setNative] = function (value) {
        this._updateSubtitles(value ? value.android : null);
    };
    Video.prototype._setupTextureSurface = function () {
        if (!this.textureSurface) {
            if (!this._textureView.isAvailable()) {
                return;
            }
            this.textureSurface = new android.view.Surface(this._textureView.getSurfaceTexture());
        }
        if (this.textureSurface) {
            if (!this.mediaPlayer) {
                return;
            }
            if (!this.textureSurfaceSet) {
                this.mediaPlayer.setVideoSurface(this.textureSurface);
                this.mediaState = SURFACE_READY;
            }
            else {
                this.mediaState = SURFACE_WAITING;
            }
            if (!this.videoOpened) {
                this._openVideo();
            }
        }
    };
    Video.prototype.createNativeView = function () {
        var nativeView = new android.widget.RelativeLayout(this._context);
        this._textureView = new android.view.TextureView(this._context);
        this._textureView.setFocusable(true);
        this._textureView.setFocusableInTouchMode(true);
        this._textureView.requestFocus();
        nativeView.addView(this._textureView);
        if (this.enableSubtitles) {
            this._subtitlesView = new com.google.android.exoplayer2.ui.SubtitleView(this._context);
            this._subtitlesView.setUserDefaultStyle();
            this._subtitlesView.setUserDefaultTextSize();
            nativeView.addView(this._subtitlesView);
        }
        return nativeView;
    };
    Video.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var that = new WeakRef(this);
        this._setupMediaController();
        this._textureView.setOnTouchListener(new android.view.View.OnTouchListener({
            get owner() {
                return that.get();
            },
            onTouch: function () {
                if (this.owner) {
                    this.owner.toggleMediaControllerVisibility();
                }
                return false;
            }
        }));
        this._textureView.setSurfaceTextureListener(new android.view.TextureView.SurfaceTextureListener({
            get owner() {
                return that.get();
            },
            onSurfaceTextureSizeChanged: function (surface, width, height) {
                console.log("SurfaceTexutureSizeChange", width, height);
                this.owner._setupAspectRatio();
            },
            onSurfaceTextureAvailable: function () {
                if (this.owner) {
                    this.owner._setupTextureSurface();
                }
            },
            onSurfaceTextureDestroyed: function () {
                if (!this.owner) {
                    return true;
                }
                if (this.owner.textureSurface !== null) {
                    this.owner.textureSurfaceSet = false;
                    this.owner.textureSurface.release();
                    this.owner.textureSurface = null;
                }
                if (this.owner.mediaController !== null) {
                    this.owner.mediaController.hide();
                }
                this.owner.release();
                return true;
            },
            onSurfaceTextureUpdated: function () {
            }
        }));
        application.on(application.suspendEvent, this._boundStop);
        application.on(application.resumeEvent, this._boundStart);
    };
    Video.prototype.disposeNativeView = function () {
        this.disableEventTracking();
    };
    Video.prototype.disableEventTracking = function () {
        application.off(application.suspendEvent, this._boundStop);
        application.off(application.resumeEvent, this._boundStart);
    };
    Video.prototype.toggleMediaControllerVisibility = function () {
        if (!this.mediaController || !this.mediaPlayer) {
            return;
        }
        if (this.mediaController.isVisible()) {
            this.mediaController.hide();
        }
        else {
            this.mediaController.show();
        }
    };
    Video.prototype._setupMediaPlayerListeners = function () {
        var that = new WeakRef(this);
        var vidListener = new com.google.android.exoplayer2.SimpleExoPlayer.VideoListener({
            get owner() {
                return that.get();
            },
            onRenderedFirstFrame: function () {
                if (this.owner && !this.owner.eventPlaybackReady) {
                    this.owner.eventPlaybackReady = true;
                    this.owner._emit(videoCommon.Video.playbackReadyEvent);
                }
            },
            onVideoSizeChanged: function (width, height) {
                if (this.owner) {
                    this.owner.videoWidth = width;
                    this.owner.videoHeight = height;
                    if (this.owner.fill !== true) {
                        this.owner._setupAspectRatio();
                    }
                }
            }
        });
        var evtListener = new com.google.android.exoplayer2.ExoPlayer.EventListener({
            get owner() {
                return that.get();
            },
            onLoadingChanged: function () {
            },
            onPlayerError: function (error) {
                console.error("PlayerError", error);
            },
            onPlayerStateChanged: function (playWhenReady, playbackState) {
                if (!this.owner) {
                    return;
                }
                if (!this.owner.textureSurfaceSet) {
                    this.owner._setupTextureSurface();
                }
                if (playbackState === STATE_READY) {
                    if (!this.owner.textureSurfaceSet && !this.owner.eventPlaybackReady) {
                        this.owner.eventPlaybackReady = true;
                        this.owner._emit(videoCommon.Video.playbackReadyEvent);
                    }
                    if (this.owner._onReadyEmitEvent.length) {
                        do {
                            this.owner._emit(this.owner._onReadyEmitEvent.shift());
                        } while (this.owner._onReadyEmitEvent.length);
                    }
                    if (playWhenReady && !this.owner.eventPlaybackStart) {
                        this.owner.eventPlaybackStart = true;
                    }
                }
                else if (playbackState === STATE_ENDED) {
                    if (!this.owner.loop) {
                        this.owner.eventPlaybackStart = false;
                        this.owner.stopCurrentTimer();
                    }
                    this.owner._emit(videoCommon.Video.finishedEvent);
                    if (this.owner.loop) {
                        this.owner.play();
                    }
                }
            },
            onPositionDiscontinuity: function () {
            },
            onSeekProcessed: function () {
            },
            onTimelineChanged: function () {
            },
            onTracksChanged: function () {
            },
            onSeekProcessed: function () {
            }
        });
        this.mediaPlayer.setVideoListener(vidListener);
        this.mediaPlayer.addListener(evtListener);
    };
    Video.prototype._setupMediaController = function () {
        if (this.controls !== false || this.controls === undefined) {
            if (this.mediaController == null) {
                this.mediaController = new com.google.android.exoplayer2.ui.PlaybackControlView(this._context);
                this.nativeView.addView(this.mediaController);
                var params = this.mediaController.getLayoutParams();
                params.addRule(14);
                params.addRule(12);
                this.mediaController.setLayoutParams(params);
            }
            else {
                return;
            }
        }
    };
    Video.prototype._setupAspectRatio = function () {
        var viewWidth = this._textureView.getWidth();
        var viewHeight = this._textureView.getHeight();
        var aspectRatio = this.videoHeight / this.videoWidth;
        var newWidth;
        var newHeight;
        if (viewHeight > (viewWidth * aspectRatio)) {
            newWidth = viewWidth;
            newHeight = (viewWidth * aspectRatio);
        }
        else {
            newWidth = (viewHeight / aspectRatio);
            newHeight = viewHeight;
        }
        var xoff = (viewWidth - newWidth) / 2;
        var yoff = (viewHeight - newHeight) / 2;
        var txform = new android.graphics.Matrix();
        this._textureView.getTransform(txform);
        txform.setScale(newWidth / viewWidth, newHeight / viewHeight);
        txform.postTranslate(xoff, yoff);
        this._textureView.setTransform(txform);
    };
    Video.prototype._detectTypeFromSrc = function (uri) {
        var type = com.google.android.exoplayer2.util.Util.inferContentType(uri);
        switch (type) {
            case 0: return this.TYPE.DASH;
            case 1: return this.TYPE.SS;
            case 2: return this.TYPE.HLS;
            default: return this.TYPE.OTHER;
        }
    };
    Video.prototype._openVideo = function () {
        if (this._src === null) {
            return;
        }
        this.release();
        if (!this.interval && this.observeCurrentTime) {
            this.startCurrentTimer();
        }
        this.videoOpened = true;
        var am = utils.ad.getApplicationContext().getSystemService(android.content.Context.AUDIO_SERVICE);
        am.requestAudioFocus(null, android.media.AudioManager.STREAM_MUSIC, android.media.AudioManager.AUDIOFOCUS_GAIN);
        try {
            var bm = new com.google.android.exoplayer2.upstream.DefaultBandwidthMeter();
            var trackSelection = new com.google.android.exoplayer2.trackselection.AdaptiveTrackSelection.Factory(bm);
            var trackSelector = new com.google.android.exoplayer2.trackselection.DefaultTrackSelector(trackSelection);
            var loadControl = new com.google.android.exoplayer2.DefaultLoadControl();
            this.mediaPlayer =
                com.google.android.exoplayer2.ExoPlayerFactory.newSimpleInstance(this._context, trackSelector, loadControl);
            if (this.textureSurface && !this.textureSurfaceSet) {
                this.textureSurfaceSet = true;
                this.mediaPlayer.setVideoSurface(this.textureSurface);
            }
            else {
                this._setupTextureSurface();
            }
            if (this.enableSubtitles) {
                this.mediaPlayer.setTextOutput(this._subtitlesView);
            }
            var dsf = new com.google.android.exoplayer2.upstream.DefaultDataSourceFactory(this._context, "NativeScript", bm);
            var ef = new com.google.android.exoplayer2.extractor.DefaultExtractorsFactory();
            var vs = void 0, uri = void 0;
            if (this._src instanceof String || typeof this._src === "string") {
                uri = android.net.Uri.parse(this._src);
                var type = this._detectTypeFromSrc(this._src);
                switch (type) {
                    case this.TYPE.SS:
                        vs = new com.google.android.exoplayer2.source.smoothstreaming.SsMediaSource(uri, dsf, new com.google.android.exoplayer2.source.smoothstreaming.DefaultSsChunkSource.Factory(dsf), null, null);
                        break;
                    case this.TYPE.DASH:
                        vs = new com.google.android.exoplayer2.source.dash.DashMediaSource(uri, dsf, new com.google.android.exoplayer2.source.dash.DefaultDashChunkSource.Factory(dsf), null, null);
                        break;
                    case this.TYPE.HLS:
                        vs = new com.google.android.exoplayer2.source.hls.HlsMediaSource(uri, dsf, null, null);
                        break;
                    default:
                        vs = new com.google.android.exoplayer2.source.ExtractorMediaSource(uri, dsf, ef, null, null, null);
                }
            }
            else if (typeof this._src.typeSource === "number") {
                uri = android.net.Uri.parse(this._src.url);
                switch (this._src.typeSource) {
                    case this.TYPE.SS:
                        vs = new com.google.android.exoplayer2.source.smoothstreaming.SsMediaSource(uri, dsf, new com.google.android.exoplayer2.source.smoothstreaming.DefaultSsChunkSource.Factory(dsf), null, null);
                        break;
                    case this.TYPE.DASH:
                        vs = new com.google.android.exoplayer2.source.dash.DashMediaSource(uri, dsf, new com.google.android.exoplayer2.source.dash.DefaultDashChunkSource.Factory(dsf), null, null);
                        break;
                    case this.TYPE.HLS:
                        vs = new com.google.android.exoplayer2.source.hls.HlsMediaSource(uri, dsf, null, null);
                        break;
                    default:
                        vs = new com.google.android.exoplayer2.source.ExtractorMediaSource(uri, dsf, ef, null, null, null);
                }
            }
            else {
                vs = this._src;
            }
            try {
                if (this._subtitlesSrc != null && this._subtitlesSrc.trim() != "") {
                    var subtitleUri = android.net.Uri.parse(this._subtitlesSrc.trim());
                    var textFormat = com.google.android.exoplayer2.Format.createTextSampleFormat(null, com.google.android.exoplayer2.util.MimeTypes.APPLICATION_SUBRIP, null, com.google.android.exoplayer2.Format.NO_VALUE, com.google.android.exoplayer2.Format.NO_VALUE, "en", null);
                    var subtitlesSrc = new com.google.android.exoplayer2.source.SingleSampleMediaSource(subtitleUri, dsf, textFormat, com.google.android.exoplayer2.C.TIME_UNSET);
                    var mergedArray = Array.create(com.google.android.exoplayer2.source.MediaSource, 2);
                    mergedArray[0] = vs;
                    mergedArray[1] = subtitlesSrc;
                    vs = new com.google.android.exoplayer2.source.MergingMediaSource(mergedArray);
                }
            }
            catch (ex) {
                console.log("Error loading subtitles:", ex, ex.stack);
            }
            if (this.mediaController) {
                this.mediaController.setPlayer(this.mediaPlayer);
            }
            this._setupMediaPlayerListeners();
            this.mediaPlayer.prepare(vs);
            if (this.autoplay === true) {
                this.mediaPlayer.setPlayWhenReady(true);
            }
            if (this.preSeekTime > 0) {
                this.mediaPlayer.seekTo(this.preSeekTime);
                this.preSeekTime = -1;
            }
            this.mediaState = SURFACE_READY;
        }
        catch (ex) {
            console.log("Error:", ex, ex.stack);
        }
    };
    Video.prototype._setNativeVideo = function (nativeVideo) {
        this._src = nativeVideo;
        this._suspendLocation = 0;
        this._openVideo();
    };
    Video.prototype.setNativeSource = function (nativePlayerSrc) {
        this._src = nativePlayerSrc;
        this._suspendLocation = 0;
        this._openVideo();
    };
    Video.prototype._updateSubtitles = function (subtitlesSrc) {
        if (this.enableSubtitles) {
            this._subtitlesSrc = subtitlesSrc;
            if (this.mediaPlayer != null) {
                this.preSeekTime = this.mediaPlayer.getCurrentPosition();
            }
            this._openVideo();
        }
    };
    Video.prototype.play = function () {
        if (!this.mediaPlayer || this.mediaState === SURFACE_WAITING) {
            this._openVideo();
        }
        else if (this.playState === STATE_ENDED) {
            this.eventPlaybackStart = false;
            this.mediaPlayer.seekToDefaultPosition();
            this.startCurrentTimer();
        }
        else {
            this.mediaPlayer.setPlayWhenReady(true);
            this.startCurrentTimer();
        }
    };
    Video.prototype.pause = function () {
        if (this.mediaPlayer) {
            this.mediaPlayer.setPlayWhenReady(false);
        }
    };
    Video.prototype.mute = function (mute) {
        if (this.mediaPlayer) {
            if (mute === true) {
                this.mediaPlayer.setVolume(0);
            }
            else if (mute === false) {
                this.mediaPlayer.setVolume(1);
            }
        }
    };
    Video.prototype.stop = function () {
        if (this.mediaPlayer) {
            this.stopCurrentTimer();
            this.mediaPlayer.stop();
            this.release();
        }
    };
    Video.prototype._addReadyEvent = function (value) {
        if (this._onReadyEmitEvent.indexOf(value)) {
            return;
        }
        this._onReadyEmitEvent.push(value);
    };
    Video.prototype.seekToTime = function (ms) {
        this._addReadyEvent(videoCommon.Video.seekToTimeCompleteEvent);
        if (!this.mediaPlayer) {
            this.preSeekTime = ms;
            return;
        }
        else {
            this.preSeekTime = -1;
        }
        this.mediaPlayer.seekTo(ms);
    };
    Video.prototype.isPlaying = function () {
        if (!this.mediaPlayer) {
            return false;
        }
        if (this.playState === STATE_READY) {
            return this.mediaPlayer.getPlayWhenReady();
        }
        return false;
    };
    Video.prototype.getDuration = function () {
        if (!this.mediaPlayer || this.mediaState === SURFACE_WAITING || this.playState === STATE_IDLE) {
            return 0;
        }
        var duration = this.mediaPlayer.getDuration();
        if (isNaN(duration)) {
            return 0;
        }
        else {
            return duration;
        }
    };
    Video.prototype.getCurrentTime = function () {
        if (!this.mediaPlayer) {
            return 0;
        }
        return this.mediaPlayer.getCurrentPosition();
    };
    Video.prototype.setVolume = function (volume) {
        if (this.mediaPlayer) {
            this.mediaPlayer.setVolume(volume);
        }
    };
    Video.prototype.destroy = function () {
        this.release();
        this.src = null;
        this._textureView = null;
        this.mediaPlayer = null;
        this.mediaController = null;
    };
    Video.prototype.release = function () {
        this.stopCurrentTimer();
        this.videoOpened = false;
        this.eventPlaybackReady = false;
        this.eventPlaybackStart = false;
        this.textureSurfaceSet = false;
        if (this.mediaPlayer !== null) {
            this.mediaState = SURFACE_WAITING;
            this.mediaPlayer.release();
            this.mediaPlayer = null;
            if (this.mediaController && this.mediaController.isVisible()) {
                this.mediaController.hide();
            }
            var am = utils.ad.getApplicationContext().getSystemService(android.content.Context.AUDIO_SERVICE);
            am.abandonAudioFocus(null);
        }
    };
    Video.prototype.suspendEvent = function () {
        this._suspendLocation = this.getCurrentTime();
        this.release();
    };
    Video.prototype.resumeEvent = function () {
        if (this._suspendLocation) {
            this.seekToTime(this._suspendLocation);
            this._suspendLocation = 0;
        }
        this._openVideo();
    };
    Video.prototype.startCurrentTimer = function () {
        var _this = this;
        if (this.interval) {
            return;
        }
        this.lastTimerUpdate = -1;
        this.interval = setInterval(function () {
            _this.fireCurrentTimeEvent();
        }, 200);
    };
    Video.prototype.fireCurrentTimeEvent = function () {
        if (!this.mediaPlayer) {
            return;
        }
        var curTimer = this.mediaPlayer.getCurrentPosition();
        if (curTimer !== this.lastTimerUpdate) {
            this.notify({
                eventName: videoCommon.Video.currentTimeUpdatedEvent,
                object: this,
                position: curTimer
            });
            this.lastTimerUpdate = curTimer;
        }
    };
    Video.prototype.stopCurrentTimer = function () {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.fireCurrentTimeEvent();
    };
    return Video;
}(videoCommon.Video));
exports.Video = Video;
