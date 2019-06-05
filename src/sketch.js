var width = window.innerWidth - 110;
var height = window.innerHeight - 110;

console.log(width, height)

let input, button, labelInput;
let x_axis = [];
let y_axis = [];

let objects_to_draw = [];
let points = [];

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
    button.mousePressed(submit_listenner);

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

    frameRate(60);
}

function Point(x, y, width) {

    this.x = x;
    this.y = y;
    this.width = width;

    this.render = function () {
        fill(0);
        ellipse(x, y, width, 10);
    }
}

function submit_listenner() {

    points = [];

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
        
        let point = new Point(x_axis[i], y_axis[i], 10);
        points.push(point);
    }
}

function run_algorithm() {

}

function draw() {
    // loops forever  

    objects_to_draw = [].concat(points);

    clear();
    
    for (const obj of objects_to_draw) {
        
        obj.render();
    }
}