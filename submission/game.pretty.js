var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
document.writeln("<h1>COMP284 Assignment2</h1>");
document.writeln("<h2 id='round'></h2>");
document.writeln("<h2 id='score'></h2>");
document.writeln("<table>");
// number of grids
var _size = 10;
// initialisation
for (var i = 0; i < _size; i++) {
    document.writeln("<tr>");
    for (var j = 0; j < _size; j++) {
        // e.g. r1c3 stands for the block located in row 1 column 3 (both start with 0)
        document.writeln("<td onclick='addItem(this)'id=r" + i + "c" + j + "></td>");
    }
    document.writeln("</tr>");
}
document.writeln("</table>");
var inSetup = true; // record status
var theHero; // store the hero
var robots = []; // array for robots
var obstacles = []; // array for obstacles
var treasures = []; // array for treasures
var haveHero = false; // record whether we have a hero or not
var heroScore = 0; // record score of hero(player)
var robotsScore = 0; // record score of robots
var round = 0; // record round
// initialise text
document.getElementById("score").innerHTML = "Hero Score: " + heroScore + " Robots Score:" + robotsScore;
document.getElementById("round").innerHTML = "Round: " + round;
// to add items in setup stage
function addItem(block) {
    function cleanBlock(block) {
        switch (block.className) {
            case "hero":
                haveHero = false;
                theHero = null;
                break;
            case "killer":
                robots.forEach(function (robot, index) {
                    if (robot.getLocation() === block.id) {
                        robots.splice(index, 1);
                    }
                });
                break;
            case "treasure":
                treasures.forEach(function (treasure, index) {
                    if (treasure.getLocation() === block.id) {
                        treasures.splice(index, 1);
                    }
                });
                break;
            case "obstacle":
                obstacles.forEach(function (obstacle, index) {
                    if (obstacle.getLocation() === block.id) {
                        obstacles.splice(index, 1);
                    }
                });
                break;
        }
    }
    if (inSetup) { // detect status
        //console.log(block.id);
        var val = prompt("Please enter a value in the following range: 0-9, o, h, k");
        // first we clean the block to be manipulated
        cleanBlock(block);
        // handle different situations
        if (val === "h") {
            if (!haveHero) {
                document.getElementById(block.id).className = "hero";
                theHero = new Hero(block.id);
                // so far we have a hero
                haveHero = true;
            }
            else {
                alert("You can only have one hero!");
                console.log(theHero);
            }
        }
        else if (val === "o") {
            document.getElementById(block.id).className = "obstacle";
            obstacles.push(new Obstacle(block.id));
        }
        else if (val === "k") {
            document.getElementById(block.id).className = "killer";
            robots.push(new Robot(block.id));
        }
        else if (parseInt(val) < 10) { //NaN < 10 is false
            // need to set value
            document.getElementById(block.id).className = "treasure";
            var treasure = new Treasure(block.id);
            treasure.value = parseInt(val);
            treasures.push(treasure);
        }
        else if (val !== "") {
            alert("Your input is invalid!");
        }
    }
    else {
        alert("You are not in the setup stage!");
    }
}
// triggered by the button with text 'setup'
function setup() {
    alert("Setup");
    clear();
}
// clean the table and reset the value
function clear() {
    for (var row = 0; row < _size; row++) {
        for (var col = 0; col < _size; col++) {
            document.getElementById("r" + row + "c" + col).className = "";
        }
    }
    obstacles = [];
    robots = [];
    inSetup = true;
    theHero = null;
    haveHero = false;
    heroScore = 0;
    robotsScore = 0;
    round = 0;
}
// triggered by the button with text 'play'
function play() {
    if (haveHero) { // detect whether we have a zero
        inSetup = false;
        round = 1;
        // detect if there is a treasure
        if (treasures.length === 0) {
            end("no treasure");
        }
        else {
            heroTurn();
        }
    }
    else {
        alert("You must have one hero!");
    }
}
// represents turn for the hero
function heroTurn() {
    if (theHero.detectSurrounding()) {
        window.onkeypress = function (e) {
            var key = e.key;
            // update round
            document.getElementById("round").innerHTML = "Round: " + round;
            // since it's hero's turn, then the hero should tries to move
            heroMove(key);
        };
    }
    else {
        end("cannot move");
    }
}
// a utility function
function formatPos(newPos) {
    return "r" + newPos[0] + "c" + newPos[1];
}
function heroMove(key) {
    // old means current
    var oldRow = theHero.getRow();
    var oldCol = theHero.getCol();
    // new means next
    var newPos;
    switch (key) {
        case 'w':
            newPos = [oldRow - 1, oldCol];
            break;
        case 'a':
            newPos = [oldRow, oldCol - 1];
            break;
        case 's':
            newPos = [oldRow + 1, oldCol];
            break;
        case 'd':
            newPos = [oldRow, oldCol + 1];
            break;
        default:
            alert("This key is invalid!");
            break;
    }
    if (newPos[0] >= 0 && newPos[0] < _size && newPos[1] >= 0 && newPos[1] < _size) {
        var newID = formatPos(newPos);
        console.log(newID);
        theHero.handleSituations(newID);
    }
    else {
        alert("You can't cross the boundary!");
    }
    robotTurn();
}
function robotTurn() {
    var robotsWaitList = []; // prepared for robots who cannot move
    var allCantMove = true;
    robots.forEach(function (robot, index) {
        var makeMovement = robot.decideAction();
        if (!makeMovement) {
            robots.splice(index, 1);
            robotsWaitList.push(robot);
        }
    });
    if (robotsWaitList.length !== 0) {
        robotsWaitList.forEach(function (robot) {
            var canMove = robot.decideAction();
            if (canMove)
                allCantMove = false;
        });
        if (allCantMove)
            end("cannot move");
    }
}
function end(state) {
    //alert("Game is over!\nYour score is " + heroScore);
    var displayScore = "\n\tYour score is: " + heroScore;
    var result = "";
    console.log(state);
    if (state === "kill") {
        result = "You lose!";
    }
    else {
        if (heroScore > robotsScore) {
            result = "You win!";
        }
        else if (heroScore < robotsScore) {
            result = "You lose!";
        }
        else {
            result = "Draw game!";
        }
    }
    alert(result + displayScore);
    clear();
}
var Item = /** @class */ (function () {
    function Item(location) {
        this.location = location;
    }
    Item.prototype.getLocation = function () {
        return this.location;
    };
    Item.prototype.getRow = function () {
        return parseInt(this.location.charAt(1));
    };
    Item.prototype.getCol = function () {
        return parseInt(this.location.charAt(3));
    };
    Item.prototype.setLocation = function (pos) {
        document.getElementById(this.getLocation()).className = "";
        this.location = pos;
    };
    return Item;
}());
var Hero = /** @class */ (function (_super) {
    __extends(Hero, _super);
    function Hero() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Hero.prototype.detectSurrounding = function () {
        var up = [], down = [], left = [], right = [];
        // get 4 possible movements in advance
        if (this.getRow() !== 0) {
            up = [this.getRow() - 1, this.getCol()];
        }
        if (this.getRow() !== _size - 1) {
            down = [this.getRow() + 1, this.getCol()];
        }
        if (this.getCol() !== 0) {
            left = [this.getRow(), this.getCol() - 1];
        }
        if (this.getCol() !== _size - 1) {
            right = [this.getRow(), this.getCol() + 1];
        }
        var allMove = [up, down, left, right];
        console.log(allMove);
        var canMove = false;
        for (var _i = 0, allMove_1 = allMove; _i < allMove_1.length; _i++) {
            var pos = allMove_1[_i];
            console.log(pos);
            if (pos.length !== 0) {
                if (document.getElementById(formatPos(pos)).className !== "obstacle") {
                    canMove = true;
                }
            }
        }
        return canMove;
    };
    Hero.prototype.handleSituations = function (pos) {
        var thatName = document.getElementById(pos).className;
        if (thatName === "obstacle") {
            alert("You can't cross a obstacle!");
        }
        else {
            round++;
            if (thatName === "killer") {
                document.getElementById(this.getLocation()).className = "";
                end("kill");
            }
            else {
                if (thatName === "treasure") {
                    treasures.forEach(function (item, index) {
                        if (item.getLocation() === pos) {
                            heroScore += item.getValue();
                            console.log(heroScore);
                            document.getElementById("score").innerHTML = "Hero Score: " + heroScore + " Robots Score:" + robotsScore;
                            treasures.splice(index, 1);
                        }
                    });
                }
                this.moveForward(pos);
                if (treasures.length === 0) {
                    end("no treasure");
                }
            }
        }
    };
    Hero.prototype.moveForward = function (pos) {
        document.getElementById(this.getLocation()).className = "";
        document.getElementById(pos).className = "hero";
        this.setLocation(pos);
    };
    return Hero;
}(Item));
var Robot = /** @class */ (function (_super) {
    __extends(Robot, _super);
    function Robot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Robot.prototype.moveForward = function (pos) {
        document.getElementById(this.getLocation()).className = "";
        document.getElementById(pos).className = "killer";
        this.setLocation(pos);
    };
    Robot.prototype.detectSurrounding = function () {
        var row = this.getRow();
        var col = this.getCol();
        var availablePlaces = [];
        var treasures = [];
        var haveTreasures = false;
        // detect its surrounding in 8 directions
        for (var rowIndex = (row === 0 ? 0 : row - 1); rowIndex <= (row === _size - 1 ? _size - 1 : row + 1); rowIndex++) {
            for (var colIndex = (col === 0 ? 0 : col - 1); colIndex <= (col === _size - 1 ? _size - 1 : col + 1); colIndex++) {
                var tempPos = formatPos([rowIndex, colIndex]);
                var thatName = document.getElementById(tempPos).className;
                if (thatName === "hero") {
                    return ["hero", tempPos];
                }
                else if (thatName === "treasure") {
                    if (!haveTreasures)
                        haveTreasures = true;
                    treasures.push(tempPos);
                }
                else if (thatName === "" && !haveTreasures) {
                    availablePlaces.push(tempPos);
                }
            }
        }
        //console.log(treasures);
        if (haveTreasures) {
            var random = Math.floor(Math.random() * treasures.length);
            return ["treasure", treasures[random]];
        }
        else {
            if (availablePlaces.length !== 0) {
                var random = Math.floor(Math.random() * availablePlaces.length);
                return ["free", availablePlaces[random]];
            }
            else {
                return ["none"];
            }
        }
    };
    Robot.prototype.decideAction = function () {
        var _this = this;
        var result = this.detectSurrounding();
        //console.log(result);
        var type = result[0];
        if (type === "hero") {
            this.moveForward(result[1]);
            end("kill");
        }
        else if (type === "treasure") {
            treasures.forEach(function (item, index) {
                if (item.getLocation() === result[1]) {
                    robotsScore += item.getValue();
                    console.log(heroScore);
                    document.getElementById("score").innerHTML = "Hero Score: " + heroScore + " Robots Score: " + robotsScore;
                    treasures.splice(index, 1);
                    _this.moveForward(result[1]);
                }
            });
            if (treasures.length === 0) {
                end("no treasure");
            }
        }
        else if (type === "free") {
            this.moveForward(result[1]);
        }
        else {
            return false;
        }
        return true;
    };
    return Robot;
}(Item));
var Obstacle = /** @class */ (function (_super) {
    __extends(Obstacle, _super);
    function Obstacle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Obstacle;
}(Item));
var Treasure = /** @class */ (function (_super) {
    __extends(Treasure, _super);
    function Treasure() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Treasure.prototype.getValue = function () {
        return this.value;
    };
    return Treasure;
}(Item));
//# sourceMappingURL=game.js.map