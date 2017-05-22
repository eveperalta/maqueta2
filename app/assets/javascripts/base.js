var slick_carousel = $('div.slick-carousel');
var slick_carousel_config = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    edgeFriction: 0,
    swipeToSlide: true,
    respondTo: "window"
  };
var badge_element = document.getElementById('carrito-badge');
var bagde_count = 0
if (badge_element != null)
  bagde_count = parseInt(badge_element.dataset.count);
var home_url = null;
var rotate_degrees = [0, 90];

//dropdown menu
$( document ).ready(function(){
  $(".dropdown-button").dropdown({
    inDuration: 300,
    outDuration: 225,
    constrainWidth: false, // Does not change width of dropdown to that of the activator
    hover: false, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: true, // Displays dropdown below the button
    alignment: 'right', // Displays dropdown with edge aligned to the left of button
    stopPropagation: false // Stops event propagation
  });

  // Inicializar slick carrusel
  slick_carousel.slick(slick_carousel_config);

  $('button#piso_img_url').on('click', function(e){
    console.log(this);
    console.log("click hidden imagen piso");

  });

  $('button#piso_rotar').on('click', function(e){
    console.log(this);
    console.log("click hidden rotar piso");

  });

  $('button#muro_img_url').on('click', function(e){
    console.log(this);
    console.log("click hidden imagen muro");


  });

  $('button#muro_rotar').on('click', function(e){
    console.log(this);
    console.log("click hidden rotar muro");

  });

});

$('a.dropdown-button').on('click', function(e){
  resetBadge();
});

$(document).ready(function(){
  $('.materialboxed').materialbox();
});

$(".btn-floating").on("click", function(e){//funcion del boton ver
  $(".fav").removeClass("hide");
})

// Click en cada boton (categorias) del sidebar
$('a.category-link').on('click', function(e){
  e.preventDefault();
  $('#loading_app').fadeIn();
  $('#instrucciones').fadeOut();
  var url = this.href;
  var span = $(this).find('span');
  var img = $(this).find('img');
  var error_json = null;

  if(this.href.indexOf("piso") > -1)
  {
      // Quitar nombre de clase a todos los span para dejarlos deseleccionados.
      $('.image_selected_piso').removeClass('image_selected_piso');
      $('.text_link_selected_piso').removeClass('text_link_selected_piso');
      // Agregar clase al span para dejar seleccionado el link.
      img.addClass('image_selected_piso');
      span.addClass('text_link_selected_piso');
  }
  else {
    $('.image_selected_muro').removeClass('image_selected_muro');
    $('.text_link_selected_muro').removeClass('text_link_selected_muro');
    // Agregar clase al span para dejar seleccionado el link.
    img.addClass('image_selected_muro');
    span.addClass('text_link_selected_muro');
  }

  $.ajax({
    url: url,
    method: "get",
    beforeSend: function()
    {
      $('a.category-link').toggleClass('disable_link');
    }
  }).done(function(data, textStatus, jqXHR) {
      console.log(data);
      var carousel;

      if (data.carousel_type == 'piso')
        carousel = $('div#pisos_carousel');
      else if(data.carousel_type == 'muro')
        carousel = $('div#muros_carousel');
      else
        carousel = null;

      if (carousel !== null) {
        // Quitar todos los elementos del carrusel
        carousel.slick('removeSlide', null, null, true);

        // Luego agregarlos.
        for (var i = 0; i < data.carousel_items.length; i++) {
          carousel.slick('slickAdd', data.carousel_items[i]);
        }
      }

        $('#loading_app').fadeOut(500);

  }).fail(function(jqXHR, textStatus, errorThrown) {
    error_json = jqXHR.responseJSON;

  }).always(function(data, textStatus, errorThrown) {
    $('a.category-link').toggleClass('disable_link');
     $(document).click();
  });
});

// Envio de formulario del carrito de pisos y muros gustados.
$('form#carrito_form').on('submit', function(event){
  event.preventDefault();
  data = $(event.target).serialize();
  // Se agrega el parametro de email en los datos que enviara ajax.
  // (POR HACER)Hay que obtener el email ingresado por el usuario en el modal...
  // data.push({name: "email", value: ''});
  console.log(data);

  $.ajax({
    url: event.target.action,
    data: data,
    method: event.target.method,
    beforeSend: function()
    {
    }
  }).done(function(data, textStatus, jqXHR) {
    // Aqui se debe agregar el par de productos gustados al carrito.
    console.log(data);

  }).fail(function(jqXHR, textStatus, errorThrown) {
    var error_json = jqXHR.responseJSON;
    console.log(error_json.msg);
  }).always(function(data, textStatus, errorThrown) {

  });
});

// Evento de click en el carrito de cada elemento del carrusel.
$('div.slick-carousel').on('click', 'a.shopping_cart', function(event){
  event.preventDefault();
  var url = this.href;
  var data = $(this).parents('div.card-content').find('input').serialize();

  $.ajax({
    url: url,
    data: data,
    method: 'get',
    beforeSend: function()
    {
    }
  }).done(function(data, textStatus, jqXHR) {
    // Aqui se debe agregar el par de productos gustados al carrito.
    console.log(data);

    addItemToCarrito(data);

  }).fail(function(jqXHR, textStatus, errorThrown) {
    var error_json = jqXHR.responseJSON;
    console.log(error_json.msg);
  }).always(function(data, textStatus, errorThrown) {

  });

});


