$(window).on("load", function () {

  $.scrollify({
    section: ".section",
    // sectionName: "section-name",
    // interstitialSection: "",
    easing: "easeInOutQuad",
    scrollSpeed: 1000,
    // offset: -50,
    scrollbars: false,
    // standardScrollElements: "#about",
    setHeights: false,
    overflowScroll: true,
    updateHash: false,
    touchScroll: true,
    // after: function (i) { },
    before: function (i) {
      if(i == 1) {
        $('#about .section-wrapper').addClass('active');
        $('#title-container').addClass('shaded');
      } else {
        $('#about .section-wrapper').removeClass('active');
        $('#title-container').removeClass('shaded');
      }
    },
    // afterResize: function () {},
    // afterRender: function () {}
  });

  drawSquareBg('#bg-cont', {
    numberOfFrags: 500,
    animationDuration: 2000,
    onComplete: function () {
      drawTitle();
    },
  });

  function drawSquareBg(element, {
    numberOfFrags: numberOfFrags = 50,
    backgroundColor: bgcolor = '#000',
    animationDuration: duration = 500,
    onComplete: callbackFn = function () {},
  } = {}) {

    drawBg();

    window.addEventListener("resize", resizer, false);

    function resizer() {
      duration = 0;
      callbackFn = function () {
        drawTitle(0)
      };
      drawBg();
    }

    function drawBg() {
      var containerHeight = 0;
      var containerWidth = 0;
      var DOMitem = '';
      if (element.indexOf('#') != -1) {
        var elementID = element.replace('#', '');
        DOMitem = document.getElementById(elementID);
        containerWidth = DOMitem.offsetWidth;
        containerHeight = DOMitem.offsetHeight;
      } else if (element.indexOf('.') != -1) {
        var elementClass = element.replace('.', '');
        DOMitem = document.getElementsByClassName(elementClass)[0];
        containerWidth = DOMitem.offsetWidth;
        containerHeight = DOMitem.offsetHeight;
      }

      var totalPx = containerWidth * containerHeight;
      var fragmentDim = Math.sqrt(totalPx / numberOfFrags);
      var verticalSegs = containerHeight / fragmentDim;
      var horizontalSegs = containerWidth / fragmentDim;
      var fragmentWidth = Math.ceil(containerWidth / horizontalSegs);
      var fragmentHeight = Math.ceil(containerHeight / verticalSegs);
      var toAnimate = [];
      var positions = [];

      var createElements = (function () {
        var fragment = document.createDocumentFragment();
        for (var y = 0; y < verticalSegs; y++) {
          for (var x = 0; x < horizontalSegs; x++) {
            var el = document.createElement('div');
            el.classList.add('particule');
            el.style.backgroundColor = bgcolor,
              el.style.border = '1px solid black',
              el.style.position = 'absolute',
              el.style.width = fragmentWidth + 'px',
              el.style.height = fragmentHeight + 'px',
              positions.push({
                left: fragmentWidth * x,
                top: fragmentHeight * y,
                x: x,
                y: y
              });
            toAnimate.push(el);
            fragment.appendChild(el);
          }
        }
        DOMitem.innerHTML = "";
        DOMitem.appendChild(fragment);
      })();
      var fragDuration = duration / verticalSegs;
      var animate = function (el, i) {
        anime({
          targets: el,
          top: [containerHeight + containerHeight * 0.05 * Math.cos(Math.PI * Math.random()) + 'px', positions[i].top],
          left: [containerWidth / 2 + containerWidth * 0.05 * Math.cos(Math.PI * Math.random()) + 'px', positions[i].left],
          scale: [0, 1],
          opacity: [0, 1],
          offset: fragDuration * (positions[i].y + Math.random()),
          duration: duration * 0.6,
          easing: 'easeInQuart',
          //borderRadius: ['25%', 0],
          //filter: ['blur(50px)', 'blur(0)'],
          complete: function (anim) {
            callbackEnd(i);
          }
        });
      }
      toAnimate.forEach(animate);

      //when finished
      function callbackEnd(i) {
        if (i == toAnimate.length - 1) {
          callbackFn();
        }
      }
    }
  }


  function drawTitle(duration = 300) {
    var lineDrawing = anime.timeline({});
    document.getElementById('title-container').style.opacity = 1;
    lineDrawing
      .add({
        targets: '.name .cls-1',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: duration,
        delay: function (el, i) {
          return i * duration / 3
        },
      })
      .add({
        targets: '.name .cls-2',
        opacity: [0, 1],
        easing: 'easeInOutSine',
        offset: duration,
        duration: duration,
        delay: function (el, i) {
          return i * duration / 3
        },
      })
      .add({
        targets: '.line svg line',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        offset: '-=1500',
        // opacity: [0, 1],
        duration: 2000,
      })
      .add({
        targets: '.subheader span',
        opacity: [0, 1],
        duration: 1500,
        easing: 'easeInOutSine',
        offset: '-=800',
      })
      .add({
        targets: '.tab-item#tab-1',
        translateY: ['100%', '0%'],
        duration: 1500,
        easing: 'easeOutElastic',
        elasticity: 800,
        // complete: function () {
        //   activeMenu();
        // }
      })
  };

  $('#tab-1').click(function () {
    $.scrollify.move(1);
  });

  $('#contact-email').click(function () {
    $('#description-content').toggleClass('active');
    $(this).toggleClass('active');
  });

  $('#send').click(function () {
    $.ajax({
      url: '../php/sendmail.php',
      type: 'POST',
      data: {
        email: $('#email').val(),
        message: $('#description').val()
      },
      success: function (msg) {
        var result = msg == "1" ?
          '<div class="green">message sent. we will be in touch soon</div>' :
          '<div class="red">message not sent :(</div>';
        $('#result').html(result);
      }
    });
    $('#email').val('');
    $('#description').val('');
    // $('#description-content').toggleClass('active');
  });

});