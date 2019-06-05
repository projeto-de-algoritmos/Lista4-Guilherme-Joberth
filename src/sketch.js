var width = window.innerWidth - 110;
var height = window.innerHeight - 110;

console.log(width, height)

let input, submit_button, run_button, labelInput;
let x_axis = [];
let y_axis = [];

let objects_to_draw = [];
let points = [];
let lines = [];

var COLOR_RED;
var COLOR_BLUE;
var COLOR_GREEN;

function setup() {

    COLOR_RED = color(255, 0, 0);
    COLOR_BLUE = color(0, 0, 255);
    COLOR_GREEN = color(0, 255, 0);
    
    var canvas = createCanvas(window.innerWidth - 20, window.innerHeight - 100);
    canvas.parent("sketch");
    noStroke();

    //Input number of points
    labelInput = createElement('h5', 'Digite a quantidade de pontos: ');
    labelInput.position(50, 7);

    input = createInput();
    input.position(labelInput.x + input.width + 20, 25);

    submit_button = createButton('submit');
    submit_button.position(input.x + input.width + 10, 25);
    submit_button.mousePressed(submit_listenner);

    run_button = createButton('run');
    run_button.position(submit_button.x + submit_button.width + 10, 25);
    run_button.mousePressed(run_algorithm);

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

function Line(x1, y1, x2, y2, color) {

    this.x1 = x1;
    this.y1 = y1;

    this.x2 = x2;
    this.y2 = y2;

    this.color = color;

    this.render = function () {
        stroke(this.color);
        line(this.x1, this.y1, this.x2, this.y2);
    }

}

function submit_listenner() {

    clear();

    points = [];
    lines = [];

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

    points.sort((a, b) => {
        return (a.x < b.x) ? -1 : 1;
    });
}

function run_algorithm() {
    let closest = findClosest(points);
}

function distance(pointA, pointB){

    if (pointA == null || pointB == null) return Infinity;

    if (typeof(pointA) == typeof([])){

        return distance(pointA[0], pointA[1]);
    }

    let result = Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2);
    result = Math.sqrt(result);

    return result;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  

async function findClosest(currentPoints){

    await sleep(parseInt(labelVelocity.value()));
    
    if (typeof(currentPoints) != typeof([]) || currentPoints.length <= 1) {
        return [currentPoints[0], null];
    }

    // TODO: use mean of means
    let mid = Math.floor(currentPoints.length / 2);
    let midPoint = currentPoints[mid];

    console.log(currentPoints);
    console.log(mid);

    let l = new Line(midPoint.x + 1, 0, midPoint.x, height, COLOR_RED);
    lines.push(l);
    
    let leftPoints = await findClosest(currentPoints.slice(0, mid));

    if (leftPoints[1] != null) {

        let a = leftPoints[0];
        let b = leftPoints[1];

        let leftLine = new Line(a.x, a.y, b.x, b.y, COLOR_BLUE);
        lines.push(leftLine);
    }

    let rigthPoints = await findClosest(currentPoints.slice(mid));

    if (rigthPoints[1] != null) {

        let a = rigthPoints[0];
        let b = rigthPoints[1];

        let rigthLine = new Line(a.x, a.y, b.x, b.y, COLOR_BLUE);
        lines.push(rigthLine);
    } else {
    
        let a = leftPoints[0];
        let b = rigthPoints[0];

        let centerline = new Line(a.x, a.y, b.x, b.y, COLOR_BLUE);
        lines.push(centerline);

        return [a, b];
    }

    let distanceLeft = distance(leftPoints);
    let distanceRight = distance(rigthPoints);

    let minPair = (distanceLeft < distanceRight) ? leftPoints : rigthPoints;
    let min = Math.min(distanceLeft, distanceRight);

    let stripMinX = midPoint.x - min;
    let stripMaxX = midPoint.x + min;

    let strip = currentPoints.filter((element) => {
        return stripMinX < element.x && element.x < stripMaxX;
    });

    strip.sort((a, b) => {
        return (a.y < b.y) ? -1 : 1;
    });

    let y_bound = 6 - strip.length;

    if (y_bound <= 0) y_bound = 6;

    for (let i = 0; i < strip.length - 1; i++) {

        let current = strip[i];

        if (Math.abs(current.x) > Math.abs(midPoint.x + min)) {
            // filter out points that are out of the strip defined by:
            // [mean - min; mean + min]

            continue;
        }

        for (let j = i + 1; j < i + y_bound && j < strip.length; j++) {

            let compare = strip[j];

            let dist = distance(current, compare);

            if (dist < min) {
                min = dist;
                minPair[0] = current;
                minPair[1] = compare;
            }

        }

    }

    let a = minPair[0];
    let b = minPair[1];
    let minLine = new Line(a.x, a.y, b.x, b.y, COLOR_GREEN);
    lines.push(minLine);

    return minPair;
}


function draw() {
    // loops forever  

    objects_to_draw = [].concat(points).concat(lines);

    clear();
    
    for (const obj of objects_to_draw) {
        
        obj.render();
    }
}
