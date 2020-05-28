function draw_a_chessboard() {
    c.lineWidth = 1;
    c.strokeStyle = 'red';
    for (let x = 0; x <= BOARD_FIELD_SIZE; x++) {
        c.beginPath();
        c.moveTo(0, x * SIZE_FIELD)
        c.lineTo(BOARD_FIELD_SIZE * SIZE_FIELD, x * SIZE_FIELD);
        c.stroke();
        c.beginPath();
        c.moveTo(x * SIZE_FIELD, 0);
        c.lineTo(x * SIZE_FIELD, SIZE_FIELD * BOARD_FIELD_SIZE);
        c.stroke();
    }
}

function draw_robot(x, y, radius) {
    c.clearRect(0, 0, BOARD_FIELD_SIZE * SIZE_FIELD, BOARD_FIELD_SIZE * SIZE_FIELD);
    c.beginPath();
    c.arc(x, y, radius, 0, 2 * Math.PI, false);
    c.lineWidth = 3;
    c.strokeStyle = 'red';
    c.stroke();
}

function draw_gems(tab) {

    c.lineWidth = 3;
    c.strokeStyle = "#b1023c";
    for (var x = 0; x < (tab.length); x++) {
        c.beginPath();
        c.arc(tab[x][0], tab[x][1], RADIUS_TREASURE, 0, 2 * Math.PI, false); //przypomnij sobie o false
        c.stroke();
    }
}