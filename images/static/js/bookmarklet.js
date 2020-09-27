(function(){
  var jquery_version = '3.4.1';
  var site_url = 'https://mysite.com:8000/';
  var static_url = site_url + 'static/';
  var min_width = 100;
  var min_height = 100;
  var max_height = 1000;

  function bookmarklet(msg) {
    // load CSS
    var css = jQuery('<link>');
    css.attr({
      rel: 'stylesheet',
      type: 'text/css',
      href: static_url + 'css/bookmarklet.css?r=' + Math.floor(Math.
  random()*99999999999999999999)
  });
  jQuery('head').append(css);
  jQuery('head').append('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">');
  console.log('running');

  // load HTML
  box_html =
  `<div id="bookmarklet">
    <a href="javascript:void();" id="close">
      &times;
    </a>
      <h1>Select an image to bookmark:
      <span>
        <button id="pause" type="button" class="btn btn-primary btn-sm">
          Pause
        </button>
      </span>
      </h1>
    <div class="images">Wait for 5 seconds.</div>
  </div>`;
  jQuery('body').append(box_html);

  $(document.body).css('overflow', 'auto');
  // close event
  jQuery('#bookmarklet #close').click(function(e){
    e.preventDefault();
    clearInterval(myTimer);
    if (typeof myTimer_restart != 'undefined') {
      clearInterval(myTimer_restart);
    }
    jQuery('#bookmarklet').remove();
  });

  // pause event
  jQuery(document).on('click', '#pause', function(e){
    e.preventDefault();
    clearInterval(myTimer);
    if (typeof myTimer_restart != 'undefined') {
      clearInterval(myTimer_restart);
    }
    jQuery(this).html("Resume");
    jQuery("#pause").attr("id", "resume")
    // jQuery('#bookmarklet').remove();
  });

  // resume event
  jQuery(document).on('click', '#resume', function(e){
    e.preventDefault();
    jQuery(this).html("Pause");
    jQuery("#resume").attr("id", "pause");
    myTimer_restart = setInterval(timer, 5000);
    // jQuery('#bookmarklet').remove();
  });



  // find images and display them
  timer();
  myTimer = setInterval(timer, 5000);
  $('#bookmarklet .images').html("");
  function timer() {
    jQuery.each(jQuery('img[src*="jpg"], img[src*="jpeg"], img[src*="photo"]'), function(index, image) {
      if (jQuery(image).width() >= min_width && jQuery(image).height() <= max_height && jQuery(image).height()
      >= min_height)
      {
        image_url = jQuery(image).attr('src');
        if (image_url.includes("__340")) {
          image_url = image_url.replace("__340","_1280");
        }
        //Pintrest Images in HD
        if (image_url.includes("pinimg")) {
          var result = image_url.substring(image_url.lastIndexOf(".com/") + 5,
              image_url.lastIndexOf("/") - 9);
          image_url = image_url.replace(result, "originals");
        }

        bookmarklet_images = $('#bookmarklet img')
        srclist = []
        var i;
        if (bookmarklet_images != null) {
          for (i=0; i<bookmarklet_images.length; i++) {
            srclist.push(bookmarklet_images[i].src);
          }
          if (srclist.includes(image_url) == false) {
            jQuery('#bookmarklet .images').append('<a class="img_link" href="#"><img src="'+
            image_url +'" /></a>');
          }
        }else{
          jQuery('#bookmarklet .images').append('<a class="img_link" href="#"><img src="'+
          image_url +'" /></a>');
        }
      }
      // timer();

      function smoothScroll(duration) {
        var startPosition = window.pageYOffset || window.scrollY;
        var targetPosition = startPosition + 1000;
        var distance = targetPosition - startPosition;
        var startTime = null;

        function loop(currentTime) {
          if (startTime === null) startTime = currentTime;
          var timeElapsed = currentTime - startTime;
          var run = ease(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(loop);
        }
        function ease(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          t--;
          return -c / 2 * (t * (t - 2) - 1) + b;
        }
        a = requestAnimationFrame(loop);
      }

      smoothScroll(5000);

      //when an image is selected open URL with it
      jQuery('#bookmarklet .images a').click(function(e){
        clearInterval(myTimer);
        if (typeof myTimer_restart != 'undefined') {
          clearInterval(myTimer_restart);
        }
        console.log("hello");
        selected_image = jQuery(this).children('img').attr('src');
        // hide bookmarklet
        jQuery('#bookmarklet').hide();
        //open new window to submit the image
        window.open(site_url +'images/create/?url='
                    + encodeURIComponent(selected_image)
                    + '&title='
                    + encodeURIComponent(jQuery('title').text()),
                    '_blank');
      });

    });
  }




};

  // Check if jQuery is loaded
  if(typeof window.jQuery != 'undefined') {
    bookmarklet();
  } else {
    // Check for conflicts
    var conflict = typeof window.$ != 'undefined';
    // Create the script and point to Google API
    var script = document.createElement('script');
    script.src = '//ajax.googleapis.com/ajax/libs/jquery/' +
      jquery_version + '/jquery.min.js';
    // Add the script to the 'head' for processing
    document.head.appendChild(script);
    // Create a way to wait until script loading
    var attempts = 15;
    (function(){
      // Check again if jQuery is undefined
      if(typeof window.jQuery == 'undefined') {
        if(--attempts > 0) {
          // Calls himself in a few milliseconds
          window.setTimeout(arguments.callee, 250)
        } else {
          // Too much attempts to load, send error
          alert('An error occurred while loading jQuery')
        }
      } else {
        bookmarklet();
      }
    }) ()
  }
}) ()
