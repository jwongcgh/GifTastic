$(document).ready(function() {

    // create button dinamically for each of the animals that are added via an user input
    // create an array to contain all the animal buttons names

    // user entry after onclick, retrieve and save user input
    // store user input in array for button creation and association
    // call buttons creation each time user inputs a valid value
    // *** check valid input / notify if invalid input when submitting
    // *** check if input is empty, or with API if not retrieving anything

    // var animals = ["test","test1","test2","test3"];
    var animals = [];
    var invalidEntry = false;
    var maxItems = 10; // max items to be displayed when slected button is clicked

    $("#submit").on("click", function() {

        var userEntry = $("#userInput").val().trim();
        console.log("userEntry: " + userEntry);

        if (userEntry == "") {
            invalidEntry = true; // no sirve
            console.log("invalid entry");
        } else if (animals.includes(userEntry)) {
            console.log("butoon already exists");
            invalidEntry = true; // no sirve
        } else {
            animals.push(userEntry);
        }

        console.log("animals array: " + animals);
        createButts();
        $("#userInput").val("");
        // We have this line so that users can hit "enter" instead of clicking on ht button and it won't move to the next page
        return false;
    }); // end onclick input



    // empty field of div that contains animal buttons
    // create button, assign animal name from user input that is in the array of animals

    function createButts() {

        $("#animalButts").empty();

        for (i = 0; i < animals.length; i++) {
            var animalButts = $("<button>");
            animalButts.attr("data-name", animals[i]);
            animalButts.addClass("animalButts");
            animalButts.text(animals[i]);
            $("#animalButts").append(animalButts);
        }
    }

    // work with user input field, retrieve data from inout field at submit button click or enter press

    // at the click of "animal" button:
    // retrieve data from giphy using API
    // retrieve from json object the data that is to be displayed
    // specify number of items to be displayed per animal
    function retrieveInfo() {

        var searchQuery = $(this).data("name");
        console.log("searchQuery: " + searchQuery);
        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + searchQuery + "&api_key=dc6zaTOxFJmzC";

        $.ajax({ url: queryURL, method: "get" }).done(function(response) {

            $("#images").empty();
            console.log(response);

            for (i = 0; i < maxItems; i++) {

                var image = $("<img>");
                image.addClass("image");
                image.attr({
                    "src": response.data[i].images.fixed_height_still.url,
                    "data-still": response.data[i].images.fixed_height_still.url,
                    "data-animated": response.data[i].images.fixed_height.url,
                    "data-rating": response.data[i].rating,
                    "data-state": "still",
                });
                $("#images").append(image);

                // attribute is "src"
                // attr values are still, animated, rating
                // I want to assign various attr with its values to each clickable image
                // data-state will get value of sattic or animated

                // var src = response.data[i].images.fixed_height_still.url;
                // var static = response.data[i].images.fixed_height_still.url;
                // var animated = response.data[i].images.fixed_height.url;
                // var rating = response.data[i].rating;
                // var state = "still";
                // console.log("animal item #: " + i);
                // console.log("rating: " + rating);
                // console.log(still);

            } // end for loop 10 items max

        }); // end ajax

    }; // end retrieveInfo

    // additional instructions
    // display 10 animals, static gifs (non-animated) at specific animal button click
    // animate image when user clicks on them, stop when clicked again

    $(document).on("click", ".animalButts", retrieveInfo);

    // at this point images should have some attribute values assigned
    // change from static to animated when clicked on image

    $(document.body).on("click", ".image", function() {
        console.log("clicked");

        var state = $(this).attr("data-state")
            // console.log(state);
        if (state === "still") {
            $(this).attr("src", $(this).data("animated"));
            $(this).attr("data-state", "animated");
        } else {
            // If the clicked image's state is still, update it's src attribute to what it's data-animate value is.
            // Then set the image's data-state to animate
            $(this).attr("src", $(this).data("still"));
            $(this).attr("data-state", "still");
        }
    }); // end of onclick image

}); // end of document ready function
