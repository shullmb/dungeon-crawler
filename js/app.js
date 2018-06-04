const game = document.getElementById('game');
const ctx = game.getContext('2d');
game.width = "832";
game.height = "416";
var img;
var mage;
var mush;

img = new Image();
img.src = '../img/plc-mage-32.png'

class Crawler {
    constructor(x,y,src) {
        this.x = x;
        this.y = y;
        this.src = src;
        this.width = 32;
        this.height = 32;
    }

    render() {
        ctx.drawImage(this.src,this.x,this.y,this.width,this.height);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    console.log('craaaawwwwwwl');

    ctx.drawImage(img, 10,10, 32,32);







})