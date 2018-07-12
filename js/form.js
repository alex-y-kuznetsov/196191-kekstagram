'use strict';

(function () {
  var SCALE_WIDTH = 453;
  var uploadPicture = document.querySelector('#upload-file');
  var pictureEditor = document.querySelector('.img-upload__overlay');
  var pictureEditorClose = document.querySelector('.img-upload__cancel');
  var sizeValue = pictureEditor.querySelector('.resize__control--value');

  var openPictureEditorHandler = function () {
    window.utils.addHidden(effectsScale);
    sizeValue.value = '100%';
    window.utils.removeHidden(pictureEditor);
    resetScale();
    document.addEventListener('keydown', escPictureEditorHandler);
    window.utils.resetFormValidity(hashtagInput);
    window.utils.resetChecked(pictureEditor);
  };

  var closePictureEditorHandler = function () {
    window.utils.addHidden(pictureEditor);
    pictureEditorClose.removeEventListener('keydown', escPictureEditorHandler);
    uploadPicture.value = '';
  };

  var escPictureEditorHandler = function (evt) {
    if (window.utils.isEscKey(evt) && !evt.target.classList.contains('text__hashtags') && !evt.target.classList.contains('text__description')) {
      window.utils.addHidden(pictureEditor);
    }
  };

  uploadPicture.addEventListener('change', openPictureEditorHandler);
  pictureEditorClose.addEventListener('click', closePictureEditorHandler);

  // Работа с превью
  var sizeMinus = pictureEditor.querySelector('.resize__control--minus');
  var sizePlus = pictureEditor.querySelector('.resize__control--plus');
  var uploadPreview = pictureEditor.querySelector('.img-upload__preview');
  var previewImage = pictureEditor.querySelector('.img-upload__preview > img');
  var previewFiltersImage = pictureEditor.querySelectorAll('.effects__preview');

  // Изменение размера превью
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

  // Загрузка превью
  var pictureUploadHandler = function () {
    pictureScale = 1;
    uploadPreview.style = 'transform: scale(1)';
    var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
    var file = uploadPicture.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        previewImage.src = reader.result;
        for (var l = 0; l < previewFiltersImage.length; l++) {
          previewFiltersImage[l].style.backgroundImage = 'url(' + previewImage.src + ')';
        }
      });
      reader.readAsDataURL(file);
    } else {
      window.utils.addHidden(pictureEditor);
      window.utils.createErrorMessage('Неверный формат файла');
    }
  };
  uploadPicture.addEventListener('change', pictureUploadHandler);

  // Наложение эффекта на изображение
  var pictureEffectsContainer = pictureEditor.querySelector('.img-upload__effects');

  var pictureFilterHandler = function (evt) {
    if (evt.target.value) {
      if (evt.target.value === 'none') {
        effectsScale.classList.add('hidden');
      } else {
        effectsScale.classList.remove('hidden');
      }
      resetScale();
      previewImage.style.filter = '';
      previewImage.className = 'effects__preview--' + evt.target.value;
    }
  };
  pictureEffectsContainer.addEventListener('click', pictureFilterHandler);

  // Определение глубины эффекта
  var effectsScale = pictureEditor.querySelector('.img-upload__scale');
  var scalePin = pictureEditor.querySelector('.scale__pin');
  var scaleLine = pictureEditor.querySelector('.scale__line');
  var scaleLevel = pictureEditor.querySelector('.scale__level');
  var scaleValue = pictureEditor.querySelector('.scale__value');

  var resetScale = function () {
    previewImage.className = '';
    scalePin.style.left = SCALE_WIDTH + 'px';
    scaleLevel.style.width = SCALE_WIDTH + 'px';
  };

  // Определение глубины эффекта
  var getScaleProportions = function (input) {
    var scaleProportions = {
      'effects__preview--none': '',
      'effects__preview--chrome': 'grayscale(' + 1 / SCALE_WIDTH * input.value + ')',
      'effects__preview--sepia': 'sepia(' + 1 / SCALE_WIDTH * input.value + ')',
      'effects__preview--marvin': 'invert(' + 100 * input.value / SCALE_WIDTH + '%)',
      'effects__preview--phobos': 'blur(' + 3 / SCALE_WIDTH * input.value + 'px)',
      'effects__preview--heat': 'brightness(' + ((2 / SCALE_WIDTH * input.value) + 1) + ')'
    };
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
      scaleValue.value = Math.round(scalePinLeft);
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
    if (!hashtagInput.value) {
      return;
    }
    var hashtagsArr = hashtagInput.value.split(' ');
    for (var i = 0; i < hashtagsArr.length; i++) {
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

  var successHandler = function () {
    window.utils.addHidden(pictureEditor);
    uploadPicture.value = '';
    hashtagInput.value = '';
    commentInput.value = '';
  };
  var errorHandler = function () {
    window.utils.createUploadErrorMessage();
  };

  var postSubmitHandler = function (evt) {
    evt.preventDefault();
    validateHashtags();
    if (!postForm.checkValidity()) {
      postForm.reportValidity();
    } else {
      window.backend.upload(new FormData(postForm), successHandler, errorHandler);
    }
  };
  var hashtagChangeHandler = function () {
    window.utils.resetFormValidity(hashtagInput);
  };

  hashtagInput.addEventListener('change', hashtagChangeHandler);
  postForm.addEventListener('submit', postSubmitHandler);
})();
