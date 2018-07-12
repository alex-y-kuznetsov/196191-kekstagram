'use strict';

(function () {
  var ERROR_DELAY = 5000;
  var DEBOUNCE_DELAY = 500;
  window.utils = {
    isEscKey: function (evt) {
      var ESC_KEY = 27;
      return evt.keyCode === ESC_KEY;
    },
    getRandomFromArr: function (arr) {
      return arr[Math.floor(Math.random() * (arr.length - 0)) + 0];
    },
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    },
    removeHidden: function (elem) {
      elem.classList.remove('hidden');
    },
    addHidden: function (elem) {
      elem.classList.add('hidden');
    },
    addVisuallyHidden: function (elem) {
      elem.classList.add('visually-hidden');
    },
    resetChecked: function (elem) {
      if (elem.querySelector('input[checked]')) {
        elem.querySelector('input[checked]').removeAttribute('checked');
        elem.querySelector('#effect-none').setAttribute('checked', 'checked');
      }
    },
    createErrorMessage: function (errorMessage) {
      var node = document.createElement('div');
      node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '30px';
      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
      window.setTimeout(function () {
        node.remove();
      }, ERROR_DELAY);
    },
    createUploadErrorMessage: function () {
      var errorTemplate = document.querySelector('#picture').content.querySelector('.img-upload__message--error');
      var errorElement = errorTemplate.cloneNode(true);
      document.body.appendChild(errorElement);
      window.utils.removeHidden(errorElement);
      errorElement.style.zIndex = '10';
      window.setTimeout(function () {
        window.utils.addHidden(errorElement);
      }, ERROR_DELAY);
    },
    resetFormValidity: function (form) {
      form.setCustomValidity('');
      form.style.outline = 'none';
    },
    getNewPosts: function (data, quantity) {
      var temporary = data.slice();
      temporary.forEach(function (element, i, arr) {
        var j = window.utils.getRandomNumber(0, i);
        arr[i] = arr[j];
        arr[j] = element;
      });
      return temporary.slice(0, quantity);
    },
    getDiscussedPosts: function (data) {
      var temporary = data.slice();
      temporary.sort(function (left, right) {
        return right.comments.length - left.comments.length;
      });
      return temporary;
    },
    debounce: function (fun) {
      var lastTimeout = null;
      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          fun.apply(null, args);
        }, DEBOUNCE_DELAY);
      };
    }
  };
})();
