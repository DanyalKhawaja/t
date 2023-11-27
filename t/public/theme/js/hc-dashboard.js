(function(document, window, $) {
    document.getElementById("li-dashboard").classList.add('active');
    function htmlDecode(input){
      var e = document.createElement('div');
      e.innerHTML = input;
      return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }
    var lang = JSON.parse(htmlDecode("<%= JSON.stringify(lang) %>"));
    var VerifiedCountByUC = JSON.parse(htmlDecode("<%= JSON.stringify(VerifiedCountByUC) %>"));
    var VerifiedMaleCountByUC = JSON.parse(htmlDecode("<%= JSON.stringify(VerifiedMaleCountByUC) %>"));
    var VerifiedFemaleCountByUC = JSON.parse(htmlDecode("<%= JSON.stringify(VerifiedFemaleCountByUC) %>"));
    var BenStatusCount = JSON.parse(htmlDecode("<%= JSON.stringify(BenStatusCount) %>"));
    var BenGenderChart = echarts.init(document.getElementById('pieGender'));

    var BenGenderChartTitle = 'BENEFICIARIES GENDER COUNT';
    var BenGenderChartSubText = 'UC WISE';
    var name1 = 'male';
    var name2 = 'female';
    if (lang == 'ar') {
      BenGenderChartTitle = 'حساب المستفيدون حسب الجنس';
      BenGenderChartSubText = 'حكيم UC';
      name1 = 'الذكر';
      name2 = 'إناثا';
    }

options = {
title : {
    text: BenGenderChartTitle,
    subtext: BenGenderChartSubText,
    x:'center'
},
tooltip : {
    trigger: 'axis',
    axisPointer : {
        type : 'shadow'
    }
},
color: ['#064789',  '#A5BE00'],
  angleAxis: {
      type: 'category',
      data: [VerifiedMaleCountByUC[0].UCName, VerifiedMaleCountByUC[1].UCName, VerifiedMaleCountByUC[2].UCName, VerifiedMaleCountByUC[3].UCName,VerifiedMaleCountByUC[4].UCName,VerifiedMaleCountByUC[5].UCName,VerifiedMaleCountByUC[6].UCName],
      z: 10
  },
  radiusAxis: {
  },
  polar: {
  },
  series: [{
      type: 'bar',
      data: [VerifiedMaleCountByUC[0].count, VerifiedMaleCountByUC[1].count, VerifiedMaleCountByUC[2].count, VerifiedMaleCountByUC[3].count,VerifiedMaleCountByUC[4].count,VerifiedMaleCountByUC[5].count,VerifiedMaleCountByUC[6].count],
      coordinateSystem: 'polar',
      name: name1,
      stack: 'a'
  }, {
      type: 'bar',
      data: [VerifiedFemaleCountByUC[0].count, VerifiedFemaleCountByUC[1].count, VerifiedFemaleCountByUC[2].count, VerifiedFemaleCountByUC[3].count,VerifiedFemaleCountByUC[4].count,VerifiedFemaleCountByUC[5].count,VerifiedFemaleCountByUC[6].count],
      coordinateSystem: 'polar',
      name: name2,
      stack: 'a'
  }, ],
  legend: {
      show: true,
      data: [name1, name2],
      y : 'bottom',
  }
};
    BenGenderChart.setOption(options);

  var BenUCChartTitle = 'VERIFIED BENEFICIARIES';
  var BenUCChartSubText = 'UC WISE';
  if (lang == 'ar') {
    BenUCChartTitle = 'المستفيدون الذين تم التحقق منهم';
    BenUCChartSubText = 'حكيم UC';
  }
  var BenUCChart = echarts.init(document.getElementById('roseUC'));
  option = {
  title : {
      text: BenUCChartTitle,
      subtext: BenUCChartSubText,
      x:'center'
  },
  tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
      x : 'center',
      y : 'bottom',
      data:[VerifiedCountByUC[0].UCName, VerifiedCountByUC[1].UCName, VerifiedCountByUC[2].UCName, VerifiedCountByUC[3].UCName, VerifiedCountByUC[4].UCName, VerifiedCountByUC[5].UCName, VerifiedCountByUC[6].UCName]
  },

  calculable : true,
  series : [
      {
          name:'',
          type:'pie',
          radius : [10, 150],
          center : ['50%', '50%'],
          roseType : 'radius',
          label: {
              normal: {
                  formatter: '{b|{b}}\n{hr|}\n  {c}  {per|{d}%}  ',
                  backgroundColor: '#eee',
                  borderColor: '#aaa',
                  borderWidth: 1,
                  borderRadius: 4,
                  rich: {
                      a: {
                          color: '#999',
                          lineHeight: 22,
                          align: 'center'
                      },
                      hr: {
                          borderColor: '#aaa',
                          width: '100%',
                          borderWidth: 0.5,
                          height: 0
                      },
                      b: {
                          fontSize: 12,
                          lineHeight: 15,
                          align: 'center'
                      },
                      per: {
                          color: '#eee',
                          backgroundColor: '#334455',
                          padding: [2, 4],
                          borderRadius: 2
                      }
                  }
              }
          },
          data:[
              {value:VerifiedCountByUC[0].count, name:VerifiedCountByUC[0].UCName},
              {value:VerifiedCountByUC[1].count, name:VerifiedCountByUC[1].UCName},
              {value:VerifiedCountByUC[2].count, name:VerifiedCountByUC[2].UCName},
              {value:VerifiedCountByUC[3].count, name:VerifiedCountByUC[3].UCName},
              {value:VerifiedCountByUC[4].count, name:VerifiedCountByUC[4].UCName},
              {value:VerifiedCountByUC[5].count, name:VerifiedCountByUC[5].UCName},
              {value:VerifiedCountByUC[6].count, name:VerifiedCountByUC[6].UCName},
          ]
      }
  ]
};
BenUCChart.setOption(option);

var BenStatusByUCChart = echarts.init(document.getElementById('BenStatusByUCChart'));

var BenStatusByUCChartTitle = 'BENEFICIARIES STATUS COUNT';
var BenStatusByUCChartSubText = 'UC WISE';
var x = 'left';
var legendX = 'right';
var data = ['Total', 'Un-Verified','Pending','Verified','Approved','Rejected','Dubious','Deceased'];
var x_inverse = false;
var y_position = 'left';
if (lang == 'ar') {
  BenStatusByUCChartTitle = 'المستفيدون الذين تم حساب المستفيدون حسب الحالة منهم';
  BenStatusByUCChartSubText = 'حكيم UC';
  x = 'right';
  legendX = 'left';
  data = ['Total', 'Un-Verified','Pending','Verified','Approved','Rejected','Dubious','Deceased'];
  x_inverse = true;
  y_position = 'right';
}
optionBenStatusByUCChart = {
title : {
    text: BenStatusByUCChartTitle,
    subtext: BenStatusByUCChartSubText,
    x: x
},
color: ['#5D2584',  '#00C1B5', '#E45A19', '#DB4848', '#80AA2B', '#9B1D20', '#0B1D20', '#A0C1B5'],
tooltip : {
    trigger: 'axis',
    axisPointer : {
        type : 'shadow'
    }
},
legend: {
    data: data,
    x:legendX
},
grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
},
xAxis:  {
    type: 'value',
    inverse: x_inverse
},
yAxis: {
    type: 'category',
    data: ['Awaran','Dandar','Gajjar','Gishkore','Nok Jo','Parwar','Teertaje'],
    position: y_position
},
series: [
    {
        name: data[0],
        type: 'bar',
        stack: '1',
        label: {
            normal: {
                show: true,
                position: 'insideRight'
            }
        },
        data: [BenStatusCount[0]['Total'],BenStatusCount[1]['Total'],BenStatusCount[2]['Total'],BenStatusCount[3]['Total'],BenStatusCount[4]['Total'],BenStatusCount[5]['Total'],BenStatusCount[6]['Total']]
    },
    {
        name: data[1],
        type: 'bar',
        stack: '1',
        label: {
            normal: {
                show: true,
                position: 'insideRight'
            }
        },
        data: [BenStatusCount[0]['Un-Verified'],BenStatusCount[1]['Un-Verified'],BenStatusCount[2]['Un-Verified'],BenStatusCount[3]['Un-Verified'],BenStatusCount[4]['Un-Verified'],BenStatusCount[5]['Un-Verified'],BenStatusCount[6]['Un-Verified']]
    },
    {
        name: data[2],
        type: 'bar',
        stack: '1',
        label: {
            normal: {
                show: true,
                position: 'insideRight'
            }
        },
        data: [BenStatusCount[0]['Pending'],BenStatusCount[1]['Pending'],BenStatusCount[2]['Pending'],BenStatusCount[3]['Pending'],BenStatusCount[4]['Pending'],BenStatusCount[5]['Pending'],BenStatusCount[6]['Pending']]
    },
    {
        name: data[3],
        type: 'bar',
        stack: '1',
        label: {
            normal: {
                show: true,
                position: 'insideRight'
            }
        },
        data: [BenStatusCount[0]['Verified'],BenStatusCount[1]['Verified'],BenStatusCount[2]['Verified'],BenStatusCount[3]['Verified'],BenStatusCount[4]['Verified'],BenStatusCount[5]['Verified'],BenStatusCount[6]['Verified']]
    },
    {
        name: data[4],
        type: 'bar',
        stack: '1',
        label: {
            normal: {
                show: true,
                position: 'insideRight'
            }
        },
        data: [BenStatusCount[0]['Approved'],BenStatusCount[1]['Approved'],BenStatusCount[2]['Approved'],BenStatusCount[3]['Approved'],BenStatusCount[4]['Approved'],BenStatusCount[5]['Approved'],BenStatusCount[6]['Approved']]
    },
    {
        name: data[5],
        type: 'bar',
        stack: '1',
        label: {
            normal: {
                show: true,
                position: 'insideRight'
            }
        },
        data: [BenStatusCount[0]['Rejected'],BenStatusCount[1]['Rejected'],BenStatusCount[2]['Rejected'],BenStatusCount[3]['Rejected'],BenStatusCount[4]['Rejected'],BenStatusCount[5]['Rejected'],BenStatusCount[6]['Rejected']]
    },
    {
        name: data[6],
        type: 'bar',
        stack: '1',
        label: {
            normal: {
                show: true,
                position: 'insideRight'
            }
        },
        data: [BenStatusCount[0]['Dubious'],BenStatusCount[1]['Dubious'],BenStatusCount[2]['Dubious'],BenStatusCount[3]['Dubious'],BenStatusCount[4]['Dubious'],BenStatusCount[5]['Dubious'],BenStatusCount[6]['Dubious']]
    },
    {
        name: data[7],
        type: 'bar',
        stack: '1',
        label: {
            normal: {
                show: true,
                position: 'insideRight'
            }
        },
        data: [BenStatusCount[0]['Deceased'],BenStatusCount[1]['Deceased'],BenStatusCount[2]['Deceased'],BenStatusCount[3]['Deceased'],BenStatusCount[4]['Deceased'],BenStatusCount[5]['Deceased'],BenStatusCount[6]['Deceased']]
    },

]
};
BenStatusByUCChart.setOption(optionBenStatusByUCChart);
  var myLatLng = new google.maps.LatLng(26.419826, 64.554864);
  var myOptions = {
    zoom: 8,
    center: myLatLng,
    scrollwheel: false,
    zoomControl: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false,
    styles: [
      {
        featureType: 'all',
        stylers: [
          { saturation: -80 }
        ]
      },{
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          { hue: '#00ffee' },
          { saturation: 50 }
        ]
      },{
        featureType: 'poi',
        elementType: 'labels',
        stylers: [
          { visibility: 'on' }
        ]
      }
    ]
        //mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  var strokeColor = '#FF0000';
  var fillcolors = ['#5D2584',  '#00C1B5', '#E45A19', '#DB4848', '#9B1D20', '#80AA2B'];
  var strokeOpacity = 0.2;
  var fillOpacity =0.4;
  var fillOpacityOver = .8;
  var map = new google.maps.Map(document.getElementById('map'),myOptions);

  var MashkaiBorder = createpoly(Mashkai, 3);
  MashkaiBorder.setMap(map);
  var GishkoreBorder = createpoly(Gishkore, 2);
  GishkoreBorder.setMap(map);
  var AwaranBorder = createpoly(Awaran,1);
  AwaranBorder.setMap(map);
  var KechBorder = createpoly(Kech,5);
  KechBorder.setMap(map);


  addmouseover(MashkaiBorder,2);

  addmouseover(GishkoreBorder,4);
  addmouseover(AwaranBorder,5);
  addmouseover(KechBorder,6);


  google.maps.event.addListener(MashkaiBorder,"click",function(){
    regionClick('2');
  });

  google.maps.event.addListener(GishkoreBorder,"click",function(){
    regionClick('4');
  });
  google.maps.event.addListener(AwaranBorder,"click",function(){
    regionClick('5');
  });
  google.maps.event.addListener(KechBorder,"click",function(){
    regionClick('6');
  });


  function createpoly(path, colorIndex) {
    return new google.maps.Polygon({
        paths: path,
        strokeColor: strokeColor,
        strokeOpacity: strokeOpacity,
        strokeWeight: 1,
        fillColor:fillcolors[colorIndex],
        fillOpacity:fillOpacity,
        label:'string'
      });
  }
  function addmouseover(item,id) {

    google.maps.event.addListener(item,"mouseover",function(){
      this.setOptions({fillOpacity:fillOpacityOver});
      if (id > 0) {
        regionHover(id);
      }

    });
    google.maps.event.addListener(item,"mouseout",function(){
      this.setOptions({fillOpacity:fillOpacity});
      $("#labelRegion").html("All Regions");
      $("#labelTotalCount").html("<%= TotalBeneficiaries %>");
      $("#labelUnverifiedCount").html("<%= TotalUnverified %>");
      $("#labelPendingCount").html("<%= TotalPending %>");
      $("#labelRejectedCount").html("<%= TotalRejected %>");
      $("#labelDubiousCount").html("<%= TotalDubious %>");
      $("#labelApprovedCount").html("<%= TotalApproved %>");
    });
  }

  function regionHover(Region) {

    var regions = ["JhalJaoSub",	"Mashkai",	"JhalJao",	"Gishkore",	"Awaran",	"Hoshab"];
    $("#labelTehsil").html("Tehsil: "+regions[Region-1]);

    $.ajax({
      url: "/getIndicatorsByTehsil",
      type: "get", //send it through get method
      data:{Tehsil:regions[Region-1]},
      success: function(response) {
        //console.log(response.count);
        if (response == 0){

          $("#labelRegion").html("AllRegions");
          $("#labelTotalCount").html(0);
          $("#labelUnverifiedCount").html(0);
          $("#labelPendingCount").html(0);
          $("#labelRejectedCount").html(0);
          $("#labelDubiousCount").html(0);
          $("#labelApprovedCount").html(0);

        } else {
          console.log(response);
          $("#labelRegion").html("Tehsil: "+regions[Region-1]);
          $("#labelTotalCount").html(response.TotalBeneficiaries[0].count);
          $("#labelUnverifiedCount").html(response.TotalUnverified[0].count);
          $("#labelPendingCount").html(response.TotalPending[0].count);
          $("#labelRejectedCount").html(response.TotalRejected[0].count);
          $("#labelDubiousCount").html(response.TotalDubious[0].count);
          $("#labelApprovedCount").html(response.TotalApproved[0].count);
        }
      },
      error: function(xhr) {
        //alert(xhr);
      }
    });
  }



  })(document, window, jQuery);