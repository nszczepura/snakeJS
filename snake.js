//classic snake written in JavaScript
//@author Nicholas Szczepura

var canvas = document.getElementById("snake");
var context = canvas.getContext("2d");
var Snake;
var Apple;
var direction;
var frame = 0;
var keysDown = {};

var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};

window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
});

var step = function() {
    update_direction();
    update();
    render();
    animate(step);
};

//in substitute of using a sleep function
//the game updates the snake every 3 frames
//this is to keep the game at a playable speed
var update = function() {
    if(frame % 3 == 0) Snake.update(direction);
    if(Snake.collision(canvas.clientWidth, canvas.clientHeight)) reset();
    frame++;
};

var render = function() {
    context.fillStyle = "#00020f";
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    Snake.render();
    Apple.render();
};

//changes the direction of the snake based on keys pressesd
function update_direction() {
    for(var key in keysDown) {
        var value = Number(key);
        if(value == 38) { //up arrow
            direction = "up";
        } else if(value == 40) { //down arrow
            direction = "down";
        } else if(value == 37) { //left arrow
            direction = "left";
        } else if(value == 39) { //right arrow
            direction = "right";
        }
    }
}


//initializes the game objects
function reset() {
    Snake = new snake(20);
    Snake.init(canvas.clientWidth, canvas.clientHeight);
    Apple = new apple(20);
    Apple.update(canvas.clientWidth, canvas.clientHeight);
    direction = "left";
}

//target to capture for the snake
//@param size of each side in pixels (should be the same as snake block size)
function apple(size) {
    this.x;
    this.y;
    this.size = size;
}

    //places the apple randomly on the canvas
    //@param width of the canvas in pixels
    //@param height of the canvas in pixels
    apple.prototype.update = function(canvas_width, canvas_height) {
        var random = Math.random() * (canvas.clientWidth - 40);
        randomMultiple = random - (random % 20) + 40;
        this.x = randomMultiple;
        var random = Math.random() * (canvas.clientHeight - 40);
        randomMultiple = random - (random % 20) + 40;
        this.y = randomMultiple;
    }   

    apple.prototype.render = function() {
        context.fillStyle = "red";
        context.fillRect(this.x, this.y, this.size, this.size);
    }

//square that makes part of a snake
//@param x position on canvas
//@param y position on canvas
//@param size of each side of the block in pixels
function snake_block(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
}

    snake_block.prototype.render = function() {
        context.fillStyle = "#19ff4f";
        context.fillRect(this.x, this.y, this.size, this.size);
    }

//creates a queue that will keep track of blocks that make up the snake
//@param size of each side of a snake block in pixels
function snake(size) {
    this.snake = [];
    this.size = size;
}

    //initializes the snake in the middle of the canvas
    //@param canvas width in pixels
    //@param canvas height in pixels
    snake.prototype.init = function(canvas_width, canvas_height) {
        for(i = 0; i < 4; i++){
            this.snake.push(new snake_block((canvas_width / 2) + (this.size * i), (canvas_height / 2), this.size));
        }
    }

    //check for collision with canvas walls and snake body
    //@param canvas width in pixels
    //@param canvas height in pixels
    //@return true if collision occured, false otherwise.
    snake.prototype.collision = function(canvas_width, canvas_height) {
        if(this.snake[0].x < 0 || this.snake[0].x > canvas_width) return true;
        else if(this.snake[0].y < 0 || this.snake[0].y > canvas_height) return true;
        else {
            for(i = 1; i < this.snake.length; i++) {
                if(this.snake[0].x == this.snake[i].x &&
                    this.snake[0].y == this.snake[i].y) return true;
            }
        }
        return false;
    }


    //uses a queue to update the snakes position
    //the tail is dequeued and a new block (placed where the head is facing)
    //is created and queued.
    //@param direction of head as a string
    snake.prototype.update = function(direction) {
        var head = this.snake[0];
        if(head.x == Apple.x && head.y == Apple.y) Apple.update();
        else this.snake.pop();
        
        var new_block;
        
        if(direction == "down") {
            new_block = new snake_block(head.x, head.y + this.size, this.size);
        } else if(direction == "up") {
            new_block = new snake_block(head.x, head.y - this.size, this.size);
        } else if(direction == "left") {
            new_block = new snake_block((head.x - this.size), head.y, this.size);
        } else if(direction == "right"){
            new_block = new snake_block((head.x + this.size), head.y, this.size);
        }
    
        this.snake.unshift(new_block);
    }

    snake.prototype.render = function() {
        for(i = 0; i < this.snake.length; i++) {
            this.snake[i].render();
        }
    }
    
//initialize variables for first iteration   
reset();
