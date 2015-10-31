'use strict';

requirejs.config({
  baseUrl: 'js'
});

define([
  'photo',
  'upload-form',
  'logo-background',
  'resize-form',
  'resize-picture',
  'filter-form'
], function(Photo) {

  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  /**
   * Контейнер для фильтра
   * @type {Еlement}
   */
  var filterContainer = document.querySelector('.filters');
  filterContainer.classList.add('hidden');

  /**
   * Контейнер для фото
   * @type {Еlement}
   */
  var picturesContainer = document.querySelector('.pictures');

  /**
   * @type {number}
   */
  var pictures;

  /**
   * Константа хранит размер страницы
   * @const
   * @type {number}
   */
  var PAGE_SIZE = 12;

  /**
   * Хранит значение текущей страницы
   * @type {number}
   */
  var currentPage;

  /**
   * Хранит текущее состояние массива
   * @type {number}
   */
  var currentPictures;

  /**
   * Хранит фрагмент галлереи
   * @type {pictureFragment}
   */
  var pictureFragment = document.createDocumentFragment();

  /**
   * Обработчик ошибки загрузки
   */
  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }

  /**
   * Загружает список фотографий постранично
   * @param {Array} picturesToRender
   * @param {number} pageNumber
   * @param {boolean} replace
   */
  function renderPictures(picturesToRender, pageNumber, replace) {
    /*
   * Условия для того, чтобы при скроле контейнер не отрисовывался заново, а добавлялся к имеющемуся
   */
    replace = typeof replace !== 'undefined' ? replace : true;
    /*
    * Нормализация аргумента на случай если он не передан
    */
    pageNumber = pageNumber || 0;

    if (replace) {
      picturesContainer.innerHTML = '';
      picturesContainer.classList.remove('pictures-failure');
    }
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

  /**
    * Загрузка изображений из 'data/pictures.json'
    * @param {requestCallback} callback
    */
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

  /**
   * Фильтр
   * @param {Array} picturesToFilter
   * @param {string} filterID
   */
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
    return filteredPictures;
  }

  /**
   * Вызывает фильтр
   * @param {string} filterID
   */
  function setActiveFilter(filterID) {
    currentPictures = filterPictures(pictures, filterID);
    currentPage = 0;
    renderPictures(currentPictures, currentPage, true);
  }

  /**
   * Проверка возможности отрисовать следующую страницу
   * @return {boolean}
   */
  function isNextPageAvailable() {
    return currentPage < Math.ceil(pictures.length / PAGE_SIZE);
  }

  /**
   * Проверка - находимся ли мы внизу страницы
   * @return {boolean}
   */
  function isAtTheBottom() {
    var GAP = 100;
    return picturesContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  /**
   * Функция проверки для отрисовки следующей страницы
   */
  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAvailable()) {
      window.dispatchEvent(new CustomEvent('loadneeded'));
    }
  }

  /**
   * Скролл
   */
  function initScroll() {
    var someTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(someTimeout);
      someTimeout = setTimeout(checkNextPage, 100);
    });
    window.addEventListener('loadneeded', function() {
      renderPictures(currentPictures, ++currentPage, false);
    });
  }

  /**
   * Фильтры
   */
  function initFilters() {
    filterContainer.addEventListener('click', function(evt) {
      location.hash = 'filters/' + evt.target.value;
    });
  }
  /**
   * Обработчик события hashchange объекта window который бы вызывает метод parseURL.
   */
  window.addEventListener('hashchange', function() {
    parseURL();
  });
  /**
   * Метод parseURL, который с помощью регулярного выражения обрабатывает хэш адресной строки и если он соответствует паттерну запускает фильтрацию
   */
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

  loadPictures(function(loadedPictures) {
    pictures = loadedPictures;
    parseURL();
  });

});
