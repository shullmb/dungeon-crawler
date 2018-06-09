// ***CRAWLER, HERO PROTOTYPE & GENERATOR*** //
function Crawler(x, y, src) {
    this.x = x;
    this.y = y;
    this.src = src;
    this.srcLrg = src.replace('32', '64');
    this.width = 32;
    this.height = 32;
    this.level = 1;
    this.initiative = 0;
    this.hp = 8 + Math.round(Math.random() * 3); // randomize starting hp a little
    this.initiative = 0;
}

// render to a canvas
Crawler.prototype.render = function (ctx) {
    var spriteImg = new Image();
    spriteImg.src = this.src;
    ctx.drawImage(spriteImg, this.x, this.y, this.width, this.height);
}

// roll for initiatice
Crawler.prototype.rollInitiative = function () {
    this.initiative = rollDie(20);
}

// attack roll - player level x d'n'
Crawler.prototype.rollAttack = function (n) {
    return this.level * rollDie(n);
}

// level up
Crawler.prototype.levelUp = function () {
    this.level += 1
    this.hp += this.level * rollDie(8) + 4;
}

// create hero prototype 
function Hero(x, y, src) {
    Crawler.call(this, x, y, src);
    this.hp = 15 + Math.round(Math.random() * 5);
    this.spellSlots = 3;
    this.healSlots = 1;
}

Hero.prototype = Object.create(Crawler.prototype);
Hero.prototype.constructor = Hero;

// cantrip roll - player level x d8
Hero.prototype.rollCantrip = function () {
    return this.level * rollDie(8)
}

// hero extras on the level up
Hero.prototype.levelUp = function () {
    Crawler.prototype.levelUp.call(this);
    this.spellSlots += Math.round(this.level / 2);
    this.healSlots++;
}

// ***TEST CRAWLER*** //
function Mover(x,y,src) {
    Crawler.call(this, x, y, src);
}

Mover.prototype = Object.create(Crawler.prototype);
Mover.prototype.constructor = Mover;

Mover.prototype.hunt = function() {
    var dx = this.x - player.x;
    var dy = this.y - player.y;
    
    if ( dx > 0) {
        this.x--; 
        this.src = this.src.replace('r','l');
    } else {
        this.x++;
        this.src = this.src.replace(/-l/,'-r');
    }
    
    if ( dy > 0 ) {
        this.y--; 
    } else {
        this.y++;
    }

}