$('div.slick-carousel').on('click', 'a.set_background', function(event){
  event.preventDefault();
  var url = this.href;

  $.ajax({
    url: url,
    method: 'get',
    beforeSend: function()
    {
    }
  }).done(function(data, textStatus, jqXHR) {
    // Aqui se debe agregar el par de productos gustados al carrito.
    console.log(data);

  }).fail(function(jqXHR, textStatus, errorThrown) {
    var error_json = jqXHR.responseJSON;
    console.log(error_json.msg);
  }).always(function(data, textStatus, errorThrown) {

  });

});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Funcion que revisa si existe un par de productos gustados en el carrito antes de agregar un nuevo par para evitar duplicados.
function addItemToCarrito(carrito_data)
{
  var carrito_container = $('div#carrito_container');
  var carrito_items = carrito_container.children();
  var add_item = true;

  for (var i = 0; i < carrito_items.length; i++) {
    var data_set = carrito_items[i].dataset;
    if (data_set.productSku == carrito_data.item_sku){
      add_item = false;
      break;
    }
  }

  if (add_item) {
    // Si no existe el par de productos en el carrito, se agrega.
    carrito_container.append(carrito_data.carrito_item);

    // Calcular el precio total de los items del carrito.
    // Se toma el atributo 'total' y se le suma el precio del par de productos gustado entrante.
    var total_element = $('li#carrito-precio-total');
    var precio_total_carrito = total_element.data().total;
    precio_total_carrito += carrito_data.precio_total_item;

    total_element.data('total', precio_total_carrito);
    total_element.find('span').html("Total: $ " + numberWithCommas(precio_total_carrito));

    // Se actualiza el estado del badge.
    updateBagde();
  }
}

function resetBadge() {
  bagde_count = 0;
  badge_element.dataset.count = bagde_count;
  badge_element.innerHTML = "";

  $(badge_element).addClass('hide');
}

function updateBagde() {
  // Se suma +1 al contador del badge.
  bagde_count += 1;
  badge_element.dataset.count = bagde_count;
  badge_element.innerHTML = "+" + bagde_count;

  // Se hace visible el badge solo si el numero de items sin ver es distinto de 0.
  if (bagde_count !== 0)
    $(badge_element).removeClass('hide');
  else
    $(badge_element).addClass('hide');
}

function redirectToHome()
{

  home_url ="/";
/*
   home_url ="/";
   var j_selector = "";
   //IMAGEN DEFAULT PISO
   hidden_el = document.getElementById('muro_img_url');
   document.getElementById('muro_img_url').value='http://www.triplea.cl/imagesPisosYmuros/fondo1_muro_default.jpg';
   j_selector = '#muro_img_url';
    $(j_selector).click();

    hidden_el = document.getElementById('piso_img_url');
    document.getElementById('piso_img_url').value=' http://pisosymuros.triplea.cl/images/Fondos/piso-23.jpg';
    j_selector = '#piso_img_url';
     $(j_selector).click();
*/
  if (home_url != null)
    window.location = home_url;


}

// tool tip activator
$(document).ready(function(){
  $('.tooltipped').tooltip({delay: 50});

  // Inicializar el modal2 para que se pueda abrir mediante JS.
  $('#modal2').modal(
    {
      complete: function() {
        redirectToHome();
      }
    });
  $('#modal1').modal();
});

// Cerrar el modal1 al presionar el boton X.
$('button#close-modal1').click(function(e){
  $('#modal1').modal('close');
});

// Cerrar el modal2 al presionar el boton X y redirigir al home.
$('button#close-modal2').click(function(e){
  $('#modal2').modal('close');
});

// Evento de click en "Enviar" del primer modal.
$("#buttonModal1").click(function(e) {
  var email = document.getElementById('email_modal').value;
  var button = $(this);

  if (email.length !== 0) {
    var form_element = document.getElementById('carrito_form');
    data = $(form_element).serializeArray();

    // Se agrega el parametro de email en los datos que enviara ajax.
    data.push({name: "email", value: email});

    $.ajax({
      url: form_element.action,
      data: data,
      method: form_element.method,
      beforeSend: function()
      {
        button.val('Enviando correo...');
        button.prop('disabled', true);
      }
    }).done(function(data, textStatus, jqXHR) {
      console.log(data);
      document.getElementById('email_modal').value = "";
      home_url = data.home_url;

      // Cerrar modal del email.
      $('#modal1').modal('close');

      // Abrir modal de termino.
      $('#modal2').modal('open');

    }).fail(function(jqXHR, textStatus, errorThrown) {
      var error_json = jqXHR.responseJSON;
      console.log(error_json);
    }).always(function(data, textStatus, errorThrown) {
      button.val('Enviar');
      button.prop('disabled', false);
    });

  }
});

