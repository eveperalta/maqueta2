var slick_carousel = $('div.slick-carousel');
var slick_carousel_config = {
    infinite: false,
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
var tienda_config = getTiendaConfigValue();
var recurrent_nodes = {
   num_cajas: document.getElementById('num_cajas')
}
var cub_item = null;
var carrusel_meta = {
  show_each: 10,
  piso: {carousel_node: $('div#pisos_carousel'), last_item_index: 0, items: []},
  muro: {carousel_node: $('div#muros_carousel'), last_item_index: 0, items: []}
}


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

  // Boton que levanta el modal para usar el cubicador.
  $('button#muro_rotar').on('click', function(e){
    console.log(this);
    console.log("click hidden rotar muro");

  });

  $('.tooltipped').tooltip({delay: 50});

  // Inicializar los modal para que se pueda abrir mediante JS.
  $('#modal1').modal();
  $('#modal2').modal({
      complete: function() {
        redirectToHome();
      }
    });
  $('#modal3').modal({
    // dismissible: false,
    complete: function(){
      checkTiendaConfig();
    }
  });
  $('#modal4').modal();
  $('#imp_success_modal').modal();
  // Modal del cubicador.
  $('#modal_cub').modal({
    // Cada vez que se cierra el modal, se reinicia el formulario del cubicador.
    complete: function(){
      clearCubicadorForm();
      cub_item = null;
    }
  });

  checkTiendaConfig();

  // Evitar la propagacion del click de un elemento dentro del carrito,
  // excepto los botones "enviar" e "imprimir".
  $('ul#dropdown1').on('click', function(event) {
    if (!(event.target.nodeName === "A" && /btn/.test(event.target.className))) {
      event.stopPropagation();
    }
  });
});

$('a.dropdown-button').on('click', function(e){
  e.preventDefault();
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

      if (data.carousel_type == 'piso'){
        carrusel_meta.piso.items = data.carousel_items;
        carrusel_meta.piso.last_item_index = 0;
      }
      else if(data.carousel_type == 'muro'){
        carrusel_meta.muro.items = data.carousel_items;
        carrusel_meta.muro.last_item_index = 0;
      }

      updateCarousel(data.carousel_type, true);
      $('#loading_app').fadeOut(500);

  }).fail(function(jqXHR, textStatus, errorThrown) {
    error_json = jqXHR.responseJSON;
    console.log(error_json);

  }).always(function(data, textStatus, errorThrown) {
    $('a.category-link').toggleClass('disable_link');
     $(document).click();
  });
});

