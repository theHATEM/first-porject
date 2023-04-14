let started = false;

let canvas = document.getElementById("canvas");

let startButton = document.getElementById("start-button");
let textOmega = document.getElementById("speed-text");
let textRadius = document.getElementById("radius-text");
let radiusSlider = document.getElementById("radius-slider");
let speedSlider = document.getElementById("speed-slider");
let angleSlider = document.getElementById("theta-slider");
let angleText = document.getElementById("theta-text");


let context = canvas.getContext("2d");

let circleRadius = 40;
let cirlceOmega = 1;

var window_height = window.innerHeight;
var window_width = window.innerWidth;

canvas.width = window_width - 20;
canvas.height = 50 / 100 * window_height;

const dt = 1 / 60;


var circleVerticalPos = canvas.height * 75 / 100;

function changeVar() {
    textOmega.textContent = "omega: " + speedSlider.value;
    textRadius.textContent = "radius: " + radiusSlider.value;
    angleText.textContent = "theta0: " + parseFloat(angleSlider.value) * 1 / 50 + " Pi";
    myCircle.setRadius(parseFloat(radiusSlider.value), started);
    myCircle.setSpeed(parseFloat(speedSlider.value));
    myCircle.setTheat0(parseFloat(angleSlider.value) * Math.PI / 50);
    myCircle.draw(context);
}

function start() {
    if (!started) {
        started = true;
        startButton.textContent = "pause";
    } else {
        started = false;
        startButton.textContent = "start";
    }
    
}

function restart() {
    started = false;
    startButton.textContent = "start";

    textOmega.textContent = "omega: " + 1;
    textRadius.textContent = "radius: " + 40;
    angleText.textContent = "theta0: 0";
    angleSlider.value = "0";
    myCircle.setRadius(40, started);
    myCircle.setSpeed(1);
    myCircle.setTheat0(0);
    myCircle.setPoints();
    myCircle.draw(context);

    radiusSlider.value = "40";
    speedSlider.value = "1";

}


class Circle {
    constructor(xPos, yPos, radius, color, speed, theta) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.theta = theta;
        this.x = this.xPos + this.radius * Math.cos(theta);
        this.y = this.yPos + this.radius * Math.sin(theta);
        this.points = [[this.x, this.y]]
    }

    draw(context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(
            this.xPos, 
            this.yPos, 
            this.radius, 
            0, 
            Math.PI * 2, 
            false
        );

        context.stroke();
        context.closePath();

        context.beginPath();

        context.arc(
            this.x,
            this.y,
            2,
            0,
            2 * Math.PI,
            false,
        );

        context.stroke();
        context.closePath();

        if (this.points.length > 2) {
            for (let i = 0; i < this.points.length - 1; i++) {
                context.beginPath();
                context.moveTo(this.points[i][0], this.points[i][1]);
                context.lineTo(this.points[i+1][0], this.points[i+1][1]);
                context.stroke();
                context.closePath();
                    
            }
        }

        
    }

    update() {
        if (this.xPos + this.radius < canvas.width) {
            this.points.push([this.x, this.y]);
            this.theta += this.speed * dt;
            context.clearRect(0, 0, window_width, window_height);
            this.xPos += this.radius * this.speed / 60;
            this.x = this.xPos + this.radius * Math.cos(this.theta);
            this.y = this.yPos + this.radius * Math.sin(this.theta);
            
            this.draw(context);
        }
    }

    setSpeed(value) {
        this.speed = value;
    }

    setRadius(value, started) {
        if (!started) {
            this.xPos = value;
        }
        this.radius = value;
        this.yPos = circleVerticalPos - value;
        this.x = this.xPos + this.radius * Math.cos(this.theta);
        this.y = this.yPos + this.radius * Math.sin(this.theta);
        if (!started) {
            this.points = [[this.x, this.y]];
        }
    }
    setTheat0(value) {
        if (!started) {
            this.theta = value;
            this.x = this.xPos + this.radius * Math.cos(this.theta);
            this.y = this.yPos + this.radius * Math.sin(this.theta);
            if (!started) {
                this.points = [[this.x, this.y]];
            }
        }
    }

    setPoints() {
        this.points = [[this.x, this.y]];
    }
}

let myCircle = new Circle(
    circleRadius,
    circleVerticalPos - circleRadius,
    circleRadius, //radius
    "red",
    cirlceOmega, //speed
    0, //theta
);


let updatePosition = function() {
    requestAnimationFrame(updatePosition);
    if (started) {
        myCircle.update();
    }
    context.beginPath();
    context.moveTo(0, circleVerticalPos);
    context.lineTo(canvas.width, circleVerticalPos);
    context.stroke();
    context.closePath();
    
}

updatePosition();



myCircle.draw(context);