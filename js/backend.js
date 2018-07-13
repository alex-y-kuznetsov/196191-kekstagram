'use strict';

(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/kekstagram/data';
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';

  var createXHR = function (onLoad, onError, method, url, data) {
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
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + (xhr.timeout / 1000) + 'секунд');
    });

    xhr.timeout = 10000;
    xhr.open(method, url);
    xhr.send(data);
    return xhr;
  };

  window.backend = {
    download: function (onLoad, onError) {
      createXHR(onLoad, onError, 'GET', DOWNLOAD_URL);
    },
    upload: function (data, onLoad, onError) {
      createXHR(onLoad, onError, 'POST', UPLOAD_URL, data);
    }
  };
})();
