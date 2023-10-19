const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";
let isPainting = false;
let isFilling = false;

function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.beginPath(); // Add this line to begin a new path
  ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
  isPainting = true;
}

function cancelPainting() {
  isPainting = false;
  //ctx.fill(); => 마우스를 떼자마자 바로 색이 자동으로 채워짐
  ctx.beginPath();
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

function onCanvasClick(event) {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onDestroyClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

function onFileChange(event) {
  //console.dir(event.target);
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  //console.log(url);
  const image = new Image(); // == <img src="">
  image.src = url;
  image.onload = function(){
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  }
}

function onDoubleClick(event) {
  const text = textInput.value;
  if(text !== ""){
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = "48px serif";
    //ctx.strokeText(text, event.offsetX, event.offsetY);
    ctx.fillText(text, event.offsetX, event.offsetY);
    //console.log(event.offsetX, event.offsetY);
    ctx.restore();
  }
}

function onSaveClick() {
  //console.log(canvas.toDataURL());
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}

canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
// => canvas.addEventListener("mouseup", onMouseUp);만 있으면 캔버스 밖에 나가도
//실행이 되는 버그 발생

canvas.addEventListener("click", onCanvasClick);

lineWidth.addEventListener("input", onLineWidthChange); // Change "change" to "input"
color.addEventListener("input", onColorChange); // Change "change" to "input"

colorOptions.forEach(colorOption =>
  colorOption.addEventListener("click", onColorClick)
);

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);