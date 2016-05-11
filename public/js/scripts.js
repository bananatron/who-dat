"use strict";
var fb = new Firebase('https://who-is-dat.firebaseio.com');

// Get user key is present
if (readCookie("name_key")) var name_key = readCookie("name_key");








// #Face (profile page)
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
  $("#save-face").text('Lets get this party started')
  showBody();
  $("#face-form").css("opacity", "1");
};








// #Login
if (window.location.pathname == "/login"){
  $("#logout-button").hide();
  var name_list = [];
  var name_data = {};
  
  $("#login-names").on("input", function(){
    console.log($(this).val())
    if ( $(this).val() != "" ){
      $(".login-button").addClass("u-opacity100");
    } else {
      $(".login-button").removeClass("u-opacity100");
    }
  });

  // Query data store
  fb.child("hired").child("people").once("value", function(snap){
    for (var key in snap.val()) {

      // Make list of names for autocomplete
      name_list.push(snap.val()[key].name);

      // Make object to reference keys using names selected
      name_data[snap.val()[key].name.toLowerCase()] = key;
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
  $(".body-navigation").show(); // Hide nav
  showBody();
};




// #Scores
if (window.location.pathname == "/scores"){
  $(".all-seeing-eye").show();
  
  fb.child("hired").child("scores").on("value", function(score_snap){
    $(".score-new").remove(); // Remove all old isntances
    
    Object.keys(score_snap.val()).forEach(function(uid){ // Go through all score results
      
      //Look up score based on uid
      fb.child("hired").child("people").child(uid).once("value", function(user_snap){
        createScore(user_snap.val().name, score_snap.val()[uid], user_snap.val().photo);
        $(".all-seeing-eye").hide();
      });
      
    });
  
  });
};




// #Play
if (window.location.pathname == "/play"){
  $(".all-seeing-eye").show();
  
  window.score = 0;
  var faceData = [];
  var faceNames = [];
  var faceIndex = 0;
  var faceKeys = [];
  
  // Fetch user keys
  fb.child("hired").child("people").once("value", function(snap){
    faceData = snap.val();
    delete faceData[name_key];
    faceKeys = shuffle(Object.keys(faceData));
    
    Object.keys(faceData).forEach(function(uid){
      faceNames.push({name:faceData[uid].name, key:uid});
    });
    $(".all-seeing-eye").hide();
    createCard(faceKeys[faceIndex]);
  });


  // ## Name selection
  var createCard = function(uid){ // Takes firebase person object - key is uid
    var max_option_count = 6;

    var card = $(".card-template").clone();
    card.find(".card-image").css("background-image", "url(" + faceData[uid].photo + ")");
    card.data("card_uid", uid);

    var name_options = [{name:faceData[uid].name, key: uid}];

    for (var ii = 0; ii < max_option_count; ii++){
      var found = false;
      var rand_name = faceNames[Math.floor(Math.random()*faceNames.length)];
      if ((name_options).indexOf(rand_name) == -1){ 
        name_options.forEach(function(name_data) { // Probably not most efficient way of checking for dups
          if (name_data.name == rand_name.name) found = true;
        });
        if (found == false) name_options.push(rand_name);
      }; shuffle(name_options);
    };


    name_options.forEach(function(name_option){
      var li_name = card.find(".name-template").clone();
      li_name.text(name_option.name);
      li_name.data("name_key", name_option.key);
      li_name.removeClass('name-template');

      card.find(".name-options").append(li_name);
    });

    card.removeClass("card-template");
    $(".cards-container").append(card);
    addCardListeners();
  };




  var addCardListeners = function(){
    // Attach listeners
    $(".name").on("click", function(ee){
      var $li = $(ee.currentTarget);
      var click_uid = $li.data("name_key");
      var card_uid = $li.closest(".card").data("card_uid");
      
      if (click_uid == card_uid){ // If the answer is right
        faceIndex += 1; window.score += 1;
        $(".scoreboard-score").text(window.score);
        
        var cc = $(ee.target).closest(".card").addClass("animated bounceOutDown");
        setTimeout(function(){
          cc.hide();
          if (faceKeys[faceIndex] == undefined){ // If there are no faces left
            var score_path = fb.child("hired").child("scores").child(name_key);
            score_path.once("value", function(snap){
              if (snap.val() == null || snap.val() < window.score ){
                score_path.set(window.score);
              }
            }).then(function(){
              $(".scoreboard-score").addClass("scoreboard-center");
              summonModal("<h3>You're amazing</h3> You know <i>literally</i> everyone.", {title: "Victory is Mine", url:"/scores"});
            });
          } else { // Show next face
            createCard(faceKeys[faceIndex]);
          }
        }, 700);


      } else { // Answer is wrong - show modal + score
        var score_path = fb.child("hired").child("scores").child(name_key);
        score_path.once("value", function(snap){
          if (snap.val() == null || snap.val() < window.score ){
            score_path.set(window.score);
          }
        }).then(function(){
          $(".scoreboard-score").addClass("scoreboard-center");
          summonModal("Oops, that's actually <h4>" + faceData[card_uid].name + "</h4>", { title: "Try Again", url: "/play" });
        });
      };
    });
  };
};




// Hacky profile link thing
$("#profile-link").on("click", function(ee){
  ee.preventDefault();

  if (name_key){ // Profile link will take user to their profile if logged in
    window.location.href = "/face/" + name_key;
  } else { // If they aren't logged in, take them to /login
    window.location.href = "/login";
  }
});

// Logout
$("#logout-button").on("click", function(){
  eraseCookie("name_key");
  window.location.href = "/login";
});



var console_style = "font-size: 16px; color:#DA2598; font-family:'monospace';"
console.log("%chired.com", "color: black; font-family: 'monospace'; font-size: 2rem; font-weight: 800;");
console.log("%c♥", console_style);
