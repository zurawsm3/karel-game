var socketCanvas = new WebSocket("ws://192.168.0.101:9001/");

const speed = 0.6;
const range = 80;
const radius_robot = 40;
var ROBOT_X = 440;
var ROBOT_Y = 440;
var coordinates_of_gems = [];
const directions = ['n', 'e', 's', 'w'];
var index_of_directions = 0;
var direction = 'up';
var before_move_x = 0;
var before_move_y = 0;
const radius_treasure = 20;
const moves_needed= ["go", "get", "left", "right", "put"];


socketCanvas.onmessage = function (e) {
  draw_a_chessboard();
  if (moves_needed.includes(e.data)){
    evaluate_comm_py(e.data)
  } else if(e.data.split(" ")[0] === "SKARBY:"){
      coordinates_of_gems = evaluate_array(e.data.slice(8));
      for (var i = 0; i<coordinates_of_gems.length; i++){
          coordinates_of_gems[i] = ((range/2) + (range*(5 + coordinates_of_gems[i])))
      }
      draw_gems(coordinates_of_gems);
  } else if (e.data.split(" ")[0] === "KAREL:"){
      direction = e.data[9];
      var tab_robot = evaluate_array(e.data.slice(13));
      ROBOT_X = (range/2) + (range*(5 + tab_robot[0]));
      ROBOT_Y = (range/2) + (range*(5 + tab_robot[1]));
      before_move_x = ROBOT_X;
      before_move_y = ROBOT_Y;
      draw_robot();
  }
};



var canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');



function evaluate_comm_py(order) {
    if (order === "go"){
        go();
    } else if (order === "left"){
        left();
    } else if (order === "right"){
        right();
    } else if ((order === "get") || (order === "put")) {
        coordinates_gems();
    }
}


// USER ORDERS
function go() {
    if (direction === directions[0]) {
        go_up();
    } else if (direction === directions[1]) {
        go_right();
    } else if (direction === directions[2]) {
        go_down();
    }
    else {
        go_left();
    }
}

function right() {
    if (direction === directions[3]) {
        index_of_directions = 0;
        direction = directions[0];
    }
    else {
        index_of_directions += 1;
        direction = directions[index_of_directions];
    }
}

function left() {
    if (direction === 'n') {
        index_of_directions = 3;
        direction = directions[index_of_directions];
    }
    else {
        index_of_directions -= 1;
        direction = directions[index_of_directions];
    }
}

function coordinates_gems() {
    go_coordinates();
}



//REAL MOVES TO DRAW
function go_up(){
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    draw_a_chessboard();
    draw_gems(coordinates_of_gems);
    c.strokeStyle='blue';
    c.beginPath();
    c.arc(ROBOT_X, ROBOT_Y -= speed, radius_robot, 0, 2*Math.PI, false);
    c.stroke();
    if(ROBOT_Y > (before_move_y-range)){
        window.requestAnimationFrame(go_up);
    }else{
        before_move_y = ROBOT_Y;
    }
}

function go_down(){
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    draw_a_chessboard();
    draw_gems(coordinates_of_gems);
    c.strokeStyle='blue';
    c.beginPath();
    c.arc(ROBOT_X, ROBOT_Y += speed, radius_robot, 0, 2*Math.PI, false);
    c.stroke();
    if(ROBOT_Y < (before_move_y+range)){
        window.requestAnimationFrame(go_down);
    }else{
        before_move_y = ROBOT_Y;
    }
}

function go_right(){
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    draw_a_chessboard();
    draw_gems(coordinates_of_gems);
    c.strokeStyle='blue';
    c.beginPath();
    c.arc(ROBOT_X += speed, ROBOT_Y, radius_robot, 0, 2*Math.PI, false);
    c.stroke();
    if(ROBOT_X < (before_move_x + range)){
        window.requestAnimationFrame(go_right);
    }else{
        before_move_x = ROBOT_X;
    }
}

function go_left(){
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    draw_a_chessboard();
    draw_gems(coordinates_of_gems);
    c.beginPath();
    c.strokeStyle='blue';
    c.arc(ROBOT_X -= speed, ROBOT_Y, radius_robot, 0, 2*Math.PI, false);
    c.stroke();
    if(ROBOT_X > (before_move_x - range)){
        window.requestAnimationFrame(go_left);
    }else{
        before_move_x = ROBOT_X;
    }
}

function go_coordinates() {
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    draw_a_chessboard();
    draw_gems(coordinates_of_gems);
    draw_robot();
}



//FUNKCJE RYSUJACE

function draw_robot(){
    c.beginPath();
    c.arc(ROBOT_X, ROBOT_Y, radius_robot, 0, 2*Math.PI, false);
    c.lineWidth = 3;
    c.strokeStyle='blue';
    c.stroke();
    c.strokeStyle='black';
}

function draw_a_chessboard() {
    c.lineWidth = 1;
    c.strokeStyle='black';
    var a = 80;
    for (var x= 0; x<10; x++ ){
        c.beginPath();
        c.moveTo(80, a);
        c.lineTo(800, a);
        c.stroke();

        c.beginPath();
        c.moveTo(a, 80);
        c.lineTo(a, 800);
        c.stroke();
        a += 80;
    }
}

function draw_gems(tab){
    c.lineWidth = 3;
    for(var x=0; x<(tab.length-1); x+=2){
        c.beginPath();
        c.arc(tab[x], tab[x+1], radius_treasure, 0, 2*Math.PI, false); //przypomnij sobie o false
        c.stroke();
    }
}



//egzekwuje tablice
function evaluate_array(old_array) {
    const separators = ['[', ' ', ',', ']', '(', ')'];
    var word = '';
    var new_array = [];

    for (var i=0; i<old_array.length; i++){
    // ~ operator bitowy NOT. Gdy -1 to False, gdy inna to True
        if (~separators.indexOf(old_array[i])){
            if(word !== ''){
                new_array.push(parseInt(word));
            }
            word = '';
        } else{
            word += old_array[i]
        }
    }
    return new_array
}