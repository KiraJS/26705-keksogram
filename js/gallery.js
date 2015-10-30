'use strict';

define(function() {

  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  function clamp(value, min, max) {
    return Math.max(Math.min(value, min), max);
  }
  var Gallery = function() {
    this._element = document.body.querySelector('.gallery-overlay');
    this._closeButton = this._element.querySelector('.gallery-overlay-close');
    this._pictureElement = this._element.querySelector('.gallery-overlay-preview');

    this._currentPhoto = 0;
    this._photos = [];

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);

  };
  //Показ галлереи
  Gallery.prototype.show = function() {
    this._element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    document.body.addEventListener('keyup', this._onKeyUp);
    this._showCurrentPhoto();
  };

  //Закрытие галлереи
  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    document.body.removeEventListener('keyup', this._onKeyUp);
    this._currentPhoto = 0;
  };

  // Метод  записывает в приватное свойство _photos массив фото
  Gallery.prototype.setPhotos = function(photos) {
    this._photos = photos;
  };

  Gallery.prototype._showCurrentPhoto = function() {
    this._pictureElement.innerHTML = '';
    var imageElement = new Image();

    imageElement.onload = function() {
      this._pictureElement.appendChild(imageElement);
    }.bind(this);


    imageElement.src = this._photos[this._currentPhoto];
  };

  //Метод записывает в приватное свойство _currentPhoto индекс текущей показанной фотографии, показывает ее на экране и пишет ее номер в соответствующем блоке.
  Gallery.prototype.setCurrentPhoto = function(index) {
    index = clamp(index, 0, this._photos.length - 1);
    if (this._currentPhoto === index) {
      return;
    }
    this._currentPhoto = index;
    this._show();
  };

  //Закрытие галлереи по крестику
  Gallery.prototype._onCloseClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  //Обработка нажатия на клавиши
  Gallery.prototype._onKeyUp = function(evt) {
    switch (evt.keyCode) {
      case Key.ESC:
        this.hide();
        break;

      case Key.LEFT:
        this.setCurrentPhoto(this._currentPhoto - 1);
        break;

      case Key.RIGHT:
        this.setCurrentPhoto(this._currentPhoto + 1);
        break;
    }
  };
  return Gallery;
});
