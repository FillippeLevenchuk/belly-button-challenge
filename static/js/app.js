// Define the URL for the data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch JSON data using D3
d3.json(url).then(function(data) {


    console.log(data);
  });

// Perform setup when the dashboard initializes
function initDash() {

    // Choose the dropdown menu using D3
    let dropdownMenu = d3.select("#selDataset");

    // Fetch sample names using D3 and populate the dropdown selector
    d3.json(url).then((data) => {
        
        // Store sample names in a variable
        let sampleNames = data.names;

        // Add samples to the dropdown menu
        sampleNames.forEach((id) => {

            // Display the current sample ID in the log
            console.log(id);

            // Append an option to the dropdown menu
            dropdownMenu.append("option")
                .text(id)
                .property("value", id);
        });

        // Select the first sample from the list
        let firstSample = sampleNames[0];

        // Display the value of the first sample in the log
        console.log(firstSample);

        // Create the initial visualizations
        Metadata(firstSample);
        BarChart(firstSample);
        BubbleChart(firstSample);
        GaugeChart(firstSample);
    });
};

// Function to create the bar chart
function BarChart(sample) {

    // Retrieve all data using D3
    d3.json(url).then((data) => {

        // Fetch all sample information
        let sampleData = data.samples;

        // Filter data for the specified sample
        let sampleValues = sampleData.filter(result => result.id === sample)[0];

        // Extract OTU IDs, labels, and sample values
        let otuIDs = sampleValues.otu_ids;
        let otuLabels = sampleValues.otu_labels;
        let sampleValuesList = sampleValues.sample_values;

        // Display the data in the console
        console.log(otuIDs, otuLabels, sampleValuesList);

        // Choose the top ten items to display in descending order
        let yTicks = otuIDs.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let xTicks = sampleValuesList.slice(0, 10).reverse();
        let labels = otuLabels.slice(0, 10).reverse();
        
        // Create the trace for the bar chart
        let trace = {
            x: xTicks,
            y: yTicks,
            text: labels,
            type: "bar",
            orientation: "h",
            marker: { color: "green"}
        };

        // Configure the layout
        let layout = {
            title: "Top 10 Most Abundant OTUs"
        };

        // Use Plotly to generate the bar chart
        Plotly.newPlot("bar", [trace], layout);
    });
};


// Function that builds the bubble chart
function BubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Portland"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function to display metadata information
function Metadata(sample) {

    // Fetch all data using D3
    d3.json(url).then((data) => {

        // Extract metadata
        let metadata = data.metadata;

        // Find metadata for the specified sample
        let sampleMetadata = metadata.filter(result => result.id == sample);

        // Display the filtered metadata
        console.log(sampleMetadata);
        let values = sampleMetadata[0];

        // Clear the existing metadata display
        d3.select("#sample-metadata").html("");

        // Display each key/value pair in the metadata panel
        Object.entries(values).forEach(([key, value]) => {

            // Display individual key/value pairs as they are added to the metadata panel
            console.log(key, value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// Function that builds the gauge chart
function GaugeChart(sample) {

    // Use D3 to retrieve all data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter metadata based on the selected sample
        let filteredMetadata = metadata.filter(result => result.id == sample);

        // Log the array of filtered metadata objects
        console.log("Filtered Metadata:", filteredMetadata);

        // Get the first index from the array
        let valueData = filteredMetadata[0];

        // Extract the washing frequency value
        let frequency = Object.values(valueData)[6];

        // Set up the trace for the gauge chart
        let gaugeTrace = {
            value: frequency,
            domain: { x: [0, 1], y: [0, 1] },
            title: {
                text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                font: { color: "black", size: 20 }
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 10], tickmode: "array", tick0: 2, dtick: 2 },
                bar: { color: "rgba(255, 0, 0, 0.8)" },
                steps: [
                    { range: [0, 1], color: "rgba(185, 248, 169, 0.8)" },
                    { range: [1, 7], color: "rgba(34, 222, 34, 0.8)" },
                    { range: [7, 9], color: "rgba(222, 59, 34, 0.8)" },
                    { range: [9, 10], color: "rgba(0, 0, 0, 10)" },
                ]
            }
        };

        // Set up the layout
        let layout = {
            width: 500,
            height: 500,
            margin: { t: 0, b: 0 }
        };

        // Call Plotly to plot the gauge chart
        Plotly.newPlot("gauge", [gaugeTrace], layout);
    });
};

// Function to handle changes when a new sample is selected
function optionChanged(selectedSample) { 

    // Display the new selected sample
    console.log(selectedSample); 

    // Invoke the necessary functions
    Metadata(selectedSample);
    BarChart(selectedSample);
    BubbleChart(selectedSample);
    GaugeChart(selectedSample);
};

// Initialize the dashboard
initDash();