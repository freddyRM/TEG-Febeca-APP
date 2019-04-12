"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("tns-core-modules/file-system");
var types_1 = require("tns-core-modules/utils/types");
var videoplayer_common_1 = require("../videoplayer-common");
__export(require("./video-source-common"));
var VideoSource = (function () {
    function VideoSource() {
    }
    VideoSource.prototype.loadFromResource = function (name) {
        videoplayer_common_1.CLog(videoplayer_common_1.CLogTypes.info, "VideoSource.loadFromResource --- name " + name);
        var videoURL = NSBundle.mainBundle.URLForResourceWithExtension(name, null);
        var player = AVPlayerItem.playerItemWithURL(videoURL);
        this.ios = player;
        return this.ios != null;
    };
    VideoSource.prototype.loadFromFile = function (path) {
        videoplayer_common_1.CLog(videoplayer_common_1.CLogTypes.info, "VideoSource.loadFromFile --- path " + path);
        var fileName = types_1.isString(path) ? path.trim() : '';
        if (fileName.indexOf('~/') === 0) {
            fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace('~/', ''));
            videoplayer_common_1.CLog(videoplayer_common_1.CLogTypes.info, "VideoSource.loadFromFile --- fileName " + fileName);
        }
        var videoURL = NSURL.fileURLWithPath(fileName);
        var player = AVPlayerItem.playerItemWithURL(videoURL);
        this.ios = player;
        return this.ios != null;
    };
    VideoSource.prototype.loadFromUrl = function (url) {
        videoplayer_common_1.CLog(videoplayer_common_1.CLogTypes.info, "VideoSource.loadFromUrl --- url " + url);
        var videoURL = NSURL.URLWithString(url);
        var player = AVPlayerItem.playerItemWithURL(videoURL);
        this.ios = player;
        return this.ios != null;
    };
    VideoSource.prototype.setNativeSource = function (source) {
        videoplayer_common_1.CLog(videoplayer_common_1.CLogTypes.info, "VideoSource.setNativeSource --- source " + source);
        this.ios = source;
        return source != null;
    };
    return VideoSource;
}());
exports.VideoSource = VideoSource;
//# sourceMappingURL=video-source.ios.js.map