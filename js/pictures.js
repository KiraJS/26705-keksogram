(function() {
  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var filterContainer = document.querySelector('.filters');
  filterContainer.classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures');
  var pictureTemplate = document.getElementById('picture-template');

  var pictures;

  function showLoadFailure (){
    picturesContainer.classList.add("pictures-failure")
  }

  function renderPictures(pictures){
    picturesContainer.innerHTML = '';

    pictures.forEach(function(picture) {
      var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);
      newPictureElement.querySelector(".picture-comments").textContent = picture['comments'];
      newPictureElement.querySelector(".picture-likes").textContent = picture['likes'];
      var pictureElement = newPictureElement.getElementsByTagName('img');

      var pictureItem = new Image();
      pictureItem.src  = picture['url'];

      pictureItem.onload = function() {
        pictureItem.setAttribute('width', 182);
        pictureItem.setAttribute('height', 182);
        newPictureElement.replaceChild(pictureItem, pictureElement[0]);
      }

      pictureItem.onerror = function() {
        newPictureElement.classList.add('picture-load-failure');
      }

      picturesContainer.appendChild(newPictureElement);
    });

  }

  filterContainer.classList.remove('hidden');

  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }

  function loadPictures(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.open('get', 'data/pictures.json');
    xhr.send();

    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          picturesContainer.classList.add('pictures-loading');
          break;

        case ReadyState.DONE:
        default:
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response.toString();
            picturesContainer.classList.remove('pictures-loading');
            return callback(JSON.parse(data));
          }

          if (loadedXhr.status > 400) {
            showLoadFailure();
          }
          break;
      }
    };

    xhr.ontimeout = function() {
      showLoadFailure();
    };
  }


  function filterPictures(pictures, filterID) {
    var filteredPictures = pictures.slice(0);
    switch (filterID) {

      case 'filter-new':
        filteredPictures = filteredPictures.sort(function(a, b) {
          if (a.date > b.date) {
            return -1;
          }
          if (a.date < b.date) {
            return 1;
          }
          if (a.date === b.date) {
            return 0;
          }
        });
        break;

      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          if (a.comments > b.comments || (b.comments && a.comments === 0)) {
            return -1;
          }
          if (a.comments < b.comments || (a.comments && b.comments === 0)) {
            return 1;
          }
          if (a.comments === b.comments) {
            return 0;
          }
        });
        break;

      default:
        filteredPictures = pictures.slice(0);
        break;
    }
    return filteredPictures;
  }

  function setActiveFilter(filterID) {
    var filteredPictures = filterPictures(pictures, filterID);
    renderPictures(filteredPictures);
  }

  function initFilters() {
    var filterElements = document.querySelectorAll('.filters-radio');
    var filterChecked = document.querySelector('.filters-radio:checked');

    for (var i = 0, l = filterElements.length; i < l; i++) {
      filterElements[i].onclick = function(evt) {
        var clickedFilter = evt.currentTarget;
        if (filterChecked !== clickedFilter) {
          setActiveFilter(clickedFilter.id);
          filterChecked = clickedFilter;
        }
        clickedFilter.checked = true;
      };
    }
  }

  initFilters();
  loadPictures(function(loadedPictures) {
    pictures = loadedPictures;
    setActiveFilter('filter-popular');
  });
})();
