document.querySelector('#room-name-submit').onclick = function(e) {
    console.log(window.inputvalue + "kkk");
    var roomName = document.querySelector('#room-name-input').value;
    window.location.pathname = '/game/' + roomName + '/';
};