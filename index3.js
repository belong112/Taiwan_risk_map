const county_density = {
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
    "中正區": 1233,
    "大安區": 121,
    "南澳鄉": 9333,
    "東石鄉": 5555
}

var path = ''
var mode = 'county_mode'
const color = d3.scale.linear().domain([0, 10000]).range(["#090", "#f00"]);
var county_features = topojson.feature(countyData, countyData.objects.county).features;
var district_features = topojson.feature(districtData, districtData.objects.twmap).features;

$(document).ready(function() {
    render(county_features);

    d3.select("svg").selectAll("path").on("click", (d) => {
        console.log(d.properties, d.density)
        update(d.properties,d.density);
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

function update(properties, density) {
    var name = properties.C_Name;
    var id = properties.County_ID;
    if( mode !== 'county_mode'){
        name = properties.TOWNNAME
        id = properties.TOWNCODE;
    }
    console.log('name',name,'id',id);
    $("#name").text(name);
    addSelectClass(id);
    $("#density").text(density);
}

function goToDistrictMap() {
    clearselected();
    var c_name = $("#name").text();
    var newfeature = district_features.filter(feature => {
        if (feature.properties.COUNTYNAME === c_name)
            return feature
    })
    console.log(newfeature);
    render(newfeature)
    document.getElementById("findDetailBtn").style["display"] = "none";
    document.getElementById("backToFullMapBtn").style["display"] = "";
    mode = 'district_mode';
}

function backToFullMap() {
    clearselected();
    console.log(county_features)
    render(county_features);
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
            features[idx].density = county_density[features[idx].properties.C_Name]
        else 
            features[idx].density = 100; // district_density[features[idx].properties.TOWNNAME];
    d3.select("svg").selectAll("path").data(features).enter().append("path");

    d3.select("svg").selectAll("path").data(features).attr({
        id: (d) => d.properties.TOWNCODE || d.properties.County_ID
    });

    d3.select("svg").selectAll("path").attr({
        "d": path,
        "fill": function(d) { return color(d.density); }
    })
}