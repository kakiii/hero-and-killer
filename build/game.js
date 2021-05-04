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
                haveHero = true;
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
function formatPos(newPos) {
    return "r" + newPos[0] + "c" + newPos[1];
}
function heroMove(key) {
    round++;
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
        var newID = formatPos(newPos);
        theHero.handleSituations(newID);
    }
    else {
        alert("You can't cross the boundary!");
    }
    robotTurn();
}
function robotTurn() {
    var robotsWaitList = [];
    var allCantMove = true;
    robots.forEach(function (robot, index) {
        var makeMovement = robot.decideAction();
        if (!makeMovement) {
            robots.splice(index, 1);
            robotsWaitList.push(robot);
        }
    });
    robotsWaitList.forEach(function (robot) {
        var canMove = robot.decideAction();
        if (canMove)
            allCantMove = false;
    });
    if (allCantMove)
        end("cannot move");
}
function end(state) {
    //alert("Game is over!\nYour score is " + heroScore);
    console.log(state);
    if (state === "kill") {
        alert("You lose!\n\tYour score is: " + heroScore);
    }
    else if (state === "no treasure") {
        alert("You win!\n\tYour score is: " + heroScore);
    }
    else if (state === "") {
        alert("Draw Game!\n\tYour score is: " + heroScore);
    }
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
    Hero.prototype.handleSituations = function (pos) {
        var thatName = document.getElementById(pos).className;
        if (thatName === "obstacle") {
            alert("You can't cross a obstacle!");
        }
        else {
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
                    document.getElementById("score").innerHTML = "Hero Score: " + heroScore + " Robots Score:" + robotsScore;
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