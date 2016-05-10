"use strict";

// Helpers

//TODO we don't want to trigger this on change, but on submit
document.getElementById("file-upload").addEventListener('change', handleFileSelect, false);

function handleFileSelect(evt) {
  console.log('File upload starting...');

  var f = evt.target.files[0];
  var reader = new FileReader();
  reader.onload = (function(theFile) {
    return function(e) {
      var filePayload = e.target.result;
      $('#file-upload').hide();
      // Generate a location that can't be guessed using the file's contents and a random number
      // var hash = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(filePayload));
      // var f = new Firebase(firebaseRef + 'pano/' + hash + '/filePayload');
      // spinner.spin(document.getElementById('spin'));
      // Set the file payload to Firebase and register an onComplete handler to stop the spinner and show the preview
      fb.child('lol').set(filePayload, function() {
        // spinner.stop();
        console.log('Uploaded');
        // document.getElementById("pano").src = e.target.result;
        $()
        // Update the location bar so the URL can be shared with others
        // window.location.hash = hash;
      });
    };
  })(f);
  reader.readAsDataURL(f);
}

var createCookie = function(name,value,days) {
  if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

var readCookie = function(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

var eraseCookie = function(name) {
  createCookie(name,"",-1);
}










var fb = new Firebase('https://who-is-dat.firebaseio.com');

// If login
if (window.location.pathname == "/login"){
  var name_list = [];
  var name_data = {};

  fb.child("hired").child("people").once("value", function(snap){
    for (var key in snap.val()) {

      // Make list of names for autocomplete
      name_list.push(snap.val()[key].name);

      // Make object to reference keys using names selected
      name_data[snap.val()[key].name.toLowerCase()] = Object.keys(snap.val())[0];
    };
  });

  $('#login-names').autocomplete({
    source: name_list,
    minLength: 2
  });
};



// ## Routing
// We aren't using real auth here, but if we needed to Firebase has twitter, google, facebook

// Redirect to login if no user is identified.

var showBody = function(){
  $(".body-content").addClass("u-opacity100");
};

if (readCookie("name_key") == null && window.location.pathname != "/login"){
  window.location.href="/login";
} else {
  showBody();
};





// ## Global
var summonModal = function(modal_text){
  $(".modal-text").text(modal_text);
  $(".overlay").show();
  $(".modal").show();
};
var dismissModal = function(){
  $(".overlay").hide();
  $(".modal").hide();
}

$(".overlay").on("click", function(){ dismissModal(); });
$(document).keyup(function(e) { // Dismiss modal on escape
  if (e.keyCode == 27) { dismissModal(); }
});


// Play
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





// ## Login

var loginForm = function(e){
  event.preventDefault(); // Don't submit lol
  var person_name = name_data[$("#login-names").val().toLowerCase()];

  // If we can't find a key for that name
  if (person_name != undefined){
    // Store user key in cookie
    // This will be referenced since all over since we aren't using actual auth
    createCookie("name_key", person_name);
    window.location.href = "/play"; // Redirect to play
  } else {
    summonModal("Oops, we can't find that name.")
    //TODO put button to add
  }

};
