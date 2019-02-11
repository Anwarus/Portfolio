import * as Vec from './vector.js';

export function Interporation(path, { speed = 10 } = {}) {
    let displacement = null;
    if(path[1])
        displacement = Vec.displacement(path[1], path[0]);
    else
        displacement = Vec.Vector(0, 0);

    return {
        path,
        speed,
        displacement,
        index: 1,
        from: path[0],
        to: path[1] || null,
        point: Object.assign({}, path[0]),
        offset: Vec.Vector(
            speed / 100.0 * displacement.x,
            speed / 100.0 * displacement.y
        ),
        update() {
            if(this.to == null)
                return;

            this.point = Vec.add(this.point, this.offset);

            if(Vec.lineDistance(this.point, this.to) < Vec.lineDistance(Vec.Vector(0, 0), this.offset)) {
                this.point = Vec.Vector(this.to.x, this.to.y);
                this.from = this.to;
        
                this.index++;
                if(this.path.length >= this.index + 1) {
                    this.to = this.path[this.index];
        
                    this.displacement = Vec.displacement(this.to, this.from);
                    this.offset = Vec.Vector(
                        this.speed / 100.0 * this.displacement.x,
                        this.speed / 100.0 * this.displacement.y
                    );
        
                }
                else
                    this.to = null;
            }
        },
        draw(context, { cellSize = 10, color = '#f9dc5c', lineWidth = 2 } = {}) {
            if(this.to != null) {
                context.beginPath();
                context.moveTo(this.from.x * cellSize, this.from.y * cellSize);
                context.lineTo(this.point.x * cellSize, this.point.y * cellSize);
                context.lineWidth = lineWidth;
                context.strokeStyle = color;
                context.stroke();
            } else {
                let point = this.path[this.path.length - 1];

                context.beginPath();
                context.arc(point.x * cellSize, point.y * cellSize, 3, 0, 2 * Math.PI);
                context.stroke();
            }

            for(let i=0; i<this.index-1; i++) {
                context.beginPath();
                context.moveTo(this.path[i].x * cellSize, this.path[i].y * cellSize);
                context.lineTo(this.path[i+1].x * cellSize, this.path[i+1].y * cellSize);
                context.lineWidth = lineWidth;
                context.strokeStyle = color;
                context.stroke();

            }
        }
    };
}