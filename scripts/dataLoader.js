DATA_LOADER = (function () {
    "use strict";

    return {
        loadData: function (dataUrl, successCallback, errorCallback, transformData) {
            var xhr = new XMLHttpRequest();

            xhr.onload = function () {
                if (this.status == 200 && this.responseText) {
                    // success!
                    var data = transformData(JSON.parse(this.responseText));
                    successCallback(data);
                } else {
                    // something went wrong
                    errorCallback();
                }
            };

            xhr.open("get", dataUrl, true);
            xhr.send(null);
        }
    };
}());