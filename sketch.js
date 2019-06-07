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
var COLOR_YELLOW;
var COLOR_WHITE;
var COLOR_TRANSPARENT;

var running = false;
var canvas;

function setup() {

    COLOR_RED = color(255, 0, 0);
    COLOR_BLUE = color(0, 0, 255);
    COLOR_GREEN = color(0, 255, 0);
    COLOR_YELLOW = color(255, 255, 0);
    COLOR_WHITE = color(255, 255, 255);
    COLOR_TRANSPARENT = color(0, 0, 0, 0);

    canvas = createCanvas(window.innerWidth - 20, window.innerHeight - 100);
    canvas.parent("sketch");

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

    VelocitySlider = createSlider(0, 1000, 100, 10);
    VelocitySlider.position( 900, input.y);

    labelVelocity = createElement('h5', 'Velocidade: ');
    labelVelocity.position(750 , 7);

    labelVelocity = createElement('h5', '0 ms');
    labelVelocity.position(VelocitySlider.x - 45 , 7);

    labelVelocity = createElement('h5', '1000 ms');
    labelVelocity.position(VelocitySlider.x + VelocitySlider.width + 10 , 7);

    textAlign(CENTER);
    textSize(50);

    frameRate(120);
}

function Point(x, y, width) {

    this.x = x;
    this.y = y;
    this.width = width;

    this.fillColor = COLOR_WHITE;

    this.render = function () {
        fill(this.fillColor);
        stroke(0);
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

function mouseReleased(){
    
    if(running) return;

    if (0 <= mouseX && mouseX <= canvas.width && 0 <= mouseY && mouseY <= canvas.height){
        let point = new Point(mouseX, mouseY, 10);
        points.push(point);
    }

}

function submit_listenner() {

    if (running){ 
        console.log("Already running");
        return;
    }

    clear();

    points = [];
    lines = [];

    x_axis = [];
    y_axis = [];
    const number_points = parseInt(input.value());

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

    if (running){ 
        console.log("Already running");
        return;
    }

    running = true;

    points.sort((a, b) => {
        return (a.x < b.x) ? -1 : 1;
    });

    findClosest(points).then((closest) =>{

        console.log(closest);

        closest[0].fillColor = COLOR_GREEN;
        closest[1].fillColor = COLOR_GREEN;
        closest[2].color = COLOR_GREEN;
        
        lines = [closest[2]];
        
        running = false;
    });
}

function distance(pointA, pointB){

    if (Array.isArray(pointA)){

        return distance(pointA[0], pointA[1]);
    }

    if (pointA == null || pointB == null) return Infinity;

    let result = Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2);
    result = Math.sqrt(result);

    return result;
}

function createLineBetweenPoints(pointA, pointB, color){

    let line = new Line(pointA.x, pointA.y, pointB.x, pointB.y, color);
    lines.push(line);

    return line;
}

function sleep(ms) {

    if (ms === 0){
        return;
    }

    return new Promise(resolve => setTimeout(resolve, ms));
}

async function findClosest(currentPoints){

    await sleep(parseInt(VelocitySlider.value()));

    let colorStep = 40;

    for (const p of currentPoints) {
        
        p.fillColor = color(
            red(p.fillColor) - colorStep,
            green(p.fillColor) - colorStep,
            blue(p.fillColor) - colorStep
        );
    }
    
    // if theres just one point, it is already the 'smallest pair' in
    // the sector
    if (typeof(currentPoints) != typeof([]) || currentPoints.length <= 1) {
        for (const p of currentPoints) {
        
        
            p.fillColor = color(
                red(p.fillColor) + colorStep,
                green(p.fillColor) + colorStep,
                blue(p.fillColor) + colorStep
            );
        }
    
        return [currentPoints[0], null, null];
    }

    // TODO: use mean of means
    // gets mid point of the sorted array of points to consider
    let mid = Math.floor(currentPoints.length / 2);
    let midPoint = currentPoints[mid];

    // draws a red division line on the division
    let divisionLine = new Line(midPoint.x - 11, 0, midPoint.x - 11, height, COLOR_RED);
    lines.push(divisionLine);

    // gets, recursively, the pair of points left of the line and
    // rigth of the line
    let leftPoints = await findClosest(currentPoints.slice(0, mid));
    let rigthPoints = await findClosest(currentPoints.slice(mid, currentPoints.length));
   
    // it the two sectors had only one point, we can unite them
    if (leftPoints[1] === null && rigthPoints[1] === null) {

        let centerSmallestLine = createLineBetweenPoints(
            leftPoints[0],
            rigthPoints[0],
            COLOR_BLUE
        );

        // removes division line
        divisionLine.color = COLOR_TRANSPARENT;

        for (const p of currentPoints) {
        
        
            p.fillColor = color(
                red(p.fillColor) + colorStep,
                green(p.fillColor) + colorStep,
                blue(p.fillColor) + colorStep
            );
        }    

        return [leftPoints[0], rigthPoints[0], centerSmallestLine]
    
    }

    // Unite the left side and the rigth side
    let distanceLeft = distance(leftPoints);
    let distanceRight = distance(rigthPoints);

    let minPair;
    let min;

    // finds minimal pair between left and rigth
    // and clears line from not selected pair
    if (distanceLeft < distanceRight){

        minPair = leftPoints;
        min = distanceLeft;
        if(rigthPoints[2] !== null) rigthPoints[2].color = COLOR_TRANSPARENT;

    }else{

        minPair = rigthPoints;
        min = distanceRight;
        if (leftPoints[2] !== null) leftPoints[2].color = COLOR_TRANSPARENT;
    }

    let stripMinX = midPoint.x - min;
    let stripMaxX = midPoint.x + min;

    divisionLine.color = COLOR_BLUE;

    let stripLineMin = new Line(stripMinX - 11, 0, stripMinX - 11, height, COLOR_GREEN);
    lines.push(stripLineMin);
    let stripLineMax = new Line(stripMaxX, 0, stripMaxX, height, COLOR_GREEN);
    lines.push(stripLineMax);

    await sleep(parseInt(VelocitySlider.value()))

    let strip = currentPoints.filter((element) => {
        return stripMinX <= element.x && element.x <= stripMaxX;
    });

    strip.sort((a, b) => {
        return (a.y < b.y) ? -1 : 1;
    });

    let original_colors = [];
    for (const p of strip) {
        original_colors.push(p.fillColor);
        p.fillColor = COLOR_YELLOW;
    }

    let y_bound = 6 - strip.length;

    if (y_bound <= 0) y_bound = 6;

    for (let i = 0; i < strip.length - 1; i++) {

        let current = strip[i];

        for (let j = i + 1; j < i + y_bound && j < strip.length; j++) {

            let compare = strip[j];

            let compareLine = createLineBetweenPoints(current, compare, COLOR_RED);

            await sleep(parseInt(VelocitySlider.value()));
            
            let dist = distance(current, compare);

            if (dist < min) {
                min = dist;

                minPair[0] = current;
                minPair[1] = compare;
                
                minPair[2].color = COLOR_TRANSPARENT;
                compareLine.color = COLOR_BLUE;
                minPair[2] = compareLine;

            }else{

                compareLine.color = COLOR_TRANSPARENT;
            }
        }
    }

    for(let i = 0; i < original_colors.length; i++){
        strip[i].fillColor = original_colors[i];
    }

    let a = minPair[0];
    let b = minPair[1];

    stripLineMin.color = COLOR_TRANSPARENT;
    stripLineMax.color = COLOR_TRANSPARENT;
    divisionLine.color = COLOR_TRANSPARENT;


    for (const p of currentPoints) {
        
        
        p.fillColor = color(
            red(p.fillColor) + colorStep,
            green(p.fillColor) + colorStep,
            blue(p.fillColor) + colorStep
        );
    }

    return minPair;
}

function draw() {
    // loops forever  
    clear();
    background(COLOR_WHITE);

    objects_to_draw = [].concat(points).concat(lines);

    for (const obj of objects_to_draw) {
        
        obj.render();
    }
}
