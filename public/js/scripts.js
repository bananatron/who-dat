"use strict";
var fb = new Firebase('https://who-is-dat.firebaseio.com');


// Get user key is present
if (readCookie("name_key")) var name_key = readCookie("name_key");



$("#profile-link").on("click", function(ee){
  ee.preventDefault();
  
  if (name_key){ // Profile link will take user to their profile if logged in
    window.location.href = "/face/" + name_key;
  } else { // If they aren't logged in, take them to /login
    window.location.href = "/login";
  }
});





// If user is on /face profile page
if (window.location.pathname.indexOf("/face/") != -1 && window.location.pathname != "/face/new"){
  $("#face-form").css("opacity", "0");
  $(".all-seeing-eye").show();
  
  fb.child("hired").child("people").child(name_key).once("value", function(snap){
    var user_data = snap.val();
    $("#name").val(user_data.name);
    $("#position").val(user_data.position);
    $(".face-photo").css("background-image", "url(" + user_data.photo + ")" );
    $("#face-form").css("opacity", "1");
    $(".all-seeing-eye").hide();
  });
  
// IF user is on /face/new page
} else if (window.location.pathname == "/face/new"){
  showBody();
  $("#face-form").css("opacity", "1");
};










// If login
if (window.location.pathname == "/login"){
  var name_list = [];
  var name_data = {};

  // Query data store
  fb.child("hired").child("people").once("value", function(snap){
    for (var key in snap.val()) {

      // Make list of names for autocomplete
      name_list.push(snap.val()[key].name);

      // Make object to reference keys using names selected
      name_data[snap.val()[key].name.toLowerCase()] = Object.keys(snap.val())[0];
    };
  });

  $('#login-names').autocomplete({ // Set up autocomplete
    source: name_list,
    minLength: 2
  });
};




// Redirect to login if no user is identified.
if (readCookie("name_key") == null && window.location.pathname != "/login"){
  if (window.location.pathname != "/face/new") { // Let them through if /face/new
    window.location.href="/login";
  }
} else { // If auth, show body
  showBody();
};




// Play
if (window.location.pathname == "/play"){
  
  
  window.score = 0;
var faceIds = [
  "v-123123123", "x-123123"
];

var faceData = [
  {
    image_url: "images/toonspenser.png",
    name_options: [
      "Michael Bluth",
      "Snow White",
      "Tina Belcher",
      "Guy Fieri"
    ]
  },
  {
    image_url: "images/toonspenser.png",
    name_options: [
      "Buster Bluth",
      "Snow White",
      "Tina Belcher",
      "Guy Fieri"
    ]
  }

];


// ## Name selection
var createCard = function(card_data){
  console.log('Creating card');
  var card = $(".card-template").clone();
  card.find(".card-image").css("background-image", card_data.image_url);

  card_data.name_options.forEach(function(name){
    var li_name = card.find(".name-template").clone();
    li_name.text(name);
    li_name.removeClass('name-template');

    card.find(".name-options").append(li_name);
  });

  card.removeClass("card-template");
  $(".cards-container").append(card);
};




var init = function(){ // TODO Only for play

  // Create cards for dataset
  createCard(faceData[0]);

  // Attach listeners
  $(".name").on("click", function(ee){
    //Here it'll check db to see if it's the right person

    if (false){ // If the answer is right
      // Increment score (window.score++)

      // Move card down and reveal next card?
      var cc = $(ee.target).closest(".card");
      cc.addClass("animated bounceOutDown");
      setTimeout(function(){
        cc.hide();
      }, 500)


    } else { // If answer is wrong, pass right name to modal and show face
      //Save score
      summonModal("Oops, that's actually [NAME]");
    };

  });

}; init();
  
  
  
};










