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
    }
  };
})();
