/**
* Template Name: Personal
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Updated: Mar 17 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
* Modified by: Iorp
*/

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    if(!el)return;
    el = el.trim() 
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)

    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
    let languageSwitcher = select('.language-switcher');
    languageSwitcher.classList.toggle('show')
   })
  /**
   * Modification by @iorp of scroll to section, in order to be able to use it elsewhere 
   */

const navigateToSection = function(sid,callback){
 
  let section = select(`#${sid}`)
  let navbar = select('#navbar')
  let navLink = navbar.querySelector(`a[href="#${sid}"]`)
  let header = select('#header')
  let sections = select('section', true)
  let navlinks = select('#navbar .nav-link', true)
  
  
  // window.setUrlArgs((prev)=>{return {...prev,s:sid}});
  navlinks.forEach((item) => {
    item.classList.remove('active')
  })

  if(navLink) navLink.classList.add('active');

  if (navbar.classList.contains('navbar-mobile')) {
    navbar.classList.remove('navbar-mobile')
    let navbarToggle = select('.mobile-nav-toggle')

    navbarToggle.classList.toggle('bi-list')
    navbarToggle.classList.toggle('bi-x')

    let languageSwitcher = select('.language-switcher');
    languageSwitcher.classList.toggle('show')

  }


  if(navLink) { 
    if (navLink.hash == '#header') {
      header.classList.remove('header-top')
      sections.forEach((item) => {
        item.classList.remove('section-show')
      })
      return;
    }
  }


  

  if (!header.classList.contains('header-top')) {
    header.classList.add('header-top')
    setTimeout(function() {
      sections.forEach((item) => {
        item.classList.remove('section-show')
      })
      section.classList.add('section-show')
      if(typeof callback=='function')callback(section);
    }, 350);
  } else {
    sections.forEach((item) => {
      item.classList.remove('section-show')
    })
    section.classList.add('section-show')
  }

 
   scrollto(sid)
};
// Share function with react
window.navigateToSection = navigateToSection;
  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '#navbar .nav-link', function(e) {
    let section = select(this.hash)
     if (section) {
      e.preventDefault()
       navigateToSection(section.getAttribute('id'));
      
   //   scrollto(select('#navbar').querySelector(section.getAttribute('id')))
     }
  }, true)

  /**
   * Activate/show sections on load with hash links
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      let initial_nav = select(window.location.hash)

      if (initial_nav) {
        let header = select('#header')
        let navlinks = select('#navbar .nav-link', true)

        header.classList.add('header-top')

        navlinks.forEach((item) => {
          if (item.getAttribute('href') == window.location.hash) {
            item.classList.add('active')
          } else {
            item.classList.remove('active')
          }
        })

        setTimeout(function() {
          initial_nav.classList.add('section-show')
        }, 350);

        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });
 
 

   
 
    // 
    
    // resumeItemLinks.forEach(e => e.addEventListener('click', (e)=>{
 
    //   e.preventDefault();
    //   scrollToSection('test');
    //   console.log(12213);
    // }));

 
  // }, true);
 
  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()