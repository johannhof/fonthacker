exports.get = function(url, cb){
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onreadystatechange = function () {
      if(request.readyState === 4){
        cb(request.responseText);
      }
    };
};
