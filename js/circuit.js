export default class Circuit {
    constructor({ width = 1920, height = 1080, cellSize = 10, pathCount = 60, maxPathLength = 80 } = {}) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.pathCount = pathCount;
        this.maxPathLength = maxPathLength;

        this.collisionBoard = Array.from(
            Array(Math.floor(width/cellSize)), 
            () => new Array(Math.floor(height/cellSize)).fill(0)
        );
        
        this.paths = [];

    }

    generatePaths() {
        for(let i=0; i<this.pathCount; i++) {
            let path = [];
            let pathLength = Math.floor(Math.random() * (this.maxPathLength - 1)) + 2;
    
            for(let j=0; j<pathLength; j++) {
                if(path.length === 0) {
                    let emptyIndex = this.getRandomEmptyIndex(
                        this.collisionBoard.map(x => x[0])
                    );
                    path.push({ x: emptyIndex, y: 0 });
                    this.collisionBoard[emptyIndex][0] = 1;

                }
                else {
                    let possiblePositions = this.getPossiblePositions({ x: path[j-1].x, y: j });

                    if(possiblePositions.length > 0) {
                        let choosenPosition = possiblePositions[Math.floor(Math.random() * possiblePositions.length)];

                        path.push(choosenPosition);
                        this.collisionBoard[choosenPosition.x][choosenPosition.y] = 1;

                    } else
                        break;
    
                }      
            }
    
            this.paths.push(path);
    
        }
        
    }

    getRandomEmptyIndex(arr) {
        let indexes = [];

        for(let i=0; i<arr.length; i++) {
            if(arr[i] === 0)
                indexes.push(i);
        }

        return indexes[Math.floor(Math.random() * indexes.length)];

    }

    getPossiblePositions(position) {
        let possiblePositions = [];

        let possiblePosition = { x: position.x, y: position.y + 1 };

        if(possiblePosition.y < this.collisionBoard[0].length) {
            if(this.collisionBoard[possiblePosition.x][possiblePosition.y] === 0)
                possiblePositions.push(possiblePosition);
        }

        possiblePosition = { x: position.x + 1 , y: position.y + 1 };

        if(possiblePosition.x < this.collisionBoard.length) {
            if(this.collisionBoard[possiblePosition.x][possiblePosition.y] === 0)
                possiblePositions.push(possiblePosition);
        }

        possiblePosition = { x: position.x - 1 , y: position.y + 1 };

        if(possiblePosition.x >= 0) {
            if(this.collisionBoard[possiblePosition.x][possiblePosition.y] === 0)
                possiblePositions.push(possiblePosition);
        }

        return possiblePositions;

    }

    draw(context) {
        for(let j=0; j<this.paths.length; j++) {
            let path = this.paths[j];

            for(let i=0; i<path.length-1; i++) {
                context.beginPath();
                context.moveTo(path[i].x * this.cellSize, path[i].y * this.cellSize);
                context.lineTo(path[i+1].x * this.cellSize, path[i+1].y * this.cellSize);
                context.lineWidth = 5;
                context.stroke();
            }
        }
    }

}