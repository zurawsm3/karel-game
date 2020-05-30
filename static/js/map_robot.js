const ROOMNAME = JSON.parse(document.getElementById('room-name').textContent);
const GAMESOCKET = new WebSocket('ws://' + window.location.host + '/ws/game/' + ROOMNAME + '/');
const COMMANDS = ["LEFT", "RIGHT", "GO", "PUT", "GET"]
const BOARD_FIELD_SIZE = 10;
const SIZE_FIELD = 40;
const RADIUS_ROBOT = SIZE_FIELD / 2;
const RADIUS_TREASURE = SIZE_FIELD / 4;

GAMESOCKET.onmessage = function (e) {
    const data = JSON.parse(e.data);
    const ROBOT_X = data.coordinate_robot[0];
    const ROBOT_Y = data.coordinate_robot[1];
    const gems = data.coordinate_gems;
    const end_radius_x = data.end_radius[0];
    const end_radius_y = data.end_radius[1];
    window.wall = data.wall;
    if (window.wall === false) {
        draw_robot(ROBOT_X, ROBOT_Y, RADIUS_ROBOT, end_radius_x, end_radius_y);
        draw_a_chessboard();
        draw_gems(gems);
        if (gems.length === 0) {
            document.querySelector('.read-panel').value += ("Do You want play again?" + '\n');
            document.getElementById('title').innerHTML = "Great! Map is clear :)";
        }
    } else {
        document.querySelector('.read-panel').value += ("Do You want play again?" + '\n');
        document.getElementById('title').innerHTML = "You hit the wall :(";
    }
}

GAMESOCKET.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('.codesubmit').onclick = function (e) {
    document.getElementById('code-submit').innerHTML = "Play again";
    document.getElementById('code-submit').onclick = backToMainPage;
    document.querySelector('#input-panel').readOnly = true;

    const messageInputDom = document.querySelector('#input-panel');
    const message_original = messageInputDom.value;
    const message_filtered = preparedInput(message_original)

    send_click(message_filtered, message_original);
};

function backToMainPage() {
    window.location.pathname = '/';

}

function preparedInput(message_str) {
    let message = message_str.replace(/[\r\n]/g, ' ');
    message = message.toUpperCase();
    message = message.split(' ');
    let message_filtered = [];
    for (let i = 0; i < message.length; i++) {
        if (!(message[i] === "")) {
            message_filtered.push(message[i])
        }
    }
    return message_filtered
}

function sleep_more(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function send_click(message, message_original) {
    for (let i = 0; i < message.length; i++) {
        document.querySelector('#input-panel').value = message_original;
        if (!COMMANDS.includes(message[i])) {
            document.querySelector('.read-panel').value += (message[i]
                + '\n' + "Invalid command. Try again" + '\n');
            document.getElementById('title').innerHTML = "Invalid command";
            break;
        }
        document.querySelector('.read-panel').value += (message[i] + '\n');
        if (message[i] === "GO") {
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            async function go() {
                for (let z = 0; z < 10; z++) {
                    await sleep(400);
                    GAMESOCKET.send(JSON.stringify({'message': message[i]}));
                }
            }
            go();
            await sleep_more(4500)
            if (window.wall === true) {
                break;
            }
        } else {
            GAMESOCKET.send(JSON.stringify({'message': message[i]}));
        }
    }
}


