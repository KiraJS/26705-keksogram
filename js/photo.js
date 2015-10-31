'use strict';

define(function() {

  var pictureTemplate = document.getElementById('picture-template');

  /**
   * Объект типа Photo
   * @constructor
   * @param {PhotoData} data
   */
  var Photo = function(data) {
    this._data = data;
    this._onClick = this._onClick.bind(this);
  };

  /**
   * Метод отрисовки изображений через прототип
   */
  Photo.prototype.render = function(container) {
    var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);
    var pictureElement = newPictureElement.getElementsByTagName('img');

    newPictureElement.querySelector('.picture-comments').textContent = this._data['comments'];
    newPictureElement.querySelector('.picture-likes').textContent = this._data['likes'];
    if (this._data.url) {
      var pictureItem = new Image();
    }
    pictureItem.src = this._data.url;

    pictureItem.addEventListener('error', function() {
      newPictureElement.classList.add('picture-load-failure');
    });

    pictureItem.addEventListener('load', function() {
      pictureItem.setAttribute('width', 182);
      pictureItem.setAttribute('height', 182);
      newPictureElement.replaceChild(pictureItem, pictureElement[0]);
    });

    container.appendChild(newPictureElement);

    this._element = newPictureElement;
    this._element.addEventListener('click', this._onClick);
  };

  /**
   * Метод обратный render
   */
  Photo.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element.removeEventListener('click', this._onClick);
    this._element = null;
  };

  /**
   * Обработка клика по фотографии
   */
  Photo.prototype._onClick = function(evt) {
    evt.preventDefault();
    if (!this._element.classList.contains('picture-load-failure')) {
      var galleryEvent = new CustomEvent('showgallery', {detail: {photoElement: this}});
      window.dispatchEvent(galleryEvent);
    }
  };

  Photo.prototype.getPhotos = function() {
    return this._data.pictures;
  };

  return Photo;
});
