(function () {
    var sortByXAxisThenLocation = function(a, b) {
        if(a['xAxis'] === b['xAxis']) {
            if (a['Location'] === b['Location']) {
                return 0;
            } else {
                return a['Location'] < b['Location'] ? -1 : 1;
            }
        } else {
            return a['xAxis'] < b['xAxis'] ? -1 : 1;
        }
    };

    var buildData = function (historicData) {
        historicData.map(function(item) {
            var month = item["Month"].length === 2 ? item["Month"] : "0" + item["Month"];
            item['xAxis'] = item['Year'] + '-' + month;
            return item;
        }).sort(sortByXAxisThenLocation);

        var dataSetsByLocation = historicData.reduce(function(accumulator, currentValue){
            var dataset = accumulator[currentValue['Location']] || {
                label: currentValue['Location'],
                data: []
            };

            dataset.data.push(currentValue['Visitors']);

            accumulator[currentValue['Location']] = dataset;

            return accumulator;
        }, {});

        var data = {
            labels: [],
            datasets: []
        };

        historicData.forEach(function(item){
            data.labels.push(item['xAxis']);
        });

        Object.keys(dataSetsByLocation).forEach(function(key){

            data.datasets.push(dataSetsByLocation[key]);
        });

        return data;
    };

    DATA_LOADER.loadData("data/historic_site_visitors.json", function (historicData) {
        "use strict";

        var ctx = document.getElementById('chart').getContext('2d');

        var data = buildData(historicData);

        new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: data,

            // Configuration options go here
            options: {}
        });
    }, function () {
        // Failure. WTF.
        document.getElementById("chart").innerHTML = "Error loading data.";
    });
}());