
// Reveal body once all the things are done
var showBody = function(){
  $(".body-content").addClass("u-opacity100");
};

// We aren't using real auth, just cookie storage
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
};





// Summon modals from the depths of the underworld
// ( Also, can include buttons )
var summonModal = function(modal_text, button_data){
  
  if (button_data){
    var a = $("<a></a>").attr("href", button_data.url);
    var button = $("<button class='button-primary modal-button'></button>").text(button_data.title);
    a.append(button);
  };

  $(".modal-text").html(modal_text).append(a);
  $(".overlay").show(); 
  $(".modal").show();
};

var dismissModal = function(){
  $modal = $(".modal");
  if ($modal.find("button").length == 0){ // Don't dismiss actionable modals
    $(".overlay").hide();
    $(".modal").hide();
  };
};

$(".overlay").on("click", function(){ dismissModal(); });
$(document).keyup(function(e) { // Dismiss modal on escape
  if (e.keyCode == 27) { dismissModal(); }
});





// Saves photo
var savePhoto = function(callback) {
  console.log('File upload starting...');
  var f = document.getElementById('file-upload').files[0];

  if (f == undefined){
    if (callback) callback();
    return;
  }

  $(".face-photo").addClass("u-blur");

  if (f.size > 500000){
    summonModal("Sorry hombre, this photo is too big. Try using a photo under 500kb.")
    return;
  };

  var reader = new FileReader();
  reader.onload = (function(theFile) {

    return function(e) {
      var filePayload = e.target.result;
      $("#save-face").addClass("u-opacity0");
      $('#file-upload').addClass("u-opacity0");
      $("input").prop('disabled', true);

      fb.child("hired").child("people").child(name_key).child("photo").set(filePayload, function() {
        console.log('Uploaded');
        $("#save-face").removeClass("u-opacity0");
        $('#file-upload').removeClass("u-opacity0");
        $(".face-photo").removeClass("u-blur");
        $("input").prop('disabled', false);

        $(".face-photo").css("background-image", "url(" + filePayload + ")" );
        if (callback) callback();
      });
    };
  })(f);
  reader.readAsDataURL(f);

};





// Saves face data for new and updates to existing users
var saveFaceData = function(){ // Called from profile update onClick
  event.preventDefault();

  var name = $("#name").val();
  var position = $("#position").val();
  
  // Validations for new
  if (window.location.pathname == "/face/new") {
    if (document.getElementById('file-upload').files[0] == undefined){
      summonModal("<h2>Oops!</h2> You need a photo!")
      return;
    };
    if (name == undefined || name == ""){
      summonModal("<h2>Whoah there!</h2> You need a name first.")
      return;
    };
  }

  if (name_key == undefined){
    // Generate placeholder object (firebase objects can't be blank)
    name_key = fb.child("hired").child("people").push({name:'New User'}).toString().split("/").pop();
    // Save cookie name_key
    createCookie("name_key", name_key);
  };

  fb.child("hired").child("people").child(name_key).child("name").set(name);
  fb.child("hired").child("people").child(name_key).child("position").set(position, function(){
    savePhoto(function(){
      // After save, redirect to user key profile page
      window.location.href = "/face/" + name_key
    });
  });
};




// Handles login form submission
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
    summonModal("<h2>Oops</h2> We can't find that name.")
  }
};


// Shuffles items of array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};



// Creates score dom element and appends to container for /scores page
var createScore = function(name, score, photo){
  var $score_listing = $(".score-listing-template").clone();
  $score_listing.find(".score-name").text(name);
  $score_listing.find(".score-number").text(score);
  $score_listing.css("order", score);
  if (photo) $score_listing.find(".score-photo").css("background-image", "url(" + photo + ")")
  $(".score-containers").append($score_listing);
  $score_listing.removeClass("score-listing-template").addClass("score-new");
};



var findPersonByName = function(person_name){
  
  fb.child("hired").child("people").once("value", function(snap){
    var result_key;
    var snap_result = snap.val();
    
    Object.keys(snap_result).forEach(function(uid){
      if (snap_result[uid].name.toLowerCase() == person_name.toLowerCase()) { 
        result_key = uid;
      };
    });
    console.log(result_key || "No user found");
    
  });
};



