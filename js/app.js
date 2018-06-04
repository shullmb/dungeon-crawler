const game = document.getElementById('game');
const ctx = game.getContext('2d');
game.width = "832";
game.height = "416";

var mage;
var mush;

class Crawler {
    constructor(x,y,src) {
        this.x = x;
        this.y = y;
        this.src = src;
        this.width = 32;
        this.height = 32;
    }

    render() {
        let spriteImg = new Image();
        spriteImg.src = this.src;
        ctx.drawImage(spriteImg,this.x,this.y,this.width,this.height);
    }
}

const gameLoop = () => {
    ctx.clearRect(0,0,game.width,game.height);
    mage.render();
    mush.render();
}


document.addEventListener("DOMContentLoaded", function() {
    console.log('craaaawwwwwwl');

    mage = new Crawler(10, 10,'../img/plc-mage-32.png');
    mush = new Crawler(200, 50,'../img/wandering_mushroom_new.png');

    // mush.render();

    setInterval(gameLoop, 60);






})