'use strict';

(function() {
  var uploadForm = document.forms['upload-select-image']; //форма выбора изображения - 1 шаг
  var resizeForm = document.forms['upload-resize']; //форма редактирования изображения - 2 шаг
  var filterForm = document.forms['upload-filter']; //форма выбора фильтра - 3 шаг

  var previewImage = filterForm.querySelector('.filter-image-preview'); //загруженное изображение
  var prevButton = filterForm['filter-prev']; // Кнопка отправки формы

  var resizeX = resizeForm['resize-x']; // Поле ввода значения сдвига по x
  var resizeY = resizeForm['resize-y']; // Поле ввода значения сдвига по y
  var resizeSize = resizeForm['resize-size']; // Поле ввода значения размера изображения

  var titleForX = document.getElementById('upload-resize-title-X');
  var titleForY = document.getElementById('upload-resize-title-Y');
  var titleForS = document.getElementById('upload-resize-title-S');


  function formValidate(input) {
    if (input == 'x') {
      if (resizeX.value < 0) {
        titleForX.style.display = 'inline-block';
        titleForX.innerHTML = 'Значение должно быть больше или равно 0';
      }
      else if (resizeX.value > resizeXMax) {
        titleForX.style.display = 'inline-block';
        titleForX.innerHTML = 'Значение не может превышать ' + resizeXMax;
      }
      else {
        titleForX.style.display = 'none';
      }
    }
    else if (input == 'y') {
      if (resizeY.value < 0) {
        titleForY.style.display = 'inline-block';
        titleForY.innerHTML = 'Значение должно быть больше или равно 0';
      }
      else if (resizeY.value > resizeYMax) {
        titleForY.style.display = 'inline-block';
        titleForY.innerHTML = 'Значение не может превышать ' + resizeYMax;
      }
      else {
        titleForY.style.display = 'none';
      }
    }
    else {
      if (resizeSize.value < 0) {
        titleForS.style.display = 'inline-block';
        titleForS.innerHTML = 'Значение должно быть больше или равно 0';
      }
      else if (resizeSize.value > resizeSize.max) {
        titleForS.style.display = 'inline-block';
        titleForS.innerHTML = 'Значение не может превышать ' + resizeSizeMax;
      }
      else {
        titleForS.style.display = 'none';
      }
    }
  };

  previewImage.onload = function() {
    var imgHeight = previewImage.height;
    var imgWidth = previewImage.width;
    var minSize = Math.min(imgHeight, imgWidth);

    resizeSize.value = minSize;
    resizeSize.max = minSize;
    resizeSize.min = 0;

    resizeX.min = resizeX.value = 0;
    resizeY.min = resizeY.value = 0;

    var resizeXMax = parseInt(imgWidth - resizeSize.value);
    var resizeYMax = parseInt(imgHeight - resizeSize.value);
    var resizeSizeMax = minSize;

    formValidate();
  };

  prevButton.onclick = function(evt) {

    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    filterForm.elements['filter-image-src'] = previewImage.src;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };

})();
