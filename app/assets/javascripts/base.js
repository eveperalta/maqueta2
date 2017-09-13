var slick_carousel = $('div.slick-carousel');
var slick_carousel_config = {
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    edgeFriction: 0,
    swipeToSlide: true,
    respondTo: "window",
    nextArrow: '<button type="button" class="slick-next">Next<span class="badge slick-carousel-badge hide"></span></button>',
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
  badge_showing: false,
  show_each: 10,
  piso: {carousel_node: $('div#pisos_carousel'), last_item_index: 0, items: []},
  muro: {carousel_node: $('div#muros_carousel'), last_item_index: 0, items: []}
}
var windows = {
  piso: null,
  muro: null
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
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

  $('.tooltipped').tooltip({delay: 50});

  // Inicializar los modal para que se pueda abrir mediante JS.
  $('#modal1').modal();
  $('#modal2').modal({
      complete: function() {
        clearCarrito();
        resetBadge();
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

  $('.materialboxed').materialbox();

  initWindows();

  $('input.vk1').keyboard({
    // set this to ISO 639-1 language code to override language set by
    // the layout: http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
    // language defaults to ["en"] if not found
    language: ['spanish-qwerty'],
    rtl: false,

    // *** choose layout & positioning ***
    // choose from 'qwerty', 'alpha',
    // 'international', 'dvorak', 'num' or
    // 'custom' (to use the customLayout below)
    layout: 'qwerty',
    customLayout: {
      'default': [
        'd e f a u l t',
        '{meta1} {meta2} {accept} {cancel}'
      ],
      'meta1': [
        'm y m e t a 1',
        '{meta1} {meta2} {accept} {cancel}'
      ],
      'meta2': [
        'M Y M E T A 2',
        '{meta1} {meta2} {accept} {cancel}'
      ]
    },
    // Used by jQuery UI position utility
    position: {
      // null = attach to input/textarea;
      // use $(sel) to attach elsewhere
      of: null,
      my: 'center top',
      at: 'center top',
      // used when "usePreview" is false
      at2: 'center bottom',
      offset: '0 20'
    },

    // allow jQuery position utility to reposition the keyboard on
    // window resize
    reposition: true,

    // true: preview added above keyboard;
    // false: original input/textarea used
    usePreview: false,

    // if true, the keyboard will always be visible
    alwaysOpen: false,

    // give the preview initial focus when the keyboard
    // becomes visible
    initialFocus: true,
    // Avoid focusing the input the keyboard is attached to
    noFocus: false,

    // if true, keyboard will remain open even if
    // the input loses focus.
    stayOpen: false,

    // Prevents the keyboard from closing when the user clicks or
    // presses outside the keyboard. The `autoAccept` option must
    // also be set to true when this option is true or changes are lost
    userClosed: false,

    // if true, keyboard will not close if you press escape.
    ignoreEsc: false,

    // *** change keyboard language & look ***
    display: {
      'meta1': '\u2666', // Diamond
      'meta2': '\u2665', // Heart

      // check mark (accept)
      'a': '\u2714:Accept (Shift-Enter)',
      'accept': 'Accept:Accept (Shift-Enter)',
      'alt': 'AltGr:Alternate Graphemes',
      // Left arrow (same as &larr;)
      'b': '\u2190:Backspace',
      'bksp': 'Bksp:Backspace',
      // big X, close/cancel
      'c': '\u2716:Cancel (Esc)',
      'cancel': 'Cancel:Cancel (Esc)',
      // clear num pad
      'clear': 'C:Clear',
      'combo': '\u00f6:Toggle Combo Keys',
      // num pad decimal '.' (US) & ',' (EU)
      'dec': '.:Decimal',
      // down, then left arrow - enter symbol
      'e': '\u21b5:Enter',
      'empty': '\u00a0', // &nbsp;
      'enter': 'Enter:Enter',
      // left arrow (move caret)
      'left': '\u2190',
      // caps lock
      'lock': '\u21ea Lock:Caps Lock',
      'next': 'Next \u21e8',
      'prev': '\u21e6 Prev',
      // right arrow (move caret)
      'right': '\u2192',
      // thick hollow up arrow
      's': '\u21e7:Shift',
      'shift': 'Shift:Shift',
      // +/- sign for num pad
      'sign': '\u00b1:Change Sign',
      'space': '\u00a0:Space',
      // right arrow to bar
      // \u21b9 is the true tab symbol
      't': '\u21e5:Tab',
      'tab': '\u21e5 Tab:Tab',
      // replaced by an image
      'toggle': ' ',

      // added to titles of keys
      // accept key status when acceptValid:true
      'valid': 'valid',
      'invalid': 'invalid',
      // combo key states
      'active': 'active',
      'disabled': 'disabled'

    },

    css: {
      // input & preview
      input: 'ui-widget-content ui-corner-all',
      // keyboard container
      container: 'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix',
      // keyboard container extra class (same as container, but separate)
      popup: 'virtual-key',
      // default state
      buttonDefault: 'ui-state-default ui-corner-all',
      // hovered button
      buttonHover: 'ui-state-hover',
      // Action keys (e.g. Accept, Cancel, Tab, etc);
      // this replaces "actionClass" option
      buttonAction: 'ui-state-active',
      // Active keys
      // (e.g. shift down, meta keyset active, combo keys active)
      buttonActive: 'ui-state-active',
      // used when disabling the decimal button {dec}
      // when a decimal exists in the input area
      buttonDisabled: 'ui-state-disabled',
      // {empty} button class name
      buttonEmpty: 'ui-keyboard-empty'
    },

    // *** Useability ***
    // Auto-accept content when clicking outside the
    // keyboard (popup will close)
    autoAccept: false,
    // Auto-accept content even if the user presses escape
    // (only works if `autoAccept` is `true`)
    autoAcceptOnEsc: false,

    // Prevents direct input in the preview window when true
    lockInput: false,

    // Prevent keys not in the displayed keyboard from being
    // typed in
    restrictInput: false,
    // Additional allowed characters while restrictInput is true
    restrictInclude: '', // e.g. 'a b foo \ud83d\ude38'

    // Check input against validate function, if valid the
    // accept button is clickable; if invalid, the accept
    // button is disabled.
    acceptValid: true,
    // Auto-accept when input is valid; requires `acceptValid`
    // set `true` & validate callback
    autoAcceptOnValid: false,

    // if acceptValid is true & the validate function returns
    // a false, this option will cancel a keyboard close only
    // after the accept button is pressed
    cancelClose: true,

    // tab to go to next, shift-tab for previous
    // (default behavior)
    tabNavigation: false,

    // enter for next input; shift-enter accepts content &
    // goes to next shift + "enterMod" + enter ("enterMod"
    // is the alt as set below) will accept content and go
    // to previous in a textarea
    enterNavigation: false,
    // mod key options: 'ctrlKey', 'shiftKey', 'altKey',
    // 'metaKey' (MAC only)
    // alt-enter to go to previous;
    // shift-alt-enter to accept & go to previous
    enterMod: 'altKey',

    // if true, the next button will stop on the last
    // keyboard input/textarea; prev button stops at first
    // if false, the next button will wrap to target the
    // first input/textarea; prev will go to the last
    stopAtEnd: true,

    // Set this to append the keyboard immediately after the
    // input/textarea it is attached to. This option works
    // best when the input container doesn't have a set width
    // and when the "tabNavigation" option is true
    appendLocally: false,
    // When appendLocally is false, the keyboard will be appended
    // to this object
    appendTo: 'body',

    // If false, the shift key will remain active until the
    // next key is (mouse) clicked on; if true it will stay
    // active until pressed again
    stickyShift: true,

    // Prevent pasting content into the area
    preventPaste: false,

    // caret places at the end of any text
    caretToEnd: false,

    // caret stays this many pixels from the edge of the input
    // while scrolling left/right; use "c" or "center" to center
    // the caret while scrolling
    scrollAdjustment: 10,

    // Set the max number of characters allowed in the input,
    // setting it to false disables this option
    maxLength: false,
    // allow inserting characters @ caret when maxLength is set
    maxInsert: true,

    // Mouse repeat delay - when clicking/touching a virtual
    // keyboard key, after this delay the key will start
    // repeating
    repeatDelay: 500,

    // Mouse repeat rate - after the repeatDelay, this is the
    // rate (characters per second) at which the key is
    // repeated. Added to simulate holding down a real keyboard
    // key and having it repeat. I haven't calculated the upper
    // limit of this rate, but it is limited to how fast the
    // javascript can process the keys. And for me, in Firefox,
    // it's around 20.
    repeatRate: 20,

    // resets the keyboard to the default keyset when visible
    resetDefault: false,

    // Event (namespaced) on the input to reveal the keyboard.
    // To disable it, just set it to ''.
    openOn: 'focus',

    // Event (namepaced) for when the character is added to the
    // input (clicking on the keyboard)
    keyBinding: 'mousedown touchstart',

    // enable/disable mousewheel functionality
    // enabling still depends on the mousewheel plugin
    useWheel: true,

    // combos (emulate dead keys)
    // if user inputs `a the script converts it to à,
    // ^o becomes ô, etc.
    useCombos: true,
    // if you add a new combo, you will need to update the
    // regex below
    combos: {
      // uncomment out the next line, then read the Combos
      //Regex section below
      '<': { 3: '\u2665' }, // turn <3 into ♥ - change regex below
      'a': { e: "\u00e6" }, // ae ligature
      'A': { E: "\u00c6" },
      'o': { e: "\u0153" }, // oe ligature
      'O': { E: "\u0152" }
    },

    // *** Methods ***
    // Callbacks - attach a function to any of these
    // callbacks as desired
    initialized: function(e, keyboard, el) {},
    beforeVisible: function(e, keyboard, el) {},
    visible: function(e, keyboard, el) {},
    beforeInsert: function(e, keyboard, el, textToAdd) { return textToAdd; },
    change: function(e, keyboard, el) {},
    beforeClose: function(e, keyboard, el, accepted) {},
    accepted: function(e, keyboard, el) {},
    canceled: function(e, keyboard, el) {},
    restricted: function(e, keyboard, el) {},
    hidden: function(e, keyboard, el) {},

    // called instead of base.switchInput
    // Go to next or prev inputs
    // goToNext = true, then go to next input;
    //   if false go to prev
    // isAccepted is from autoAccept option or
    //   true if user presses shift-enter
    switchInput: function(keyboard, goToNext, isAccepted) {},

    /*
        // build key callback
        buildKey : function( keyboard, data ) {
          /* data = {
            // READ ONLY
            isAction: [boolean] true if key is an action key
            // name... may include decimal ascii value of character
            // prefix = 'ui-keyboard-'
            name    : [string]  key class name suffix
            value   : [string]  text inserted (non-action keys)
            title   : [string]  title attribute of key
            action  : [string]  keyaction name
            // html includes a <span> wrapping the text
            html    : [string]  HTML of the key;
            // DO NOT MODIFY THE ABOVE SETTINGS

            // use to modify key HTML
            $key    : [object]  jQuery selector of key already added to keyboard
          }
          * /
          data.$key.html('<span class="ui-keyboard-text">Foo</span>');
          return data;
          },
        */

    // this callback is called just before the "beforeClose"
    // to check the value if the value is valid, return true
    // and the keyboard will continue as it should (close if
    // not always open, etc)
    // if the value is not value, return false and the clear
    // the keyboard value ( like this
    // "keyboard.$preview.val('');" ), if desired
    validate: function(keyboard, value, isClosing) {
      return true;
    }
  });
  
  $('input.vk2').keyboard({
    // set this to ISO 639-1 language code to override language set by
    // the layout: http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
    // language defaults to ["en"] if not found
    language: ['spanish-qwerty'],
    rtl: false,

    // *** choose layout & positioning ***
    // choose from 'qwerty', 'alpha',
    // 'international', 'dvorak', 'num' or
    // 'custom' (to use the customLayout below)
    layout: 'custom',
    customLayout: { 'normal': ['1 2 3', '4 5 6', '7 8 9', 'k 0 {b}', '{accept} {cancel}'] },
    // Used by jQuery UI position utility
    position: {
      // null = attach to input/textarea;
      // use $(sel) to attach elsewhere
      of: null,
      my: 'center top',
      at: 'center top',
      // used when "usePreview" is false
      at2: 'center bottom',
      offset: '0 20'
    },

    // allow jQuery position utility to reposition the keyboard on
    // window resize
    reposition: true,

    // true: preview added above keyboard;
    // false: original input/textarea used
    usePreview: false,

    // if true, the keyboard will always be visible
    alwaysOpen: false,

    // give the preview initial focus when the keyboard
    // becomes visible
    initialFocus: true,
    // Avoid focusing the input the keyboard is attached to
    noFocus: false,

    // if true, keyboard will remain open even if
    // the input loses focus.
    stayOpen: false,

    // Prevents the keyboard from closing when the user clicks or
    // presses outside the keyboard. The `autoAccept` option must
    // also be set to true when this option is true or changes are lost
    userClosed: false,

    // if true, keyboard will not close if you press escape.
    ignoreEsc: false,

    // *** change keyboard language & look ***
    display: {
      'meta1': '\u2666', // Diamond
      'meta2': '\u2665', // Heart

      // check mark (accept)
      'a': '\u2714:Accept (Shift-Enter)',
      'accept': 'Accept:Accept (Shift-Enter)',
      'alt': 'AltGr:Alternate Graphemes',
      // Left arrow (same as &larr;)
      'b': '\u2190:Backspace',
      'bksp': 'Bksp:Backspace',
      // big X, close/cancel
      'c': '\u2716:Cancel (Esc)',
      'cancel': 'Cancel:Cancel (Esc)',
      // clear num pad
      'clear': 'C:Clear',
      'combo': '\u00f6:Toggle Combo Keys',
      // num pad decimal '.' (US) & ',' (EU)
      'dec': '.:Decimal',
      // down, then left arrow - enter symbol
      'e': '\u21b5:Enter',
      'empty': '\u00a0', // &nbsp;
      'enter': 'Enter:Enter',
      // left arrow (move caret)
      'left': '\u2190',
      // caps lock
      'lock': '\u21ea Lock:Caps Lock',
      'next': 'Next \u21e8',
      'prev': '\u21e6 Prev',
      // right arrow (move caret)
      'right': '\u2192',
      // thick hollow up arrow
      's': '\u21e7:Shift',
      'shift': 'Shift:Shift',
      // +/- sign for num pad
      'sign': '\u00b1:Change Sign',
      'space': '\u00a0:Space',
      // right arrow to bar
      // \u21b9 is the true tab symbol
      't': '\u21e5:Tab',
      'tab': '\u21e5 Tab:Tab',
      // replaced by an image
      'toggle': ' ',

      // added to titles of keys
      // accept key status when acceptValid:true
      'valid': 'valid',
      'invalid': 'invalid',
      // combo key states
      'active': 'active',
      'disabled': 'disabled'

    },

    css: {
      // input & preview
      input: 'ui-widget-content ui-corner-all',
      // keyboard container
      container: 'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix',
      // keyboard container extra class (same as container, but separate)
      popup: 'virtual-key',
      // default state
      buttonDefault: 'ui-state-default ui-corner-all',
      // hovered button
      buttonHover: 'ui-state-hover',
      // Action keys (e.g. Accept, Cancel, Tab, etc);
      // this replaces "actionClass" option
      buttonAction: 'ui-state-active',
      // Active keys
      // (e.g. shift down, meta keyset active, combo keys active)
      buttonActive: 'ui-state-active',
      // used when disabling the decimal button {dec}
      // when a decimal exists in the input area
      buttonDisabled: 'ui-state-disabled',
      // {empty} button class name
      buttonEmpty: 'ui-keyboard-empty'
    },

    // *** Useability ***
    // Auto-accept content when clicking outside the
    // keyboard (popup will close)
    autoAccept: false,
    // Auto-accept content even if the user presses escape
    // (only works if `autoAccept` is `true`)
    autoAcceptOnEsc: false,

    // Prevents direct input in the preview window when true
    lockInput: false,

    // Prevent keys not in the displayed keyboard from being
    // typed in
    restrictInput: false,
    // Additional allowed characters while restrictInput is true
    restrictInclude: '', // e.g. 'a b foo \ud83d\ude38'

    // Check input against validate function, if valid the
    // accept button is clickable; if invalid, the accept
    // button is disabled.
    acceptValid: true,
    // Auto-accept when input is valid; requires `acceptValid`
    // set `true` & validate callback
    autoAcceptOnValid: false,

    // if acceptValid is true & the validate function returns
    // a false, this option will cancel a keyboard close only
    // after the accept button is pressed
    cancelClose: true,

    // tab to go to next, shift-tab for previous
    // (default behavior)
    tabNavigation: false,

    // enter for next input; shift-enter accepts content &
    // goes to next shift + "enterMod" + enter ("enterMod"
    // is the alt as set below) will accept content and go
    // to previous in a textarea
    enterNavigation: false,
    // mod key options: 'ctrlKey', 'shiftKey', 'altKey',
    // 'metaKey' (MAC only)
    // alt-enter to go to previous;
    // shift-alt-enter to accept & go to previous
    enterMod: 'altKey',

    // if true, the next button will stop on the last
    // keyboard input/textarea; prev button stops at first
    // if false, the next button will wrap to target the
    // first input/textarea; prev will go to the last
    stopAtEnd: true,

    // Set this to append the keyboard immediately after the
    // input/textarea it is attached to. This option works
    // best when the input container doesn't have a set width
    // and when the "tabNavigation" option is true
    appendLocally: false,
    // When appendLocally is false, the keyboard will be appended
    // to this object
    appendTo: 'body',

    // If false, the shift key will remain active until the
    // next key is (mouse) clicked on; if true it will stay
    // active until pressed again
    stickyShift: true,

    // Prevent pasting content into the area
    preventPaste: false,

    // caret places at the end of any text
    caretToEnd: false,

    // caret stays this many pixels from the edge of the input
    // while scrolling left/right; use "c" or "center" to center
    // the caret while scrolling
    scrollAdjustment: 10,

    // Set the max number of characters allowed in the input,
    // setting it to false disables this option
    maxLength: 9,
    // allow inserting characters @ caret when maxLength is set
    maxInsert: true,

    // Mouse repeat delay - when clicking/touching a virtual
    // keyboard key, after this delay the key will start
    // repeating
    repeatDelay: 500,

    // Mouse repeat rate - after the repeatDelay, this is the
    // rate (characters per second) at which the key is
    // repeated. Added to simulate holding down a real keyboard
    // key and having it repeat. I haven't calculated the upper
    // limit of this rate, but it is limited to how fast the
    // javascript can process the keys. And for me, in Firefox,
    // it's around 20.
    repeatRate: 20,

    // resets the keyboard to the default keyset when visible
    resetDefault: false,

    // Event (namespaced) on the input to reveal the keyboard.
    // To disable it, just set it to ''.
    openOn: 'focus',

    // Event (namepaced) for when the character is added to the
    // input (clicking on the keyboard)
    keyBinding: 'mousedown touchstart',

    // enable/disable mousewheel functionality
    // enabling still depends on the mousewheel plugin
    useWheel: true,

    // combos (emulate dead keys)
    // if user inputs `a the script converts it to à,
    // ^o becomes ô, etc.
    useCombos: true,
    // if you add a new combo, you will need to update the
    // regex below
    combos: {
      // uncomment out the next line, then read the Combos
      //Regex section below
      '<': { 3: '\u2665' }, // turn <3 into ♥ - change regex below
      'a': { e: "\u00e6" }, // ae ligature
      'A': { E: "\u00c6" },
      'o': { e: "\u0153" }, // oe ligature
      'O': { E: "\u0152" }
    },

    // *** Methods ***
    // Callbacks - attach a function to any of these
    // callbacks as desired
    initialized: function(e, keyboard, el) {},
    beforeVisible: function(e, keyboard, el) {},
    visible: function(e, keyboard, el) {},
    beforeInsert: function(e, keyboard, el, textToAdd) { return textToAdd; },
    change: function(e, keyboard, el) {},
    beforeClose: function(e, keyboard, el, accepted) {},
    accepted: function(e, keyboard, el) {},
    canceled: function(e, keyboard, el) {},
    restricted: function(e, keyboard, el) {},
    hidden: function(e, keyboard, el) {},

    // called instead of base.switchInput
    // Go to next or prev inputs
    // goToNext = true, then go to next input;
    //   if false go to prev
    // isAccepted is from autoAccept option or
    //   true if user presses shift-enter
    switchInput: function(keyboard, goToNext, isAccepted) {},

    // this callback is called just before the "beforeClose"
    // to check the value if the value is valid, return true
    // and the keyboard will continue as it should (close if
    // not always open, etc)
    // if the value is not value, return false and the clear
    // the keyboard value ( like this
    // "keyboard.$preview.val('');" ), if desired
    validate: function(keyboard, value, isClosing) {
      return true;
    }
  });

  $('input.vk3').keyboard({
      // set this to ISO 639-1 language code to override language set by
      // the layout: http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
      // language defaults to ["en"] if not found
      language: ['es'],
      rtl: false,

      // *** choose layout & positioning ***
      // choose from 'qwerty', 'alpha',
      // 'international', 'dvorak', 'num' or
      // 'custom' (to use the customLayout below)
      layout: 'numpad',
      customLayout: {
        'default': [
          'd e f a u l t',
          '{meta1} {meta2} {accept} {cancel}'
        ],
        'meta1': [
          'm y m e t a 1',
          '{meta1} {meta2} {accept} {cancel}'
        ],
        'meta2': [
          'M Y M E T A 2',
          '{meta1} {meta2} {accept} {cancel}'
        ]
      },
      // Used by jQuery UI position utility
      position: {
        // null = attach to input/textarea;
        // use $(sel) to attach elsewhere
        of: null,
        my: 'center top',
        at: 'center top',
        // used when "usePreview" is false
        at2: 'center bottom',
        offset: '0 20'
      },

      // allow jQuery position utility to reposition the keyboard on
      // window resize
      reposition: true,

      // true: preview added above keyboard;
      // false: original input/textarea used
      usePreview: false,

      // if true, the keyboard will always be visible
      alwaysOpen: false,

      // give the preview initial focus when the keyboard
      // becomes visible
      initialFocus: true,
      // Avoid focusing the input the keyboard is attached to
      noFocus: false,

      // if true, keyboard will remain open even if
      // the input loses focus.
      stayOpen: false,

      // Prevents the keyboard from closing when the user clicks or
      // presses outside the keyboard. The `autoAccept` option must
      // also be set to true when this option is true or changes are lost
      userClosed: false,

      // if true, keyboard will not close if you press escape.
      ignoreEsc: false,

      // *** change keyboard language & look ***
      display: {
        'meta1': '\u2666', // Diamond
        'meta2': '\u2665', // Heart

        // check mark (accept)
        'a': '\u2714:Accept (Shift-Enter)',
        'accept': 'Accept:Accept (Shift-Enter)',
        'alt': 'AltGr:Alternate Graphemes',
        // Left arrow (same as &larr;)
        'b': '\u2190:Backspace',
        'bksp': 'Bksp:Backspace',
        // big X, close/cancel
        'c': '\u2716:Cancel (Esc)',
        'cancel': 'Cancel:Cancel (Esc)',
        // clear num pad
        'clear': 'C:Clear',
        'combo': '\u00f6:Toggle Combo Keys',
        // num pad decimal '.' (US) & ',' (EU)
        'dec': '.:Decimal',
        // down, then left arrow - enter symbol
        'e': '\u21b5:Enter',
        'empty': '\u00a0', // &nbsp;
        'enter': 'Enter:Enter',
        // left arrow (move caret)
        'left': '\u2190',
        // caps lock
        'lock': '\u21ea Lock:Caps Lock',
        'next': 'Next \u21e8',
        'prev': '\u21e6 Prev',
        // right arrow (move caret)
        'right': '\u2192',
        // thick hollow up arrow
        's': '\u21e7:Shift',
        'shift': 'Shift:Shift',
        // +/- sign for num pad
        'sign': '\u00b1:Change Sign',
        'space': '\u00a0:Space',
        // right arrow to bar
        // \u21b9 is the true tab symbol
        't': '\u21e5:Tab',
        'tab': '\u21e5 Tab:Tab',
        // replaced by an image
        'toggle': ' ',

        // added to titles of keys
        // accept key status when acceptValid:true
        'valid': 'valid',
        'invalid': 'invalid',
        // combo key states
        'active': 'active',
        'disabled': 'disabled'

      },

      css: {
        // input & preview
        input: 'ui-widget-content ui-corner-all',
        // keyboard container
        container: 'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix',
        // keyboard container extra class (same as container, but separate)
        popup: 'virtual-key',
        // default state
        buttonDefault: 'ui-state-default ui-corner-all',
        // hovered button
        buttonHover: 'ui-state-hover',
        // Action keys (e.g. Accept, Cancel, Tab, etc);
        // this replaces "actionClass" option
        buttonAction: 'ui-state-active',
        // Active keys
        // (e.g. shift down, meta keyset active, combo keys active)
        buttonActive: 'ui-state-active',
        // used when disabling the decimal button {dec}
        // when a decimal exists in the input area
        buttonDisabled: 'ui-state-disabled',
        // {empty} button class name
        buttonEmpty: 'ui-keyboard-empty'
      },

      // *** Useability ***
      // Auto-accept content when clicking outside the
      // keyboard (popup will close)
      autoAccept: true,
      // Auto-accept content even if the user presses escape
      // (only works if `autoAccept` is `true`)
      autoAcceptOnEsc: false,

      // Prevents direct input in the preview window when true
      lockInput: false,

      // Prevent keys not in the displayed keyboard from being
      // typed in
      restrictInput: false,
      // Additional allowed characters while restrictInput is true
      restrictInclude: '', // e.g. 'a b foo \ud83d\ude38'

      // Check input against validate function, if valid the
      // accept button is clickable; if invalid, the accept
      // button is disabled.
      acceptValid: true,
      // Auto-accept when input is valid; requires `acceptValid`
      // set `true` & validate callback
      autoAcceptOnValid: false,

      // if acceptValid is true & the validate function returns
      // a false, this option will cancel a keyboard close only
      // after the accept button is pressed
      cancelClose: true,

      // tab to go to next, shift-tab for previous
      // (default behavior)
      tabNavigation: false,

      // enter for next input; shift-enter accepts content &
      // goes to next shift + "enterMod" + enter ("enterMod"
      // is the alt as set below) will accept content and go
      // to previous in a textarea
      enterNavigation: false,
      // mod key options: 'ctrlKey', 'shiftKey', 'altKey',
      // 'metaKey' (MAC only)
      // alt-enter to go to previous;
      // shift-alt-enter to accept & go to previous
      enterMod: 'altKey',

      // if true, the next button will stop on the last
      // keyboard input/textarea; prev button stops at first
      // if false, the next button will wrap to target the
      // first input/textarea; prev will go to the last
      stopAtEnd: true,

      // Set this to append the keyboard immediately after the
      // input/textarea it is attached to. This option works
      // best when the input container doesn't have a set width
      // and when the "tabNavigation" option is true
      appendLocally: false,
      // When appendLocally is false, the keyboard will be appended
      // to this object
      appendTo: 'body',

      // If false, the shift key will remain active until the
      // next key is (mouse) clicked on; if true it will stay
      // active until pressed again
      stickyShift: true,

      // Prevent pasting content into the area
      preventPaste: false,

      // caret places at the end of any text
      caretToEnd: false,

      // caret stays this many pixels from the edge of the input
      // while scrolling left/right; use "c" or "center" to center
      // the caret while scrolling
      scrollAdjustment: 10,

      // Set the max number of characters allowed in the input,
      // setting it to false disables this option
      maxLength: false,
      // allow inserting characters @ caret when maxLength is set
      maxInsert: true,

      // Mouse repeat delay - when clicking/touching a virtual
      // keyboard key, after this delay the key will start
      // repeating
      repeatDelay: 500,

      // Mouse repeat rate - after the repeatDelay, this is the
      // rate (characters per second) at which the key is
      // repeated. Added to simulate holding down a real keyboard
      // key and having it repeat. I haven't calculated the upper
      // limit of this rate, but it is limited to how fast the
      // javascript can process the keys. And for me, in Firefox,
      // it's around 20.
      repeatRate: 20,

      // resets the keyboard to the default keyset when visible
      resetDefault: false,

      // Event (namespaced) on the input to reveal the keyboard.
      // To disable it, just set it to ''.
      openOn: 'focus',

      // Event (namepaced) for when the character is added to the
      // input (clicking on the keyboard)
      keyBinding: 'mousedown touchstart',

      // enable/disable mousewheel functionality
      // enabling still depends on the mousewheel plugin
      useWheel: true,

      // combos (emulate dead keys)
      // if user inputs `a the script converts it to à,
      // ^o becomes ô, etc.
      useCombos: true,
      // if you add a new combo, you will need to update the
      // regex below
      combos: {
        // uncomment out the next line, then read the Combos
        //Regex section below
        '<': { 3: '\u2665' }, // turn <3 into ♥ - change regex below
        'a': { e: "\u00e6" }, // ae ligature
        'A': { E: "\u00c6" },
        'o': { e: "\u0153" }, // oe ligature
        'O': { E: "\u0152" }
      },

      // *** Methods ***
      // Callbacks - attach a function to any of these
      // callbacks as desired
      initialized: function(e, keyboard, el) {},
      beforeVisible: function(e, keyboard, el) {},
      visible: function(e, keyboard, el) {},
      beforeInsert: function(e, keyboard, el, textToAdd) { return textToAdd; },
      change: function(e, keyboard, el) {},
      beforeClose: function(e, keyboard, el, accepted) {},
      accepted: function(e, keyboard, el) {},
      canceled: function(e, keyboard, el) {},
      restricted: function(e, keyboard, el) {},
      hidden: function(e, keyboard, el) {},

      // called instead of base.switchInput
      // Go to next or prev inputs
      // goToNext = true, then go to next input;
      //   if false go to prev
      // isAccepted is from autoAccept option or
      //   true if user presses shift-enter
      switchInput: function(keyboard, goToNext, isAccepted) {},

      // this callback is called just before the "beforeClose"
      // to check the value if the value is valid, return true
      // and the keyboard will continue as it should (close if
      // not always open, etc)
      // if the value is not value, return false and the clear
      // the keyboard value ( like this
      // "keyboard.$preview.val('');" ), if desired
      validate: function(keyboard, value, isClosing) {
        return true;
      }
    });

});

$('a.dropdown-button').on('click', function(e){
  e.preventDefault();
  resetBadge();
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

      updateCarousel(data.carousel_type, true, null);
      $('#loading_app').fadeOut(500);

  }).fail(function(jqXHR, textStatus, errorThrown) {
    error_json = jqXHR.responseJSON;
    console.log(error_json);

  }).always(function(data, textStatus, errorThrown) {
    $('a.category-link').toggleClass('disable_link');
     $(document).click();
  });
});

