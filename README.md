# Project-One
#Know Your Vote Application


This application was built with the purpose of allowing the user to access politcal information such as voting candiadtes, polling locaitons and current representives based on the user's input. Therefore the Google Civic Information API and Google Maps were used. 

When the user opens the application, they are taken to the index page that describes the purpose of the application. The "Know Your Vote" Button can be clicked and starts the apllication.  

Once on the polling.html,,the user will input their street address in the search box above the map that allows the application to pull from the api. On that page, the user will input his/her street address in the search box which will auto fill, if the user allows geolocation. The address is used to pull user specific information from the api and depending on the button the user clicks: 

-Polling Location,
-Early Voting,
-Candidates on Ballot and
-Current Representatives.

By clicking the specific button the user will be provided with specific information related to the request.

The polling information contains the election name and the date the election occurs, displays a map and a pin that allows the user to locate the nearest voting location in accordance with thier home address, and a section that states the polling location name and hours.

The early voting information shows where the user could vote early with each location having its own card with location name, days and hours early voting is possible. 

The candidate information presents each cardidate in a card. The cards are sorted by office and party. The card color is related to the party that they are affiliated with.


<img src ="./assets/images/appCurrentDesign.png">
<a href="https://mvn410.github.io/Project-One/">Election Info Application</a>
