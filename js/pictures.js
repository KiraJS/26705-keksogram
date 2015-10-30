'use strict';

requirejs.config({
  baseUrl: 'js'
});

define([
  'photo',
  'gallery',
  'logo-background',
  'upload-form',
  'resize-form',
  'resize-picture',
  'filter-form'
], function(Photo, Gallery) {

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
  var gallery = new Gallery();

  var pictures;
  var PAGE_SIZE = 12; // Константа хранит размер страницы
  var currentPage; // Хранит значение текущей страницы
  var currentPictures; // Хранит текущее состояние массива

  var pictureFragment = document.createDocumentFragment();


  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }
  //Отрисовка изображений с помощью объекта Photo
  function renderPictures(picturesToRender, pageNumber, replace) {
    // Добавила еще один аргумент и условия для того, чтобы при скроле потом контейнер не отрисовывался заново, а добавлялся
    replace = typeof replace !== 'undefined' ? replace : true;
    pageNumber = pageNumber || 0; //Нормализация аргумента на случай если он не передан

    if (replace) {
      picturesContainer.innerHTML = '';
      picturesContainer.classList.remove('pictures-failure');
    }
    //Постраничное отображение
    var picturesFrom = pageNumber * PAGE_SIZE;
    var picturesTo = picturesFrom + PAGE_SIZE;
    picturesToRender = picturesToRender.slice(picturesFrom, picturesTo);

    picturesToRender.forEach(function(pictureData) {
      var newPictureElement = new Photo(pictureData);
      newPictureElement.render(pictureFragment);
    });
    picturesContainer.appendChild(pictureFragment);
    filterContainer.classList.remove('hidden');
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

  function filterPictures(picturesToFilter, filterID) {
    var filteredPictures = picturesToFilter.slice(0);
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
        filteredPictures = picturesToFilter.slice(0);
        break;
    }
    localStorage.setItem('filterID', filterID);
    return filteredPictures;
  }


  function setActiveFilter(filterID) {
    currentPictures = filterPictures(pictures, filterID);
    currentPage = 0;
    renderPictures(currentPictures, currentPage, true);
  }


  function isNextPageAvailable() {
    return currentPage < Math.ceil(pictures.length / PAGE_SIZE);
  }

  function isAtTheBottom() {
    var GAP = 100;
    return picturesContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  // Скролл. Проверка находимся ли мы внизу страницы и можно ли отрисовать следующую
  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAvailable()) {
      //Создание кастомного события - достижение низа страницы
      window.dispatchEvent(new CustomEvent('loadneeded'));
    }
  }
  // Скролл. Запуск функции с таймаутом в 1 сек
  function initScroll() {
    var someTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(someTimeout);
      someTimeout = setTimeout(checkNextPage, 100);
    });
    // Вызов кастомного события - достижение низа страницы
    window.addEventListener('loadneeded', function() {
      renderPictures(currentPictures, currentPage++, false);
    });
  }

  function initGallery() {
    window.addEventListener('showgallery', function(evt) {
      gallery.setPhotos(evt.detail.photoElement.getPhotos());
      gallery.show();
    });
  }

  // Поменяла тип обработки события
  function initFilters() {
    filterContainer.addEventListener('click', function(evt) {
      //Пишем хэш вместо фильтрации
      location.hash = 'filters/' + evt.target.value;
    });
  }
  // обработчик события hashchange объекта window который бы вызывал метод parseURL.
  window.addEventListener('hashchange', function() {
    parseURL();
  });

  //Метод parseURL, который с помощью регулярного выражения обрабатывает хэш адресной строки и если он соответствует паттерну запускает фильтрацию
  function parseURL() {
    var filterHash = location.hash.match(/^#filters\/(\S+)$/);
    var filterName = 'filter-popular';
    if (filterHash) {
      filterName = 'filter-' + filterHash[1];
    }

    setActiveFilter(filterName);
  }

  initScroll();
  initFilters();
  initGallery();

  loadPictures(function(loadedPictures) {
    pictures = loadedPictures;
    //Убрала код, который записывает  состояние фильтров в localStorage и код, читающий значение фильтра по умолчанию из него
    // Заменила setActiveFilter  на вызов метода parseURL
    parseURL();
  });

});
