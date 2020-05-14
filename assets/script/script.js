
$(document).ready(function() {
    //=============================================================================
    //Set up variables
    //=============================================================================
    
    var APIkey= "?key=AIzaSyC1MqND2SWxPfzCLjrWJW7tagrSmpgr6dI";
    var map;
    var queryBaseURL="https://www.googleapis.com/civicinfo/v2/";
    
      //hide certain areas at start
      $("#polling").css("display","none");
      $("#elections").css("display","none");
      $("#secondLowestRow").css("display","none");
      $("#lowestRow").css("display","none");
      $("#lowerRow").css("display","none");
      $("#repPopUp").css("display","none");
      $("#repResultRow").css("display", "none");

    //=============================================================================
    //Event Listeners
    //=============================================================================
    
    //button to open the rep section

        $("#repSearchBtn").on("click", function(e){
            $("#repPopUp").css("display","block");
            $("#lowerRow").css("display","none");
            $("#repSearchBtn").css("display", "none");
            $("#earlySearchBtn").css("display","none");
            $("#pollSearchBtn").css("display","none");
            $("#candSearchBtn").css("display","none");
            $("#backBtn").css("display","none");  
            //don't display rows that areant rep rows
            $("#lowestRow").css("display","none");  //candidate row
    });
    
    //representatives click event
      $("#searchRepBtn").on("click", function(e){
          e.preventDefault();
          console.log("search btn clicked");
          $("#repRow").css("display","block");
          $("#repResultsRow").css("display","flex");

        var enteredAddress=encodeURI($("#autocomplete").val().trim());
        //var saveInput = JSON.parse(localStorage.getItem("address"));//
           // $("#text").val("");//  <!-- local storage for address-->
           // $("#text").val(saveInput);//
        var levels =$("#levels").val();
        var roles=$("#roles").val();
        console.log(enteredAddress);
        console.log(levels);
        console.log(roles);

        var enteredAddressURL = queryBaseURL +"representatives" + APIkey+  "&address=" + enteredAddress + "&levels=" +levels+"&roles="+roles;
        if(enteredAddress===""){
            return;
        }
        $("#wellSection").empty();

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


      //polling search click event

      $("#pollSearchBtn").on("click", function(e){
        e.preventDefault();
        console.log("poll search btn clicked");
      var enteredAddress=encodeURI($("#autocomplete").val().trim());
      
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

    //candidate search click event

    $("#candSearchBtn").on("click", function(e){
        e.preventDefault();
        console.log("cand search btn clicked");
      var enteredAddress=encodeURI($("#autocomplete").val().trim());
      
      console.log(enteredAddress);

      var NewQueryURLVoterInfo= queryBaseURL + "voterinfo" +APIkey + "&address=" +enteredAddress;
      console.log(NewQueryURLVoterInfo);
      if(enteredAddress===""){
          return;
      }

      candidateQuery(NewQueryURLVoterInfo);
     
      return false;
    })

    //early voting event listener

    $("#earlySearchBtn").on("click", function(e){
        e.preventDefault();
        console.log("early vote search btn clicked");
      var enteredAddress=encodeURI($("#autocomplete").val().trim());
      
      console.log(enteredAddress);

      var NewQueryURLVoterInfo= queryBaseURL + "voterinfo" +APIkey + "&address=" +enteredAddress;
      console.log(NewQueryURLVoterInfo);
      if(enteredAddress===""){
          return;
      }

      earlyVoteQuery(NewQueryURLVoterInfo);
     
      return false;
    })
    
//======================================
//Functions
//=============================================================================

//polling location function

function pollingQuery (queryURLVoterInfo){
    console.log('polling function runs');
    
    $.ajax({url: queryURLVoterInfo,
        method: "GET",
    }).then(function(response){  
        // console.log("ajax complete")
     $("#elecSection").empty();
     $("#pollSection").empty();

     //take out other rows
     $("#lowerRow").css("display","flex");
     $("#map").css("display","flex");
     $("#secondLowestRow").css("display","none");
     $("#lowestRow").css("display","none");
     $("#polling").css("display","block");
     $("#elections").css("display","block");

    //put into HTML
    var electionSection=$('<div>');
    electionSection.addClass("well");
    electionSection.attr('id', 'elWell');
    $('#elecSection').append(electionSection);

    
    // var elecName= response.election.name || response.error.errors[0].message;
    //     console.log(elecName);
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
        
        var addr = response.pollingLocations[p].address.line1 + " " + response.pollingLocations[p].address.city + " " + response.pollingLocations[p].address.state + " " + response.pollingLocations[p].address.zip;

        console.log("adress to pin:", addr);

        //fillInAddress()
        console.log(response);

        codeAddress(addr);


        //console log bc some appending issue, but data shows correctly in console
        console.log(response.election.name);
        console.log(response.election.electionDay);
        console.log(response.pollingLocations[p].address.locationName);

    } 

});
$(document).ajaxError(function(){
    $("#elecSection").empty();
     $("#pollSection").empty();
     $("candidateSection").empty();

     //take out other rows
     $("#lowerRow").css("display","flex");
     $("#secondLowestRow").css("display","none");
     $("#lowestRow").css("display","none");
     $("#elections").css("display","block");
     $("#mapSection").css("display","block");
     $("#polling").css("display", "block");

    //put into HTML
    var electionSection=$('<div>');
    electionSection.addClass("well");
    electionSection.attr('id', 'elWell');
    $('#elecSection').append(electionSection);
   //append error message
    $("#elWell").append("<p>Currently, there is no election information available! This might be due to the fact that there is no election in the near future, due to missing information in the Google Civic Information API or an error in your entered address.</p>");

    var locationSection=$("<div>");
        locationSection.addClass("well");
        locationSection.attr('id', 'pollWell');
        $("#pollSection").append(locationSection);

    //error message for missing polling location
    $("#pollWell").append("<p>Currently, there is no polling location information available! This might be due to the fact that there is no election in the near future, due to missing information in the Google Civic Information API or an error in your entered address.</p>");

  });
}
///candidate function

function candidateQuery(queryURLVoterInfo){
    console.log('candidate function runs');
    $.ajax({url: queryURLVoterInfo,
        method: "GET"
    }).then(function(response){  
        
     $("#candidateSection").empty();

     //take out map and location etc
    $("#lowestRow").css("display", "block");
    $("#secondLowestRow").css("display","none");
    $("#lowerRow").css("display","none");


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
            // console.log(response.contests[c].candidates.length);
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
    $(document).ajaxError(function(){
        $("#elecSection").empty();
         $("#pollSection").empty();
         $("candidateSection").empty();

    
         //take out other rows
         $("#lowerRow").css("display","none");
         $("#secondLowestRow").css("display","none");
         $("#lowestRow").css("display","block");
         $("#elections").css("display","none");
         $("#mapSection").css("display","none");
         $("#candidateSection").css("display","flex");

    
        //put into HTML
        var candidateSection=$("<div>");
        candidateSection.addClass("well");
        candidateSection.attr('id', 'candWell' );
        $("#candidateSection").append(candidateSection);
       //append error message
        $("#candWell").append("<p>Currently, there is no candidate information available! This might be due to the fact that there is no election in the near future, due to missing information in the Google Civic Information API or an error in your entered address.</p>");
    
      });
}

//early voting info

function earlyVoteQuery(queryURLVoterInfo){
    console.log('candidate function runs');
    $.ajax({url: queryURLVoterInfo,
        method: "GET"
    }).then(function(response){  
        
        $("#elecSection").empty();
        $("#pollSection").empty();
        $("#earlyVoteSection").empty();

//hide other rows
    $("#lowerRow").css("display","none");
     $("#secondLowestRow").css("display","block");
     $("#lowestRow").css("display","none");

    //put into HTML
    var electionSection=$('<div>');
    electionSection.addClass("well");
    electionSection.attr('id', 'elWell');
    $('#elecSection').append(electionSection);


    //Attach election content to approp section
    $("#elWell").append("<h2>Election: <br>"+ response.election.name+"</h2><br>");
    $("#elWell").append("<h2>Election Day: <br>"+ response.election.electionDay+"</h2>");

    //take out candidate column and empty polling loc column
    $("#lowestRow").css("display", "none");
    $("#polling").css("display","none");


    //data for polling places

    for (var e=0; e<response.earlyVoteSites.length; e++){
        var earlyLocationSection=$("<div>");
        earlyLocationSection.addClass("card");
        earlyLocationSection.attr('id', 'earlyWell-'+e );
        $("#earlyVoteSection").append(earlyLocationSection);

        //attach the content to well
        $("#earlyWell-"+e).append("<h2>Location : <br>"+response.earlyVoteSites[e].address.locationName + 
            "<br>"+ response.earlyVoteSites[e].address.line1 + ", " 
            + response.earlyVoteSites[e].address.city + ", "
            + response.earlyVoteSites[e].address.state + ", "
            + response.earlyVoteSites[e].address.zip+"</h2><br>");
        $("#earlyWell-"+e).append("<h2>Polling Hours: <br>"+response.earlyVoteSites[e].pollingHours+"</h2><br>");
        $("#earlyWell-"+e).append("<h2>Start Date: <br>"+response.earlyVoteSites[e].startDate+"</h2><br>");
        $("#earlyWell-"+e).append("<h2>End Date: <br>"+response.earlyVoteSites[e].endDate+"</h2>");

        
        //console log bc some appending issue, but data shows correctly in console
      
        console.log(response.earlyVoteSites[e].address.locationName);

    }
     
});
$(document).ajaxError(function(){
    $("#elecSection").empty();
     $("#pollSection").empty();
     $("candidateSection").empty();


     //take out other rows
     $("#lowerRow").css("display","none");
     $("#secondLowestRow").css("display","block");
     $("#lowestRow").css("display","none");
     $("#elections").css("display","none");
     $("#mapSection").css("display","none");

    //put into HTML
    var earlySection=$('<div>');
    earlySection.addClass("well");
    earlySection.attr('id', 'earlyWell');
    $('#earlyVoteSection').append(earlySection);
   //append error message
    $("#earlyWell").append("<p>Currently, there is no early vote information available! This might be due to the fact that there is no election in the near future, due to missing information in the Google Civic Information API or an error in your entered address.</p>");

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
        $("#repResultRow").css("display","flex");
        $("#polling").css("display","none");
        $("#elections").css("display","none");
        $("#secondLowestRow").css("display","none");
        $("#lowestRow").css("display","none");
        $("#lowerRow").css("display","none");
        $("#repRow").css("display","none");



        for (var i=0; i<response.officials.length; i++){
    
            //put into HTML
            var wellSection=$('<div>');
            wellSection.addClass("card");
            wellSection.attr('id', 'repWell-'+i);
            $('#wellSection').append(wellSection);


            var imgUrl = response.officials[i].photoUrl || "http://placehold.it/128x128";

    
            //Attach content to approp well
            $("#repWell-"+i).append("<div class='card-image mx-auto'><figure class='image is-128x128'><img src=" +imgUrl+"></figure></div>");
            $("#repWell-"+i).append("<div class='card-content mx-auto'><div class='content>");
            $("#repWell-"+i).append("<h4>Office: "+response.offices[i].name+"</h4>");
    
            $("#repWell-"+i).append("<h4>Name: "+response.officials[i].name+"</h4>");
            $("#repWell-"+i).append("<h4>Party: "+response.officials[i].party+"</h4>");
    
            var offUrl = (response.officials[i].urls && response.officials[i].urls[0]) ? response.officials[i].urls[0] : "no url available";

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
    $(document).ajaxError(function(){
        $("#elecSection").empty();
         $("#pollSection").empty();
    
         //take out other rows
         $("#lowerRow").css("display","flex");
         $("#secondLowestRow").css("display","none");
         $("#lowestRow").css("display","none");
         $("#elections").css("display","block");
         $("#mapSection").css("display","none");
    
        //put into HTML
      var wellSection=$('<div>');
      wellSection.addClass("card");
      wellSection.attr('id', 'repWell');
      $('#wellSection').append(wellSection);
       //append error message
        $("#repWell").append("<p>No information available! This might be due to the missing information in the API (e.g. the state not updating the information) or an error in your entered address.</p>");
    
      });
    }


 });
