
//var fbUrl = 'http://{YOUR FIREBASE STUFF}.firebaseio.com';
//if (fbRoot === undefined) var fbRoot = new Firebase(fbUrl);

//
// $.post( "/example", function( data ) {
//   $( "#post-result" ).html( data );
// });


// Global
var summonModal = function(modal_text){
  $(".modal-text").text(modal_text);
  $(".overlay").show();
  $(".modal").show();
};
var dismissModal = function(){
  $(".overlay").hide();
  $(".modal").hide();
}

$(".overlay").on("click", function(){
  dismissModal();
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


// Name selection
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

// Should only ever show one at a time

var init = function(){

  // Create cards for dataset
  faceData.forEach(function(card_data){
    createCard(card_data);
  });

  // Attach listeners
  $(".name").on("click", function(ee){
    //Here it'll check db to see if it's the right person

    if (true){ // If the answer is right
      // Increment score (window.score++)

      // Move card down and reveal next card?
      var cc = $(ee.target).closest(".card");
      cc.addClass("animated bounceOutDown");
      setTimeout(function(){
        cc.hide();
      }, 500)


    } else { // If answer is wrong, pass right name to modal and show face
      summonModal("Oops, that's actually [NAME]");
    };

  });

}; init();
