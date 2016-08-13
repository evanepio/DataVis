/**
 * Created by evanporter on 2016-06-18.
 */
HISTORIC_DATA = (function () {
    "use strict";

    var data = null;

    return {
        loadData: function (dataUrl, successCallback, errorCallback, transformData) {
            var xhr = new XMLHttpRequest();

            xhr.onload = function () {
                if (this.status == 200 && this.responseText) {
                    // success!
                    data = transformData(JSON.parse(this.responseText));
                    successCallback();
                } else {
                    // something went wrong
                    errorCallback();
                }
            };

            xhr.open("get", dataUrl, true);
            xhr.send(null);
        },
        getUniquePlaces: function () {
            var placeMap = {};

            data.forEach(function (item) {
                placeMap[item["Location"]] = true;
            });

            return Object.keys(placeMap).sort();
        },
        getDataForLocation: function (location) {
            var placeData = data.filter(function (item) {
                return item["Location"] === location;
            });

            return placeData.map(function (item) {
                return {
                    x: item["Year"] + "-" + item["Month"],
                    y: item["Visitors"]
                };
            });
        },
        getAllData: function () {
            var locations = this.getUniquePlaces();

            return data.map(function (item) {
                return {
                    x: item["Year"] + "-" + item["Month"],
                    y: item["Visitors"],
                    group: locations.indexOf(item["Location"])
                };
            });
        }
    };
}());

(function () {
    HISTORIC_DATA.loadData("data/historic_site_visitors.json", function () {
        "use strict";

        // Success! Load the chart!
        var container = document.getElementById('chart');
        var locations = HISTORIC_DATA.getUniquePlaces();
        var items = HISTORIC_DATA.getAllData();

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