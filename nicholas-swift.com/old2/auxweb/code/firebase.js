
// Global variable partyId
var partyId = "6RKQWU"

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCc0QkHGLGuu20jsORfgrJ2iUEzGaI5rPE",
    authDomain: "auxmusic-e8f47.firebaseapp.com",
    databaseURL: "https://auxmusic-e8f47.firebaseio.com",
    storageBucket: "auxmusic-e8f47.appspot.com",
};
firebase.initializeApp(config);

// Search for tracks
function searchTracks() {

    //console.log("TESTING");

    // Set up which field it is
    var fieldText = 'searchtextfield';

    // Get the elements and then url
    var songName = document.getElementById(fieldText).value;
    //console.log(songName);
    var myUrl = 'https://api.spotify.com/v1/search?q=' + songName + '&type=track';

    // Make the ajax call
    $.ajax({
        url: myUrl,
        data: {
            format: 'json'
        },
        error: function() {
            console.log("AN ERROR HAS OCCURED");

            // SHOW RED OR SOMETHING
        },
        dataType: 'json',
        success: function(data) {
            trackHelper(data); // Return a list of tracks
        }
    });
}

// Add tracks to the search table view
function trackHelper(data) {

    // Set up with ul it is
    var myUl = 'searchlistTableView';

    var trackList = document.getElementById(myUl);

    $(trackList).empty();

    // Empty the albumList first
    //$('searchListTableView').empty();

    // Fill the album list with data
    for (i = 0; i < data.tracks.items.length; i++) {

        // Set up vars
        var trackName = data.tracks.items[i].name;
        var artistName = data.tracks.items[i].artists[0].name;
        var artworkUrl = data.tracks.items[i].album.images[0].url;
        var trackId = data.tracks.items[i].id;

        // Create a new list element with correct class
        var myLi = '<button class="searchTrackButton" id="' + trackId + '"><li class="tableViewCell">';
        var myImg = '<img class="albumArt" src="' + artworkUrl + '" width="50" height="50">';
        var myTitle = '<span style="margin-right:64px;">' + trackName + '</span><br>';
        var myArtist = '<span style="color:#999; margin-right:64px;">' + artistName + '</span></li></button>';

        var allStrings = myLi + myImg + myTitle + myArtist;

        //console.log(allStrings); // Log data for debugging

        // Add the li to the ul
        $(allStrings).fadeIn(1000).appendTo(trackList);
        var element = document.getElementById(trackId);
        console.log(trackId);
        element.addEventListener('click', addTrack, false);

        // //Create an input type dynamically.
        // var element = document.createElement("input");

        // //Assign different attributes to the element.
        // element.setAttribute("type", 'button');
        // element.setAttribute("id", trackId);
        // element.setAttribute("value", trackName + " by " + artistName);
        // element.addEventListener('click', addTrack, false);

        // var ul = document.getElementById("addSongList2");
        // ul.appendChild(element);
    }
}

function addTrack(e) {

    //console.log("ADD TRACK FUNCTION STARTED");

    var trackId = jQuery(this).attr("id"); //e.target.id;
    //console.log(trackId);
    //console.log("GOT TRACK ID");

    // Set up field and url
    var myUrl = 'https://api.spotify.com/v1/tracks/' + trackId

    // Make the ajax call
    $.ajax({
        url: myUrl,
        data: {
            format: 'json'
        },
        error: function() {
            document.getElementById("p1").innerHTML = ('An error has occured');
        },
        dataType: 'json',
        success: function(data) {

            var albumTitle = data.album.name;
            var artist = data.artists[0].name;
            var duration = data.duration_ms;
            var spotifyId = data.id;
            var title = data.name;
            var uri = data.uri;
            var url = data.album.images[0].url;

            //document.write(title)

            var postData = {
                albumTitle: albumTitle,
                artist: artist,
                duration: duration,
                spotifyId: spotifyId,
                title: title,
                uri: uri,
                url: url
            };

            addTrackHelper(postData);
        }
    });
}

function addTrackHelper(postData) {

    //console.log("IN ADD TRACK HELPER");

    //var partyId = 'GN63ri'

    //Get a key for a new Post.
    var newPostKey = firebase.database().ref().push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/PartyDetails/' + partyId + '/queue/' + newPostKey] = 0;
    updates['/Songs/' + partyId + '/' + newPostKey] = postData;

    //$('#' + 'joinDiv').addClass('wowhidden');
    $('#' + 'searchDiv').addClass('wowhidden');
    $('#' + 'partyDiv').removeClass('wowhidden');

    return firebase.database().ref().update(updates);
}

