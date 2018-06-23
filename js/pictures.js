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
var renderBigPicture = function (evt) {
  removeHidden(bigPicture);
  bigPicture.querySelector('.big-picture__img img').src = evt.target.src;
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
addVisuallyHidden(socialCommentCounter);
addVisuallyHidden(socialLoadMore);

// Показ большой фотографии по клику на превью
var picturePreview = document.querySelectorAll('.picture__link');
var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');

var openBigPictureHandler = function (evt) {
  evt.preventDefault();
  renderBigPicture(evt);
  document.addEventListener('keydown', escBigPictureHandler);
};

var closeBigPictureHandler = function () {
  addHidden(bigPicture);
  bigPictureClose.removeEventListener('keydown', escPictureEditorHandler);
  uploadPicture.innerHtml = '';
};

var escBigPictureHandler = function (evt) {
  if (evt.keyCode === ESC_KEY) {
    addHidden(bigPicture);
  }
};

for (var i = 0; i < picturePreview.length; i++) {
  picturePreview[i].addEventListener('click', openBigPictureHandler);
}
bigPictureClose.addEventListener('click', closeBigPictureHandler);

// Загрузка изображения и показ формы редактирования
var ESC_KEY = 27;
var uploadPicture = document.querySelector('#upload-file');
var pictureEditor = document.querySelector('.img-upload__overlay');
var pictureEditorClose = document.querySelector('.img-upload__cancel');
var sizeValue = pictureEditor.querySelector('.resize__control--value');

var openPictureEditorHandler = function () {
  sizeValue.value = '100%';
  removeHidden(pictureEditor);
  resetScale();
  document.addEventListener('keydown', escPictureEditorHandler);
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
var pictureEffectsContainer = pictureEditor.querySelector('.img-upload__effects');

var pictureFilterHandler = function (evt) {
  if (evt.target.value) {
    resetScale();
    previewImage.className = 'effects__preview--' + evt.target.value;
  }
};

pictureEffectsContainer.addEventListener('click', pictureFilterHandler);

// Определение глубины эффекта
var SCALE_WIDTH = 453;
var effectsScale = pictureEditor.querySelector('.img-upload__scale');
var scalePin = pictureEditor.querySelector('.scale__pin');
var scaleLine = pictureEditor.querySelector('.scale__line');
var scaleLevel = pictureEditor.querySelector('.scale__level');
var scaleValue = pictureEditor.querySelector('.scale__value');

var resetScale = function () {
  if (previewImage.className === 'effects__preview--none' || !previewImage.className) {
    effectsScale.classList.add('hidden');
  } else {
    effectsScale.classList.remove('hidden');
  }
  previewImage.className = '';
  applyFilterDepth();
  scalePin.style.left = SCALE_WIDTH + 'px';
  scaleLevel.style.width = SCALE_WIDTH + 'px';
};

// Определение глубины эффекта
var getScaleProportions = function (input) {
  var scaleProportions = {
    'effects__preview--none': 'none',
    'effects__preview--chrome': 'grayscale(' + 1 / SCALE_WIDTH * input.value + ')',
    'effects__preview--sepia': 'sepia(' + 1 / SCALE_WIDTH * input.value + ')',
    'effects__preview--marvin': 'invert(' + 100 * input.value / SCALE_WIDTH + '%)',
    'effects__preview--phobos': 'blur(' + 3 / SCALE_WIDTH * input.value + 'px)',
    'effects__preview--heat': 'brightness(' + ((2 / SCALE_WIDTH * input.value) + 1) +')'
  }
  return scaleProportions;
};

var applyFilterDepth = function () {
  var currentFilter = previewImage.className;
  var result = getScaleProportions(scaleValue);
  previewImage.style.filter = result[currentFilter];
};

// Перемещение пина
var pinMouseDownHandler = function (evt) {
  evt.preventDefault();
  var startX = evt.clientX;

  var pinMouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();
    var shift = startX - moveEvt.clientX;
    var scaleLineLeftOffset = scaleLine.getBoundingClientRect().left;
    var scalePinLeft = startX - shift - scaleLineLeftOffset;

    if (scalePinLeft < 0 || scalePinLeft > SCALE_WIDTH) {
      return;
    }
      scalePin.style.left = scalePinLeft + 'px';
      scaleLevel.style.width = scalePinLeft + 'px';

      // Apply effect here
      scaleValue.value = parseFloat(scalePin.style.left);
      applyFilterDepth();
  };

  var pinMouseUpHandler = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', pinMouseMoveHandler);
    document.removeEventListener('mouseup', pinMouseUpHandler);
  };

  document.addEventListener('mousemove', pinMouseMoveHandler);
  document.addEventListener('mouseup', pinMouseUpHandler);
};

scalePin.addEventListener('mousedown', pinMouseDownHandler);

// Валидация
var hashtagInput = pictureEditor.querySelector('.text__hashtags');
var commentInput = pictureEditor.querySelector('.text__description');
var postForm = document.querySelector('.img-upload__form');

// Валидация комментов
commentInput.addEventListener('invalid', function () {
  if (commentInput.validity.tooLong) {
    commentInput.setCustomValidity('Максимальное число знаков 140');
  } else {
    commentInput.setCustomValidity('');
  }
});

// Валидация хэштегов
var validateHashtags = function () {
  var hashtagsArr = hashtagInput.value.split(' ');
  for (i = 0; i < hashtagsArr.length; i++) {
    if (hashtagsArr[i].charAt(0) !== '#') {
      hashtagInput.setCustomValidity('Хэштег должен начинаться с символа #');
    } else if (hashtagsArr[i].length === 1) {
      hashtagInput.setCustomValidity('Хэштег не может быть пустым');
    } else if (hashtagsArr[i].length > 20) {
      hashtagInput.setCustomValidity('Длина хэштега не должна превышать 20 символов');
    } else if (hashtagsArr.length > 5) {
      hashtagInput.setCustomValidity('Нельзя использовать более 5 хэштегов');
    } else {
      hashtagInput.setCustomValidity('');
    }
    for (var j = 0; j < hashtagsArr.length - 1; j++) {
      for (var k = j + 1; k < hashtagsArr.length; k++) {
        if (hashtagsArr[j].toLowerCase() === hashtagsArr[k].toLowerCase()) {
          hashtagInput.setCustomValidity('Нельзя использовать один хэштег несколько раз');
        }
      }
    }
  }
  if (!hashtagInput.validity.valid) {
    hashtagInput.style.outline = '2px solid red';
  }
};

var postSubmitHandler = function (evt) {
  validateHashtags();
  if (!postForm.checkValidity()) {
    evt.preventDefault();
    postForm.reportValidity();
  }
};
var hashtagChangeHandler = function () {
  hashtagInput.setCustomValidity('');
  hashtagInput.style.outline = 'none';
};

hashtagInput.addEventListener('change', hashtagChangeHandler);
postForm.addEventListener('submit', postSubmitHandler);
