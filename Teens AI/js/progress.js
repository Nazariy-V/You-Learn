const canvas = $("#progress");
const ctx = canvas[0].getContext("2d");
canvas[0].width = 200;
canvas[0].height = 700;

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#979797";
    ctx.fillRect(100, 100, 60, 900);
};

setInterval(update, 40);