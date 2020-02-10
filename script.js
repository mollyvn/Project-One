
//address needs to be turned into lat and long to create a pin
//polling place data needs to be pulled to create the pin
//the polling.html has a bug and doesnt show the results but it runs correctly and correct API info is in console.log
//I think having Bootstrap and Bulma messes up the style?!?

$(document).ready(function() {
    //=============================================================================
    //Set up variables
    //=============================================================================
    
    var APIkey= "?key=AIzaSyC1MqND2SWxPfzCLjrWJW7tagrSmpgr6dI";
    var map;

    //default address to test
    var defaultAddress="209%20W.%20Wilder%20Ave.%20Tampa%20FL"
    var defaultElectionID= "2000";
    //buttons
    var submitBtn =$("#submit");
    
    // URL base representatives
    var queryBaseURL="https://www.googleapis.com/civicinfo/v2/";
    var queryURLElection= queryBaseURL + "elections" +APIkey;
    var queryURLVoterInfo= queryBaseURL + "voterinfo" +APIkey + "&address=" +defaultAddress;
    // var queryURLDivisions= queryBaseURL + "division" +APIkey + "&address=" +defaultAddress;
    var queryURLRepresentatives= queryBaseURL +"representatives" + APIkey+ "&address=" +defaultAddress;
    var queryURLSearchPage = queryBaseURL +"representatives" + APIkey+ "&address="

    //Map
    var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([35.47, 78.46]),
          zoom: 4
        })
      });

    //=============================================================================
    //Event Listeners
    //=============================================================================
    //representatives
      $("#search").on("click", function(e){
          e.preventDefault();
          console.log("search btn clicked");
        var enteredAddress=encodeURI($("#address").val().trim());
        var levels =$("#levels").val();
        var roles=$("#roles").val();
        console.log(enteredAddress);
        console.log(levels);
        console.log(roles);

        var enteredAddressURL = queryBaseURL +"representatives" + APIkey+  "&address=" + enteredAddress + "&levels=" +levels+"&roles="+roles;
        if(enteredAddress===""){
            return;
        }
        // $("#wellSection").empty();

        if(levels==="Choose..."&&roles=="Choose..."){
            enteredAddressURL = queryBaseURL +"representatives" + APIkey+  "&address=" + enteredAddress;
        } else if(levels==="Choose..."){
            enteredAddressURL = queryBaseURL +"representatives" + APIkey+  "&address=" + enteredAddress +"&roles="+roles;
        } else if (roles==="Choose..."){
            enteredAddressURL = queryBaseURL +"representatives" + APIkey+  "&address=" + enteredAddress + "&levels=" +levels;
        };

        console.log(enteredAddressURL);


        runRepresentativeQuery(enteredAddressURL);

        return false;
      })


      //poll search

      $("#pollSearch").on("click", function(e){
        e.preventDefault();
        console.log("search btn clicked");
      var enteredAddress=encodeURI($("#address").val().trim());
      
      console.log(enteredAddress);

      var NewQueryURLVoterInfo= queryBaseURL + "voterinfo" +APIkey + "&address=" +enteredAddress;
      console.log(NewQueryURLVoterInfo);
      if(enteredAddress===""){
          return;
      }
      $("#wellSection").empty();

      pollingQuery(NewQueryURLVoterInfo);
     
      return false;
    })
    
//======================================
//Functions
//=============================================================================
//polling location function

function pollingQuery (queryURLVoterInfo){
    console.log('polling function runs');
    $.ajax({url: queryURLVoterInfo,
        method: "GET"
    }).then(function(response){  
     
    //put into HTML
    var electionSection=$('<div>');
    electionSection.addClass("well");
    electionSection.attr('data-election', 'elWell');
    $('#elecSection').append(electionSection);


    //Attach content to approp well
    $("#elWell").append("<h2>Election: "+ response.election.name+"</h2>");
    $("#elWell").append("<h2>Election Day: "+ response.election.electionDay+"</h2>");

    for (var p=0; p<response.pollingLocations.length; p++){
        var locationSection=$("<div>");
        locationSection.addClass("well");
        locationSection.attr('data-poll', 'pollWell-'+p );
        $("#elecSection").append(locationSection);

        //attach the content to well
        $("#pollWell-"+p).append("<h3>Location : "+response.pollingLocations[p].address.locationName+ "<br>"+ response.pollingLocations[p].address.line1+", " + response.pollingLocations[p].address.city+", "+ response.pollingLocations[p].address.state+", "+ response.pollingLocations[p].address.zip+"</h3>");
        $("#pollWell-"+p).append("<h3>Polling Hours: "+response.pollingLocations[p].pollingHours+"</h3>");
        
        //console log bc some appending issue, but data shows correctly in console
        console.log(response.election.name);
        console.log(response.election.electionDay);
        console.log(response.pollingLocations[p].address.locationName);

        }

        //add contestants when appending works- for now only console log test
       
        console.log(response.contests.length);
        console.log(response.contests[0].candidates[0]);
        // for(var c=0; response.contests.length;c++){
        //     var contestSection =$("<div>");
        //     conttestsection.addClass("well)
        // }
    
    // }

    });
}

//representative function 

function runRepresentativeQuery(queryURLRepresentatives){
    console.log("runQuery runs");

    $.ajax({url: queryURLRepresentatives,
        method: "GET"
    }).then(function(response){  
        console.log(queryURLRepresentatives);
        console.log(response);

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

            //the urls throw errors bc some don't have any(I think), so I commented it out for now
    
            // if(response.officials[i].urls[0]=="null" || response.officials[i].urls[0]==="undefined"){
            //     console.log(response.officials[i].name);
            //     $("#repWell-"+i).append("<h4>No URL available</h4>");
    
            // }
    
            //Attach content to approp well
            $("#repWell-"+i).append("<div class='card-image'><figure class='image is-128x128'><img src=" +response.officials[i].photoUrl+"></figure></div>");
            $("#repWell-"+i).append("<div class='card-content'><div class='content>");
            $("#repWell-"+i).append("<h4>Office: "+response.offices[i].name+"</h4>");
    
            $("#repWell-"+i).append("<h4>Name: "+response.officials[i].name+"</h4>");
            $("#repWell-"+i).append("<h4>Party: "+response.officials[i].party+"</h4>");
    
            // $("#repWell-"+i).append("<a href=" + response.officials[i].urls[0]+">"+response.officials[i].urls[0] +"</a>");
            $("#repWell-"+i).append("<br></div></div>");
    
        }
        
    
    
    });
    
    }







//a function for all upcoming elections, but we might not need that one

// function runElectionQuery(){
//     var queryURLElection= queryBaseURL + "elections" +APIkey;
//     $.ajax({url: queryURLElection,
//         method: "GET"
//     }).then(function(response){  
//         console.log(queryURLElection);
//         console.log(response);

//         $("#electionSection").empty();

//         for (var i=0; i<response.elections.length; i++){
    
//             //put into HTML
//             var electionSection=$('<div>');
//             electionSection.addClass("card");
//             electionSection.attr('data-election', 'elecWell-'+i);
//             $('#electionSection').append(electionSection);
    
    
//             //Attach content to approp well
//             $("#elecWell-"+i).append("<h2>Election: "+ response.elections[i].name+"</h2>");
//             $("#elecWell-"+i).append("<h2>Election Day: "+ response.elections[i].electionDay+"</h2>");
    
//         }
    
//     });
    
}
  

//======================================
//Event Handlers
//=============================================================================
//Event handler that goes with that election.html page and the election function that we can probably throw out
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
