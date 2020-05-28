console.log(document.querySelector('#room-name-input').value);
// var inputvalue = "";
var input = document.querySelector('#room-name-input');
input.addEventListener("keyup", function (event) {
    if (document.querySelector('#room-name-input').value !== "") {
        console.log("wchodzi");
        window.inputvalue = document.querySelector('#room-name-input').value;
        console.log(typeof window.inputvalue);
    }
    console.log(window.inputvalue + "ll");
    if (event.keyCode == 13) {
        var nowa = window.inputvalue;
        console.log(nowa + "  dziala?");
        console.log(window.inputvalue);
        console.log(document.getElementById("room-name-submit"));
        document.getElementById("room-name-submit").click();
    }
});