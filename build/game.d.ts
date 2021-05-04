declare const _size = 10;
declare let inSetup: boolean;
declare let theHero: Hero;
declare let robots: Robot[];
declare let obstacles: Obstacle[];
declare let treasures: Treasure[];
declare let haveHero: boolean;
declare let heroScore: number;
declare let robotsScore: number;
declare let round: number;
declare function addItem(block: {
    id: string;
}): void;
declare function setup(): void;
declare function clear(): void;
declare function play(): void;
declare function heroTurn(): void;
declare function formatPos(newPos: number[]): string;
declare function heroMove(key: string): void;
declare function robotTurn(): void;
declare function end(state: string): void;
declare class Item {
    location: string;
    constructor(location: string);
    getLocation(): string;
    getRow(): number;
    getCol(): number;
    setLocation(pos: string): void;
}
interface canMove {
    moveForward(pos: string): void;
}
declare class Hero extends Item implements canMove {
    handleSituations(pos: string): void;
    moveForward(pos: string): void;
}
declare class Robot extends Item implements canMove {
    moveForward(pos: string): void;
    detectSurrounding(): string[];
    decideAction(): boolean;
}
declare class Obstacle extends Item {
}
declare class Treasure extends Item {
    value: number;
    getValue(): number;
}
