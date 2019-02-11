import * as Cir from './circuit';

$(document).ready(function() {
    let canvas = createCanvas('screen', '#target');
    let context = canvas.getContext('2d');
    let circuit = Cir.Circuit(canvas);

    circuit = Cir.randomizePaths(circuit);
    circuit = Cir.setupInterpolations(circuit);

    loop();

    function loop() {
        requestAnimationFrame(loop);
    
        context.clearRect(0, 0, canvas.width, canvas.height);
        Cir.update(circuit);
        Cir.draw(circuit);
    }

    var win = $(window);
    var allMods = $('.slide');

    // Already visible modules
    allMods.each(function(i, element) {
        let el = $(element);
        if (el.discovered()) {
            el.addClass('already-visible'); 
        } 
    });

    win.scroll(function(event) {
        allMods.each(function(i, element) {
            let el = $(element);
            if (el.discovered(true)) {
                el.addClass('come-in'); 
            } 
        });
    
    });

    $(window).scroll(function(event) {
        $('.slide').each(function(i, element) {
            let el = $(element);
            if (el.discovered(true)) {
                el.addClass('come-in'); 
            } 
        });
    });
    
});

function createCanvas(id, target) {
    let canvas = document.createElement('canvas');

    canvas.id = id;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * (4/10);

    $(target).append(canvas);

    return canvas;
}