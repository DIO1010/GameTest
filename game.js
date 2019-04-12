const Glaphic = require('./src/liblary'); // electron
//import Glaphic from './src/liblary.js';
// ブラウザでデバッグするよう↓
/*
class Glaphic {
	// canvas htmlキャンバスを取得
	// fileimage,imageWidth,imageHeight ファイル画像、画像幅、画像高さ
	// constructor(canvas,filename,imageWidth,imageHeight) {
	constructor(context,filename,imageWidth,imageHeight) {
		// this.context = canvas.getContext('2d');
		this.context = context;
		this.img = new Image();
		this.img.src = filename;
		this.width = imageWidth;
		this.height = imageHeight;
		//console.log(context);
		//console.log(this.context);
	}

	// drawImage
	paint(x,y){
		//console.log(this.context);
		//console.log(this.img);
		this.context.drawImage(this.img,x,y);
	}
}
*/
// ステージの幅、高さの定数
const STAGE_WIDTH = 8;
const STAGE_HEIGHT = 8;
// 画像の大きさの定数
const IMAGE_SIZE = 64;

// Player位置の変数
var player_x = 5,player_y = 2;

// FPS
const fps = 30;
var ms = 1000 / fps ;
var count = 0;

// ステージのマップ
var stage = [
    1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,1,
    1,0,3,0,3,0,0,1,
    1,0,2,0,2,0,0,1,
    1,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,
];

var buffered = new Array(STAGE_WIDTH * STAGE_HEIGHT);

// stageチップ列挙
var StageChip = {
	NONE : 0,
	WALL : 1,
	BLOCK : 2,
	GOAL : 3,
	PLAYER : 4,
	BLOCK_GOAL : 5,
	PLAYER_GOAL : 6
};

//2Dコンテキストのオブジェクトを生成する
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

//画像オブジェクトを生成
// 画像のPath配列
var srcs = [
    "img/none.png",
    "img/wall.png",
    "img/block.png",
    "img/goal.png",
    "img/player.png"
];
// 画像オブジェクトの配列
var images = [];
// 画像インスタンス
for(var i in srcs)
{
	images[i] = new Glaphic(context,srcs[i],IMAGE_SIZE,IMAGE_SIZE);
}

// Playerを動かす先の座標を指定する。
// 範囲外なら指定しない。
function stageChange(){
	var dx = 0;
	var dy = 0;
	var player_x_t = player_x;
	var player_y_t = player_y;
    document.onkeydown = function(){
        switch (event.keyCode) {
            case 87: // W
                dy = -1;
                break;
            case 65: // A
                dx = -1;
                break;
            case 83: // S
                dy = 1;
                break;
            case 68: // D
                dx = 1;
                break;
		}

		player_x_t += dx;
        player_y_t += dy;

		// Playerが壁にめり込まないように
		// めり込む場合は、代入しない
        if(player_x_t <= 0
        || player_x_t >= STAGE_WIDTH - 1
        || player_y_t <= 0
        || player_y_t >= STAGE_HEIGHT - 1){
			return;
        }

		var prePosition = player_y * STAGE_WIDTH + player_x;
		var nowPosition = player_y_t * STAGE_WIDTH + player_x_t;

		// 移動先が何もないか、ゴールなら	
		if(stage[nowPosition] == StageChip.NONE || stage[nowPosition] == StageChip.GOAL){
			player_x = player_x_t;
			player_y = player_y_t;
		}
		// Blockに触れた時の処理を描く
		
		if(stage[nowPosition] == StageChip.BLOCK){
			var nexPosition = (player_y_t + dy) * STAGE_WIDTH + (player_x_t + dx);
			if(stage[nexPosition] == StageChip.NONE){
				stage[nowPosition] = StageChip.NONE;
				stage[nexPosition] = StageChip.BLOCK;
				player_x = player_x_t;
				player_y = player_y_t;
			}
		}
	}
}

// Playerを指定した座標に表示させる
function putPlayer(x,y)
{
    var img_x = x * IMAGE_SIZE;
    var img_y = y * IMAGE_SIZE;

	images[StageChip.PLAYER].paint(x * IMAGE_SIZE,img_y);
};

function draw(){
    // canvasクリア
    context.clearRect(0,0,canvas.width,canvas.height);

    // 要素を描画
    context.beginPath();
    for(var i in srcs){
        for(var y = 0; y < STAGE_HEIGHT;y++)
        {
            for(var x = 0;x < STAGE_WIDTH;x++)
            {
                var img_x = x * IMAGE_SIZE;
                var img_y = y * IMAGE_SIZE;
                var imgIndex = stage[y * STAGE_WIDTH + x];
				images[imgIndex].paint(img_x,img_y);
            }
        }
    }
    putPlayer(player_x,player_y);
};

function loop(){
    stageChange();
    draw();
    setTimeout("loop()",ms);
};

loop();
