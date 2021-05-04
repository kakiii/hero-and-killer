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
                haveHero = true;
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

function formatPos(newPos: number[]) {
    return "r" + newPos[0] + "c" + newPos[1];
}

function heroMove(key: string) {
    round++;
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
        let newID = formatPos(newPos);
        theHero.handleSituations(newID);
    } else {
        alert("You can't cross the boundary!");
    }

    robotTurn();

}

function robotTurn() {
    let robotsWaitList: Robot[] = [];
    let allCantMove = true;
    robots.forEach((robot, index) => {
        let makeMovement = robot.decideAction();
        if (!makeMovement) {
            robots.splice(index, 1);
            robotsWaitList.push(robot);
        }
    });
    robotsWaitList.forEach((robot)=>{
        let canMove = robot.decideAction();
        if (canMove) allCantMove = false;
    });
    if (allCantMove) end("cannot move");

}
function end(state:string) {
    //alert("Game is over!\nYour score is " + heroScore);
    console.log(state);
    if (state==="kill"){
        alert("You lose!\n\tYour score is: " + heroScore);
    }else if(state==="no treasure"){
        alert("You win!\n\tYour score is: "+heroScore)
    }else if(state===""){
        alert("Draw Game!\n\tYour score is: "+heroScore)
    }
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
    handleSituations(pos: string) {
        let thatName: string = document.getElementById(pos).className;
        if (thatName === "obstacle") {
            alert("You can't cross a obstacle!");
        } else {
            if (thatName === "killer") {
                document.getElementById(this.getLocation()).className = "";
                end("kill");
            } else {
                if (thatName === "treasure") {
                    treasures.forEach((item, index) => {
                        if (item.getLocation() === pos) {
                            heroScore += item.getValue();
                            console.log(heroScore);
                            document.getElementById("score").innerHTML = `Hero Score: ${heroScore} Robots Score:${robotsScore}`;
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
        let availablePlaces: string[] = [];
        let treasures: string[] = [];
        let haveTreasures = false;
        for (let rowIndex = (row === 0 ? 0 : row - 1); rowIndex <= (row === _size - 1 ? _size - 1 : row + 1); rowIndex++) {
            for (let colIndex = (col === 0 ? 0 : col - 1); colIndex <= (col === _size - 1 ? _size - 1 : col + 1); colIndex++) {
                let tempPos = formatPos([rowIndex, colIndex]);
                let thatName = document.getElementById(tempPos).className;
                if (thatName === "hero") {
                    return ["hero", tempPos];
                } else if (thatName === "treasure") {
                    if (!haveTreasures) haveTreasures = true;
                    treasures.push(tempPos);
                } else if (thatName === "" && !haveTreasures) {
                    availablePlaces.push(tempPos);
                }

            }
        }
        //console.log(treasures);
        if (haveTreasures) {
            const random = Math.floor(Math.random() * treasures.length);
            return ["treasure", treasures[random]];
        } else {
            if (availablePlaces.length !== 0) {
                const random = Math.floor(Math.random() * availablePlaces.length);
                return ["free", availablePlaces[random]];
            } else {
                return ["none"];
            }

        }
    }

    decideAction() {
        let result = this.detectSurrounding();
        //console.log(result);
        let type = result[0];
        if (type === "hero") {
            this.moveForward(result[1]);
            end("kill");
        } else if (type === "treasure") {
            treasures.forEach((item, index) => {
                if (item.getLocation() === result[1]) {
                    robotsScore += item.getValue();
                    console.log(heroScore);
                    document.getElementById("score").innerHTML = `Hero Score: ${heroScore} Robots Score:${robotsScore}`;
                    treasures.splice(index, 1);
                    this.moveForward(result[1]);
                }
            });
            if (treasures.length === 0) {
                end("no treasure");
            }
        } else if (type === "free") {
            this.moveForward(result[1]);
        } else {
            return false;
        }
        return true;
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