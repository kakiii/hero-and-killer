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
declare function heroMove(key: string): void;
declare function detectStone(pos: number[]): boolean;
declare function robotTurn(): void;
declare function detectTreasure(robotPos: number[]): string;
declare function randomMove(robotPos: number[]): string[];
declare function end(): void;
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
    detectObstacle(pos: number[]): boolean;
    moveForward(pos: string): void;
}
declare class Robot extends Item implements canMove {
    moveForward(pos: string): void;
    detectSurrounding(): string[] | "hero" | "treasure";
}
declare class Obstacle extends Item {
}
declare class Treasure extends Item {
    value: number;
    getValue(): number;
}
