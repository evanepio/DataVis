/**
 * Created by evanporter on 2016-06-18.
 */
HISTORIC_DATA = (function (w, d) {
    "use strict";

    var historicData = null;

    // Put a new status message in the status div
    var updateStatus = function (status) {
        var statusDiv = d.getElementById('status');
        statusDiv.innerHTML = status;
    };

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("progress", function (event) {
        if (event.lengthComputable) {
            var percentComplete = event.loaded / event.total;
            updateStatus("Percent loaded: " + percentComplete);
        } else {
            updateStatus("Percent loaded: unknowable?");
        }
    });

    xhr.onload = function () {
        if (this.status == 200 && this.responseText !== null) {
            // success!
            updateStatus("Data loaded.");
            historicData = this.responseText;
        } else {
            // something went wrong
            updateStatus("Terrible news. The data didn't load. Yikes.");
        }
    };

    xhr.open("get", "data/historic_site_visitors.json", true);
    xhr.send(null);

    return {};
}(window, document));