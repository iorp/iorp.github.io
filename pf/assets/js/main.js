 
(function() {
  "use strict";




  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
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
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

    /**
   * readmore toggle
   */
    on('click', '.read-toggle', function(e) {

    e.preventDefault();

    var button =e.target ;
    var container = button.closest("div");

  

    const hiddenContent =container.querySelector('.hidden-content') ; // button.previousElementSibling;
    const dotsSpan = button.closest("div").querySelector(".dots");
 
    if (hiddenContent.style.display !=="block") {
     if(dotsSpan) dotsSpan.style.display = "none";
      button.textContent = "Read Less";
    
      new Waypoint({
        element: hiddenContent,
        handler: function(direction) {
            if (direction === "down") {
              hiddenContent.style.display = "block";
                setTimeout(() => {
                  hiddenContent.style.opacity = 1;
                }, 50); // Delay the opacity change to allow display to take effect
                this.destroy(); // Remove the waypoint once it's triggered
            }
        },
        offset: "bottom-in-view" // Trigger when the bottom of the element enters the viewport
     }); 
        
    } else {
      if(dotsSpan)   dotsSpan.style.display = "inline";
      button.textContent = "Read More"; 
      hiddenContent.style.display = "none";
      hiddenContent.style.opacity = 0;
       
    }
      
       
    }, true)

  

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

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
   * List github repositories
   */

  function initializePortfolio(callback){
    let divPortfolio = document.getElementById('portfolio');
    if(!divPortfolio) return;
const username = 'iorp'; 
// GitHub API endpoint for listing user repositories
const apiUrl = `https://api.github.com/users/${username}/repos`;
let repos =[];
let cats = [];
// Send a GET request to the GitHub API
fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
    // 'data' now contains an array of user repositories
    // You can loop through 'data' and do something with each repository

    let divFilters = document.getElementById('portfolio')
    data.forEach((repo) => {
      // Filter only well prefixed repos
      if(!repo.name.includes('.') || repo.name=='iorp.github.io')return;
      let sp =repo.name.split('.');
      repo.cat = sp[sp.length-1];
      if(!cats.includes(repo.cat)) cats.push(repo.cat);  
      repos.push(repo); 
     });

   
      // Sort repos, the dates in descending order (newest first)
    repos.sort((a, b) => {
      const dateA = new Date(a.updated_at );
      const dateB = new Date(b.updated_at); 
      return dateB - dateA;
    });
    
    
  // populate github portfolio
    let ulPortfolioFilters = divPortfolio.querySelector('.portfolio-filters');
    let divPortfolioContainer = divPortfolio.querySelector('.portfolio-container');

   
  
  cats.forEach((cat) => {  ulPortfolioFilters.append(createCat(cat));  });

  repos.forEach((repo) => { divPortfolioContainer.append(createItem(repo));  });
    console.log(repos);
  if(typeof callback==='function')callback();
  })
  .catch((error) => {
    console.error('There was a problem with the fetch operation:', error);
  });

  function createCat(cat){
    let li = document.createElement('li');
    li.setAttribute('data-filter',`.filter-${cat}`);
    li.innerHTML = cat;
    return li;
  }

  function createItem(repo) {
    // Create a new div element with class attributes
const portfolioItem = document.createElement('div');
portfolioItem.classList.add('col-lg-4', 'col-md-6', 'portfolio-item', `filter-${repo.cat}`);

// Create the inner structure
const githubCard = document.createElement('div');
githubCard.classList.add('portfolio-card');

const repoHeader = document.createElement('div');
repoHeader.classList.add('portfolio-card-repo-header');

const repoTitle = document.createElement('a');
repoTitle.classList.add('portfolio-card-repo-title');
repoTitle.textContent = repo.name;

const repoBody = document.createElement('div');
repoBody.classList.add('portfolio-card-repo-body');

const repoDescription = document.createElement('p');
repoDescription.classList.add('portfolio-card-repo-description');
repoDescription.textContent =repo.description || `A ${repo.cat} repository.`;

const repoFooter = document.createElement('div');
repoFooter.classList.add('portfolio-card-repo-footer');

const viewOnGithubLink = document.createElement('a');
viewOnGithubLink.classList.add('portfolio-card-view-on-github');
viewOnGithubLink.href = repo.url;
viewOnGithubLink.target = '_blank';
viewOnGithubLink.textContent = 'View on GitHub';

const repoStars = document.createElement('span');
repoStars.classList.add('portfolio-card-repo-stars');
repoStars.textContent = '★'+repo.stargazers_count;

const repoCategory = document.createElement('span');
repoCategory.classList.add('portfolio-card-repo-category');
repoCategory.textContent = repo.cat;

// Append elements to build the structure
repoHeader.appendChild(repoTitle);
repoBody.appendChild(repoDescription);
repoFooter.appendChild(viewOnGithubLink);
repoFooter.appendChild(repoStars);
repoFooter.appendChild(repoCategory);

githubCard.appendChild(repoHeader);
githubCard.appendChild(repoBody);
githubCard.appendChild(repoFooter);

portfolioItem.appendChild(githubCard);
return portfolioItem;
    // return `
    // <div class="col-lg-4 col-md-6 portfolio-item filter-${repo.cat}">
    //   <div class="portfolio-card">
    //       <div class="portfolio-card-repo-header">
    //            <a class="portfolio-card-repo-title">${repo.name}</a>
    //       </div>
    //       <div class="portfolio-card-repo-body">
    //           <p class="portfolio-card-repo-description">Repository Description goes here. This is a brief description of the repository.</p>
    //       </div>
    //       <div class="portfolio-card-repo-footer">
    //           <a class="portfolio-card-view-on-github" href="#" target="_blank">View on GitHub</a>
    //           <span class="portfolio-card-repo-stars">★ 100</span>
    //           <span class="portfolio-card-repo-category">C++</span>  
    //       </div>
    //   </div>
    //   </div>
    // `;
   
  }
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {

    initializePortfolio(()=>{


    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('.portfolio-filters li', true);

      on('click', '.portfolio-filters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }
  });
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
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()