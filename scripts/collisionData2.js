(function () {
    "use strict";

	var buildDataForGraph = function (data) {
		var dataPoints = [];

		data.forEach(function (item) {
			dataPoints.push({
				x: item["year"],
				y: item["number_of_collisions"],
				group: "Number of Collisions"
			});
			dataPoints.push({
				x: item["year"],
				y: item["number_of_fatalities"],
				group: "Number of Fatalities"
			});
		});

		return dataPoints;
	}
    var promise = DATA_LOADER.promiseData("https://data.princeedwardisland.ca/resource/bzym-2vv6.json");
	promise.then(function onSuccess(data) {
		var container = document.getElementById('chart');
		var items = buildDataForGraph(data);

		        var dataSet = new vis.DataSet(items);

        var options = {
            drawPoints: true,
            dataAxis: {visible: false},
            legend: true,
            height: '750px',
            zoomable: false
        };
		var groups = new vis.DataSet();
		groups.add( {id: 0, content: "Number of Collisions" } );
		groups.add( {id: 1, content: "Number of Fatalities" } );

		var theGraph = new vis.Graph2d(container, dataSet, groups, options);

	},
		function onError(error) {

        document.getElementById("chart").innerHTML = "Error loading data.";
        console.error(error)
		});
}());
