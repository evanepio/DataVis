(function () {
    "use strict";

    var getCollisionTypes = function (collisionData) {
        var placeMap = {};

        collisionData.forEach(function (item) {
            placeMap[item["Collision Fatalities"]] = true;
        });

        return Object.keys(placeMap).sort();
    };

    var buildDataForGraph = function (collisionData) {
        var collisionTypes = getCollisionTypes(collisionData);
        var dataPoints = [];

        var years = Object.keys(collisionData[0]).filter(function (collisionType) {
            return collisionType !== "Collision Fatalities";
        });

        collisionData.forEach(function (collisionType) {
            years.forEach(function (year) {
                if (!isNaN(year)) {
                    dataPoints.push({
                        x: year,
                        y: collisionType[year].split(',').join(''),
                        group: collisionTypes.indexOf(collisionType["Collision Fatalities"])
                    });
                }

            });
        });

        return dataPoints;
    };

    DATA_LOADER.loadData("data/collisions/vehicle-collisions.json", function (collisionData) {

        // Success! Load the chart!
        var container = document.getElementById('chart');
        var collisionTypes = getCollisionTypes(collisionData);
        var items = buildDataForGraph(collisionData);

        var groups = new vis.DataSet();
        collisionTypes.forEach(function (collisionType, index) {
            groups.add({
                id: index,
                content: collisionType
            });
        });

        var dataSet = new vis.DataSet(items);

        var options = {
            drawPoints: true,
            dataAxis: {visible: false},
            legend: true
        };

        new vis.Graph2d(container, dataSet, groups, options);
    }, function () {
        // Failure. WTF.
        document.getElementById("chart").innerHTML = "Error loading data.";
    });
}());