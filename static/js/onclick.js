document.querySelector('#room-name-submit').onclick = function(e) {
    var roomName = document.querySelector('#room-name-input').value;
    window.location.pathname = '/' + roomName + '/';
};