// Evento que se dispara despues de hacer el cambio de item (o slide) del carrusel.
$('div.slick-carousel').on('afterChange', function(event, slick, currentSlide, nextSlide){
  // Se guarda que tipo de carrusel (piso o muro) se esta usando,
  // con el nombre del id del DIV contenedor.
  var items_count = 0;
  var type = null;
  if (event.currentTarget.id === 'pisos_carousel'){
    type = 'piso';
    items_count = carrusel_meta.piso.items.length;
  }
  else if (event.currentTarget.id === 'muros_carousel'){
    type = 'muro';
    items_count = carrusel_meta.muro.items.length;
  }

  // console.log("posicion " + (currentSlide + slick.options.slidesToShow));

  if (type !== null) {
    // Se verifica si quedan productos por agregar al carrusel,
    if (items_count !== slick.slideCount) {
      // Se agregaran los siguientes n items (carrusel_meta.show_each) si
      // la siguiente posicion del carrusel es la ultima (sgte_pos + slidesToShow).
      if (currentSlide + slick.options.slidesToShow >= slick.slideCount) {
        console.log("Traer mas");
        updateCarousel(type, false);

      }else{
        console.log("Aun no");
      }
    }else{
      console.log("Ya se agregaron todos los items al carrusel");
    }
  }else{
    console.error("No se pudo determinar cual carrusel.");
  }
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

// Envio de formulario de la configuracion de la tienda de Sodimac (cuando la tienda no esta seteada en la app).
$('form#tienda_form').on('submit', function(event){
  event.preventDefault();
  var data = $(event.target).serialize();
  var button = $(event.target).find('input[type=submit]');
  var btn_txt = button.val();

  $.ajax({
    url: event.target.action,
    data: data,
    method: event.target.method,
    beforeSend: function()
    {
      button.val("Enviando...");
    }
  }).done(function(data, textStatus, jqXHR) {
    // Actualizar el valor del <meta> de la configuracion de la tienda.
    setTiendaConfigValue(data.tienda_config);
    // Cerrar modal.
    $('#modal3').modal('close');

  }).fail(function(jqXHR, textStatus, errorThrown) {
    var error_json = jqXHR.responseJSON;
    console.log(error_json.msg);

  }).always(function(data, textStatus, errorThrown) {
    button.val(btn_txt);

  });
});

// Envio del formulario para usar la API del cubicador.
$('form#cubicador_form').on('submit', function(event){
  event.preventDefault();
  var data = $(event.target).serialize();
  var button = $(event.target).find('input[type=submit]');
  var btn_txt = button.val();

  $.ajax({
    url: event.target.action,
    data: data,
    method: event.target.method,
    beforeSend: function()
    {
      button.prop('disabled', true);
      button.val("Calculando...");
    }
  }).done(function(data, textStatus, jqXHR) {
    // Setear la cantidad de cajas al span.
    setCantidadCajas(data.cantidad);

  }).fail(function(jqXHR, textStatus, errorThrown) {
    var error_json = jqXHR.responseJSON;
    console.log(error_json.msg);

  }).always(function(data, textStatus, errorThrown) {
    button.prop('disabled', false);
    button.val(btn_txt);
  });
});

// Evento de click en el carrito de cada elemento del carrusel.
$('div.slick-carousel').on('click', 'a.shopping_cart', function(event){
  event.preventDefault();
  var url = this.href;
  var data = $(this).parents('div.card-content').find('input').serialize();

  sendToCarritoAjax(data, url);
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

$('button#send_carrito_cub').on('click', function(event){
  if (cub_item !== null) {
    var data = cub_item.serializeArray();
    var href = this.dataset.carritoUrl + "/";

    for (var i = 0; i < data.length; i++) {
      if (/cantidad/i.test(data[i].name)) {
        data[i].value = recurrent_nodes.num_cajas.dataset.numCajas;
      }
      if (/sku/i.test(data[i].name)) {
        href += data[i].value;
      }
    }

    // Enviar el item con la cantidad cambiada al carrito.
    sendToCarritoAjax(data, href);
    // Cerrar el modal del cubicador.
    $('#modal_cub').modal('close');

  }else{
    console.error("No se tiene guardado el item para agregar al carrito, cub_item === null");
  }
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Realiza el llamado AJAX para enviar el producto (item) al carrito.
// Se dejo como funcion ya que el cubicador y el icono de carrito del producto lo usan.
function sendToCarritoAjax(data, url)
{
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
}

// Funcion que agrega n items (carrusel_meta.show_each) al carrusel.
// type = si es piso o muro
// delete_all = si hay que borrar los items del carrusel
// solamente los borra cambiar de categoria.
function updateCarousel(type, delete_all)
{
  var meta_temp = null;
  var limit = 0;

  if (type === 'piso') 
    meta_temp = carrusel_meta.piso;
  else if (type === 'muro')
    meta_temp = carrusel_meta.muro;

  if (meta_temp !== null) {
    // Borrar todos los items del carrusel si delete_all == true.
    if (delete_all)
      meta_temp.carousel_node.slick('removeSlide', null, null, true);

    // Calcular hasta donde se recorrera el array de productos.
    if (meta_temp.last_item_index + carrusel_meta.show_each >= meta_temp.items.length) {
      limit = meta_temp.items.length;
    }else{
      limit = meta_temp.last_item_index + carrusel_meta.show_each;
    }
    
    // Se itera el array de productos para agregarlos al carrusel hasta el limit.
    for (var i = meta_temp.last_item_index; i < limit; i++) {
      meta_temp.carousel_node.slick('slickAdd', meta_temp.items[i]);
    }
    // Asignar la ultima posicion.
    meta_temp.last_item_index = i;
  }
  console.log(carrusel_meta);
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
    updateTotal();
    // Se actualiza el estado del badge.
    updateBagde();
  }
}

// Resetear los valores por defecto de los inputs del formulario del cubicador.
function clearCubicadorForm()
{
  var fields = $('form#cubicador_form > input.cubicador_field');
  for (var i = 0; i < fields.length; i++) {
    if (/m2/i.test(fields[i].name)) {
      fields[i].value = 1;
    }else{
      fields[i].value = null;
    }
  }
  // Resetear el atributo de cantidad de cajas.
  setCantidadCajas(0);
}

// Dado la cantidad de cajas se asigna este valor al span y a su data-cantidad-cajas.
// Tambien verifica si tiene que habilitar el boton de enviar al carrito dentro del modal.
function setCantidadCajas(cantidad) 
{
  var btn = $('button#send_carrito_cub');
  // Setear el texto del span y el dataset con la cantidad de cajas.
  recurrent_nodes.num_cajas.innerHTML = cantidad;
  recurrent_nodes.num_cajas.dataset.numCajas = cantidad;

  // Revisar si habilitar o no el boton de enviar al carrito del modal del cubicador.
  if (cantidad > 0) {
    btn.prop('disabled', false);
  }else{
    btn.prop('disabled', true);
  }
}

// Actualiza el precio total de todos los items del carrito.
function updateTotal() 
{
  var carrito_items = $('div#carrito_container').children();
  var total_element = $('li#carrito-precio-total');
  var precio_total_carrito = 0;

  for (var i = 0; i < carrito_items.length; i++) {
    var price_item = parseInt(carrito_items[i].dataset.productPrice);
    var cantidad_item = parseInt(carrito_items[i].getElementsByClassName('cantidad-item')[0].value);
    precio_total_carrito += price_item * cantidad_item;
  }

  if (isNaN(precio_total_carrito))
    precio_total_carrito = 0;

  total_element.data('total', precio_total_carrito);
  total_element.find('span').html("Total: $ " + numberWithCommas(precio_total_carrito));
}

// Remueve todos los productos agregados al carrito de compra y deja en $0 el total.
function clearCarrito() 
{
  var carrito_container = document.getElementById('carrito_container');
  var total_element = $('li#carrito-precio-total');
  
  // Se remueve cada nodo del div#carrito_container
  while (carrito_container.firstChild) {
    carrito_container.removeChild(carrito_container.firstChild);
  }

  // Reinicializar el valor total del carrito.
  total_element.data('total', 0);  
  total_element.find('span').html("Total: $ 0");
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
  if (home_url != null)
    window.location = home_url;
}

function getTiendaConfigValue()
{
  var metas = document.getElementsByTagName('meta');
  for (var i = 0; i < metas.length; i++) {
    if (metas[i].name === 'tienda_config') {
      return (metas[i].getAttribute('value') === 'true')
    }
  }
  return true;
}

function setTiendaConfigValue(value)
{
  var metas = document.getElementsByTagName('meta');
  for (var i = 0; i < metas.length; i++) {
    if (metas[i].name === 'tienda_config') {
      metas[i].setAttribute('value', value);
      tienda_config = value;
      return;
    }
  }
  return;
}

function checkTiendaConfig()
{
  if (tienda_config) {
    $('#modal3').modal('open');

  }
}

function validateEmail(email)
{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function setValidOrInvalidField(field, valid) 
{
  if (valid) {
    $(field).removeClass('invalid');
    $(field).addClass('valid');
  }else{
    $(field).removeClass('valid');
    $(field).addClass('invalid');
  }
}

// Valida los datos (email, nombre y rut) que se envian a impresion.
function validateImpresionData(data)
{
  var pass = true;
  // EMAIL
  if (validateEmail(data.email.value.trim())) {
    setValidOrInvalidField(data.email, true);
  }else{
    setValidOrInvalidField(data.email, false);
    pass = false;
  }
  // NOMBRE
  if (data.nombre.value.trim().length !== 0) {
    setValidOrInvalidField(data.nombre, true);
  }else{
    setValidOrInvalidField(data.nombre, false);
    pass = false;
  }
  // RUT
  if (checkRut(data.rut.value)) {
    setValidOrInvalidField(data.rut, true);
  }else{
    setValidOrInvalidField(data.rut, false);
    pass = false;
  }
  return pass;
}

// Cada vez que se cambia la cantidad de cada item del carrito, se actualiza su precio total.
// Tambien previene que el usuario cambie valores inadecuados del input, los cambia a 1.
$('div#carrito_container').on('change', 'input.cantidad-item', function(event){
  var input_val = parseInt($(this).val());
  if (isNaN(input_val) || input_val < 1) {
    $(this).val(1);
  }
  updateTotal();
});

// Validar que el usuario cambie la cantidad de m2 del cubicador con valores inadecuados, los cambia a 1.
$('form#cubicador_form').on('change', 'input.m2_cub', function(event){
  var input_val = parseFloat($(this).val());
  if (isNaN(input_val) || input_val < 1) {
    $(this).val(1);
  }
});

// Cerrar el modal1 al presionar el boton X.
$('button#close-modal1').click(function(e){
  $('#modal1').modal('close');
});

// Cerrar el modal4 (IMPRESION) al presionar el boton X.
$('button#close-modal4').click(function(e){
  $('#modal4').modal('close');
});

// Cerrar el modal2 al presionar el boton X y redirigir al home.
$('button#close-modal2').click(function(e){
  $('#modal2').modal('close');
});

// Cerrar el modal2 al presionar el boton X y redirigir al home.
$('button#close-imp-success').click(function(e){
  $('#imp_success_modal').modal('close');
});

// Cerrar el modal del cubicador al presionar el boton X.
$('button#close-modal-cub').click(function(e){
  $('#modal_cub').modal('close');
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
      home_url = null;
      console.log(error_json);
    }).always(function(data, textStatus, errorThrown) {
      button.val('Enviar');
      button.prop('disabled', false);
    });

  }
});

// Evento de click en "Enviar" del modal de impresion.
$("#buttonModal4").click(function(e) {
  var btn = $(this);
  var impresion_data = {
    email: document.getElementById('imp_email'),
    nombre: document.getElementById('imp_nombre'),
    rut: document.getElementById('imp_rut')
  };
  var form_element = document.getElementById('carrito_form');
  var data = $(form_element).serializeArray();
  var form_url = this.dataset.formUrl;

  if (validateImpresionData(impresion_data)){
    // Agregar los datos que debe llenar el usuario a los datos del formulario (carrito)
    // para enviarlos a la impresion
    data.push({name: 'nombre', value: impresion_data.nombre.value.trim()});
    data.push({name: 'email', value: impresion_data.email.value.trim()});
    data.push({name: 'rut', value: impresion_data.rut.value});

    $.ajax({
      url: form_url,
      data: data,
      method: form_element.method,
      beforeSend: function()
      {
        btn.val('Enviando impresion...');
        btn.prop('disabled', true);
      }
    }).done(function(data, textStatus, jqXHR) {
      console.log(data);

      // Cerrar modal.
      $('#modal4').modal('close');
      // Abrir modal con el mensaje de exito al usuario.
      $('#imp_success_modal').modal('open');
      // Limpiar los campos de impresion llenados por el usuario.
      impresion_data.email.value = "";
      impresion_data.nombre.value = "";
      impresion_data.rut.value = "";
      // Reiniciar el carrito de compra.
      clearCarrito();
      // Y el badge
      resetBadge();

    }).fail(function(jqXHR, textStatus, errorThrown) {
      var error_json = jqXHR.responseJSON;
      console.log(error_json);

    }).always(function(data, textStatus, errorThrown) {
      btn.val('Enviar');
      btn.prop('disabled', false);
    });
  }

});

// Formatear el campo del rut al escribir o pegar en el input.
$("input#imp_rut").rut({
  formatOn: 'keyup change',
  validateOn: null // si no se quiere validar, pasar null
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

// Evento de click en boton 'm2' del producto. Asigna los valores de los input hidden del producto (sku, piso, superficie)
// para asignarlo a los input hidden del formulario del cubicador, luego de esto, se levanta el modal.
$('div.slick-carousel').on('click', 'button.rotate_background', function(event){
  // Guardar los input del producto clickeado.
  cub_item = $(this).parents('div.card-content').find('input');
  // Valores de los input hidden (sku, precio y tipo) de item del carrusel.
  var hidden_vals = cub_item.serializeArray();
  var data = {sku: null, piso: null, superficie: null};

  for (var i = 0; i < hidden_vals.length; i++) {
    var tmp_value = hidden_vals[i].value.length === 0 ? null : hidden_vals[i].value;
    // Obtener el valor del sku
    if (/sku/i.test(hidden_vals[i].name))
      data.sku = tmp_value;

    if (/categoria/i.test(hidden_vals[i].name))
      data.piso = tmp_value;

    if (/superficie/i.test(hidden_vals[i].name))
      data.superficie = tmp_value;
  }

  if (data.sku !== null && data.piso !== null && data.superficie !== null) {
    var cub_hiddens = $('form#cubicador_form').find('input');
    // Se asignan los valores de los input hidden del formulario del cubicador con 
    // el producto del carrusel clickeado.
    for (var i = 0; i < cub_hiddens.length; i++) {
      // SKU.
      if (/sku/i.test(cub_hiddens[i].name))
        cub_hiddens[i].value = data.sku;
      // PISO
      if (/piso/i.test(cub_hiddens[i].name))
        cub_hiddens[i].value = data.piso;
      // SUPERFICIE
      if (/superficie/i.test(cub_hiddens[i].name))
        cub_hiddens[i].value = data.superficie;
    }
    // Levantar el modal del cubicador.
    $('#modal_cub').modal('open');
  }
});

// Funcion para setear el valor de rotacion para los input hidden.
// input: nodo input hidden del valor de la rotacion.
function setRotateDegrees(input)
{
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
