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