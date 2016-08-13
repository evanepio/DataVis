/**
 * Created by evanporter on 2016-06-18.
 */
HISTORIC_DATA = (function () {
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

(function () {

    var getUniquePlaces = function (historicData) {
        var placeMap = {};

        historicData.forEach(function (item) {
            placeMap[item["Location"]] = true;
        });

        return Object.keys(placeMap).sort();
    };

    var getAllData = function (historicData) {
        var locations = getUniquePlaces(historicData);

        return historicData.map(function (item) {
            return {
                x: item["Year"] + "-" + item["Month"],
                y: item["Visitors"],
                group: locations.indexOf(item["Location"])
            };
        });
    };

    HISTORIC_DATA.loadData("data/historic_site_visitors.json", function (historicData) {
        "use strict";

        // Success! Load the chart!
        var container = document.getElementById('chart');
        var locations = getUniquePlaces(historicData);
        var items = getAllData(historicData);

        var groups = new vis.DataSet();
        locations.forEach(function (location, index) {
            groups.add({
                id: index,
                content: location
            });
        });

        var dataSet = new vis.DataSet(items);

        var options = {
            drawPoints: true,
            dataAxis: {visible: false},
            legend: true
        };

        var graph2d = new vis.Graph2d(container, dataSet, groups, options);
    }, function () {
        // Failure. WTF.
        document.getElementById("chart").innerHTML = "Error loading data.";
    }, function (dataArray) {
        dataArray.forEach(function (item) {
            if (item["Month"] && item["Month"].length === 1) {
                item["Month"] = "0" + item["Month"];
            }
        });

        return dataArray;
    });
}());