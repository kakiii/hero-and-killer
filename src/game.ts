document.writeln("<h1>COMP284 Assignment2</h1>");
document.writeln("<h2 id='round'></h2>")
document.writeln("<h2 id='score'></h2>");
document.writeln("<table>");
// number of grids
const _size = 10;
// initialisation
for (let i = 0; i < _size; i++) {
    document.writeln("<tr>");
    for (let j = 0; j < _size; j++) {
        // e.g. r1c3 stands for the block located in row 1 column 3 (both start with 0)
        document.writeln(`<td onclick='addItem(this)'id=r${i}c${j}></td>`);
    }
    document.writeln("</tr>");
}
document.writeln("</table>");

let inSetup = true; // record status
let theHero: Hero; // store the hero
let robots: Robot[] = []; // array for robots
let obstacles: Obstacle[] = []; // array for obstacles
let treasures: Treasure[] = []; // array for treasures
let haveHero = false; // record whether we have a hero or not
let heroScore = 0; // record score of hero(player)
let robotsScore = 0; // record score of robots
let round = 0; // record round

// initialise text
document.getElementById("score").innerHTML = "Hero Score: " + heroScore + " Robots Score:" + robotsScore;
document.getElementById("round").innerHTML = "Round: " + round;

// to add items in setup stage
function addItem(block: Element) {
    function cleanBlock(block: Element) {
        switch (block.className) {
            case "hero":
                haveHero = false;
                theHero = null;
                break;
            case "killer":
                robots.forEach((robot, index) => {
                    if (robot.getLocation() === block.id) {
                        robots.splice(index, 1);
                    }
                })
                break;
            case "treasure":
                treasures.forEach((treasure, index) => {
                    if (treasure.getLocation() === block.id) {
                        treasures.splice(index, 1);

                    }
                })
                break;
            case "obstacle":
                obstacles.forEach((obstacle, index) => {
                    if (obstacle.getLocation() === block.id) {
                        obstacles.splice(index, 1);
                    }

                })
                break;
        }
    }

    if (inSetup) { // detect status
        //console.log(block.id);
        let val = prompt("Please enter a value in the following range: 0-9, o, h, k");
        // first we clean the block to be manipulated
        cleanBlock(block);
        // handle different situations
        if (val === "h") {
            if (!haveHero) {
                document.getElementById(block.id).className = "hero";
                theHero = new Hero(block.id);
                // so far we have a hero
                haveHero = true;
            } else {
                alert("You can only have one hero!");
                console.log(theHero);
            }
        } else if (val === "o") {
            document.getElementById(block.id).className = "obstacle";
            obstacles.push(new Obstacle(block.id));
        } else if (val === "k") {
            document.getElementById(block.id).className = "killer";
            robots.push(new Robot(block.id));
        } else if (parseInt(val) < 10) { //NaN < 10 is false
            // need to set value
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

// triggered by the button with text 'setup'
function setup() {
    alert("Setup");
    clear();
}

// clean the table and reset the value
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

// triggered by the button with text 'play'
function play() {

    if (haveHero) { // detect whether we have a zero
        inSetup = false;
        round = 1;
        // detect if there is a treasure
        if (treasures.length === 0) {
            end("no treasure");
        } else {
            heroTurn();
        }
    } else {
        alert("You must have one hero!");
    }
}

// represents turn for the hero
function heroTurn() {
    if (theHero.detectSurrounding()) {
        window.onkeypress = function (e) {
            let key = e.key;
            // update round
            document.getElementById("round").innerHTML = "Round: " + round;
            // since it's hero's turn, then the hero should tries to move
            heroMove(key);
        }
    } else {
        end("cannot move");
    }

}

// a utility function
function formatPos(newPos: number[]) {
    return "r" + newPos[0] + "c" + newPos[1];
}

function heroMove(key: string) {
    // old means current
    let oldRow = theHero.getRow();
    let oldCol = theHero.getCol();
    // new means next
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
        console.log(newID);
        theHero.handleSituations(newID);

    } else {
        alert("You can't cross the boundary!");
    }

    robotTurn();

}

function robotTurn() {
    let robotsWaitList: Robot[] = []; // prepared for robots who cannot move
    let allCantMove = true;
    robots.forEach((robot, index) => {
        let makeMovement = robot.decideAction();
        if (!makeMovement) {
            robots.splice(index, 1);
            robotsWaitList.push(robot);
        }
    });
    if (robotsWaitList.length !== 0) {
        robotsWaitList.forEach((robot) => {
            let canMove = robot.decideAction();
            if (canMove) allCantMove = false;
        });
        if (allCantMove) end("cannot move");
    }


}

function end(state: string) {
    //alert("Game is over!\nYour score is " + heroScore);
    let displayScore = "\n\tYour score is: " + heroScore;
    let result = "";
    console.log(state);
    if (state === "kill") {
        result = "You lose!";
    } else {
        if (heroScore > robotsScore) {
            result = "You win!";
        } else if (heroScore < robotsScore) {
            result = "You lose!";
        } else {
            result = "Draw game!"
        }
    }
    alert(result + displayScore);
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

    detectSurrounding() {
        let up: number[] = [], down: number[] = [], left: number[] = [], right: number[] = [];
        // get 4 possible movements in advance
        if (this.getRow() !== 0) {
            up = [this.getRow() - 1, this.getCol()];
        }
        if (this.getRow() !== _size-1) {
            down = [this.getRow() + 1, this.getCol()];
        }
        if (this.getCol() !== 0) {
            left = [this.getRow(), this.getCol() - 1];
        }
        if (this.getCol() !== _size-1) {
            right = [this.getRow(), this.getCol() + 1];
        }
        let allMove = [up, down, left, right];
        console.log(allMove)
        let canMove = false;
        for (const pos of allMove) {
            console.log(pos);
            if (pos.length !== 0) {
                if (document.getElementById(formatPos(pos)).className !== "obstacle") {
                    canMove = true;
                }

            }

        }
        return canMove;
    }

    handleSituations(pos: string) {

        let thatName: string = document.getElementById(pos).className;
        if (thatName === "obstacle") {
            alert("You can't cross a obstacle!");
        } else {
            round++;
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
        // detect its surrounding in 8 directions
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
                    document.getElementById("score").innerHTML = `Hero Score: ${heroScore} Robots Score: ${robotsScore}`;
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