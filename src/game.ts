document.writeln("<h1>COMP284 Assignment2</h1>");
document.writeln("<h2 id='round'></h2>")
document.writeln("<h2 id='score'></h2>");

document.writeln("<table>");
const _size = 10;
for (let i = 0; i < _size; i++) {
    document.writeln("<tr>");
    for (let j = 0; j < _size; j++) {
        document.writeln(`<td onclick='addItem(this)'id=r${i}c${j}></td>`);
    }
    document.writeln("</tr>");
}
document.writeln("</table>");

let inSetup = true;
let theHero: Hero;
let robots: Robot[] = [];
let obstacles: Obstacle[] = [];
let treasures: Treasure[] = [];
let haveHero = false;
let heroScore = 0;
let robotsScore = 0;
let round = 0;
document.getElementById("score").innerHTML = "Hero Score: " + heroScore + " Robots Score:" + robotsScore;
document.getElementById("round").innerHTML = "Round: " + round;

function addItem(block: { id: string; }) {
    if (inSetup) {
        console.log(block.id);
        let val = prompt("Please enter a value in the following range: 0-9, o, h, k");
        //console.log(typeof (val));
        if (val === "h") {
            if (!haveHero) {
                document.getElementById(block.id).className = "hero";
                theHero = new Hero(block.id);
            } else {
                alert("You can only have one hero!");
                //console.log(theHero);
            }
        } else if (val === "o") {
            document.getElementById(block.id).className = "obstacle";
            obstacles.push(new Obstacle(block.id));
        } else if (val === "k") {
            document.getElementById(block.id).className = "killer";
            robots.push(new Robot(block.id));
        } else if (parseInt(val) < 10) {
            document.getElementById(block.id).className = "treasure";
            let treasure = new Treasure(block.id);
            treasure.value = parseInt(val);
            treasures.push(treasure);
        } else if (val !== "") {
            alert("Your input is invalid!");
        }
    } else {
        alert("You are not in the setup stage!");
    }

}

function setup() {
    alert("Setup");
    clear();
}

function clear() {
    for (let row = 0; row < _size; row++) {
        for (let col = 0; col < _size; col++) {
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
    } else {
        alert("You must have one hero!");
    }
}


function heroTurn() {
    window.onkeypress = function (e) {
        let key = e.key;
        //console.log(key);

        document.getElementById("round").innerHTML = "Round: " + round;
        heroMove(key);
    }
}

function heroMove(key: string) {
    round++;
    let oldPos = theHero.getLocation();
    let oldRow = theHero.getRow();
    let oldCol = theHero.getCol();
    let newPos: number[];
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
            let newID = "r" + newPos[0] + "c" + newPos[1];
            let thatClass = document.getElementById(newID).className;
            if (thatClass === "treasure") {
                treasures.forEach((item, index) => {
                    if (item.getLocation() === newID) {
                        heroScore += item.getValue();
                        console.log(heroScore);
                        document.getElementById("score").innerHTML = "Hero Score: " + heroScore + " Robots Score:" + robotsScore;
                        treasures.splice(index, 1);
                    }
                });
                document.getElementById(newID).className = "hero";
                document.getElementById(oldPos).className = "";
                theHero.moveForward(newID);
            } else if (thatClass === "killer") {
                document.getElementById(oldPos).className = "";
                end();
            } else {
                document.getElementById(newID).className = "hero";
                document.getElementById(oldPos).className = "";
                theHero.moveForward(newID);

            }

        } else {
            alert("You can't cross a obstacle!");
        }
    } else {
        alert("You can't cross the boundary!");
    }
    if (treasures.length === 0) {
        end();
    }
    robotTurn();

}

function detectStone(pos: number[]): boolean {
    let target = "r" + pos[0] + "c" + pos[1];
    let targetName = document.getElementById(target).className;
    //console.log(targetName);
    return (targetName === "obstacle");
    //alert("There is obstacle!");
}

