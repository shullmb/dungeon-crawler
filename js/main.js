// ***CANVAS SETUP*** //
var dungeon = document.getElementById('game'); //rename canvas id dungeon when implemented
var battleScreen = document.getElementById('battle-screen')
var ctx = dungeon.getContext('2d');
var ctx2 = dungeon.getContext('2d');
var ctxWidth = '832';
var ctxHeight = '416';

dungeon.width = ctxWidth;
dungeon.height = ctxHeight;
battleScreen.width = ctxWidth;
battleScreen.height = ctxHeight;

// ***GLOBAL VARIABLES*** //
var gameLoopHandle;
var battleMode = false;

var player;
var crawler = {current: null};
var turn = null;

// ***HELPER FUNCTIONS***




