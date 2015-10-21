'use strict';

(function() {
  var uploadForm = document.forms['upload-select-image']; //форма выбора изображения - 1 шаг
  var resizeForm = document.forms['upload-resize']; //форма редактирования изображения - 2 шаг
  var filterForm = document.forms['upload-filter']; //форма выбора фильтра - 3 шаг

  var previewImage = filterForm.querySelector('.filter-image-preview'); //загруженное изображение
  var prevButton = filterForm['filter-prev']; // Кнопка отправки формы
  var selectedFilter = filterForm['upload-filter']; // Коллекция фильтров

  var filterMap;

  // Функция добавляет коллекцию фильтров в переменную filterMap, объявленную выше
  // Функция ограничивает максимальную ширину img до 582px и добавляет изображению значение выбранного css-фильтра

  function setFilter() {
    if (!filterMap) {
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      }
    }
    previewImage.className = 'filter-image-preview' + ' ' + filterMap[selectedFilter.value];
  };

  // Цикл перебирает массив фильтров и в случае выбранного фильтра вызывает фунццию setFilter, которая добавляет нужный класс для применения css-фильтра
  for (var i = 0, l = selectedFilter.length; i < l; i++) {
    selectedFilter[i].onchange = function(evt) {
      setFilter();
    }
  };
  prevButton.onclick = function(evt) {
    evt.preventDefault();

    filterForm.reset();
    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  filterForm.onsubmit = function() {
    evt.preventDefault();
    // Запись в cookie.
    docCookies.setItem('upload-filter', selectedFilter.value);

    uploadForm.classList.remove('invisible');
    filterForm.classList.add('invisible');

    //filterForm.submit();

  };
  // Восстановление cookie
  if (docCookies.hasItem('upload-filter')) {
    selectedFilter.value = docCookies.getItem('upload-filter');
  };

  setFilter();

})();
