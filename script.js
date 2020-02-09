//auto complete address needs to be done for address input field
//address needs to be turned into lat and long to create a pin
//polling place data needs to be pulled to create the pin

$(document).ready(function() {
    //=============================================================================
    //Set up variables
    //=============================================================================
    
    var APIkey= "?key=AIzaSyC1MqND2SWxPfzCLjrWJW7tagrSmpgr6dI";
    var map;

    //$("#search");
    //if using whole address add %20 between all spaces
    var defaultAddress="209%20W.%20Wilder%20Ave.%20Tampa%20FL"
    //using the zip code for now
    // var defaultAddress="33603";
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
        // console.log(queryURLElection);
        // console.log(response);
    });
    //voter Info
    $.ajax({url: queryURLVoterInfo,
        method: "GET"
    }).then(function(response){  
        // console.log(queryURLVoterInfo);
        // console.log(response);

        //polling location address
        // console.log(response.pollingLocations[0].address);

    });
  
   

    //Map
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


      $("#search").on("click", function(e){
          e.preventDefault();
          console.log("search btn clicked");
        var enteredAddress=encodeURI($("#address").val().trim());
        console.log(enteredAddress);

        var enteredAddressURL = queryBaseURL +"representatives" + APIkey+  "&address=" + enteredAddress;
        console.log(enteredAddressURL);

        runQuery(enteredAddressURL);

        if(enteredAddress===""){
            return;
        }
        $("#wellSection").empty();

        return false;
      })
    
    //======================================
    //Functions
    //=============================================================================
      //get representative infor from address

      //representative url

      function runQuery(queryURLRepresentatives){
        console.log("runQuery runs");

      
    
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
        console.log(response.officials.length);

    
        //Result section representative test with default address
    //clear well
    $("#wellSection").empty();

    for (var i=0; i<response.officials.length; i++){

        //put into HTML
        var wellSection=$('<div>');
        wellSection.addClass("card");
        wellSection.attr('id', 'repWell-'+i);
        $('#wellSection').append(wellSection);

        if(response.officials[i].photoUrl=== "null" || response.officials[i].photoUrl=== "undefined" ){
            console.log(response.officials[i].name);
            $("#repWell-"+i).append("<img src='http://placehold.it/128x128'>");

        }

        // if(response.officials[i].urls[0]=="null" || response.officials[i].urls[0]==="undefined"){
        //     console.log(response.officials[i].name);
        //     $("#repWell-"+i).append("<h4>No URL available</h4>");

        // }

        //Attach content to approp well
        $("#repWell-"+i).append("<div class='card-image'><figure class='image is-128x128'><img src=" +response.officials[i].photoUrl+"></figure></div>");
        $("#repWell-"+i).append("<div class='card-content'><div class='content>");
        $("#repWell-"+i).append("<h4>Office: "+response.offices[i].name+"</h4>");
        // $("#repWell-"+i).append("<div class='card-content'><div class='media'><div class='media-content'><h4>Office: "+response.offices[i].name+"</h4>");

        $("#repWell-"+i).append("<h4>Name: "+response.officials[i].name+"</h4>");
        $("#repWell-"+i).append("<h4>Party: "+response.officials[i].party+"</h4>");

        // $("#repWell-"+i).append("<a href=" + response.officials[i].urls[0]+">"+response.officials[i].urls[0] +"</a>");
        $("#repWell-"+i).append("<br></div></div>");

        // class='is-rounded' 
    }
    


});

}
      

    //======================================
    //Event Handlers
    //=============================================================================
    // $("#searchbtn").on("click", function(){
    //     //get address fom input field
    //     //use address to get info about upcoming elections

    // function test(){

   
    //     $.ajax({url: queryURLElection,
    //         method: "GET"
    //     }).then(function(response){  
    //         console.log(queryURLElection);
    //         console.log(response);
    //     });

    //     $("#wellSection").empty();

    //         for (var i=0; i<response.elections.length; i++){

    //             //put into HTML
    //             var wellSection=$('<div>');
    //             wellSection.addClass("well");
    //             wellSection.attr('id', 'electionWell-'+i);
    //             $('#wellSection').append(wellSection);

    //             console.log(response.elections[i].name);
    //             console.log(response.elections[i].electionDay);

    //             $("#electionWell-"+i).append("<h5>"+response.elections[i].name+"</h5>");
    //             $("#electionWell-"+i).append("<h5>"+response.elections[i].electionDay+"</h5>");

    //         }
    //     }
    // test();

    // })
    

 });
