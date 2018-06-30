'use strict';

(function () {
  window.utils = {
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
    createErrorMessage: function (errorMessage) {
      var node = document.createElement('div');
      node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '30px';
      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
    }
  };
})();
