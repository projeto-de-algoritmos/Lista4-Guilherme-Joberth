var width = window.innerWidth - 110;
var height = window.innerHeight - 110;

console.log(width, height)

let input, button, labelInput;
let x_axis = [];
let y_axis = [];

function setup() {
    var canvas = createCanvas(window.innerWidth - 20, window.innerHeight - 100);
    canvas.parent("sketch");
    noStroke();

    //Input number of points
    labelInput = createElement('h5', 'Digite a quantidade de pontos: ');
    labelInput.position(50, 7);

    input = createInput();
    input.position(labelInput.x + input.width + 20, 25);

    button = createButton('submit');
    button.position(input.x + input.width + 10, 25);
    button.mousePressed(listenner);

    //Slide for adjust the velocity

    VelocitySlider = createSlider(10, 100, 10);
    VelocitySlider.position( 900, input.y);

    labelVelocity = createElement('h5', 'Velocidade: ');
    labelVelocity.position(750 , 7);

    labelVelocity = createElement('h5', '10 ms');
    labelVelocity.position(VelocitySlider.x - 45 , 7);

    labelVelocity = createElement('h5', '100 ms');
    labelVelocity.position(VelocitySlider.x + VelocitySlider.width + 10 , 7);

    textAlign(CENTER);
    textSize(50);
}

function listenner() {
    clear();
    x_axis = [];
    y_axis = [];
    const number_points = parseInt(input.value());
    input.value("");

    while (x_axis.length < number_points) {
        let current_x = Math.floor(Math.random() * (width - 15)) + 10;
        if (x_axis.indexOf(current_x) === -1) {
            x_axis.push(current_x);
            y_axis.push(Math.floor(Math.random() * (height - 15)) + 10);
        }
    }

    console.log(x_axis);
    console.log(y_axis);

    for (let i = 0; i < number_points; i++) {
        fill(0);
        ellipse(x_axis[i], y_axis[i], 10, 10);
    }
}

function draw() {
}