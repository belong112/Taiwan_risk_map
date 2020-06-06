var path = '';
var mapMode = 'county_mode';
var displayMode = 'total_mode';

const colorFn = (min, max) => d3.scale.linear().domain([min, max]).range(["#090", "#f00"]);
const county_total_colorFn = colorFn(0,5000);
const district_total_colorFn = colorFn(0,500);
const county_ratio_colorFn = colorFn(0,11094); // d3.scale.linear().domain([0, 11094]).range(["#090", "#f00"]);
const district_ratio_colorFn = colorFn(0,11094); // d3.scale.linear().domain([0, 11094]).range(["#090", "#f00"]);

var county_features = topojson.feature(countyData, countyData.objects.county).features;
var district_features = topojson.feature(districtData, districtData.objects.twmap).features;

$(document).ready(function() {
    render();
    hideDiv('firecaseTable');
});

// TODO : optimize color function 
// const color_func = (obj) => {
//     const arr = Object.values(obj);
//     const min = Math.min(...arr);
//     const max = Math.max(...arr);
//     return d3.scale.linear().domain([min, max]).range(["#090", "#f00"]);
// }

function renderStreetDataTable(d_name) {
    const streetData = taipei_fire_counts[d_name];
    const tableElemnets = streetData.slice(0,3).map((data, index) => {
        return (
            '<tr>\
                <th scope="row">' + (index+1) + '</th>\
                <td>' + data.street + '</td>\
                <td>' + data.count + '</td>\
            </tr>'
        )
    });
    document.getElementById("tableBody").innerHTML = tableElemnets.join('');
}

function clearselected() {
    if (document.querySelector('.selected')) {
        document.querySelector('.selected').classList.remove('selected');
    }
}

function addSelectClass(c_id) {
    clearselected();
    document.getElementById(c_id).classList.add('selected');
}

function showDiv(elementId) {
    document.getElementById(elementId).style["display"] = "";
}

function hideDiv(elementId) {
    document.getElementById(elementId).style["display"] = "none";
}

function update(properties, total) {
    var name = properties.C_Name;
    var id = properties.County_ID;
    if( mapMode !== 'county_mode'){
        name = properties.TOWNNAME;
        id = properties.TOWNCODE;
        renderStreetDataTable(name);
    }
    $("#name").text(name);
    addSelectClass(id);
    $("#total").text(total);
}

function goToDistrictMap() {
    mapMode = 'district_mode';
    clearselected();
    render();
    hideDiv('findDetailBtn');
    showDiv('backToFullMapBtn');
    showDiv('firecaseTable');
}

function backToFullMap() {
    mapMode = 'county_mode';
    clearselected();
    render();
    hideDiv('backToFullMapBtn');
    hideDiv('firecaseTable');
    showDiv('findDetailBtn');
}

function useRatioMode() {
    displayMode = 'ratio_mode'; 
    render();   
    hideDiv('useRatioBtn');
    showDiv('useTotalBtn');
    document.getElementById("unit").innerHTML = '( 火災次數 / 戶數 )';
}

function useTotalMode(){
    displayMode = 'total_mode';
    render();
    hideDiv('useTotalBtn');
    showDiv('useRatioBtn');
    document.getElementById("unit").innerHTML = '( 火災次數 / 年 )';
}

function computeFeature(mMode, dmode) {
    var features = [];
    if (mMode === 'county_mode'){
        features = county_features;
    }
    else{
        var c_name = $("#name").text();
        if (c_name === "?") {
            return;
        }
        var features = district_features.filter(feature => {
            if (feature.properties.COUNTYNAME === c_name)
                return feature;
        });
    }

    // and total attr in features
    for (idx = features.length - 1; idx >= 0; idx--){
        if (features[idx].properties.C_Name) {
            if (displayMode === 'total_mode')
                features[idx].total = county_total[features[idx].properties.C_Name];
            else
                features[idx].total = county_ratio[features[idx].properties.C_Name];
        }
        else {
            if (displayMode === 'total_mode')
                features[idx].total = district_total[features[idx].properties.COUNTYNAME][features[idx].properties.TOWNNAME] || 100;
            else
                features[idx].total = district_ratio[features[idx].properties.COUNTYNAME][features[idx].properties.TOWNNAME] || 100;
        }
    }

    return features;
}

function render() {
    features = computeFeature(mapMode, displayMode);
    d3.select("svg").selectAll("*").remove();
    var prj = function(v) {
        var ret = d3.geo.mercator().center([122, 23.25]).scale(6000)(v);
        var position = { x: ret[0], y: ret[1] };
        return [position.x, position.y];
    };
    path = d3.geo.path().projection(prj);
    
    d3.select("svg").selectAll("path").data(features).enter().append("path");

    d3.select("svg").selectAll("path").data(features).attr({
        id: (d) => d.properties.TOWNCODE || d.properties.County_ID
    });

    d3.select("svg").selectAll("path").attr({
        "d": path,
        "fill": function(d) {
            if (d.properties.County_ID) {
                if (displayMode === 'ratio_mode')
                    return county_ratio_colorFn(d.total*1000000); 
                else
                    return county_total_colorFn(d.total);
            } 
            else {
                if (displayMode === 'ratio_mode')
                    return district_ratio_colorFn(d.total*1000000);
                else
                    return district_total_colorFn(d.total);
            }
            
        }
    });

    d3.select("svg").selectAll("path").on("click", (d) => {
        console.log(d.properties, d.total);
        update(d.properties,d.total);
    });
}
