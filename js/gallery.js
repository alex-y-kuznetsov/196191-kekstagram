'use strict';

(function () {
  var MIN_COMMENTS = 1;
  var MAX_COMMENTS = 15;
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;
  var MAX_POSTS = 25;
  var ESC_KEY = 27;
  var postTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var similarListElement = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var commentsContainer = document.querySelector('.social__comments');
  var socialCommentCounter = document.querySelector('.social__comment-count');
  var socialLoadMore = document.querySelector('.social__loadmore');
  // Создание поста
  var generateComment = function () {
    var postComment = [];
    var randomTimes = window.utils.getRandomNumber(MIN_COMMENTS, MAX_COMMENTS);
    for (var i = 0; i < randomTimes; i++) {
      postComment.push(window.data.sentences[window.utils.getRandomNumber(0, window.data.sentences.length - 1)]);
    }
    return postComment;
  };
  // Создание массива постов
  var posts = [];
  var generateAllPosts = function () {
    for (var i = 0; i < MAX_POSTS; i++) {
      posts[i] = {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: window.utils.getRandomNumber(MIN_LIKES, MAX_LIKES),
        comments: generateComment(),
        description: window.utils.getRandomFromArr(window.data.descriptions)
      };
    }
  };
  // Отрисовка постов
  var renderPictures = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < MAX_POSTS; i++) {
      var postElement = postTemplate.cloneNode(true);

      postElement.querySelector('.picture__img').src = posts[i].url;
      postElement.querySelector('.picture__img').dataset.indexNumber = i;
      postElement.querySelector('.picture__stat--likes').textContent = posts[i].likes;
      postElement.querySelector('.picture__stat--comments').textContent = posts[i].comments.length;

      fragment.appendChild(postElement);
    }

    similarListElement.appendChild(fragment);
  };
  // Отрисовка поста Big Picture
  var renderBigPicture = function (evt) {
    window.utils.removeHidden(bigPicture);
    var pictureIndex = evt.target.dataset.indexNumber;
    bigPicture.querySelector('.big-picture__img img').src = evt.target.src;
    bigPicture.querySelector('.likes-count').textContent = posts[pictureIndex].likes;
    bigPicture.querySelector('.comments-count').textContent = posts[pictureIndex].comments.length;
    bigPicture.querySelector('.social__caption').textContent = posts[pictureIndex].description;

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

  generateAllPosts();
  renderPictures();
  window.utils.addVisuallyHidden(socialCommentCounter);
  window.utils.addVisuallyHidden(socialLoadMore);
  // Показ большой фотографии по клику на превью
  var picturePreview = document.querySelectorAll('.picture__link');
  var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');

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

  for (var i = 0; i < picturePreview.length; i++) {
    picturePreview[i].addEventListener('click', openBigPictureHandler);
  }
  bigPictureClose.addEventListener('click', closeBigPictureHandler);
})();