// Evento que se dispara DESPUES de hacer el cambio de item (o slide) del carrusel.
$('div.slick-carousel').on('afterChange', function(event, slick, currentSlide){
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

  if (type !== null) {
    // Se verifica si quedan productos por agregar al carrusel,
    if (items_count !== slick.slideCount) {
      // Se agregaran los siguientes n items (carrusel_meta.show_each) si
      // la siguiente posicion del carrusel es la ultima (sgte_pos + slidesToShow).
      if (currentSlide + slick.options.slidesToShow >= slick.slideCount) {
        updateCarousel(type, false, 'next');

      }else{
        // console.log("Aun no");
      }
    }else{
      // console.log("Ya se agregaron todos los items al carrusel");
    }
  }else{
    console.error("No se pudo determinar cual carrusel.");
  }
});

// Evento que se dispara ANTES de hacer el cambio de item (o slide) del carrusel.
$('div.slick-carousel').on('beforeChange', function(event, slick, currentSlide, nextSlide){
  if (carrusel_meta.badge_showing) {
    updateCarouselBadge(slick.$nextArrow, null, true);
    updateCarouselBadge(slick.$prevArrow, null, true);
  }
});

// Envio de formulario del carrito de pisos y muros gustados.
$('form#carrito_form').on('submit', function(event){
  event.preventDefault();
  data = $(event.target).serialize();
  // Se agrega el parametro de email en los datos que enviara ajax.
  // (POR HACER)Hay que obtener el email ingresado por el usuario en el modal...
  // data.push({name: "email", value: ''});

  $.ajax({
    url: event.target.action,
    data: data,
    method: event.target.method,
    beforeSend: function()
    {
    }
  }).done(function(data, textStatus, jqXHR) {
    // Aqui se debe agregar el par de productos gustados al carrito.

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
function updateCarousel(type, delete_all, arrow_dir)
{
  var meta_temp = null;
  var limit = 0;
  var arrow = null;

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
    
    // var date1 = new Date();
    var ar_tmp = [];
    // Optimizar esto...
    // Se itera el array de productos para agregarlos al carrusel hasta el limit.
    for (var i = meta_temp.last_item_index; i < limit; i++) {
      ar_tmp.push(meta_temp.items[i]);
      // meta_temp.carousel_node.slick('slickAdd', meta_temp.items[i]);
    }
    meta_temp.carousel_node.slick('slickAdd', ar_tmp);

    // var date2 = new Date();
    // console.log("Se agrego en " + (date2 - date1) + " ms");

    // Hay que volver a obtener la referencia del boton de sgte | prev,
    // debido que al momento de agregar o borrar elementos del carrusel, este se 
    // reinicializa y se pierde la referencia.
    if (arrow_dir === 'next')
      arrow = meta_temp.carousel_node.slick('getSlick').$nextArrow;
    else if (arrow_dir === 'prev')
      arrow = meta_temp.carousel_node.slick('getSlick').$prevArrow;

    // Mostrar el bagde con la cantidad de productos agregados al carrusel.
    if (arrow !== null)
      updateCarouselBadge(arrow, limit - meta_temp.last_item_index, false);
    
    // Asignar la ultima posicion.
    meta_temp.last_item_index = i;
  }
  // console.log(carrusel_meta);
}

// Funcion que muestra|oculta y actualiza el badge junto al boton de navegacion
// del carrusel.
function updateCarouselBadge(badge_element, value, clear) 
{
  badge_element = badge_element.find('span');
  if (clear) {
    badge_element.addClass('hide');
    badge_element.html('');
    carrusel_meta.badge_showing = false;

  }else{
    if (value !== null || value !== undefined) {
      badge_element.html('+ ' + value.toString());
      badge_element.removeClass('hide');
      carrusel_meta.badge_showing = true;
    }
  }
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

// Inicializa y abre las ventanas de piso y muros.
function initWindows(only)
{
  // Obtener el link css para agregarlo a las ventanas.
  var links = document.getElementsByTagName("link");
  var css = null;
  for (var i = 0; i < links.length; i++) 
  {
    if (links[i].dataset.only_window !== undefined && links[i].dataset.only_window)
      css = links[i];
  }

  var ws = only !== undefined ? [only] : Object.keys(windows);
  for (var i = 0; i < ws.length; i++) 
  {
    windows[ws[i]] = window.open("", ws[i] + "_window", 'width=window.innerWidth,height=window.innerHeight');
    windows[ws[i]].document.title = ws[i].capitalize();

    if (windows[ws[i]].document.body.innerHTML.length !== 0)
      windows[ws[i]].document.body.innerHTML = '';

    if (css !== null)
      $(windows[ws[i]].document.head).append($(css).clone());
  }
}

// Quitar la imagenes de las ventanas al cerrar la pagina.
$(window).unload(function() {
  windows.piso.close();
  windows.muro.close();
});

// Asigna la imagen a su respectiva ventana cuando el usuario
// hace click en el boton del ojo del carrusel.
function setImageToWindow(type, img_node)
{
  if (type !== null && img_node !== undefined) {
    // Si la ventana donde se agregara la imagen se encuentra cerrada,
    // se vuelve a inicializar y abrir la ventana.
    if (windows[type].closed)
      initWindows(type);

    img_node.style.width = '100%';
    img_node.style.height = '100%';

    if (type === 'piso')
      windows.piso.document.body.innerHTML = img_node.outerHTML;
    else if(type === 'muro')
      windows.muro.document.body.innerHTML = img_node.outerHTML;
  }
}

// Cada vez que se cambia la cantidad de cada item del carrito, se actualiza su precio total.
// Tambien previene que el usuario cambie valores inadecuados del input, los cambia a 1.
$('div#carrito_container').on('change', 'input.cantidad-item', function(event){
  var input_val = parseInt($(this).val());
  if (isNaN(input_val) || input_val < 1) {
    $(this).parent('div').find('button.cantidad-rem-btn').addClass('disabled');
    $(this).val(1);
  }
  updateTotal();
});

// Evento de click en '-' de la cantidad de producto en el carrito.
$('div#carrito_container').on('click', 'button.cantidad-rem-btn', function(event){
  event.preventDefault();

  var input = $(this).parent('div').find('input[type=number]');
  var next_val = parseInt(input.val()) - 1;

  if (next_val <= parseInt(input.attr('min')))
    $(this).addClass('disabled');

  input.val(next_val).change();
});

// Evento de click en '+' de la cantidad de producto en el carrito.
$('div#carrito_container').on('click', 'button.cantidad-add-btn', function(event){
  event.preventDefault();

  var input = $(this).parent('div').find('input[type=number]');
  var rem_btn = $(this).parent('div').find('button.cantidad-rem-btn');
  var next_val = parseInt(input.val()) + 1;

  if (next_val >= parseInt(input.attr('min')))
    rem_btn.removeClass('disabled');

  input.val(next_val).change();
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
  var img_node = $(this).parents('div.slick-slide').find('img');
  var type = null

  if (carousel_container === 'muros_carousel') {
    // Setear los valores de los input hidden de muros.
    hidden_el = document.getElementById('muro_img_url');
    rotar_hidden = document.getElementById('muro_rotar');
    j_selector = '#muro_img_url';
    type = 'muro';

  }else if(carousel_container === 'pisos_carousel'){
    // Setear los valores de los input hidden de pisos.
    hidden_el = document.getElementById('piso_img_url');
    rotar_hidden = document.getElementById('piso_rotar');
    j_selector = '#piso_img_url';
    type = 'piso';
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

  // Setear la imagen a su ventana correspondiente.
  setImageToWindow(type, img_node[0])
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
