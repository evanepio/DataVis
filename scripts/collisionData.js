(function () {
    "use strict";

    var getCollisionTypes = function (collisionData) {
        var placeMap = {};

        collisionData.forEach(function (item) {
            placeMap[item["Collision Fatalities"]] = true;
        });

        return Object.keys(placeMap).sort();
    };

    var buildCollisionDataForGraph = function (collisionData, allGroups) {
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
                        group: allGroups.indexOf(collisionType["Collision Fatalities"])
                    });
                }

            });
        });

        return dataPoints;
    };

    var getDriverClasses = function (driverData) {
        return driverData.map(function (driverDatum) {
            return driverDatum["License"];
        });
    };

    var buildDriverDataForGraph = function (driverData, allGroups) {
        var dataPoints = [];

        driverData.forEach(function (driverDatum) {
            var driverClass = driverDatum["License"];
            var nonLicenseKeys = Object.keys(driverDatum).filter(function (key) {
                return key !== "License";
            });

            nonLicenseKeys.forEach(function (key) {
                dataPoints.push({
                    x: key.split("-")[0],
                    y: driverDatum[key].split(",").join(""),
                    group: allGroups.indexOf(driverClass)
                });
            });
        });

        return dataPoints;
    };

    var promises = [DATA_LOADER.promiseData("data/collisions/vehicle-collisions.json"),
        DATA_LOADER.promiseData("data/collisions/impaired-convictions.json"),
        DATA_LOADER.promiseData("data/collisions/drivers-by-class.json")];

    Promise.all(promises).then(function (results) {
        // Success! Load the chart!
        var container = document.getElementById('chart');

        var allGroups = getCollisionTypes(results[0])
            .concat(getDriverClasses(results[2]));


        var items = buildCollisionDataForGraph(results[0], allGroups)
            .concat(buildDriverDataForGraph(results[2], allGroups));

        var groups = new vis.DataSet();
        allGroups.forEach(function (collisionType, index) {
            groups.add({
                id: index,
                content: collisionType
            });
        });

        var dataSet = new vis.DataSet(items);

        var options = {
            drawPoints: true,
            dataAxis: {visible: false},
            legend: true,
            height: '750px'
        };

        new vis.Graph2d(container, dataSet, groups, options);
    }, function (error) {
        document.getElementById("chart").innerHTML = "Error loading data.";
        console.error(error)
    });
}());