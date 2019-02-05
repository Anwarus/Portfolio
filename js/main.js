import Circuit from './circuit';

$(document).ready(function() {
    let canvas = createCanvas('screen', '#target');
    let context = canvas.getContext('2d');
    //let circuit = new Circuit(canvas);

    function loop() {
        requestAnimationFrame(loop);
    
        context.clearRect(0, 0, canvas.width, canvas.height);
        circuit.draw(context);
    
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
    canvas.height = window.innerHeight;

    $(target).append(canvas);

    return canvas;
}