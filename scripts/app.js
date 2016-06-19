/**
 * Created by evanporter on 2016-06-18.
 */
(function () {
    HISTORIC_DATA.loadData(function () {
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
    });
}());