// Join a party
function joinParty() {

    // Set up which field it is
    var partyCode = document.getElementsByClassName('partyCode')[0];
    var joinButton = document.getElementsByClassName('joinButton')[0];

    var canJoin = false;


    // Call firebase database at parties/. It will return a list of party ids
    firebase.database().ref('Parties/').on('value', function(snapshot) {

        // Check if the code typed matches
        snapshot.forEach(function(childSnapshot) {

            var key = childSnapshot.key
            if(partyCode.value == key) {
                canJoin = true;
            }
        });

        if(canJoin === true) {
            //console.log("LOG IN PLEASE");
            partyId = partyCode.value

            // var joinDiv = document.getElementById('joinDiv');
            // var partyDiv = document.getElementById('partyDiv');

            setup();

            $('#' + 'joinDiv').addClass('wowhidden');
            $('#' + 'partyDiv').removeClass('wowhidden');
        }
        else {
            // DO SOMETHING, MAYBE RED TEXT
        }

    });

}

// Get Tracks
function setup() {

    console.log("SETUP");

    console.log(partyId);

    // ADD THE CURRENT SONG

    firebase.database().ref('PartyDetails/' + partyId + '/currentSong').on('value', function(snapshot) {

        console.log("IN FIREBASE");
        console.log(partyId);

        console.log(snapshot.val());

        var myStr = 'Songs/' + partyId + '/' + snapshot.val();
        //console.log(myStr);

        firebase.database().ref(myStr).on('value', function(snapshot) {

            // Organize all the data
            var albumUrl = snapshot.val().url;
            var trackTitle = snapshot.val().title;
            var artist = snapshot.val().artist;
            var albumTitle = snapshot.val().albumTitle;

            // Set up the current song with the correct information
            var hTrack = document.getElementsByClassName('song')[0];
            var hArtist = document.getElementsByClassName('artist')[0];
            var hAlbum = document.getElementsByClassName('album')[0];
            var hImg = document.getElementById('currentSongImage');

            hTrack.innerHTML = trackTitle;
            hArtist.innerHTML = artist;
            hAlbum.innerHTML = albumTitle;
            hImg.src = albumUrl;
            hImg.width = 250;
            hImg.height = 250;

            // Set up the background
            var backgroundStr = "url('" + albumUrl + "')";
            document.body.style.backgroundImage = backgroundStr;

            console.log("CURRENT SONG");
            console.log(albumUrl + " - " + trackTitle + " - " + artist);
        });

    });

    // ADD THE SONGS TO THE CURRENT PLAYLIST

    // Get the unordered list
    var myUl = document.getElementById('playlistTableView');

    firebase.database().ref('PartyDetails/' + partyId + '/queue').on('child_added', function(snapshot) {

        // Upvotes
        //console.log(snapshot.val());
        var tempUpvotes = snapshot.val();
        //console.log(tempUpvotes);

        firebase.database().ref('Songs/' + partyId + '/' + snapshot.key).on('value', function(snapshot) {

            // Upvotes
            //console.log(snapshot);
            //console.log(snapshot.val().title);

            var upvotes = tempUpvotes;
            //console.log(upvotes);

            // Organize all the data
            var albumUrl = snapshot.val().url;
            var trackTitle = snapshot.val().title;
            var artist = snapshot.val().artist;

            //console.log(albumUrl + " - " + trackTitle + " - " + artist) // Log data for debugging

            // Create a new list element with correct class
            var myLi = '<li class="tableViewCell" id="' + snapshot.key + '">';
            var myImg = '<img class="albumArt" src="' + albumUrl + '" width="50" height="50">';
            var myTitle = '<span style="margin-right:64px;">' + trackTitle + '</span><br>';
            var myArtist = '<span style="color:#999; margin-right:64px;">' + artist + '</span></li>';

            var allStrings = myLi + myImg + myTitle + myArtist;

            //console.log(allStrings); // Log data for debugging

            // Add the li to the ul
            $(allStrings).fadeIn(1000).appendTo(myUl);

        });
    });

    firebase.database().ref('PartyDetails/' + partyId + '/queue').on('child_removed', function(snapshot) {

        //console.log(snapshot.key); // This is the console firebase key
        var removeString = '#' + String(snapshot.key);
        $(removeString).remove();

    });

    // Search 
}

function goToSearch() {

    //$('#' + 'joinDiv').addClass('wowhidden');
    $('#' + 'searchDiv').removeClass('wowhidden');
    $('#' + 'partyDiv').addClass('wowhidden');

}

//$(document).ready(setup);