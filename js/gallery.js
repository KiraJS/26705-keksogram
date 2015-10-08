(function() {

  // Константа для кода клавиш
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  // Получаю контейнер с картинкой, контейнер для галлереи и кнопку закрытия галлереи
  var picturesContainer = document.querySelector('.pictures');
  var galleryElement = document.querySelector('.gallery-overlay');
  var closeButton = document.querySelector('.gallery-overlay-close');

  //Проверяет имеет ли таргет класс pictures
function doesHaveParent(element, className) {
  do {
    if (element.classList.contains(className)) {
      return !element.classList.contains('picture-load-failure');
    }
    element = element.parentElement;
  } while (element);

  return false;
}
  // Закрытие галлереи
  function hideGallery(){
    galleryElement.classList.add('invisible');
    closeButton.removeEventListener('click', closeHandler);
    document.body.removeEventListener('keydown', keyHandler);
  }

  function closeHandler(evt){
    evt.preventDefault();
    hideGallery();
  }

//Обработчик нажатия esc
  function keyHandler(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        console.log('show previous photo');
        break;
      case Key.RIGHT:
        console.log('show next photo');
        break;
      case Key.ESC:
        hideGallery();
        break;
      default: break;
    }
  }

  // Открытие галлереи
  function showGallery(){
    galleryElement.classList.remove('invisible');
    closeButton.addEventListener('click', closeHandler);
    document.body.addEventListener('keydown', keyHandler);
  }

  picturesContainer.addEventListener('click', function(evt){
    evt.preventDefault();
    if(doesHaveParent(evt.target, 'picture')){
      showGallery();
    }
  })

})();
