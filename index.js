$(document).ready(function() {
    var density = {
        "臺北市": 4952,
        "嘉義市": 4512,
        "新竹市": 4151,
        "基隆市": 2809,
        "新北市": 1932,
        "桃園市": 1692,
        "臺中市": 1229,
        "彰化縣": 1201,
        "高雄市": 942,
        "臺南市": 860,
        "金門縣": 847,
        "澎湖縣": 802,
        "雲林縣": 545,
        "連江縣": 435,
        "新竹縣": 376,
        "苗栗縣": 311,
        "屏東縣": 305,
        "嘉義縣": 275,
        "宜蘭縣": 213,
        "南投縣": 125,
        "花蓮縣": 71,
        "臺東縣": 63,
    };

    // var topodata = topodata.filter()
    var features = topojson.feature(topodata, topodata.objects.county).features;
    var c_name = '新竹縣'
    features = features.filter(feature => {
                    if (feature.properties.COUNTYNAME === c_name)
                        return feature
                });
    console.log(features)
    var color = d3.scale.linear().domain([0, 10000]).range(["#060", "#53ff53"]);
    var prj = function(v) {
        var ret = d3.geo.mercator().center([122, 23.25]).scale(6000)(v);
        return [ret.x, ret.y];
    };
    var path = d3.geo.path().projection(prj);
    for (idx = features.length - 1; idx >= 0; idx--) features[idx].density = 100 // density[features[idx].properties.COUNTYNAME];
    d3.select("svg").selectAll("path").data(features).enter().append("path");

    d3.select("svg").selectAll("path").data(features).attr({
        id: (d) => d.properties.TOWNCODE
    });

    let c_density = 0;

    function update() {
        d3.select("svg").selectAll("path").attr({
            "d": path,
            "fill": function(d) { return color(d.density); }
        }).on("mouseover", function(d) {
            c_name = d.properties.COUNTYNAME;
            c_density = d.density;
            update_data();
        });
    }

    function clicked(c_id) {
        if (document.querySelector('.selected')) {
            document.querySelector('.selected').classList.remove('selected');
        }
        document.getElementById(c_id).classList.add('selected');
    }

    function update_data() {
        $("#name").text(c_name);
        $("#density").text(c_density);
    }

    d3.select("svg").on("mousemove", function() {
        update();
    });

    d3.select("svg").selectAll("path").on("click", (d) => {
        clicked(d.properties.TOWNCODE);
    });

    update();
});