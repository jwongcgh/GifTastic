$(document).ready(function() {

    // *************** variables declared/initialized *************** //

    var animals = [];           // array to store user entries
    var testEntry = false;      // helps weeding out user entries that are invalid
    var thisButton = "";        // variable especifying query to pass into gyphi's API


    // ****************************** user input listening event ****************************** //  
    
    $("#submit").on("click", function() {

        var userEntry = $("#userInput").val().trim();
        console.log("userEntry: " + userEntry);

        // checks for invalid and duplicate entries
        // this check CANNOT prevent valid word entries other than animals topic/theme
        // condition rejects empty spaces and anything that does not match alphabet
        // otherwise entry is temporarily accepted pending check with APIs database
        if (userEntry.match(/[^a-z]/i) || userEntry == "") {
            console.log("invalid entry from regexp");
        } else if (animals.includes(userEntry)) {
            console.log("butoon already exists");
        } else {
            animals.push(userEntry);
        }

        console.log("animals array: " + animals);
        // empties user input field
        $("#userInput").val("");
        testEntry = true;
        createButts();
        // users can hit "enter" or clicking button and it won't move to the next page
        return false;
    }); // end onclick input


    // ****************************** buttons generate function ****************************** //  

    function createButts() {
        // empties html button field before creating them
        $("#animalButts").empty();

        for (i = 0; i < animals.length; i++) {
            var animalButts = $("<button>");
            animalButts.attr("data-name", animals[i]);
            animalButts.addClass("animalButts");
            animalButts.text(animals[i]);
            // type and attr bootstrap style
            animalButts.attr("type", "button")
            animalButts.addClass("btn btn-default btn-success")
                // appending new buttons
            $("#animalButts").append(animalButts);
        }

        // testing entry control flow
        // testEntry = true, then user entry is sent to API's ajax query for content verification
        // checking against API's content, it weeds out additional invalid entries formats
        // else: userEntry = false, means user clicked on a button that was already created and verified
        if (testEntry) {
            retrieveInfo();
        } else {
            return
        }

    } // end createButts


    // ****************************** retrieve info from gyphi ****************************** // 

    function retrieveInfo() {

        // entry verificaion control flow
        // testEntry = false, the request for giphy content came from existing button
        // else: testEntry = true, the request for giphy content came from user entry step
        if (!testEntry) {
            var searchQuery = thisButton;
            // console.log("searchQuery: " + searchQuery);
        } else {
            var searchQuery = animals[animals.length - 1];
            // console.log("searchQuery: " + searchQuery);
        }

        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + searchQuery + "&api_key=dc6zaTOxFJmzC&limit=10";

        $.ajax({ url: queryURL, method: "get" }).done(function(response) {

            // entry verification control flow
            // testEntry = false, loads images, the request for giphy content came from existing button
            // else: testEntry = true, forwards to invalidEntry function since no content was found in giphy
            if (!testEntry) {
                $("#images").empty();
                console.log(response);
                console.log(response.data.length);

                for (i = 0; i < response.data.length; i++) {
                    var imgCont = $("<div>");
                    imgCont.addClass("imgCont thumbnail");
                    var image = $("<img>");
                    image.addClass("image");
                    image.attr({
                        "src": response.data[i].images.fixed_height_still.url,
                        "data-still": response.data[i].images.fixed_height_still.url,
                        "data-animated": response.data[i].images.fixed_height.url,
                        "data-state": "still",
                    });
                    imgCont.append("rating: " + response.data[i].rating);
                    imgCont.append(image);

                    $("#images").append(imgCont);

                } // end for loop 10 items max set on queryURL at &limit=10
            } else if (response.data.length == 0) {
                invalidEntry();
            } // end of entry verification control
        }); // end of ajax / response function
    }; // end retrieveInfo


    // ****************************** invalid Entry function ****************************** // 

    function invalidEntry() {
        // the button was created but found to be an invalid entry
        // remove/pop entries that cannot be found in APIs database, this was the last user entry in animals array
        // testEntry set to false and createButts function is called to refresh buttons field, invalid button is removed in the process
        animals.pop();
        console.log("removed invalid entry from array");
        console.log("array is now: " + animals);
        testEntry = false;
        createButts();
    } // end invalidEntry


    // ****************************** querying images from API server ****************************** // 

    // listening for created buttons click 
    // testEntry is set to false and retrieveInfo function is called to show content from gyphi related to the clicked button
    // this button info is stored in thisButton variable
    $(document).on("click", ".animalButts", function() {
        testEntry = false;
        thisButton = $(this).data("name");
        console.log("searchQuery thisButton is: " + thisButton);
        retrieveInfo();
    }); // end of on-click

    // ****************************** querying images from API server ****************************** // 

    // change from static to animated when clicked on image
    $(document.body).on("click", ".image", function() {
        console.log("clicked");

        var state = $(this).attr("data-state")
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
