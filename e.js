document.writeln("<h1 style='text-align:center'>COMP284 Assignment2</h1>");
document.writeln("<table>");
const _size = 9;
for (let i = 0; i < _size; i++) {
    document.writeln("<tr>");
    for (let j = 0; j < _size; j++) {
        document.writeln("<td onclick='addItem(this)'" + "id=" + "r" + i + "c" + j + "></td>");
    }
    document.writeln("</tr>");
}
document.writeln("</table>");

let haveHero = false;
let numTreasure = 0;
let inSetup = true;
function addItem(block) {
    if (inSetup) {
        let val = prompt("Please enter a value in the following range: 0-9, o, h, k");
        console.log(typeof val);
        if (val === "h") {
            if (!haveHero) {
                document.getElementById(block.id).className = "hero";
                haveHero = true;
            } else {
                alert("You can only have one hero!");
            }
        } else if (val === "o") {
            document.getElementById(block.id).className = "obstacle";
        } else if (val === "k") {
            document.getElementById(block.id).className = "killer";
        } else if (parseInt(val) < 10) {
            document.getElementById(block.id).className = "treasure";
            numTreasure++;
        } else {
            alert("Your input is invalid!");
        }
    } else {
        alert("You are not in the setup stage!");
    }
}

function setup() {
    for (let row = 0; row < _size; row++) {
        for (let col = 0; col < _size; col++) {
            document.getElementById("r" + row + "c" + col).className = "";
        }
    }
    inSetup = true;
}

function play() {
    if (haveHero) {
        inSetup = false;
    } else {
        alert("You must have at least one hero!");
    }
}
