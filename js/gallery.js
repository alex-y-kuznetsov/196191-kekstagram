'use strict';

(function () {
  var MAX_POSTS = 25;
  var ESC_KEY = 27;
  var postTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var similarListElement = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var commentsContainer = document.querySelector('.social__comments');
  var socialCommentCounter = document.querySelector('.social__comment-count');
  var socialLoadMore = document.querySelector('.social__loadmore');
  var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');
  var sortByBlock = document.querySelector('.img-filters');
  var picturePreview = document.querySelectorAll('.picture__link');

  // Создание обработчиков
  var openBigPictureHandler = function (evt) {
    evt.preventDefault();
    renderBigPicture(evt);
    document.addEventListener('keydown', escBigPictureHandler);
  };

  var closeBigPictureHandler = function () {
    window.utils.addHidden(bigPicture);
    bigPictureClose.removeEventListener('keydown', escBigPictureHandler);
    window.uploadPicture.innerHtml = '';
  };

  var escBigPictureHandler = function (evt) {
    if (evt.keyCode === ESC_KEY) {
      window.utils.addHidden(bigPicture);
    }
  };

  // Очитска галереи
  var clearGallery = function () {
    // picturePreview.forEach(function (picture) {
    //   similarListElement.removeChild(picture);
    // })
    similarListElement.innerHtml = '';
  };

  var renderPosts = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < MAX_POSTS; i++) {
      var postElement = postTemplate.cloneNode(true);

      postElement.querySelector('.picture__img').src = data[i].url;
      postElement.querySelector('.picture__img').dataset.indexNumber = i;
      postElement.querySelector('.picture__stat--likes').textContent = data[i].likes;
      postElement.querySelector('.picture__stat--comments').textContent = data[i].comments.length;

      fragment.appendChild(postElement);
    }

    similarListElement.appendChild(fragment);
    for (var j = 0; j < picturePreview.length; j++) {
      picturePreview[j].addEventListener('click', openBigPictureHandler);
    }
  };

  // Создание массива постов
  var posts = [];
  var successHandler = function (response) {
    posts = response;
    renderPosts(posts);
    sortByBlock.classList.remove('img-filters--inactive');
  };

  // Фильтрация постов
  var sortByModes = sortByBlock.querySelectorAll('.img-filters__button');
  var updatePosts = function (sortByMode) {
    switch (sortByMode.id) {                                                      // Кажется, проблема возникает здесь
      case 'filter-popular': renderPosts(posts);
        break;
      case 'filter-new': renderPosts(window.utils.getNewPosts(posts, 10));
        break;
      case 'filter-discussed': renderPosts(window.utils.getDiscussedPosts(posts));
        break;
    }
  };

  var changeSortModeHandler = function (evt) {
    clearGallery();
    updatePosts(evt.target);                                                      // Или здесь
  };

  for (var k = 0; k < sortByModes.length; k++) {
    sortByModes[k].addEventListener('click', changeSortModeHandler);
  }

  // Отрисовка Big Picture
  var renderBigPicture = function (evt) {
    window.utils.removeHidden(bigPicture);
    var pictureIndex = evt.target.dataset.indexNumber;
    bigPicture.querySelector('.big-picture__img img').src = evt.target.src;
    bigPicture.querySelector('.likes-count').textContent = posts[pictureIndex].likes;
    bigPicture.querySelector('.comments-count').textContent = posts[pictureIndex].comments.length;
    bigPicture.querySelector('.social__caption').textContent = posts[pictureIndex].comments[0];

    // Удаляем старые комментарии
    var commentsToRemove = commentsContainer.querySelectorAll('.social__comment');
    commentsToRemove.forEach(function (comment) {
      commentsContainer.removeChild(comment);
    });

    // Отображаем новые комментарии
    var maxRenderedComments;
    if (posts[pictureIndex].comments.length > 5) {
      maxRenderedComments = 5;
    } else {
      maxRenderedComments = posts[pictureIndex].comments.length;
    }
    for (var i = 0; i < maxRenderedComments; i++) {
      var newComment = document.createElement('li');
      newComment.classList.add('social__comment');
      commentsContainer.appendChild(newComment);

      var newCommentImg = document.createElement('img');
      newCommentImg.classList.add('social__picture');
      newCommentImg.src = 'img/avatar-' + window.utils.getRandomNumber(1, 6) + '.svg';
      newCommentImg.alt = 'Аватар комментатора фотографии';
      newCommentImg.width = '35';
      newCommentImg.height = '35';
      newComment.appendChild(newCommentImg);

      var newCommentText = document.createElement('p');
      newCommentText.classList.add('social__text');
      newCommentText.textContent = posts[pictureIndex].comments[i];
      newComment.appendChild(newCommentText);
    }
  };
  window.utils.addVisuallyHidden(socialCommentCounter);
  window.utils.addVisuallyHidden(socialLoadMore);

  bigPictureClose.addEventListener('click', closeBigPictureHandler);

  var errorHandler = function (errorMessage) {
    window.utils.createErrorMessage(errorMessage);
  };
  window.backend.download(successHandler, errorHandler);
})();
