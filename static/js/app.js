// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filteredMetadata = metadata.filter(obj => obj.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");   

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    filteredMetadata.forEach(item => {
      Object.entries(item).forEach(([key, value]) => {
        let listItem = metadataPanel.append("li");
        listItem.text(`${key}: ${value}`);
      });
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredSample = samples.filter(obj => obj.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filteredSample[0].otu_ids;
    let otu_labels = filteredSample[0].otu_labels;
    let sample_values = filteredSample[0].sample_values;

    // Build a Bubble Chart
    let Colorscale = 'Viridis';

    let min_value = Math.min(...sample_values);
    let max_value = Math.max(...sample_values);
    let desired_size = 3000; 
    let scaled_sample_values = sample_values.map(value => (value - min_value) / (max_value - min_value) * desired_size);

    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: scaled_sample_values,
        color: otu_ids,
        colorscale: Colorscale,
        sizemode: 'area',
        text: otu_labels
      }
    }

    let bubblelayout = {title: "Bacteria Cultures Per Sample", 
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'}
    };

    let bubbleData = [bubbleTrace];

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubblelayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let otu_labels_bar = otu_ids.map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: otu_labels_bar.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h',
      text: otu_labels_bar.slice(0, 10).reverse()
    };

    let barlayout = {title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: 'Number of Bacteria'}};

    let barData = [barTrace];

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barlayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name => {dropdown.append('option').text(name).attr('value', name);});

    // Get the first sample from the list
    let newSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(newSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample)
}

// Initialize the dashboard
init();
