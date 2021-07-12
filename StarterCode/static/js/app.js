function init() {
    var selector = d3.select('#selDataset');

    d3.json("./samples.json").then((data) => {
        var dataNames = data.names;
        dataNames.forEach((sample) => {
            selector.append('option').text(sample).property("value", sample);
        });
        var firstdata = dataNames[0];
        updateMetadata(firstdata);
        updateCharts(firstdata);
    });
}



 function updateMetadata(sample) {
     d3.json('samples.json').then((data) => {
        var metadata = data.metadata;
        var results = metadata.filter((dataobject) => dataobject.id == sample);
        var values = Object.entries(results[0]);
        var panel = d3.select('#sample-metadata'); 

        panel.html('');
        var results = values.forEach(function(values) {
            panel.append('h6').text(values[0]+': '+values[1])

        });
     });
      
 }

 function updateCharts(sample) {
     d3.json('./samples.json').then(function({samples, metadata}) {
         var data = samples.filter((obj) => obj.id == sample)[0];
         console.log(data);
         var otuIds = data.otu_ids.map((row)=> `otu ID: ${row}`);
         var sampleValues = data.sample_values.slice(0,10);
         var sampleLabels = data.otu_labels.map((label) => label.replace(/\;/g, ', ')
        );
        var bubble_otuIds = data.out_ids;
        var bubble_values = data.sample_values;
        var bubble_labels = data.otu_labels.map((label) => label.replace(/\;/g,', ')
        );
        var gaugeData = metadata.filter((obj) => obj.id == sample)[0];
        var wfreq = gaugeData.wfreq;
        var trace1 = [
            {
                x: sampleValues,
                y: otuIds,
                type: 'bar',
                orientation: 'h',
                text: sampleLabels,
                hoverinfo: 'text',
            },
        ];
        var trace2 = [
            {
                x: bubble_otuIds,
                y: bubble_values,
                mode: 'markers',
                text: sampleLabels,
                marker: {
                    size: sampleValues,
                    color: otuIds,
                },
            },
        ];
        var trace3 = [
            {
                value: wfreq,
                title:{
                    text: 'Freq per Week'
                },
                type: 'indicator',
                mode: 'gauge+number',
                gauge: {
                    axos: {range: [null, 9]},
                },
            },
        ];
        var layout1 = {
            margin: {
                t: 40,
                l:150,
            },
            title: {
                text: "Top 10 Bacterial Species(otus)",
            },
        };
        var layout2 = {
            xaxis: {
                title: "Top 10 Bacterial Species(otus)",
            },
        };


        Plotly.newPlot('bar', trace1, layout1);
        Plotly.newPlot('bubble', trace2, layout2);
        Plotly.newPlot('gauge', trace3);
     });
 }

init();

function optionChanged(newData) {
    updateMetadata(newData);
    updateCharts(newData);
    }