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

fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer 7f249d17e6a63de60326527e013909682bc30f82' },
    body: JSON.stringify({ query: 
        `{
            user(login: "Anwarus") {
                repositories(first: 1, orderBy: {field: PUSHED_AT, direction: DESC}) {
                    nodes {
                        name
                        pushedAt
                        description
                        languages(first: 10) {
                            nodes {
                                name
                            }
                        }
                    }
                }
            }
        }`
    }),
})
    .then(res => res.json())
    .then(res => {
        console.log(res.data);

        let card = $('.card-github');
        let recentRepository = res.data.user.repositories.nodes[0];
        let lastUpdate = new Date(recentRepository.pushedAt);
        let stack = (recentRepository.languages.nodes).map(language => language.name);

        $(card).find('.github-date').text(lastUpdate.toISOString().substring(0, 10));
        $(card).find('.github-stack').text(stack.join('/'));
        $(card).find('.github-title').text(recentRepository.name);
        $(card).find('.github-description').text(recentRepository.description);

        $(card).find('.github-button.start').attr('href', 'https://github.com/Anwarus/' + recentRepository.name + '/subscription');
        $(card).find('.github-button.start').attr('href', 'https://github.com/Anwarus/' + recentRepository.name);
        $(card).find('.github-button.start').attr('href', 'https://github.com/Anwarus/' + recentRepository.name + '/fork');

        $(card).children('.loader').hide();
        $(card).children('.content').removeClass('hidden');
    })
    .catch(error => {
        console.log("Error: ", error);

        let card = $('.card-github');

        $(card).children('.loader').hide();
        $(card).children('.error').removeClass('hidden');
    });

function createCanvas(id, target) {
    let canvas = document.createElement('canvas');

    canvas.id = id;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * (4/10);

    $(target).append(canvas);

    return canvas;
}