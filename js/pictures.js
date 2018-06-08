'use strict';

var MAX_POSTS = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENTS = 1;
var MAX_COMMENTS = 2;

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

var generateComment = function () {
  var randomTimes = getRandomNumber(MIN_COMMENTS, MAX_COMMENTS);
  var comment ='';
  for (var i = 0; i < randomTimes; i++) {
    comment = comment + ' ' + getRandomFromArr(sentences);
  }
  return comment;
};

var uniqueUrls = [];
var getUniqueUrls = function () {
  for (var i = 0; uniqueUrls.length < MAX_POSTS; i++) {
    var newUrl = 'photos/' + getRandomNumber(1, MAX_POSTS) + '.jpg';
    if (uniqueUrls.indexOf(newUrl) == -1) {
      uniqueUrls.push(newUrl);
    }
  }
  return uniqueUrls;
};

var generatePost = function () {
  getUniqueUrls();
  for (var i = 0; i < uniqueUrls.length; i++) {
    var post = {
      url: uniqueUrls[i],
      likes: getRandomNumber(MIN_LIKES, MAX_LIKES),
      comments: generateComment(),
      description: getRandomFromArr(descriptions)
    }
  }
  // console.log(post);
  return post;
};
// generatePost(); На этом этапе все нормально - генерится случайный пост со случайным УРЛ

var posts = [];
var generateAllPosts = function () {
  for (var i = 0; i < MAX_POSTS; i++) {
    posts.push(generatePost())
  }
};

generateAllPosts(); // Тут все ломается и генерится один и тот же УРЛ во всех постах.
console.log(posts);
