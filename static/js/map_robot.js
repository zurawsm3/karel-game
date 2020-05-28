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
const commands = ["LEFT", "RIGHT", "GO", "PUT", "GET"]
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

// const moves_needed = ["go", "get", "left", "right"];


var canvas = document.getElementById("myCanvas");
canvas.width = 400;
canvas.height = 400;
var c = canvas.getContext('2d');

gameSocket.onopen = function (e) {
    draw_a_chessboard();
    // create_initial_gems_coordinates(center_fields);
    // draw_gems(gems_coordinates);
}


gameSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    const ROBOT_X = data.coordinate_robot[0];
    const ROBOT_Y = data.coordinate_robot[1];
    const gems = data.coordinate_gems;
    console.log(gems);
    window.wall = data.wall;
    console.log(window.wall);
    if (window.wall === false) {
        draw_robot(ROBOT_X, ROBOT_Y, RADIUS_ROBOT);
        draw_a_chessboard();
        draw_gems(gems);
        if (gems.length === 0) {
            console.log("weszlo");
            document.querySelector('.read-panel').value += ("Do You want play again?" + '\n');
            document.getElementById('title').innerHTML = "Congratulations! You won :)";
        }
    } else {
        document.querySelector('.read-panel').value += ("You hit a WALL" + '\n');
        document.getElementById('title').innerHTML = "You hit the wall :(";

    }

}

gameSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('.codesubmit').onclick = function (e) {
    document.getElementById('code_submit').innerHTML = "Play again";
    document.getElementById('code_submit').onclick = backToMainPage;
    document.querySelector('#input-panel').readOnly = true;
    console.log(window.wall + "jest false?")


    const messageInputDom = document.querySelector('#input-panel');
    var message_oryginal = messageInputDom.value;
    var message = message_oryginal.replace(/[\r\n]/g, ' ');
    message = message.toUpperCase();
    message = message.split(' ');

    function sleep_more(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function send_click() {

        for (let i = 0; i < message.length; i++) {
            document.querySelector('#input-panel').value = message_oryginal;
            document.getElementById('input-panel').innerHTML = "Invalid command";
            if (!commands.includes(message[i])) {
                document.querySelector('.read-panel').value += (message[i] + '\n' + "Invalid command. Try again" + '\n');
                document.getElementById('title').innerHTML = "Invalid command";
                document.querySelector('#input-panel').readOnly = true;
                console.log(message_oryginal + "OOOO");
                // document.getElementById("input-panel").value = message_oryginal;
                document.getElementById("input-panel").placeholder = "Try next time";
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

                        await sleep(400);
                        console.log(message[i] + "OOO");
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
                if (window.wall ===true) {
                    document.querySelector('#input-panel').readOnly = true;
                    break;
                }
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


function backToMainPage() {
    window.location.pathname = '/';

}