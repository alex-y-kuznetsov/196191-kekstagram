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
    },
    getNewPosts: function (data, quantity) {
      var temporary = data.slice();
      temporary.forEach(function (element, i, arr) {
        var j = window.utils.getRandomNumber(0, i);
        arr[i] = arr[j];
        arr[j] = element;
      });
      return temporary;
    },
    getDiscussedPosts: function (data) {
      var temporary = data.slice();
      temporary.sort(function (left, right) {
        return right.comments.length - left.comments.length;
      })
      return temporary;
    }
  };
})();
