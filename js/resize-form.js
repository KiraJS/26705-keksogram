(function() {
  var uploadForm = document.forms['upload-select-image']; //форма выбора изображения - 1 шаг
  var resizeForm = document.forms['upload-resize']; //форма редактирования изображения - 2 шаг
  var filterForm = document.forms['upload-filter']; //форма выбора фильтра - 3 шаг

  var previewImage = filterForm.querySelector('.filter-image-preview'); //загруженное изображение
  var prevButton = filterForm['filter-prev']; // Кнопка отправки формы
  
  var resizeX = resizeForm['resize-x']; // Поле ввода значения сдвига по x
  var resizeY = resizeForm['resize-y']; // Поле ввода значения сдвига по y
  var resizeSize = resizeForm['resize-size']; // Поле ввода значения размера изображения

  
  // Валидация размера и смещения загружаемого изображения

  previewImage.onload = function(){
    var imgHeight = previewImage.height;
    var imgWidth = previewImage.width;

    var minSize = Math.min(imgHeight, imgWidth);
    resizeSize.value = minSize;
    resizeSize.max = minSize;

    resizeX.min = 0;
    resizeY.min = 0;

    resizeX.max = imgWidth;
    resizeY.max = imgHeight;
    
    formValidate = function(input){
      if(resizeSize.value > minSize ){
        resizeSize.value =  minSize;
      }
      resizeX.max = parseInt(imgWidth - resizeSize.value);
      if(resizeX.value > resizeX.max){
        resizeX.value = resizeX.max;
      }
      resizeY.max = parseInt(imgHeight - resizeSize.value);
      if(resizeY.value > resizeY.max){
        resizeY.value = resizeY.max;
      }
    }
  }
  
  // Ограничение на ввод отрицательных значений
  
  resizeX.onchange = function(evt) {
    if (resizeX.value < 0) {
      resizeX.value = 0;
    }
  };

  resizeY.onchange = function(evt) {
    if (resizeY.value < 0) {
      resizeY.value = 0;
    }
  };

  resizeSize.onchange = function(evt) {
    if (resizeSize.value < 0) {
      resizeSize.value = 0;
    }
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
