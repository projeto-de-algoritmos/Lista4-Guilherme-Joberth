var width = window.innerWidth - 110;
var height = window.innerHeight - 110;

console.log(width, height)

let input, button, labelInput;
let x_axis = [];
let y_axis = [];

let objects_to_draw = [];
let points = [];
let listOrderX = []

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

    VelocitySlider = createSlider(300, 800, 300);
    VelocitySlider.position( 900, input.y);

    labelVelocity = createElement('h5', 'Velocidade: ');
    labelVelocity.position(750 , 7);

    labelVelocity = createElement('h5', '300 ms');
    labelVelocity.position(VelocitySlider.x - 45 , 7);

    labelVelocity = createElement('h5', '800 ms');
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
        fill(255);
        stroke(255);
        ellipse(x, y, width, 10);
    }
}

function submit_listenner() {

    clear();

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

    listOrderX = orderByX(points);
    run_algorithm(listOrderX);
}

function orderByX(points){
    return points.sort((a,b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run_algorithm(points) {

    if (points.length <= 2){
        return
    } 

    let middle = parseInt(points.length / 2);

    let left = points.slice(0, middle);
    let right = points.slice(middle, points.length);

    stroke(255);
    line(right[0].x - 7, 0, right[0].x - 7, height);

    await sleep(VelocitySlider.value());

    run_algorithm(left);
    run_algorithm(right);
}

function draw() {
    // loops forever  

    objects_to_draw = [].concat(points);

    //clear();
    
    for (const obj of objects_to_draw) {
        
        obj.render();
    }

}