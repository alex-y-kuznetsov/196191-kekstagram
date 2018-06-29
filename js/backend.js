'use strict';

(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/kekstagram/data';
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';
  window.backend = {
    download: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.open('GET', DOWNLOAD_URL);

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Статус: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения')
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + (xhr.timeout / 1000) + 'секунд');
      });

      xhr.timeout = 10000;
      xhr.send();
    },
    upload: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            onLoad(xhr.response);
            break;
          case 400:
            onError('Пожалуйста, убедитесь, что загружаете изображение');
            break;
          default:
            onError('Статус:' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения')
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + (xhr.timeout / 1000) + 'секунд');
      });

      xhr.timeout = 5000;
      xhr.open('POST', UPLOAD_URL);
      xhr.send(data);
    }
  }
})();
