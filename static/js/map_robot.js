const roomName = JSON.parse(document.getElementById('room-name').textContent);
const gameSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/game/'
    + roomName
    + '/'
);
const speed = 0.6;
const range = 80;
const commands = ["LEFT", "RIGHT", "GO", "PUT"]
const BOARD_FIELD_SIZE = 10;
const SIZE_FIELD = 40;
const RADIUS_ROBOT = SIZE_FIELD / 2;
const RADIUS_TREASURE = SIZE_FIELD / 4;
const NUMBER_OF_GEMS = 10;
var center_fields = []
for (var i = 0; i < BOARD_FIELD_SIZE; i++) {
    center_fields[i] = (SIZE_FIELD / 2) + (i * SIZE_FIELD)
}
var gems_coordinates = []
var coordinates_of_gems = [];
const directions = ['n', 'e', 's', 'w'];
var index_of_directions = 0;
var direction = 'up';
var before_move_x = 0;
var before_move_y = 0;

const moves_needed = ["go", "get", "left", "right", "put"];


var canvas = document.getElementById("myCanvas");
canvas.width = 400;
canvas.height = 400;
var c = canvas.getContext('2d');

gameSocket.onopen = function (e) {
    draw_a_chessboard();
    create_initial_gems_coordinates(center_fields);
    draw_gems(gems_coordinates);
}


gameSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    const ROBOT_X = data.coordinate[0];
    const ROBOT_Y = data.coordinate[1];
    window.wall = data.wall;
    console.log(window.wall);
    if (window.wall === false) {
        draw_robot(ROBOT_X, ROBOT_Y, RADIUS_ROBOT);
        draw_a_chessboard();
    } else {
                    if (window.wall === true) {
                console.log("e")
                document.querySelector('.read-panel').value += ("UPSdddaadd, WALL" + '\n');
            }
        document.getElementById('title').innerHTML = "You hit the wall :(";
    }

}

gameSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('.codesubmit').onclick = function (e) {
    document.querySelector('#input-panel').readOnly = true;
    console.log(window.wall + "jest false?")


    const messageInputDom = document.querySelector('#input-panel');
    var message_oryginal = messageInputDom.value;
    var message = message_oryginal.replace(/[\r\n]/g, ' ');
    message = message.toUpperCase();
    message = message.split(' ');

    for (let i = 0; i < message.length; i++) {
        if (!commands.includes(message[i])) {
            if (message[i] === "") {
                console.log("You gived wrong command");
            }
            message.splice(i, 1)
        }
    }

    function sleep_more(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function send_click() {

        for (let i = 0; i < message.length; i++) {
                        if (window.wall === true) {
                break;
            }
            document.querySelector('.read-panel').value += (message[i] + '\n');
            if (message[i] === "GO") {
                function sleep(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

                async function go() {

                    for (var z = 0; z < 10; z++) {
                        document.querySelector('#input-panel').value = message_oryginal;
                        // console.log(document.querySelector('#input-panel').value);
                        await sleep(400);

                        gameSocket.send(
                            JSON.stringify({
                                    'message': message[i]
                                }
                            )
                        );
                    }
                }

                go();
                await sleep_more(4500)
                            console.log(window.wall);

            } else {
                gameSocket.send(
                    JSON.stringify({
                        'message': message[i]
                    })
                );
            }
        }
    }

    send_click()
    messageInputDom.value = '';
};


//CREATE GEMS COORDINATES
function create_initial_gems_coordinates(center_of_fields) {
    for (var i = 0; i < NUMBER_OF_GEMS; i++) {
        x = center_of_fields[Math.floor(Math.random() * center_of_fields.length)];
        y = center_of_fields[Math.floor(Math.random() * center_of_fields.length)];
        while (check_if_tab_is_in_list([x, y], gems_coordinates)) {
            x = center_of_fields[Math.floor(Math.random() * center_of_fields.length)];
            y = center_of_fields[Math.floor(Math.random() * center_of_fields.length)];
        }
        gems_coordinates[i] = [x, y]
    }
}

function check_if_tab_is_in_list(small_tab, big_tab) {
    // console.log(big_tab)
    for (var x = 0; x < (big_tab.length - 1); x++) {
        if (JSON.stringify(big_tab[x]) === JSON.stringify(small_tab)) {
            return true
        }
    }
    return false
}