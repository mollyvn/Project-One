//<script src="script.js"></script> ---->add to your index
$(document).ready(function() {
    //=============================================================================
    //Set up variables
    //=============================================================================
    
    var APIkey= "?key=AIzaSyC1MqND2SWxPfzCLjrWJW7tagrSmpgr6dI";
    var map;

    //$("#search");
    //if using whole address add %20 between all spaces
    // var defaultAddress="209%20W.%20Wilder%20Ave.%20Tampa%20FL"
    
    //using the zip code for now
    var defaultAddress="33603"
    var defaultElectionID= "2000";

    var submitBtn =$("#submit");
    
    // URL base representatives
    var queryBaseURL="https://www.googleapis.com/civicinfo/v2/";
    var queryURLElection= queryBaseURL + "elections" +APIkey;
    var queryURLVoterInfo= queryBaseURL + "voterinfo" +APIkey + "&address=" +defaultAddress + "&electionId=" +defaultElectionID;
    // var queryURLDivisions= queryBaseURL + "division" +APIkey + "&address=" +defaultAddress;
    var queryURLRepresentatives= queryBaseURL +"representatives" + APIkey+ "&address=" +defaultAddress;

    //Test URLs and console log
    //Election
    $.ajax({url: queryURLElection,
        method: "GET"
    }).then(function(response){  
        console.log(queryURLElection);
        console.log(response);
    });
    //voter Info
    $.ajax({url: queryURLVoterInfo,
        method: "GET"
    }).then(function(response){  
        console.log(queryURLVoterInfo);
        console.log(response);

    });
  
    //Representatives
    $.ajax({url: queryURLRepresentatives,
        method: "GET"
    }).then(function(response){  
        console.log(queryURLRepresentatives);
        console.log(response);
        //gives the info of the representative- in this example the highest ranked representative the president
        console.log(response.offices[0].name);
        console.log(response.officials[0].name);
        console.log(response.officials[0].photoUrl);
        console.log(response.officials[0].party);

    });
    
    //======================================
    //Functions
    //=============================================================================
    // initMap();
    // function initMap() {
    //     map= new google.maps.Map(document.getElementById('map'),{
    //         //default latitude and longitude
    //         center: {lat: -34.397, lng: 150.644},
    //         zoom: 8
    //     });
    // };
    var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([37.41, 8.82]),
          zoom: 4
        })
      });

    
    

 });
