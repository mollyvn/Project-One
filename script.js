
//address needs to be turned into lat and long to create a pin
//polling place data needs to be pulled to create the pin
//I think having Bootstrap and Bulma messes up the style, is that possible?!?

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
      console.log("POLLING DATS", NewQueryURLVoterInfo)
     
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
        


     $("#elecSection").empty();
     $("#pollSection").empty();
     $("#candidateSection").empty();

     //
    //  if (response==="error") {
    //      $("#elecSection").html("<p>No elections in the near future available or error in address.<p>")
    //  } else
    

    //put into HTML
    var electionSection=$('<div>');
    electionSection.addClass("well");
    electionSection.attr('id', 'elWell');
    $('#elecSection').append(electionSection);


    //Attach election content to approp section
    $("#elWell").append("<h2>Election: <br>"+ response.election.name+"</h2><br>");
    $("#elWell").append("<h2>Election Day: <br>"+ response.election.electionDay+"</h2>");

    //data for polling places

    for (var p=0; p<response.pollingLocations.length; p++){
        var locationSection=$("<div>");
        locationSection.addClass("well");
        locationSection.attr('id', 'pollWell-'+p );
        $("#pollSection").append(locationSection);

        //attach the content to well
        $("#pollWell-"+p).append("<h2>Location : <br>"+response.pollingLocations[p].address.locationName + 
            "<br>"+ response.pollingLocations[p].address.line1 + ", " 
            + response.pollingLocations[p].address.city + ", "
            + response.pollingLocations[p].address.state + ", "
            + response.pollingLocations[p].address.zip+"</h2><br>");
        $("#pollWell-"+p).append("<h2>Polling Hours: <br>"+response.pollingLocations[p].pollingHours+"</h2>");
        
        //console log bc some appending issue, but data shows correctly in console
        console.log(response.election.name);
        console.log(response.election.electionDay);
        console.log(response.pollingLocations[p].address.locationName);

    }

    //add contestants when appending works- for now only console log test
    for (var c=0; c<response.contests.length; c++){
        var candidateSection=$("<div>");
        var candidateContainer = $("<div class='candidate-container'>");
        candidateSection.addClass("well");
        candidateSection.attr('id', 'candWell-'+c );
        $("#candidateSection").append(candidateSection);

        //attach the content to well
        $("#candWell-"+c).append("<h2 style='font-weight:bold;'>Ballot Placement: "+response.contests[c].ballotPlacement+ "</h2>");
        $("#candWell-"+c).append("<h2 style='font-weight:bold;'>Ballot Title/ Office : "+response.contests[c].office + "</h2> <hr class='my-4'>");
        for (var a=0; a<response.contests[c].candidates.length; a++){
            var candidateCard = $("<div class='candidate-card'>");
            console.log(response.contests[c].candidates.length);
            $(candidateCard).append("<p>Candidate: "+response.contests[c].candidates[a].name+ "</p>");
            $(candidateCard).append("<p>Party: "+response.contests[c].candidates[a].party+ "</p>");
            $(candidateContainer).append(candidateCard);
            $("#candWell-"+c).append(candidateContainer);

            var green =response.contests[c].candidates[0].party==="GREEN";
            var liberatarian= response.contests[c].candidates[0].party==="LIBERTARIAN";
            var democratic= response.contests[c].candidates[0].party==="DEMOCRATIC";
            var republican = response.contests[c].candidates[0].party==="REPUBLICAN";
        
            
            if(green){
                $(candidateCard).css("background-color","#e3eaa7");

                $("#candWell-"+c).css("box-shadow", "2px 2px 2px 2px #e3eaa7");
                $("#candWell-"+c).css("border-radius", "5px");
            } else if (liberatarian){
                $(candidateCard).css("background-color","#ffef96");

                $("#candWell-"+c).css("box-shadow", "2px 2px 2px 2px #ffef96");
                $("#candWell-"+c).css("border-radius", "5px");
            }else if (democratic){
                $(candidateCard).css("background-color","#deeaee");
                
                $("#candWell-"+c).css("box-shadow", "2px 2px 2px 2px #deeaee");
                $("#candWell-"+c).css("border-radius", "5px");
            } else if(republican){
                $(candidateCard).css("background-color","#eca1a6");

                $("#candWell-"+c).css("box-shadow", "2px 2px 2px 2px #eca1a6");
                $("#candWell-"+c).css("border-radius", "5px");
            }  else {
                $("#candWell-"+c).css("box-shadow", "2px 2px 2px 2px gray");
            }
        }
        
        }


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
    
            $("#repWell-"+i).append("<a href=" + response.officials[i].urls[0]+">"+response.officials[i].urls[0] +"</a>");
            // var offUrl = (response.officials[i].urls && response.officials[i].urls[0]) ? response.officials[i].urls[0] : "no url available";

            var offUrl;

            if(response.officials[i].urls && response.officials[i].urls[0]) {
                offUrl = "<a href='" + response.officials[i].urls[0] + "'>" + response.officials[i].urls[0] + "</a>";
            } else {
                offUrl = "<p>no url available</p>";
            }

            $("#repWell-"+i).append(offUrl);
            $("#repWell-"+i).append("<br></div></div>");
    
        }
        
    
    
    });
    
    }


 });
