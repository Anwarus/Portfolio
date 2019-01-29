import Circuit from './circuit';

$(document).ready(function() {
    let canvas = createCanvas('screen', '#target');
    let context = canvas.getContext('2d');
    let circuit = new Circuit();
    circuit.generatePaths();
    circuit.draw(context);
    
});

function createCanvas(id, target) {
    let canvas = document.createElement('canvas');

    canvas.id = id;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    $(target).append(canvas);

    return canvas;
}