//Data
export function Vector(x = 0, y = 0) {
    return {
        x: x,
        y: y
    };
}

//Functions

export function lineDistance(vector1, vector2) {
    return Math.hypot(vector2.x - vector1.x, vector2.y - vector1.y);
}

export function displacement(vector1, vector2) {
    return Vector(vector1.x - vector2.x, vector1.y - vector2.y);
}

export function multiply(vector1, vector2) {
    return Vector(vector1.x * vector2.x, vector1.y * vector2.y);
}

export function divide(vector, divider) {
    return Vector(vector.x / divider, vector.y / divider);
}

export function add(vector1, vector2) {
    return Vector(vector1.x + vector2.x, vector1.y + vector2.y);
}
