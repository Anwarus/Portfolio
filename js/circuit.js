import * as Vec from './vector.js';
import { Interporation } from './interpolation.js';

//Data
const POSITION_STATE = {
    EMPTY: 0,
    BUSY: 1
};

export function Circuit(canvas, { cellSize = 10, pathCount = 100, minPathLength = 20, maxPathLength = 35, straightChance = 96 } = {}) {
    return {
        canvas,
        settings: {
            cellSize,
            pathCount,
            minPathLength,
            maxPathLength,
            straightChance
        },
        context: canvas.getContext('2d'),
        width: canvas.width,
        height: canvas.height,
        paths: new Array(pathCount).fill([]),
        interpolations: new Array(pathCount).fill({}),
        collisionBoard: Array.from(
            Array(Math.floor(canvas.width/cellSize)), 
            () => new Array(Math.floor(canvas.height/cellSize)).fill(POSITION_STATE.EMPTY)
        )
    };
}

//Functions

export function setupInterpolations(circuit) {
    let circuitCopy = Object.assign({}, circuit);
    circuitCopy.interpolations = circuitCopy.interpolations.map((interpolation, index) => {
        return setupInterpolation(circuit.paths[index]);
    });

    return circuitCopy;
}

function setupInterpolation(path) {
    return Interporation(path, { speed: Math.floor(Math.random() * 20 + 10) });
}

export function randomizePaths(circuit) {
    let circuitCopy = Object.assign({}, circuit);

    circuitCopy.paths = circuitCopy.paths.map(() => {
        return randomizePath(circuitCopy.collisionBoard, circuitCopy.settings);
    });
    
    return circuitCopy;
}

function randomizePath(collisionBoard, settings) {
    let pathLength = Math.floor(Math.random() * (settings.maxPathLength - settings.minPathLength)) + settings.minPathLength;
    let path = [];

    for(let i=0; i<pathLength; i++) {
        let vector = randomizeVector(
            collisionBoard,
            settings,
            (i > 0) ? path[i - 1]: null 
        );

        if(vector != null)
            path.push(vector);
        else
            break;
    }

    return path;
}

function randomizeVector(collisionBoard, settings, lastVector = null) {
    let vector = null;

    if(lastVector == null) 
        vector = setRandomStartPosition(collisionBoard);
    else {
        if(isMovingStraight(settings)) {
            if(isStraightMovePossible(collisionBoard, lastVector))
                vector = moveStraight(collisionBoard, lastVector);
        } else {
            if(isMovingLeft()) {
                if(isLeftMovePossible(collisionBoard, lastVector))
                    vector = moveLeft(collisionBoard, lastVector);
            } else {
                if(isRightMovePossible(collisionBoard, lastVector))
                    vector = moveRight(collisionBoard, lastVector);
            }
        }

    }

    return vector;
}

function setRandomStartPosition(collisionBoard) {
    let emptyIndex = getRandomEmptyIndex(collisionBoard.map(x => x[0]));
    let vector = Vec.Vector(emptyIndex, 0);
    collisionBoard[vector.x][vector.y] = POSITION_STATE.BUSY;

    return vector;
}

function isMovingStraight(settings) {
    return (Math.floor(Math.random() * 100) < settings.straightChance) ? true : false;
}

function isMovingLeft() {
    return (Math.floor(Math.random() * 2) < 1) ? true : false;
}

function isStraightMovePossible(collisionBoard, lastVector) {
    let possibleVector = Vec.Vector(lastVector.x, lastVector.y + 1);

    if(possibleVector.y < collisionBoard[0].length)
        if(collisionBoard[possibleVector.x][possibleVector.y] === POSITION_STATE.EMPTY)
            return true;

    return false;
}

function isLeftMovePossible(collisionBoard, lastVector) {
    let possiblePosition = Vec.Vector(lastVector.x - 1, lastVector.y + 1);

    if(possiblePosition.x >= 0 && possiblePosition.y < collisionBoard[0].length) {
        if(collisionBoard[possiblePosition.x][possiblePosition.y] === POSITION_STATE.EMPTY &&
           collisionBoard[possiblePosition.x + 1][possiblePosition.y] === POSITION_STATE.EMPTY)
            return true;
    }
    
    return false;
}

function isRightMovePossible(collisionBoard, lastVector) {
    let possiblePosition = Vec.Vector(lastVector.x + 1, lastVector.y + 1);

    if(possiblePosition.x < collisionBoard.length && possiblePosition.y < collisionBoard[0].length) {
        if(collisionBoard[possiblePosition.x][possiblePosition.y] === POSITION_STATE.EMPTY &&
           collisionBoard[possiblePosition.x - 1][possiblePosition.y] === POSITION_STATE.EMPTY)
            return true;
    }
    
    return false;
}

function moveStraight(collisionBoard, lastVector) {
    let newVector = Vec.Vector(lastVector.x, lastVector.y + 1);
    collisionBoard[newVector.x][newVector.y] = POSITION_STATE.BUSY;

    return newVector;
}

function moveLeft(collisionBoard, lastVector) {
    let newVector = Vec.Vector(lastVector.x - 1, lastVector.y + 1);
    collisionBoard[newVector.x][newVector.y] = POSITION_STATE.BUSY;

    return newVector;
}

function moveRight(collisionBoard, lastVector) {
    let newVector = Vec.Vector(lastVector.x + 1, lastVector.y + 1);
    collisionBoard[newVector.x][newVector.y] = POSITION_STATE.BUSY;

    return newVector;
}

function getRandomEmptyIndex(array) {
    let emptyIndexes = getEmptyIndexes(array);
    return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
}

function getEmptyIndexes(array) {
    let emptyIndexes = [];
    
    array.map((value, index) => {
        if(value === POSITION_STATE.EMPTY)
            emptyIndexes.push(index);
    });

    return emptyIndexes;
}

export function update(circuit) {
    for(let i=0; i<circuit.interpolations.length; i++) {
        circuit.interpolations[i].update();
    }
}

export function draw(circuit) {
    for(let i=0; i<circuit.interpolations.length; i++) {
        circuit.interpolations[i].draw(circuit.context, { cellSize: circuit.settings.cellSize });
    }
}