//dropdown menu
$( document ).ready(function(){
  $(".dropdown-button").dropdown();
});

// Initialize collapsible (uncomment the line below if you use the dropdown variation)
$('.collapsible').collapsible();



$(document).ready(function(){
  $('.materialboxed').materialbox();
});
$(document).ready(function(){
  $(".owl-carousel").owlCarousel();
});

$(".btn-floating").on("click", function(e){
  $(".fav").removeClass("hide");
})
