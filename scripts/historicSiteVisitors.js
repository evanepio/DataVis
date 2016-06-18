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

    // Months are numbers, so we need to pad them with zeros
    var normalizeMonths = function (dataArray) {
        dataArray.forEach(function (item) {
            if (item["Month"] && item["Month"].length === 1) {
                item["Month"] = "0" + item["Month"];
            }
        });

        return dataArray;
    };

    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (this.status == 200 && this.responseText) {
            // success!
            updateStatus("Data loaded.");
            historicData = normalizeMonths(JSON.parse(this.responseText));
        } else {
            // something went wrong
            updateStatus("Terrible news. The data didn't load. Yikes.");
        }
    };

    xhr.open("get", "data/historic_site_visitors.json", true);
    xhr.send(null);

    return {
        doneLoading: function () {
            return !!historicData;
        },
        getUniquePlaces: function () {
            var placeMap = {};

            historicData.forEach(function (item) {
                placeMap[item["Location"]] = true;
            });

            return Object.keys(placeMap);
        }
    };
}(window, document));