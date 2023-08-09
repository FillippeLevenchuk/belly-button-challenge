// Define the URL for the data
const dataUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch and log the JSON data
d3.json(dataUrl).then(function(data) {
  console.log(data);
});

// Initialize the dashboard upon startup
function initDash() {

    // Use D3 to select the dropdown menu
    let dropdown = d3.select("#selDataset");

    // Fetch sample names using D3 and populate the dropdown selector
    d3.json(url).then((data) => {
        
        // Store sample names in a variable
        let sampleNames = data.names;

        // Add samples to the dropdown menu
        sampleNames.forEach((id) => {

            // Log the current sample ID
            console.log("Sample ID:", id);

            // Append an option to the dropdown menu
            dropdown.append("option")
                .text(id)
                .property("value", id);
        });

        // Select the first sample from the list
        let firstSample = sampleNames[0];

        // Log the value of the first sample
        console.log("First Sample:", firstSample);

        // Build the initial plots
        GaugeChart(firstSample);
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
                font: { color: "black", size: 18 }
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 10], tickmode: "linear", tick0: 2, dtick: 2 },
                bar: { color: "rgba(255, 0, 0, 0.8)" },
                steps: [
                    { range: [0, 1], color: "rgba(0, 176, 255, 0.1)" },
                    { range: [1, 2], color: "rgba(0, 144, 255, 0.2)" },
                    // ... (remaining steps)
                    { range: [9, 10], color: "rgba(0, 0, 0, 1)" },
                ]
            }
        };

        // Set up the layout
        let layout = {
            width: 400,
            height: 400,
            margin: { t: 0, b: 0 }
        };

        // Call Plotly to plot the gauge chart
        Plotly.newPlot("gauge", [gaugeTrace], layout);
    });
};

// Call the initialization function
initDash();