const margin = {top: 10, left: 10, bottom: 10, right: 10}, 
    width = parseInt(d3.select('#visualization').style('width')) - margin.left - margin.right,
    mapRatio = .5,
    height = width * mapRatio;

d3.select("div#visualization")
    .classed("svg-container", true) 
    .attr("width", width)
    .attr("height", height);

const svg = d3.select(".map")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .classed("svg-content-responsive", true);

const tooltip = d3.select("div.flex-container")
    .append("div")	
    .attr("class", "tooltip")			
    .attr('style', 'position: absolute; opacity: 0;');

const projection = d3.geoAlbersUsa()
    .scale(width)
    .translate([width / 2, height / 2]);

const path = d3.geoPath()
    .projection(projection);

let energy_type = 'Total', data_type = 'C', year = '2010';

const colorgradient = (min, max) => {
    const res = d3.scaleSequential()
        .domain([min, max])
        .interpolator(d3.interpolateBlues);
    return res;
}

const drawMap = (states, energy_data_raw, energy_data) => {

    const min = d3.min(energy_data_raw, d => parseInt(d[energy_type + data_type + year]));
    const max = d3.max(energy_data_raw, d => parseInt(d[energy_type + data_type + year]));

    Legend(d3.scaleSequential([min, max], d3.interpolateBlues), {
        title: (data_type === 'E') ? "Expenditure (Million $USD)" : "Energy (Billion BTU)"
    })

    svg.selectAll(".state")
        .data(states)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", path)
        .attr("fill", d => colorgradient(min, max)(energy_data.get(d.properties.STATE_ABBR)[energy_type + data_type + year]))
        .on("mouseover", (e, d) => {
            drawChart(energy_data, d);
            d3.select(".tooltip")
                .html(() => {
                    const btu = energy_data.get(d.properties.STATE_ABBR)[energy_type + data_type + year];
                    if (btu !== undefined) {
                        return `${energy_data.get(d.properties.STATE_ABBR).State} <br> ${btu} Billion BTU`
                    } else {
                        return `${energy_data.get(d.properties.STATE_ABBR).State} <br> No Data`
                    }
                })
                .transition().duration(200)
                .attr('style', `opacity: 1; left: ${(e.x - margin.left)}px; top: ${e.y - (margin.top * 10)}px;`)
        })
        .on("mouseout", () => {
            removeChart();
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

const updateMap = (states, energy_data_raw, energy_data) => {
    const min = d3.min(energy_data_raw, d => parseInt(d[energy_type + data_type + year]));
    const max = d3.max(energy_data_raw, d => parseInt(d[energy_type + data_type + year]));

    d3.selectAll("image").remove();
    d3.selectAll("g.legend").remove();
    if (min !== undefined) {
        Legend(d3.scaleSequential([min, max], d3.interpolateBlues), {
            title: (data_type === 'E') ? "Expenditure (Million $USD)" : "Energy (Billion BTU)"
        })
    }

    svg.selectAll(".state")
        .data(states)
        .attr("fill", d => colorgradient(min, max)(energy_data.get(d.properties.STATE_ABBR)[energy_type + data_type + year]));

    if (min === undefined) {
        d3.select("#no-data-text h1")
            .text("NO DATA AVAILABLE");
    } else {
        d3.select("#no-data-text h1")
            .text("");
    }
}

const drawChart = (energy_data, d) => {
    removeChart();
    
    const chart = d3.select("svg.chart")
        .attr("transform", `translate(0, ${height})`);

    const chart_margin = 200, 
        chart_width = chart.attr("width") - chart_margin, 
        chart_height = chart.attr("height") - chart_margin;

    chart.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 0)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text(() => {
            const state_name = energy_data.get(d.properties.STATE_ABBR)["State"];
            if (data_type === 'E') {
                return `${state_name}'s Expenditure in ${year}`
            } else {
                return `${state_name}'s Energy ${(data_type === 'C') ? "Consumption" : "Production"} in ${year}`
            }
        })
    
    const energy_types_keys = ["Biomass", "Coal", "Elec", "FossFuel", "Geo", "Hydro", "NatGas", "LPG"];
    const max = d3.max(energy_types_keys.map(val => parseInt(energy_data.get(d.properties.STATE_ABBR)[val + data_type + year])));

    let bargraph_data = energy_types_keys.map(key => {
        const val = energy_data.get(d.properties.STATE_ABBR)[key + data_type + year];
        if (val !== undefined) {
            return { key: key, val: parseInt(val) };
        } else {
            return { key: key, val: 0 };
        }
    })

    bargraph_data = bargraph_data.sort((a, b) => (b.val - a.val));

    const xScale = d3.scaleBand()
        .domain(bargraph_data.map(d => d.key))
        .range([0, chart_width])
        .padding(0.4)

    const yScale = d3.scaleLinear()
        .domain([0, max])
        .range([chart_height, 0])

    const g = chart.append("g")
        .attr("id", "barchart")
        .attr("transform", "translate(100, 100)");

    g.append("g")
        .attr("id", "xaxis")
        .attr("transform", "translate(0," + (chart_height) + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", chart_height - 275)
        .attr("x", chart_width + 50)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Energy Type");

    g.append("g")
        .attr("id", "yaxis")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("y", 6)
        .attr("dy", "-3em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text((data_type === 'E') ? "Expenditure (M $USD)" : "Energy (Billion BTU)");


    g.selectAll(".bar")
        .data(bargraph_data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.key))
        .attr("y", (d) => yScale(d.val))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => { return chart_height - yScale(d.val); });
        
}

removeChart = () => {
    d3.selectAll("svg.chart text")
        .remove();

    d3.selectAll("#barchart")
        .remove();
}

const ready = async () => {

    const state_data = await d3.json("states.json");
    const states = topojson.feature(state_data, state_data.objects.usStates).features;
    
    const energy_data_raw = await d3.csv("Energy Census and Economic Data US 2010-2014.csv");
    const energy_data = new Map(energy_data_raw.map(d => [d.StateCodes, d]))

    // console.log("State Data ABBR", state_data.objects.usStates.geometries.map(state => state.properties.STATE_ABBR));
    // console.log("Energy Data", energy_data);

    drawMap(states, energy_data_raw, energy_data);
    
    d3.select("#energy-type")
        .on("change", (e) => {
            energy_type = e.target.value;
            updateMap(states, energy_data_raw, energy_data);
        });

    d3.select("#data-type")
        .on("change", (e) => {
            data_type = e.target.value;
            updateMap(states, energy_data_raw, energy_data);
        });

    d3.select("#year")
        .on("change", (e) => {
            year = e.target.value;
            updateMap(states, energy_data_raw, energy_data);
            d3.select("#year-label")
                .text(e.target.value)
        });
}

ready();

// Copyright 2021, Observable Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-legend
function Legend(color, {
    title,
    tickSize = 6,
    legend_width = 320, 
    legend_height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = legend_width / 64,
    tickFormat,
    tickValues
  } = {}) {
  
    function ramp(color, n = 256) {
      const canvas = document.createElement("canvas");
      canvas.width = n;
      canvas.height = 1;
      const context = canvas.getContext("2d");
      for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
      }
      return canvas;
    }
  
    const svg = d3.select("svg#legend")
        .attr("width", legend_width)
        .attr("height", legend_height)
        .attr("viewBox", [0, 0, legend_width, legend_height])
        .style("overflow", "visible")
        .style("display", "block")
        .attr("transform", `translate(0, ${parseInt(d3.select('svg.map.svg-content-responsive').style('height'))})`);
  
    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - legend_height);
    let x;
  
    // Continuous
    if (color.interpolate) {
      const n = Math.min(color.domain().length, color.range().length);
  
      x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, legend_width - marginRight), n));
  
      svg.append("image")
          .attr("x", marginLeft)
          .attr("y", marginTop)
          .attr("width", legend_width - marginLeft - marginRight)
          .attr("height", legend_height - marginTop - marginBottom)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
    }
  
    // Sequential
    else if (color.interpolator) {
      x = Object.assign(color.copy()
          .interpolator(d3.interpolateRound(marginLeft, legend_width - marginRight)),
          {range() { return [marginLeft, legend_width - marginRight]; }});
  
      svg.append("image")
          .attr("x", marginLeft)
          .attr("y", marginTop)
          .attr("width", legend_width - marginLeft - marginRight)
          .attr("height", legend_height - marginTop - marginBottom)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", ramp(color.interpolator()).toDataURL());
  
      // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
      if (!x.ticks) {
        if (tickValues === undefined) {
          const n = Math.round(ticks + 1);
          tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
        }
        if (typeof tickFormat !== "function") {
          tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
        }
      }
    }
  
    // Threshold
    else if (color.invertExtent) {
      const thresholds
          = color.thresholds ? color.thresholds() // scaleQuantize
          : color.quantiles ? color.quantiles() // scaleQuantile
          : color.domain(); // scaleThreshold
  
      const thresholdFormat
          = tickFormat === undefined ? d => d
          : typeof tickFormat === "string" ? d3.format(tickFormat)
          : tickFormat;
  
      x = d3.scaleLinear()
          .domain([-1, color.range().length - 1])
          .rangeRound([marginLeft, legend_width - marginRight]);
  
      svg.append("g")
        .attr("class", "legend")
        .selectAll("rect")
        .data(color.range())
        .join("rect")
          .attr("x", (d, i) => x(i - 1))
          .attr("y", marginTop)
          .attr("width", (d, i) => x(i) - x(i - 1))
          .attr("height", legend_height - marginTop - marginBottom)
          .attr("fill", d => d);
  
      tickValues = d3.range(thresholds.length);
      tickFormat = i => thresholdFormat(thresholds[i], i);
    }
  
    // Ordinal
    else {
      x = d3.scaleBand()
          .domain(color.domain())
          .rangeRound([marginLeft, legend_width - marginRight]);
  
      svg.append("g")
        .attr("class", "legend")
        .selectAll("rect")
        .data(color.domain())
        .join("rect")
          .attr("x", x)
          .attr("y", marginTop)
          .attr("width", Math.max(0, x.bandwidth() - 1))
          .attr("height", legend_height - marginTop - marginBottom)
          .attr("fill", color);
  
      tickAdjust = () => {};
    }
  
    svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(0,${legend_height - marginBottom})`)
        .call(d3.axisBottom(x)
          .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
          .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
          .tickSize(tickSize)
          .tickValues(tickValues))
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
          .attr("x", marginLeft)
          .attr("y", marginTop + marginBottom - legend_height - 6)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .attr("class", "title")
          .text(title));
  
    return svg.node();
  }