var path = ''
var mode = 'county_mode'
const county_color = d3.scale.linear().domain([0, 5000]).range(["#090", "#f00"]);
const distrirct_color = d3.scale.linear().domain([0, 500]).range(["#090", "#f00"]);
var county_features = topojson.feature(countyData, countyData.objects.county).features;
var district_features = topojson.feature(districtData, districtData.objects.twmap).features;

$(document).ready(function() {
    render(county_features);

    d3.select("svg").selectAll("path").on("click", (d) => {
        console.log(d.properties, d.total)
        update(d.properties,d.total);
    });
});

function clearselected() {
    if (document.querySelector('.selected')) {
        document.querySelector('.selected').classList.remove('selected');
    }
}

function addSelectClass(c_id) {
    clearselected();
    document.getElementById(c_id).classList.add('selected');
}

function update(properties, total) {
    var name = properties.C_Name;
    var id = properties.County_ID;
    if( mode !== 'county_mode'){
        name = properties.TOWNNAME
        id = properties.TOWNCODE;
    }
    console.log('name',name,'id',id);
    $("#name").text(name);
    addSelectClass(id);
    $("#total").text(total);
}

function goToDistrictMap() {
    clearselected();
    var c_name = $("#name").text();
    if (c_name === "?") {
        return;
    }
    var newfeature = district_features.filter(feature => {
        if (feature.properties.COUNTYNAME === c_name)
            return feature
    })
    console.log(newfeature);
    render(newfeature, c_name)
    document.getElementById("findDetailBtn").style["display"] = "none";
    document.getElementById("backToFullMapBtn").style["display"] = "";
    mode = 'district_mode';
}

function backToFullMap() {
    clearselected();
    console.log(county_features)
    render(county_features,'');
    document.getElementById("findDetailBtn").style["display"] = "";
    document.getElementById("backToFullMapBtn").style["display"] = "none";
    mode = 'county_mode';
}

function render(features) {
    var prj = function(v) {
        var ret = d3.geo.mercator().center([122, 23.25]).scale(6000)(v);
        var position = { x: ret[0], y: ret[1] };
        return [position.x, position.y];
    };
    path = d3.geo.path().projection(prj);
    for (idx = features.length - 1; idx >= 0; idx--)
        if (features[idx].properties.C_Name)
            features[idx].total = county_total[features[idx].properties.C_Name]
        else 
            features[idx].total = district_total[features[idx].properties.COUNTYNAME][features[idx].properties.TOWNNAME] || 100;
    d3.select("svg").selectAll("path").data(features).enter().append("path");

    d3.select("svg").selectAll("path").data(features).attr({
        id: (d) => d.properties.TOWNCODE || d.properties.County_ID
    });

    d3.select("svg").selectAll("path").attr({
        "d": path,
        "fill": function(d) {
            if (d.properties.County_ID) {
                return county_color(d.total); 
            } 
            else {
                return distrirct_color(d.total)
            }
            
        }
    })
}