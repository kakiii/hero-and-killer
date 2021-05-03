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
var _size = 10;
for (var i = 0; i < _size; i++) {
    document.writeln("<tr>");
    for (var j = 0; j < _size; j++) {
        document.writeln("<td onclick='addItem(this)'id=r" + i + "c" + j + "></td>");
    }
    document.writeln("</tr>");
}
document.writeln("</table>");
var inSetup = true;
var theHero;
var robots = [];
var obstacles = [];
var treasures = [];
var haveHero = false;
var heroScore = 0;
var robotsScore = 0;
var round = 0;
document.getElementById("score").innerHTML = "Hero Score: " + heroScore + " Robots Score:" + robotsScore;
document.getElementById("round").innerHTML = "Round: " + round;
function addItem(block) {
    if (inSetup) {
        console.log(block.id);
        var val = prompt("Please enter a value in the following range: 0-9, o, h, k");
        //console.log(typeof (val));
        if (val === "h") {
            if (!haveHero) {
                document.getElementById(block.id).className = "hero";
                theHero = new Hero(block.id);
            }
            else {
                alert("You can only have one hero!");
                //console.log(theHero);
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
        else if (parseInt(val) < 10) {
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
function setup() {
    alert("Setup");
    clear();
}
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
function play() {
    if (theHero !== null) {
        inSetup = false;
        round = 1;
        heroTurn();
    }
    else {
        alert("You must have one hero!");
    }
}
function heroTurn() {
    window.onkeypress = function (e) {
        var key = e.key;
        //console.log(key);
        document.getElementById("round").innerHTML = "Round: " + round;
        heroMove(key);
    };
}
function heroMove(key) {
    round++;
    var oldPos = theHero.getLocation();
    var oldRow = theHero.getRow();
    var oldCol = theHero.getCol();
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
        if (!detectStone(newPos)) {
            var newID_1 = "r" + newPos[0] + "c" + newPos[1];
            var thatClass = document.getElementById(newID_1).className;
            if (thatClass === "treasure") {
                treasures.forEach(function (item, index) {
                    if (item.getLocation() === newID_1) {
                        heroScore += item.getValue();
                        console.log(heroScore);
                        document.getElementById("score").innerHTML = "Hero Score: " + heroScore + " Robots Score:" + robotsScore;
                        treasures.splice(index, 1);
                    }
                });
                document.getElementById(newID_1).className = "hero";
                document.getElementById(oldPos).className = "";
                theHero.moveForward(newID_1);
            }
            else if (thatClass === "killer") {
                document.getElementById(oldPos).className = "";
                end();
            }
            else {
                document.getElementById(newID_1).className = "hero";
                document.getElementById(oldPos).className = "";
                theHero.moveForward(newID_1);
            }
        }
        else {
            alert("You can't cross a obstacle!");
        }
    }
    else {
        alert("You can't cross the boundary!");
    }
    if (treasures.length === 0) {
        end();
    }
    robotTurn();
}
function detectStone(pos) {
    var target = "r" + pos[0] + "c" + pos[1];
    var targetName = document.getElementById(target).className;
    //console.log(targetName);
    return (targetName === "obstacle");
    //alert("There is obstacle!");
}
function robotTurn() {
    robots.forEach(function (robot, index) {
        console.log(robot.getLocation());
        var oldRow = robot.getRow();
        var oldCol = robot.getCol();
        var oldPos = robot.getLocation();
        var heroRow = theHero.getRow();
        var heroCol = theHero.getCol();
        var heroPos = theHero.getLocation();
        if (Math.abs(oldRow - heroRow) <= 1 && Math.abs(oldCol - heroCol) <= 1) {
            document.getElementById(oldPos).className = "";
            document.getElementById(heroPos).className = "killer";
            end();
        }
        else {
            var newPos_1 = detectTreasure([oldRow, oldCol]);
            if (newPos_1 !== "none") {
                document.getElementById(oldPos).className = "";
                document.getElementById(newPos_1).className = "killer";
                robot.moveForward(newPos_1);
                treasures.forEach(function (item, index) {
                    if (item.getLocation() === newPos_1) {
                        robotsScore += item.getValue();
                        treasures.splice(index, 1);
                        document.getElementById("score").innerHTML = "Hero Score: " + heroScore + " Robots Score:" + robotsScore;
                    }
                });
            }
            else {
                var newLocations = randomMove([oldRow, oldCol]);
                var randomNum = Math.floor(Math.random() * newLocations.length);
                console.log(randomNum);
                document.getElementById(oldPos).className = "";
                document.getElementById(newLocations[randomNum]).className = "killer";
                robot.moveForward(newLocations[randomNum]);
            }
        }
    });
}
function detectTreasure(robotPos) {
    for (var rowIndex = (robotPos[0] === 0 ? 0 : robotPos[0] - 1); rowIndex <= (robotPos[0] === _size - 1 ? _size - 1 : robotPos[0] + 1); rowIndex++) {
        for (var colIndex = (robotPos[1] === 0 ? 0 : robotPos[1] - 1); colIndex <= (robotPos[1] === _size - 1 ? _size - 1 : robotPos[1] + 1); colIndex++) {
            var tempPos = "r" + rowIndex + "c" + colIndex;
            var thatName = document.getElementById(tempPos).className;
            if (thatName === "treasure") {
                return tempPos;
            }
        }
    }
    return "none";
}
function randomMove(robotPos) {
    var possiblePos = [];
    for (var rowIndex = (robotPos[0] === 0 ? 0 : robotPos[0] - 1); rowIndex <= (robotPos[0] === _size - 1 ? _size - 1 : robotPos[0] + 1); rowIndex++) {
        for (var colIndex = (robotPos[1] === 0 ? 0 : robotPos[1] - 1); colIndex <= (robotPos[1] === _size - 1 ? _size - 1 : robotPos[1] + 1); colIndex++) {
            var tempPos = "r" + rowIndex + "c" + colIndex;
            var thatName = document.getElementById(tempPos).className;
            if (thatName !== "obstacle" && thatName !== "killer") {
                possiblePos.push(tempPos);
            }
        }
    }
    //console.log(possiblePos);
    return possiblePos;
}
function end() {
    alert("Game is over!\nYour score is " + heroScore.toString());
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
    Hero.prototype.detectObstacle = function (pos) {
        var target = "r" + pos[0] + "c" + pos[1];
        var targetName = document.getElementById(target).className;
        //console.log(targetName);
        return (targetName === "obstacle");
        //alert("There is obstacle!");
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
        var availablePlace = [];
        for (var rowIndex = (row === 0 ? 0 : row - 1); rowIndex <= (row === _size - 1 ? _size - 1 : row + 1); rowIndex++) {
            for (var colIndex = (col === 0 ? 0 : col - 1); colIndex <= (col === _size - 1 ? _size - 1 : col + 1); colIndex++) {
                var tempPos = "r" + rowIndex + "c" + colIndex;
                var thatPlace = document.getElementById(tempPos).className;
                if (thatPlace === "hero" || thatPlace === "treasure") {
                    return thatPlace;
                }
                else if (thatPlace !== "obstacle") {
                    availablePlace.push(thatPlace);
                }
            }
        }
        return availablePlace;
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