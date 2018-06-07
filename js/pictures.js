'use strict';

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

// var getUniqueNumbers = function () {
//   var uniqueNumbers = [];
//   var uniqueNumber = 0;
//   while (uniqueNumbers.length <= 25) {
//     uniqueNumber = Math.floor(Math.random() * 25);
//     if (uniqueNumbers.indexOf(uniqueNumber) == -1) {
//       uniqueNumbers.push(uniqueNumber);
//     }
//   }
//   console.log(uniqueNumbers);
//   return uniqueNumbers;
// };

var getUniqueUrls = function () {
  var uniqueUrls = [];
  for (var i = 0; i < 25; i++) {
    var newUrl = 'photos/' + getRandomNumber(1, 25) + '.jpg';
    if (uniqueUrls.indexOf(newUrl) == -1) {
      uniqueUrls[i] = newUrl;
    }
  }
  console.log(uniqueUrls);
  return uniqueUrls;
};

getUniqueUrls();

// var generatePost = function () {
//   var post = {
//     url: ,
//     likes: ,
//     comments: ,
//     description:
//   }
// };
