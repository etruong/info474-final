import * as d3 from 'd3';
import dataCSV from '../../data/combine-hour-zip-code-data.csv';
import * as mapCoord from '../../data/neighborhoods.json';

const DIV_CONTAINER_ID = "#elisa-vis";
const WIDTH = 1000;
const HEIGHT = 700;
const COLOR_RATING = {
    0.5: "#EF626C",
    1: "#22181C",
    1.5: "#312F2F",
    2: "#84DCCF",
    2.5: "#F0F757",
    3: "#80475E",
    3.5: "#C89B7B",
    4: "#574AE2",
    4.5: "#E2ADF2",
    5: "#222A68",
}

const svg = d3.select(DIV_CONTAINER_ID)
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

const neighborhoods = svg.append("g");

let albersProjection = d3.geoAlbers()
    .scale(60000)
    .rotate([123, 0])
    .center([0, 500])
    .translate([WIDTH / 100, HEIGHT * 11.7]);

let geoPath = d3.geoPath()
    .projection(albersProjection)
    .pointRadius(3)

svg.append('text')
    .attr('x', '35px')
    .attr('y', '35px')
    .attr('font-family', 'arial')
    .text("Rating Legend")
let circleX = 45;
let circleY = 60;
let rating = Object.keys(COLOR_RATING);
rating.sort();
svg.append("g")
    .attr('x', "35px")
    .attr('y', "35px")
    .selectAll('dot')
    .append('circle')
    .data(rating)
    .enter()
    .append('circle')
    .attr('cx', circleX + "px")
    .attr('cy', (d, i) => {
        return (circleY + (i * 20)) + "px";
    })
    .attr('r', "3px")
    .attr('fill', (d) => { return COLOR_RATING[d] })
svg.append("g")
    .attr('x', "35px")
    .attr('y', "35px")
    .selectAll('text')
    .data(rating)
    .enter()
    .append('text')
    .text((d) => { return d })
    .attr('x', circleX + 10 + "px")
    .attr('y', (d, i) => {
        return (circleY + (i * 20)) + 5 + "px";
    })
    .attr('font-family', 'arial')
    neighborhoods.selectAll("path")
    .data(mapCoord.features)
    .enter()
    .append("path")
    .attr("fill", "#ccc")
    .attr("stroke", "darkgrey")
    .attr("d", geoPath)



    const main = async () => {
        const data = await d3.csv(dataCSV);
        // console.log(data)

        let filtered_data = data.filter((point) => {
            return point["coordinates.latitude"] != "NA" || point["coordinates.longitude"] != "NA";
        });

        let pointData = filtered_data.map((point) => {
            return {
                "type": "Feature",
                "properties": {
                    "info": point
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        parseFloat(point["coordinates.longitude"]),
                        parseFloat(point["coordinates.latitude"])
                    ]
                }
            }
        })

    let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    let points = svg.append("g");
    points.selectAll("path")
        .data(pointData)
        .enter()
        .append("path")
        .attr('fill', (d) => {
            return COLOR_RATING[d.properties.info.rating];
        })
        .attr('d', geoPath)
        .on("mouseover", (d) => {
            div.transition()
                .duration(200)
                .style("opacity", 1)
            div.html(d.properties.info.name + "<br />" + d.properties.info["location.address1"] +
                "<br />" + d.properties.info["location.city"] + ", " + d.properties.info["location.state"] +
                " " + d.properties.info["location.zip_code"] + "<br /> Rating: " + d.properties.info["rating"])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 5) + "px")
                .style("background-color", () => {
                    return COLOR_RATING[d.properties.info.rating];
                })
                .style("opacity", 2);
        })
        .on("mouseout", (d) => {
            div.transition()
                .duration(200)
                .style("opacity", 0)
        });;

    }
    main();      

// let data = d3.csv(dataCSV)
// console.log(data)
// data = data.filter((point) => {
//         return point["coordinates.latitude"] != "NA" || point["coordinates.longitude"] != "NA";
//     });
// let pointData = data.map((point) => {
//     return {
//         "type": "Feature",
//         "properties": {
//             "info": point
//         },
//         "geometry": {
//             "type": "Point",
//             "coordinates": [
//                 parseFloat(point["coordinates.longitude"]),
//                 parseFloat(point["coordinates.latitude"])
//             ]
//         }
//     }
// })
// console.log(pointData)

// d3.csv(dataCSV, (data) => {
//     console.log(data);
//     if (data["coordinates.latitude"] != "NA" || data["coordinates.longitude"] != "NA") {
    
//     // data = data.filter((point) => {
//     //     return point["coordinates.latitude"] != "NA" || point["coordinates.longitude"] != "NA";
//     // });
//     let pointData = data.map((point) => {
//         return {
//             "type": "Feature",
//             "properties": {
//                 "info": point
//             },
//             "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                     parseFloat(point["coordinates.longitude"]),
//                     parseFloat(point["coordinates.latitude"])
//                 ]
//             }
//         }
//     });

    // let div = d3.select("body").append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);

    // let points = svg.append("g");
    // points.selectAll("path")
    //     .data(pointData)
    //     .enter()
    //     .append("path")
    //     .attr('fill', (d) => {
    //         return COLOR_RATING[d.properties.info.rating];
    //     })
    //     .attr('d', geoPath)
    //     .on("mouseover", (d) => {
    //         div.transition()
    //             .duration(200)
    //             .style("opacity", 1)
    //         div.html(d.properties.info.name + "<br />" + d.properties.info["location.address1"] +
    //             "<br />" + d.properties.info["location.city"] + ", " + d.properties.info["location.state"] +
    //             " " + d.properties.info["location.zip_code"] + "<br /> Rating: " + d.properties.info["rating"])
    //             .style("left", (d3.event.pageX) + "px")
    //             .style("top", (d3.event.pageY - 5) + "px")
    //             .style("background-color", () => {
    //                 return COLOR_RATING[d.properties.info.rating];
    //             })
    //             .style("opacity", 2);
    //     })
    //     .on("mouseout", (d) => {
    //         div.transition()
    //             .duration(200)
    //             .style("opacity", 0)
    //     });;
    // }
// });
