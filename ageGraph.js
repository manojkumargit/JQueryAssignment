function renderAgeGraph(data,id){

    var outerWidth = 1000;
    var outerHeight = 2000;
    var margin = { left: 90, top: 30, right: 30, bottom: 90 };
    var barPadding = 0.3;
    var xColumn = "x";
    var yColumn = "y";
    var colorColumn = "x";
    var innerWidth  = outerWidth  - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top  - margin.bottom-1500;
    var xAxisLabelText = "Age-group";
    var xAxisLabelOffset = 10;
    var yAxisLabelText = "Population";
    var yAxisLabelOffset = 10;
    var svg = d3.select(id).append("svg")
                               .attr("width",  outerWidth)
                               .attr("height", outerHeight);
    var g = svg.append("g")
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var xAxisG = g.append("g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0," + innerHeight + ")");
    var xAxisLabel = xAxisG.append("text")
                           .style("text-anchor", "middle")
                           .attr("transform", "translate(" + (innerWidth / 2) + "," + (xAxisLabelOffset+50) + ")")
                           .attr("class", "scales")
                           .text(xAxisLabelText);
    var yAxisG = g.append("g")
                   .attr("class", "y axis");
    var yAxisLabel = yAxisG.append("text")
                           .style("text-anchor", "middle")
                           .attr("transform", "translate(-" + (yAxisLabelOffset+63) + "," + (innerHeight / 2) + ") rotate(-90)")
                           .attr("class", "scales")
                           .text(yAxisLabelText);
   var colorLegendG = g.append("g")
                      .attr("class", "color-legend")
                      .attr("transform", "translate(50, 400)");

    var xScale = d3.scale.ordinal().rangeBands([0, innerWidth], barPadding);
    var yScale = d3.scale.linear().range([innerHeight, 0]);
    var colorScale = d3.scale.category20();
    var siFormat = d3.format("s");
    var customTickFormat = function (d){
                             return siFormat(d).replace("G", "B");
                             };
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
                                           .outerTickSize(0);
    var yAxis = d3.svg.axis().scale(yScale).orient("left")
                                           .ticks(5)
                                           .tickFormat(customTickFormat)
                                           .outerTickSize(0);
     var colorLegend = d3.legend.color()
                                      .scale(colorScale)
                                      .shapePadding(30)
                                      .shapeWidth(15)
                                      .shapeHeight(15)
                                      .labelOffset(10);

      xScale.domain(data.map( function (d){ return d[xColumn]; }));
      yScale.domain([0, d3.max(data, function (d){ return d[yColumn]; })]);
      colorScale.domain(data.map(function (d){ return d[colorColumn]; }));
      xAxisG.call(xAxis);
      yAxisG.call(yAxis);
      var bars = g.selectAll("rect").data(data);
      bars.enter().append("rect")
                  .attr("width", xScale.rangeBand());
      bars.attr("x",function (d){
                    return xScale(d[xColumn]); })
           .attr("y",function (d){
                    return yScale(d[yColumn]); })
           .attr("height", function (d){
                           return innerHeight - yScale(d[yColumn]); })
           .attr("fill", function (d){
                           return colorScale(d[colorColumn]); });
      bars.exit().remove();
      colorLegendG.call(colorLegend);
    }
