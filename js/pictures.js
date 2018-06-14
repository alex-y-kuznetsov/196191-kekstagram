'use strict';

var MAX_POSTS = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENTS = 1;
var MAX_COMMENTS = 2;
var postTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
var similarListElement = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
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

// Utils
var getRandomFromArr = function (arr) {
  return arr[Math.floor(Math.random() * (arr.length - 0)) + 0];
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
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
  elem.classList.add('hidden');
};

var addVisuallyHidden = function (elem) {
  elem.classList.add('visually-hidden');
};

var getRandomAvatar = function () {
  return 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
};

// Создание массива постов
var posts = [];
var generateAllPosts = function () {
  for (var i = 0; i < MAX_POSTS; i++) {
    posts[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumber(MIN_LIKES, MAX_LIKES),
      comments: generateComment(),
      description: getRandomFromArr(descriptions)
    };
  }
};

// Отрисовка постов
var renderPictures = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < MAX_POSTS; i++) {
    var postElement = postTemplate.cloneNode(true);

    postElement.querySelector('.picture__img').src = posts[i].url;
    postElement.querySelector('.picture__stat--likes').textContent = posts[i].likes;
    postElement.querySelector('.picture__stat--comments').textContent = posts[i].comments.length;

    fragment.appendChild(postElement);
  }

  similarListElement.appendChild(fragment);
};

// Отрисовка поста Big Picture
var renderBigPicture = function () {
  bigPicture.querySelector('.big-picture__img img').src = posts[0].url;
  bigPicture.querySelector('.likes-count').textContent = posts[0].likes;
  bigPicture.querySelector('.comments-count').textContent = posts[0].comments.length;
  bigPicture.querySelector('.social__caption').textContent = posts[0].description;

  // Удаляем старые комментарии
  var commentsToRemove = commentsContainer.querySelectorAll('.social__comment');
  commentsToRemove.forEach(function (comment) {
    commentsContainer.removeChild(comment);
  });

  // Отображаем новые комментарии
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
// removeHidden(bigPicture);
renderBigPicture();
addVisuallyHidden(socialCommentCounter);
addVisuallyHidden(socialLoadMore);

// Загрузка изображения и показ формы редактирования
var ESC_KEY = 27;
var ENTER_KEY = 13;
var uploadPicture = document.querySelector('#upload-file');
var pictureEditor = document.querySelector('.img-upload__overlay');
var pictureEditorClose = document.querySelector('.img-upload__cancel');
var sizeValue = pictureEditor.querySelector('.resize__control--value');

var openPictureEditorHandler = function () {
  sizeValue.value = '100%';
  removeHidden(pictureEditor);
  document.addEventListener('keydown', escPictureEditorHandler)
};

var closePictureEditorHandler = function () {
  addHidden(pictureEditor);
  pictureEditorClose.removeEventListener('keydown', escPictureEditorHandler);
  uploadPicture.innerHtml = '';
};

var escPictureEditorHandler = function (evt) {
  if (evt.keyCode === ESC_KEY && !evt.target.classList.contains('text__hashtags') && !evt.target.classList.contains('text__description')) {
    addHidden(pictureEditor);
  }
};

uploadPicture.addEventListener('change', openPictureEditorHandler);
pictureEditorClose.addEventListener('click', closePictureEditorHandler);

// Изменение размера изображения
var scalePin = pictureEditor.querySelector('.scale__pin');
var sizeMinus = pictureEditor.querySelector('.resize__control--minus');
var sizePlus = pictureEditor.querySelector('.resize__control--plus');
var uploadPreview = pictureEditor.querySelector('.img-upload__preview');
var previewImage = pictureEditor.querySelector('.img-upload__preview > img');

var pictureScale = 1;
var sizeMinusHandler = function () {
  if (pictureScale > 0.25) {
    sizeValue.value = ((+(sizeValue.value.slice(0, -1)) - 25).toString() + '%');
    uploadPreview.style = 'transform:scale(' + (pictureScale - 0.25) + ')';
    pictureScale -= 0.25;
  }
};
var sizePlusHandler = function () {
  if (pictureScale < 1) {
    sizeValue.value = ((+(sizeValue.value.slice(0, -1)) + 25).toString() + '%');
    uploadPreview.style = 'transform:scale(' + (pictureScale + 0.25) + ')';
    pictureScale += 0.25;
  }
};

sizeMinus.addEventListener('click', sizeMinusHandler);
sizePlus.addEventListener('click', sizePlusHandler);

// Наложение эффекта на изображение
var pictuteEffectModes = pictureEditor.querySelectorAll('.effects__radio');

var pictureFilterHandler = function (evt) {
  switch(evt.target.id) {
    case 'effect-chrome':
      previewImage.classList = '';
      previewImage.classList.add('effects__preview--chrome');
      break;
    case 'effect-sepia':
      previewImage.classList = '';
      previewImage.classList.add('effects__preview--sepia');
      break;
    case 'effect-marvin':
      previewImage.classList = '';
      previewImage.classList.add('effects__preview--marvin');
      break;
    case 'effect-phobos':
      previewImage.classList = '';
      previewImage.classList.add('effects__preview--phobos');
      break;
    case 'effect-heat':
      previewImage.classList = '';
      previewImage.classList.add('effects__preview--heat');
      break;
    default:
      previewImage.classList = '';
  }
};

for (var i = 0; i < pictuteEffectModes.length; i++) {
  pictuteEffectModes[i].addEventListener('click', pictureFilterHandler);
};

// Определение глубины эффекта
var scalePin = pictureEditor.querySelector('.scale__pin');

var filterDepthHandler = function (evt) { // ??
  var scalePinStartX = 456;
  var scalePinEndX = evt.x;
  var scalePinPath;
  if (scalePinEndX > scalePinStartX) {
    scalePinPath = scalePinEndX + scalePinStartX;
  } else if (scalePinEndX < scalePinStartX) {
    scalePinPath = scalePinEndX - scalePinStartX;
  } else {
    scalePinPath = 0;
  }
};

scalePin.addEventListener('mouseup', filterDepthHandler);

// Валидация
var hashtagInput = pictureEditor.querySelector('.text__hashtags');
var commentInput = pictureEditor.querySelector('.text__description');

commentInput.addEventListener('invalid', function () {
  if (commentInput.validity.tooLong) {
    commentInput.setCustomValidity('Максимальное число знаков 140');
  } else {
    commentInput.setCustomValidity('');
  }
});

console.log(hashtagInput.validity);