function robotTurn() {
    robots.forEach((robot, index) => {
        console.log(robot.getLocation());
        let oldRow = robot.getRow();
        let oldCol = robot.getCol();
        let oldPos = robot.getLocation();
        let heroRow = theHero.getRow();
        let heroCol = theHero.getCol();
        let heroPos = theHero.getLocation();
        if (Math.abs(oldRow - heroRow) <= 1 && Math.abs(oldCol - heroCol) <= 1) {
            document.getElementById(oldPos).className = "";
            document.getElementById(heroPos).className = "killer";
            end();
        } else {
            let newPos = detectTreasure([oldRow, oldCol]);
            if (newPos !== "none") {
                document.getElementById(oldPos).className = "";
                document.getElementById(newPos).className = "killer";
                robot.moveForward(newPos);
                treasures.forEach((item, index) => {
                    if (item.getLocation() === newPos) {
                        robotsScore += item.getValue();
                        treasures.splice(index, 1);
                        document.getElementById("score").innerHTML = "Hero Score: " + heroScore + " Robots Score:" + robotsScore;
                    }
                });
            } else {
                let newLocations = randomMove([oldRow, oldCol]);
                let randomNum = Math.floor(Math.random() * newLocations.length);
                console.log(randomNum);
                document.getElementById(oldPos).className = "";
                document.getElementById(newLocations[randomNum]).className = "killer";
                robot.moveForward(newLocations[randomNum]);

            }

        }
    });

}

function detectTreasure(robotPos: number[]) {
    for (let rowIndex = (robotPos[0] === 0 ? 0 : robotPos[0] - 1); rowIndex <= (robotPos[0] === _size - 1 ? _size - 1 : robotPos[0] + 1); rowIndex++) {
        for (let colIndex = (robotPos[1] === 0 ? 0 : robotPos[1] - 1); colIndex <= (robotPos[1] === _size - 1 ? _size - 1 : robotPos[1] + 1); colIndex++) {
            let tempPos = "r" + rowIndex + "c" + colIndex;
            let thatName = document.getElementById(tempPos).className;
            if (thatName === "treasure") {
                return tempPos;
            }
        }
    }
    return "none";

}

function randomMove(robotPos: number[]) {
    let possiblePos: string[] = [];
    for (let rowIndex = (robotPos[0] === 0 ? 0 : robotPos[0] - 1); rowIndex <= (robotPos[0] === _size - 1 ? _size - 1 : robotPos[0] + 1); rowIndex++) {
        for (let colIndex = (robotPos[1] === 0 ? 0 : robotPos[1] - 1); colIndex <= (robotPos[1] === _size - 1 ? _size - 1 : robotPos[1] + 1); colIndex++) {
            let tempPos = "r" + rowIndex + "c" + colIndex;
            let thatName = document.getElementById(tempPos).className;
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

class Item {
    location: string;

    constructor(location: string) {
        this.location = location;
    }

    getLocation(): string {
        return this.location;
    }

    getRow(): number {
        return parseInt(this.location.charAt(1));
    }

    getCol(): number {
        return parseInt(this.location.charAt(3));
    }

    setLocation(pos: string): void {
        document.getElementById(this.getLocation()).className = "";

        this.location = pos;
    }
}

interface canMove {

    moveForward(pos: string): void
}

class Hero extends Item implements canMove {
    detectObstacle(pos: number[]): boolean {
        let target = "r" + pos[0] + "c" + pos[1];
        let targetName = document.getElementById(target).className;
        //console.log(targetName);
        return (targetName === "obstacle");
        //alert("There is obstacle!");
    }

    moveForward(pos: string) {
        document.getElementById(this.getLocation()).className = "";
        document.getElementById(pos).className = "hero";
        this.setLocation(pos);
    }

}

class Robot extends Item implements canMove {


    moveForward(pos: string) {
        document.getElementById(this.getLocation()).className = "";
        document.getElementById(pos).className = "killer";
        this.setLocation(pos);
    }

    detectSurrounding() {
        let row = this.getRow();
        let col = this.getCol();
        let availablePlace: string[] = [];
        for (let rowIndex = (row === 0 ? 0 : row - 1); rowIndex <= (row === _size - 1 ? _size - 1 : row + 1); rowIndex++) {
            for (let colIndex = (col === 0 ? 0 : col - 1); colIndex <= (col === _size - 1 ? _size - 1 : col + 1); colIndex++) {
                let tempPos = "r" + rowIndex + "c" + colIndex;
                let thatPlace = document.getElementById(tempPos).className;
                if (thatPlace === "hero" || thatPlace === "treasure") {
                    return thatPlace
                } else if (thatPlace !== "obstacle"){
                    availablePlace.push(thatPlace);
                }

            }
        }
        return availablePlace;
    }
}

class Obstacle extends Item {

}

class Treasure extends Item {
    value: number;

    getValue(): number {
        return this.value;
    }
}