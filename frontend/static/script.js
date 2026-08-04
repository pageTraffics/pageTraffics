$(function () {
  $(".faqs-title-wrapper").click(function () {
    $(".open").not(this).removeClass("open").next().slideUp(300);
    $(this).toggleClass("open").next().slideToggle(300);
  });
});

$(document).ready(function () {
  // const element = document.querySelector('.hero-bg-vector-wrapper');
  // document.addEventListener('mousemove', (event) => {
  //   const mouseX = (event.clientX / window.innerWidth) * 100;
  //   const mouseY = (event.clientY / window.innerHeight) * 100;

  //   // GSAP animation to update CSS variables
  //   gsap.to(':root', {
  //     duration: 2,
  //     ease: 'power4.out',
  //     '--mask-position-x': `${mouseX}%`,
  //     '--mask-position-y': `${mouseY}%`,
  //     overwrite: 'auto'
  //   });
  // });

  // Text
  var text_elements = gsap.utils.toArray("[animate]");
  text_elements.forEach(function (element) {
    // var splitText = new SplitType(element, { type: 'lines' })
    let letter_tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 95%",
        end: "bottom 50%",
        toggleActions: "play none none none",
      },
    });
    letter_tl.from(element, {
      y: "100%",
      opacity: 0,
      duration: 0.55,
      ease: "back.out",
      stagger: 0.1,
    });
  });

  // Element
  var elements = gsap.utils.toArray("[ele-animate]");
  elements.forEach(function (element) {
    let scrollelement = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 95%",
        end: "bottom 50%",
        toggleActions: "play none none none",
      },
    });
    scrollelement.from(element, {
      y: "100%",
      opacity: 0,
      duration: 0.55,
      ease: "power1.out",
      stagger: 0.1,
    });
  });

  // Fade in
  var fade_elements = gsap.utils.toArray("[fade-in]");
  fade_elements.forEach(function (element) {
    let scrollelement = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 95%",
        end: "bottom 50%",
        toggleActions: "play none none none",
      },
    });
    scrollelement.from(element, {
      y: 60,
      opacity: 0,
      duration: 0.55,
      ease: "power1.out",
      stagger: 0.1,
    });
  });

  // CRO UXO Box
  gsap.set("[cro-uxo-box]", {
    autoAlpha: 0,
    y: 60,
  });
  ScrollTrigger.batch("[cro-uxo-box]", {
    onEnter: (elements) => {
      gsap.fromTo(
        elements,
        {
          autoAlpha: 0,
          y: 60,
        },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.2,
          ease: "sine.out",
        }
      );
    },
    once: true,
    start: "top 80%",
    end: "bottom 50%",
  });

  // World Brand Card
  gsap.set("[world-brand-card]", {
    autoAlpha: 0,
    x: 60,
  });
  ScrollTrigger.batch("[world-brand-card]", {
    onEnter: (elements) => {
      gsap.fromTo(
        elements,
        {
          autoAlpha: 0,
          x: 60,
        },
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.2,
          ease: "sine.out",
        }
      );
    },
    once: true,
    start: "top 80%",
    end: "bottom 50%",
  });

  var studies_swiper = new Swiper(".swiper.is-case-studies", {
    slidesPerView: 3,
    pagination: {
      el: ".case-studies-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '"></span>';
      },
    },
    spaceBetween: 24,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      480: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 1.5,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });

  var cro_uxo_swiper = new Swiper(".swiper.is-cro-uxo", {
    slidesPerView: 4,
    spaceBetween: 24,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      480: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 4,
      },
    },
    pagination: {
      el: ".swiper-pagination.is-uxo",
      clickable: true,
    },
  });

  var review_swiper = new Swiper(".swiper.is-client-reviews", {
    slidesPerView: 3,
    spaceBetween: 24,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      480: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 1.5,
      },
    },
    pagination: {
      el: ".swiper-pagination.is-client",
      clickable: true,
    },
  });
  if ($(window).width() < 991) {
    var trust_swiper = new Swiper(".swiper.is-trust", {
      slidesPerView: 3,
      spaceBetween: 24,
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        480: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 1,
        },
      },
      pagination: {
        el: ".swiper-pagination.is-trust",
        clickable: true,
      },
    });
  }
  // footer
  if ($(window).width() > 768) {
    var f_point = "15rem";
    if ($(window).width() <= 1440) {
      f_point = "12rem";
    }
    if ($(window).width() <= 1366) {
      f_point = "9rem";
    }
    if ($(window).width() <= 1280) {
      f_point = "8rem";
    }
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".footer",
          start: "top 95%",
          end: "bottom 40%",
          scrub: true,
        },
      })
      .fromTo(
        ".footer-wrapper",
        {
          translateY: f_point,
        },
        {
          translateY: `${-(innerHeight / 4) / 16}rem`,
          ease: "none",
        }
      );
  }

  if ($(window).width() < 768) {
    var brands_swiper = new Swiper(".swiper.is-world-class-brands", {
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: {
        el: ".world-class-brand-pagination",
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '"></span>';
        },
      },
    });
  }

  // Navbar
  setTimeout(function () {
    $(".navbar").addClass("is-active");
  }, 1000);

  var prevScrollpos = window.pageYOffset;
  window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;

    if (currentScrollPos < 20) {
      $(".navbar").addClass("is-active").addClass("is-top");
    } else {
      $(".navbar").removeClass("is-active").removeClass("is-top");
    }

    if (prevScrollpos > currentScrollPos) {
      $(".navbar").addClass("is-active");
    } else if (currentScrollPos > $(".navbar").outerHeight()) {
      $(".navbar").removeClass("is-active");
    }
    prevScrollpos = currentScrollPos;

    $(".hamburger-box").removeClass("is-active");
    $(".mobile-menu-drawer").removeClass("is-active");
  };

  // Mobile menu
  $(".hamburger-box").on("click", function () {
    $(this).toggleClass("is-active");
    $(".mobile-menu-drawer").toggleClass("is-active");
  });
});

//cursor
var follower = $(".cursor");

$(document).on("mousemove", function (e) {
  var mouseX = e.clientX;
  var mouseY = e.clientY;

  TweenMax.set(follower, {
    css: {
      left: mouseX - 12,
      top: mouseY - 12,
    },
  });
});
