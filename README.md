# Project-One
Know Your Vote Application


This application was built with the purpose of allowing the user to access politcal information such as voting candiadtes, polling locaitons and current representives based on the user's input. Therefore the Google Civic Information API and Google Maps were used. 

When the user opens the application, they are taken to the index page when it states it purpose and allows the user to choose two routes of information. 

The first route allows the user to click on the "Your Representatives" button. The user will be connected to the "representatives.html" and will see an address input field and selection options to get personalized information about current representatives. After the "search" button is clicked, the representative information appears. Each representative is displayed in a card containing a picture, if there is one available in the API, the name, current office and the representative's url, if available in the API. 

The second route of information appears when the user click's the "Election Info" button and allows the user to search for his/her upcoming election using the user's entered address, the nearby polling location and hours, early voting locations and hours or information about the running candidates that will be on the ballot.

The user will input their street address in the search box above the map that allows the application to pull from the api. On that page, the user will input his/her street address in the search box which will auto fill, if the user allows geolocation. The address is used to pull user specific information from the api and depending on the button the user clicks:

-Polling Location,
-Early Voting or
-Candidates on Ballot,

a second row with the related information appears.

The polling information contains the election name and the date the election occurs, displays a map and a pin that allows the user to locate the nearest voting location in accordance with thier home address, and a section that states the polling location name and hours.

The early voting information shows where the user could vote early with each location having its own card with location name, days and hours early voting is possible. 

The candidate information presents each cardidate in a card. The cards are sorted by office and party. The card color is related to the party that they are affiliated with.


<img src ="./assets/images/project1IMg.png">
<a href="https://mvn410.github.io/Project-One/">Election Info Application</a>
