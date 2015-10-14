(function() {

  var pictureTemplate = document.getElementById('picture-template');

  //Создала конструктор для фото
  var Photo = function(data){
    this._data = data;
    this._onClick = this._onClick.bind(this);
  };

  //Добавила метод отрисовки изображений через прототип
  Photo.prototype.render = function(container){
    var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);
    var pictureElement = newPictureElement.getElementsByTagName('img');

    newPictureElement.querySelector(".picture-comments").textContent = this._data['comments'];
    newPictureElement.querySelector(".picture-likes").textContent = this._data['likes'];
    if (this._data['url']) {
      var pictureItem = new Image();
    }
    pictureItem.src = this._data['url'];

    pictureItem.addEventListener("error", function() {
      newPictureElement.classList.add('picture-load-failure');
    });

    pictureItem.addEventListener("load", function() {
      pictureItem.setAttribute('width', 182);
      pictureItem.setAttribute('height', 182);
      newPictureElement.replaceChild(pictureItem, pictureElement[0]);
    });

    container.appendChild(newPictureElement);

    this._element = newPictureElement;
  };


 //Добавила в прототип метод обратный render
  Photo.prototype.unrender = function(){
  this._element.parentNode.removeChild(this._element);
  this._element.removeEventListener('click', this._onClick);
  this._element = null;
  };

  //Заготовка для обработки лайка
  Photo.prototype.like = function() {

  };

  //Заготовка для обработки клика
  Photo.prototype._onClick = function() {

  };

  //Вынесла переменную Photo в глобальную область видимости
  window.Photo = Photo;
})();

