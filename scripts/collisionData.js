(function () {
    "use strict";

    var buildDataForGraph = function (data, allGroups, mainKey) {
        var dataPoints = [];

        data.forEach(function (datum) {
            var dataKeys = Object.keys(datum).filter(function (key) {
                return key !== mainKey;
            });

            dataKeys.forEach(function (key) {
                dataPoints.push({
                    x: key.split("-")[0],
                    y: datum[key].split(",").join(""),
                    group: allGroups.indexOf(datum[mainKey])
                });
            });
        });

        return dataPoints;
    };

    var getDataTypes = function (data, mainKey) {
        return data.map(function (datum) {
            return datum[mainKey];
        })
    };

    var promises = [DATA_LOADER.promiseData("data/collisions/vehicle-collisions.json"),
        DATA_LOADER.promiseData("data/collisions/impaired-convictions.json"),
        DATA_LOADER.promiseData("data/collisions/drivers-by-class.json")];

    Promise.all(promises).then(function (results) {
        // Success! Load the chart!
        var container = document.getElementById('chart');

        var allGroups = getDataTypes(results[0], "Collision Fatalities")
            .concat(getDataTypes(results[1], "Criminal Code Charges"))
            .concat(getDataTypes(results[2], "License"));

        allGroups.sort();

        var items = buildDataForGraph(results[0], allGroups, "Collision Fatalities")
            .concat(buildDataForGraph(results[1], allGroups, "Criminal Code Charges"))
            .concat(buildDataForGraph(results[2], allGroups, "License"));

        var groups = new vis.DataSet();
        allGroups.forEach(function (groupName, index) {
            groups.add({
                id: index,
                content: groupName
            });
        });

        var dataSet = new vis.DataSet(items);

        var options = {
            drawPoints: true,
            dataAxis: {visible: false},
            legend: true,
            height: '750px'
        };

        var theGraph = new vis.Graph2d(container, dataSet, groups, options);

        var controls = document.getElementById("controls");
        var visibilityOptions = {groups: {visibility: {}}};
        allGroups.forEach(function (group, index) {
            var id = "group" + index;
            var checkBox = document.createElement('input');
            checkBox.type = "checkbox";
            checkBox.name = "groupVisibility";
            checkBox.value = group;
            checkBox.id = id;

            var label = document.createElement('label');
            label.htmlFor = id;
            label.appendChild(document.createTextNode(group));

            controls.appendChild(checkBox);
            controls.appendChild(label);
            controls.appendChild(document.createElement('br'));

            checkBox.checked = "checked";
            checkBox.onchange = function () {
                visibilityOptions.groups.visibility[index] = !visibilityOptions.groups.visibility[index];

                theGraph.setOptions(visibilityOptions);
            };

            visibilityOptions.groups.visibility[index] = true;
        });

    }, function (error) {
        document.getElementById("chart").innerHTML = "Error loading data.";
        console.error(error)
    });
}());