// Evento de click en boton 'ver'
$('div.slick-carousel').on('click', 'button.set_background', function(event){
  var carousel_container = $(this).parents('div.slick-carousel').attr('id');
  var img_url = this.dataset.img_url;
  var hidden_el = null;
  var rotar_hidden = null;
  var j_selector = "";

  if (carousel_container === 'muros_carousel') {
    // Setear los valores de los input hidden de muros.
    hidden_el = document.getElementById('muro_img_url');
    rotar_hidden = document.getElementById('muro_rotar');
    j_selector = '#muro_img_url';

  }else if(carousel_container === 'pisos_carousel'){
    // Setear los valores de los input hidden de pisos.
    hidden_el = document.getElementById('piso_img_url');
    rotar_hidden = document.getElementById('piso_rotar');
    j_selector = '#piso_img_url';

  }

  if (hidden_el !== null) {
    // Volver a dejar en 0 el input de la rotacion solo si la imagen a setear es distinta al valor guardado en el input.
    if (hidden_el.value != img_url)
      rotar_hidden.value = rotate_degrees[0];

    // Asignar el valor al input (url de la imagen).
    hidden_el.value = img_url;

    // Disparar el evento de click en el boton.
    $(j_selector).click();
  }

});


$('div.slick-carousel').on('click', 'div.card-image', function(event){


 var carousel_container = $(this).parents('div.slick-carousel').attr('id');
 var img_url =$(this).children('img').attr('src');
 var hidden_el = null;
 var rotar_hidden = null;
 var j_selector = "";

 if (carousel_container === 'muros_carousel') {
   // Setear los valores de los input hidden de muros.
   hidden_el = document.getElementById('muro_img_url');
   rotar_hidden = document.getElementById('muro_rotar');
   j_selector = '#muro_img_url';

 }else if(carousel_container === 'pisos_carousel'){
   // Setear los valores de los input hidden de pisos.
   hidden_el = document.getElementById('piso_img_url');
   rotar_hidden = document.getElementById('piso_rotar');
   j_selector = '#piso_img_url';

 }

 if (hidden_el !== null) {
   // Volver a dejar en 0 el input de la rotacion solo si la imagen a setear es distinta al valor guardado en el input.
   if (hidden_el.value != img_url)
     rotar_hidden.value = rotate_degrees[0];

   // Asignar el valor al input (url de la imagen).
   hidden_el.value = img_url;

   // Disparar el evento de click en el boton.
   $(j_selector).click();
 }


});

// Evento de click en boton 'rotar'
$('div.slick-carousel').on('click', 'button.rotate_background', function(event){

/*  var j_selector ="#muro_img_url";
  alert("asdf");
var j_selector1= "#muro_img_url";
alert($(j_selector1).val());
$(j_selector1).click();*/
  var carousel_container = $(this).parents('div.slick-carousel').attr('id');
  var hidden_el = null;
  var j_selector = "";

  if (carousel_container === 'muros_carousel') {
    // Setear los valores de los input hidden de muros.
    hidden_el = document.getElementById('muro_rotar');
    j_selector = '#muro_rotar';

  }else if(carousel_container === 'pisos_carousel'){
    // Setear los valores de los input hidden de pisos.
    hidden_el = document.getElementById('piso_rotar');
    j_selector = '#piso_rotar';

  }

  if (hidden_el !== null) {
     // Disparar el evento de click en el boton.
    $(j_selector).click();

    setRotateDegrees(hidden_el);
  }

});

// Funcion para setear el valor de rotacion para los input hidden.
// input: nodo input hidden del valor de la rotacion.
function setRotateDegrees(input){
  var degrees = input.value;
  var new_degrees = null;
  var index = rotate_degrees.indexOf(parseInt(degrees));

  if (index !== -1) {
    if (rotate_degrees[index + 1] === undefined)
      new_degrees = rotate_degrees[0];
    else
      new_degrees = rotate_degrees[index + 1];
  }else{
    new_degrees = rotate_degrees[0];
  }

  input.value = new_degrees;
}

/*$("#fondoInicial").load(function() {
  $("#loading_app_inicial").fadeOut(300);
  setTimeout(function() {
        $("#fondoInicial").fadeIn(1000);
        setTimeout(function() {
            $("#content_pantalla_inicio").fadeIn(1400);
        },1000);

    }, 600);

});*/


$('#autorenew_bottom').on('click', function(){
$('.fondo').fadeOut(300);
$("#loading_app").fadeIn();
$('#goHome_App').click();
    redirectToHome();

});


  $(document).ready(function () {

    /* Pantalla Inicial */
    $("#loading_app_inicial").fadeOut(300);
    setTimeout(function() {
          $("#fondoInicial").fadeIn(1000);
          setTimeout(function() {
              $("#content_pantalla_inicio").fadeIn(1400);
          },1000);

      }, 600);

    /*Fin Pantalla Inicial */
  /*  setTimeout(function() {
          $("#loading_app").fadeOut(300);
          setTimeout(function() {
              $(".fondo").fadeIn(1400);
          },500);

      }, 6000);*/


  })
