DATA_LOADER = (function () {
    "use strict";

    var _loadData = function (dataUrl, successCallback, errorCallback) {
        var xhr = new XMLHttpRequest();

        xhr.onload = function () {
            if (this.status == 200 && this.responseText) {
                // success!
                var data = JSON.parse(this.responseText);
                successCallback(data);
            } else {
                // something went wrong
                errorCallback();
            }
        };

        xhr.open("get", dataUrl, true);
        xhr.send(null);
    };

    return {
        loadData: _loadData,
        promiseData: function (dataUrl) {
            return new Promise(function (resolve, reject) {
                _loadData(dataUrl, resolve, reject);
            });
        }
    };
}());