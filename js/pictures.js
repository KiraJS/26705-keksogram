(function() {
  var filterContainer = document.querySelector('.filters');
  filterContainer.classList.add('hidden');
  
  var picturesContainer = document.querySelector('.pictures');
  var pictureTemplate = document.getElementById('picture-template');

  pictures.forEach(function(picture, i) {
    var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);
    newPictureElement.querySelector(".picture-comments").textContent = picture['comments'];
    newPictureElement.querySelector(".picture-likes").textContent = picture['likes'];
    var pictureElement = newPictureElement.getElementsByTagName('img');

    var pictureItem = new Image();
    pictureItem.src  = picture['url'];
    
    pictureItem.onload = function() {
      pictureItem.setAttribute('width', 182);
      pictureItem.setAttribute('height', 182);
      newPictureElement.replaceChild(pictureItem, pictureElement[0]);
    }

    pictureItem.onerror = function() {
      newPictureElement.classList.add('picture-load-failure');
    }

    picturesContainer.appendChild(newPictureElement);
  });

  filtersBlock.classList.remove('hidden');
})();