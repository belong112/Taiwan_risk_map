const density = {
    "臺北市": 9952.60,
    "嘉義市": 4512.66,
    "新竹市": 4151.27,
    "基隆市": 2809.27,
    "新北市": 1932.91,
    "桃園市": 1692.09,
    "臺中市": 1229.62,
    "彰化縣": 1201.65,
    "高雄市": 942.97,
    "臺南市": 860.02,
    "金門縣": 847.16,
    "澎湖縣": 802.83,
    "雲林縣": 545.57,
    "連江縣": 435.21,
    "新竹縣": 376.86,
    "苗栗縣": 311.49,
    "屏東縣": 305.03,
    "嘉義縣": 275.18,
    "宜蘭縣": 213.89,
    "南投縣": 125.10,
    "花蓮縣": 71.96,
    "臺東縣": 63.75
};

const district_density = {
    "中正區": 123,
    "大安區": 12
}

var path = ''
const color = d3.scale.linear().domain([0, 10000]).range(["#090", "#f00"]);
var county_features = topojson.feature(countyData, countyData.objects.county).features;
var district_features = topojson.feature(districtData, districtData.objects.twmap).features;

$(document).ready(function() {
    render(county_features);

    d3.select("svg").on("mousemove", function() {
        update();
    });

    update();
});

function update() {
    d3.select("svg").selectAll("path").on("mouseover", function(d) {
        $("#name").text(d.properties.C_Name);
        $("#density").text(d.density);
    });
}

function goToDistrictMap() {
    var c_name = $("#name").text();
    var newfeature = district_features.filter(feature => {
        if (feature.properties.COUNTYNAME === c_name)
            return feature
    })
    render(newfeature)
    document.getElementById("findDetailBtn").style["display"] = "none";
    document.getElementById("backToFullMapBtn").style["display"] = "";
}

function render(features) {
    var prj = function(v) {
        var ret = d3.geo.mercator().center([122, 23.25]).scale(6000)(v);
        var position = { x: ret[0], y: ret[1] };
        return [position.x, position.y];
    };
    path = d3.geo.path().projection(prj);
    for (idx = features.length - 1; idx >= 0; idx--) 
        features[idx].density = density[features[idx].properties.C_Name] || 1000;
    $('svg').empty();
    d3.select("svg").selectAll("path").data(features).enter().append("path");

    d3.select("svg").selectAll("path").data(features).attr({
        id: (d) =>  d.properties.TOWNCODE || d.properties.County_ID
    });

    d3.select("svg").selectAll("path").attr({
        "d": path,
        "fill": function(d) { return color(d.density); }
    })

}