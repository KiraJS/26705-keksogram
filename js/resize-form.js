/* global resizer: true*/
'use strict';

(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];
  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  var resizeX = resizeForm['resize-x'];
  var resizeY = resizeForm['resize-y'];
  var resizeS = resizeForm['resize-size'];

  var imageHeight;
  var imageWidth;
  var imageConstraint;

  window.addEventListener('imagecreated', function() {
    imageConstraint = resizer.getConstraint();
    imageHeight = resizer.getImageSizeHeight();
    imageWidth = resizer.getImageSizeWidth();
    resizeS.value = imageConstraint.side;

    document.querySelector('.resize-image-preview').classList.add('invisible');

    resizeX.max = Math.max(imageWidth - resizeS.value, 0);
    resizeY.max = Math.max(imageHeight - resizeS.value, 0);
    resizeS.max = Math.min(imageWidth, imageHeight);

    resizeX.min = resizeX.value = 0;
    resizeY.min = resizeY.value = 0;
    resizeS.min = 50;
  });

  window.addEventListener('resizerchange', function() {
    imageConstraint = resizer.getConstraint();

    resizeX.value = Math.floor(imageConstraint.x);
    resizeY.value = Math.floor(imageConstraint.y);

    if (imageConstraint.x > resizeX.max) {
      resizer.setConstraint(Number(resizeX.max), Number(resizeY.value), Number(resizeS.value));
    }
    if (imageConstraint.x < resizeX.min) {
      resizer.setConstraint(Number(resizeX.min), Number(resizeY.value), Number(resizeS.value));
    }
    if (imageConstraint.y > resizeY.max) {
      resizer.setConstraint(Number(resizeX.value), Number(resizeY.max), Number(resizeS.value));
    }
    if (imageConstraint.y < resizeY.min) {
      resizer.setConstraint(Number(resizeX.value), Number(resizeY.min), Number(resizeS.value));
    }
  });

  resizeS.onchange = function() {
    if (Number(resizeS.value) > Number(resizeS.max)) {
      resizeS.value = resizeS.max;
    }
    if (Number(resizeS.value) < Number(resizeS.min)) {
      resizeS.value = resizeS.min;
    }
    imageConstraint = resizer.getConstraint();

    var sideDiff = (imageConstraint.side - Number(resizeS.value)) / 2;
    resizer.setConstraint(imageConstraint.x + sideDiff, imageConstraint.y + sideDiff, Number(resizeS.value));

    var picCanvas = document.querySelector('canvas');
    resizeX.max = Math.max(imageWidth - resizeS.value, 0);
    resizeY.max = Math.max(imageHeight - resizeS.value, 0);
    resizeS.max = Math.min(picCanvas.width, picCanvas.height);

    resizeS.value = Math.floor(imageConstraint.side);

    resizeX.value = Math.floor(imageConstraint.x);
    resizeY.value = Math.floor(imageConstraint.y);
  };

  resizeX.onchange = function() {
    if (Number(resizeX.value) > Number(resizeX.max)) {
      resizeX.value = resizeX.max;
    }
    if (Number(resizeX.value) < Number(resizeX.min)) {
      resizeX.value = resizeX.min;
    }
    resizer.setConstraint(Number(resizeX.value), Number(resizeY.value), Number(resizeS.value));
  };

  resizeY.onchange = function() {
    if (Number(resizeY.value) > Number(resizeY.max)) {
      resizeY.value = resizeY.max;
    }
    if (Number(resizeY.value) < Number(resizeY.min)) {
      resizeY.value = resizeY.min;
    }
    resizer.setConstraint(Number(resizeX.value), Number(resizeY.value), Number(resizeS.value));
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
    filterForm.querySelector('.filter-image-preview').src = resizer.exportImage().src;
    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };
})();
