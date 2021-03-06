let prevHash = undefined, scrollToTop;




function init () {
  const navMenu = document.getElementById('slide-out');
  const sideMenu = document.getElementById('side-menu');
  updateInnerHTML(sideMenu, 'update', navMenu.innerHTML);
  

  $('.collapsible').collapsible();
  $('.tooltipped').tooltip();
  
  $('.scrollspy').scrollSpy({
    scrollOffset: 20
  });
  
  routie({
    '/:page': (page) => {
      loadPage(page);
      
      goToTop();
      // console.log('elements');
    }
  });
  
  if (location.hash === '') {
    routie('/get-started/');
  }
  
  // console.log('DOMContentLoaded');
  
}



function loadPage (file) {
  const path = './pages/';
  const extension = '.html';
  
  progressBar().show();
  
  $.ajax({
    type: 'GET',
    url: path + file + extension,
    success: (data) => {
      const pageContent = document.getElementsByTagName('main')[0];
      const currHash = location.hash;
      
      setTimeout(function() {
        
        // console.log(prevHash, currHash, file);
        if (currHash !== prevHash || prevHash === undefined) {
          const collectionItem = document.querySelectorAll('.collection-item');
          
          updateInnerHTML('main', 'update', data);
          Prism.highlightAll();
          add(pageContent, 'showPage');
          
          progressBar().size(100);
          progressBar().hide();
          
          
          collectionItem.forEach(function (el) {
            el.classList.remove('active');
          });
          
          setTimeout(function() {
            
            if (file) {
              let item = document.querySelectorAll('.sidebar ul li');
              
              for (let i in item) {
                // console.log(file, item[i].id, item);
                if (item[i].id === file) {
                  $('.collapsible').collapsible('open', i - 1);
                  break;
                }
              }
            }
            
            $('.scrollspy').scrollSpy({
              scrollOffset: 100
            });
          }, 400);
        }
        prevHash = location.hash;
      }, 300);
    },
    
    error: (request, status, error) => {
      console.log(request.responseText);
      console.log(status, error);
    }
  });
}


function updateInnerHTML (element, insertType = undefined, content) {
  const elementOnDOM = $(element);
  // console.log(element, elementOnDOM);
  
  if (elementOnDOM.length > 0) {
    // console.log('elementOnDOM: ', elementOnDOM);
    const showItem = document.querySelectorAll('.showItem');
    
    switch (insertType) {
      case 'append':
        elementOnDOM.append(content)
        .find('.showItem')
        .one('animationend',function () {
          showItem.forEach(function (el) {
            el.classList.remove('showItem');
          });
        });
        
        break;
        case 'prepend':
          elementOnDOM.prepend(content)
          .find('.showItem')
          .one('animationend',function () {
            showItem.forEach(function (el) {
              el.classList.remove('showItem');
            });
          });
          break;
          default: // update
          elementOnDOM.html(content);
        }
      }
    }
    
    
    
    
    function add (element, animationName, callback) {
      if (element) {
        element.classList.add('animated', 'faster', animationName);
        
        element.addEventListener('animationend', function () {
          if (!animationName.match(/out/gi)) {
            element.classList.remove('faster', animationName);
      }
      
      if (callback !== undefined) callback();
    });
  }
}


function goToTop() {
  scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 8);
    }
  };
  
  scrollToTop();
}




function progressBar() {
  return {
    show: () => {
      // Check if progress bar exists
      let loop = setInterval(function () {
        let theBar = document.getElementsByClassName('helpers-progress')[0];
        if (progressBar) {
          theBar.classList.add('show');
          
          clearInterval(loop);
        }
      }, 300);
    },
    
    hide: () => {
      setTimeout(function () {
        let theBar = document.getElementsByClassName('helpers-progress')[0];
        theBar.classList.remove('show');
        
        setTimeout(function () {
          progressBar().size(15);
        }, 1000);
      }, 500);
    },
    
    size: (percentage) => {
      let theBar = document.querySelector('.helpers-progress .helpers-progress--bar');
      
      theBar.style.width = percentage + '%';
    }
  }
}


$('.sidenav').sidenav({
  preventScrolling: false
});

$('.sidenav .collection-item').on('click', function () {
  $('.sidenav').sidenav('close');
});

document.addEventListener('DOMContentLoaded', function () {
  init();
});
