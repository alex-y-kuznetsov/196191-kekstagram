'use strict';

var MAX_POSTS = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENTS = 1;
var MAX_COMMENTS = 2;
var postTemplate = document.querySelector('#picture')
.content
.querySelector('.picture__link');
var similarListElement = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var commentsElement = document.querySelector('.social__comment');
var commentsContainer = document.querySelector('.social__comments');
var socialCommentCounter = document.querySelector('.social__comment-count');
var socialLoadMore = document.querySelector('.social__loadmore');

var sentences = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var descriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

//Utils
var getRandomFromArr = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    var generatedProperty = arr[Math.floor(Math.random() * (arr.length - 0)) + 0];
  }
  return generatedProperty;
};

var getRandomNumber = function (min, max) {
  var randomNumber = Math.floor(Math.random() * (max + 1 - min)) + min;
  return randomNumber;
};

var postComment = [];
var generateComment = function () {
  var randomTimes = getRandomNumber(MIN_COMMENTS, MAX_COMMENTS);
  for (var i = 0; i < randomTimes; i++) {
    postComment.push(sentences[getRandomNumber(0, sentences.length - 1)]);
  }
  return postComment;
};

var removeHidden = function (elem) {
  elem.classList.remove('hidden');
};

var addHidden = function (elem) {
  elem.classList.add('visually-hidden');
};

var getRandomAvatar = function () {
  return 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
};

//Создание массива постов
var posts = [];
var generateAllPosts = function () {
  for (var i = 0; i < MAX_POSTS; i++) {
    posts[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumber(MIN_LIKES, MAX_LIKES),
      comments: generateComment(),
      description: getRandomFromArr(descriptions)
    }
  }
};

//Отрисовка постов
var renderPictures = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < MAX_POSTS; i++) {
    var postElement = postTemplate.cloneNode(true);

    postElement.querySelector('.picture__img').src = posts[i].url;
    postElement.querySelector('.picture__stat--likes').textContent = posts[i].likes;
    postElement.querySelector('.picture__stat--comments').textContent = posts[i].comments.length;

    fragment.appendChild(postElement);
  };

  similarListElement.appendChild(fragment);
};

// Отрисовка поста Big Picture
var renderBigPicture = function () {
  bigPicture.querySelector('.big-picture__img img').src = posts[0].url;
  bigPicture.querySelector('.likes-count').textContent = posts[0].likes;
  bigPicture.querySelector('.comments-count').textContent - posts[0].comments.length;
  bigPicture.querySelector('.social__picture').src = getRandomAvatar();
  bigPicture.querySelector('.social__caption').textContent = posts[0].description;

  // Удаляем старые комментарии
  var commentsToRemove = commentsContainer.querySelectorAll('.social__comment');
  for (var i = 0; i < commentsToRemove.length; i++) {
    commentsContainer.removeChild(commentsToRemove[i]);
  }

  //Отображаем новые комментарии
  var randomTimes = getRandomNumber(MIN_COMMENTS, MAX_COMMENTS);
  for (var i = 0; i < randomTimes; i++) {
    var newComment = document.createElement('li');
    newComment.classList.add('social__comment');
    commentsContainer.appendChild(newComment);

    var newCommentImg = document.createElement('img');
    newCommentImg.classList.add('social__picture');
    newCommentImg.src = getRandomAvatar();
    newCommentImg.alt = 'Аватар комментатора фотографии';
    newCommentImg.width = '35';
    newCommentImg.height = '35';
    newComment.appendChild(newCommentImg);

    var newCommentText = document.createElement('p');
    newCommentText.classList.add('social__text');
    newCommentText.textContent = postComment[i];
    newComment.appendChild(newCommentText);
  }
};

generateAllPosts();
renderPictures();
removeHidden(bigPicture);
renderBigPicture();
addHidden(socialCommentCounter);
addHidden(socialLoadMore);
