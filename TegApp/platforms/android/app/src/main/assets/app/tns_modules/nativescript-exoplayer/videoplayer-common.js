"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var videoSource = require("./video-source/video-source");
var subtitleSource = require("./subtitle-source/subtitle-source");
var utils_1 = require("utils/utils");
var types_1 = require("utils/types");
var view_1 = require("ui/core/view");
var imageSource = require("image-source");
function onSrcPropertyChanged(view, oldValue, newValue) {
    var video = view;
    var value = newValue;
    if (types_1.isString(value)) {
        value = value.trim();
        video.videoSource = null;
        video["_url"] = value;
        video.isLoadingProperty = true;
        if (utils_1.isFileOrResourcePath(value)) {
            video.videoSource = videoSource.fromFileOrResource(value);
            video.isLoadingProperty = false;
        }
        else {
            if (video["_url"] === value) {
                video.videoSource = videoSource.fromUrl(value);
                video.isLoadingProperty = false;
            }
        }
    }
    else if (value instanceof videoSource.VideoSource) {
        video.videoSource = value;
    }
    else {
        video.videoSource = videoSource.fromNativeSource(value);
    }
}
function onSubtitlesPropertyChanged(view, oldValue, newValue) {
    var video = view;
    if (types_1.isString(newValue)) {
        var value = newValue.trim();
        video.subtitleSource = null;
        if (utils_1.isFileOrResourcePath(value)) {
            video.subtitleSource = subtitleSource.fromFileOrResource(value);
        }
        else {
            video.subtitleSource = subtitleSource.fromUrl(value);
        }
    }
}
function onImgSrcPropertyChanged(view, oldValue, newValue) {
    var video = view;
    var value = newValue;
    if (types_1.isString(value)) {
        value = value.trim();
        video["_url"] = value;
        video.isLoadingProperty = true;
        if (utils_1.isFileOrResourcePath(value)) {
            video.imageSource = imageSource.fromFileOrResource(value);
            video.isLoadingProperty = false;
        }
        else {
            if (video["_url"] === value) {
                video.imageSource = imageSource.fromUrl(value);
                video.isLoadingProperty = false;
            }
        }
    }
    else if (value instanceof imageSource.ImageSource) {
        video.imageSource = value;
    }
    else {
        video.imageSource = imageSource.fromNativeSource(value);
    }
}
var Video = (function (_super) {
    __extends(Video, _super);
    function Video() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imgType = 1;
        _this.autoplay = false;
        _this.controls = true;
        _this.loop = false;
        _this.muted = false;
        _this.fill = false;
        return _this;
    }
    Video.finishedEvent = "finished";
    Video.playbackReadyEvent = "playbackReady";
    Video.playbackStartEvent = "playbackStart";
    Video.seekToTimeCompleteEvent = "seekToTimeComplete";
    Video.currentTimeUpdatedEvent = "currentTimeUpdated";
    Video.IMAGETYPEMONO = 1;
    Video.IMAGETYPESTEREOTOPBOTTOM = 2;
    Video.IMAGETYPESTEREOLEFTRIGHT = 3;
    return Video;
}(view_1.View));
exports.Video = Video;
exports.srcProperty = new view_1.Property({
    name: "src",
    valueChanged: onSrcPropertyChanged
});
exports.srcProperty.register(Video);
exports.imgSrcProperty = new view_1.Property({
    name: "imgSrc",
    valueChanged: onImgSrcPropertyChanged
});
exports.imgSrcProperty.register(Video);
exports.imgTypeProperty = new view_1.Property({
    name: "imgType",
});
exports.imgTypeProperty.register(Video);
exports.subtitlesProperty = new view_1.Property({
    name: "subtitles",
    valueChanged: onSubtitlesPropertyChanged
});
exports.subtitlesProperty.register(Video);
exports.subtitleSourceProperty = new view_1.Property({
    name: "subtitleSource",
});
exports.subtitleSourceProperty.register(Video);
exports.videoSourceProperty = new view_1.Property({
    name: "videoSource",
});
exports.videoSourceProperty.register(Video);
exports.imageSourceProperty = new view_1.Property({
    name: "imageSource",
});
exports.imageSourceProperty.register(Video);
exports.isLoadingProperty = new view_1.Property({
    name: "isLoading",
    valueConverter: view_1.booleanConverter,
});
exports.isLoadingProperty.register(Video);
exports.observeCurrentTimeProperty = new view_1.Property({
    name: "observeCurrentTime",
    valueConverter: view_1.booleanConverter,
});
exports.observeCurrentTimeProperty.register(Video);
exports.autoplayProperty = new view_1.Property({
    name: "autoplay",
    valueConverter: view_1.booleanConverter,
});
exports.autoplayProperty.register(Video);
exports.controlsProperty = new view_1.Property({
    name: "controls",
    valueConverter: view_1.booleanConverter,
});
exports.controlsProperty.register(Video);
exports.loopProperty = new view_1.Property({
    name: "loop",
    valueConverter: view_1.booleanConverter,
});
exports.loopProperty.register(Video);
exports.mutedProperty = new view_1.Property({
    name: "muted",
    valueConverter: view_1.booleanConverter,
});
exports.mutedProperty.register(Video);
exports.fillProperty = new view_1.Property({
    name: "fill",
    valueConverter: view_1.booleanConverter,
});
exports.fillProperty.register(Video);
