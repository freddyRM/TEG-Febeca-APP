"use strict";
var view_1 = require('ui/core/view');
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var VidPlayer = (function (_super) {
    __extends(VidPlayer, _super);
    function VidPlayer() {
        _super.call(this);
    }
    Object.defineProperty(VidPlayer.prototype, "src", {
        get: function () {
            return this._getValue(VidPlayer.srcProperty);
        },
        set: function (val) {
            this._setValue(VidPlayer.srcProperty, val);
        },
        enumerable: true,
        configurable: true
    });
    VidPlayer.srcProperty = new dependencyObservable.Property("src", "VidPlayer", new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None));
    return VidPlayer;
}(view_1.View));
exports.VidPlayer = VidPlayer;
