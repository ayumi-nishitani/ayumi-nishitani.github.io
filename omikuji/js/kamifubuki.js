//--------------------------------------------------------------------
// Falls colorful confetti. 色とりどりの紙吹雪が降る
// CopyRight(C) 2014 Simple Style, All rights reserved.
// Last update : 2017.10.23 const,addEventListener
//--------------------------------------------------------------------
// NUM        : 表示する要素の数
// MSEC       : 更新処理間隔(ミリ秒）
// MAX_SIZE   : 表示する画像の最大サイズ（単位：px）
// MIN_SIZE   : 表示する画像の最大サイズ（単位：px）
// DROP       : 画像の最小落下速度（大きくすると速く落下）
// AMPL       : 画像の振幅の具合
// WIND       : 風の割合（正数=右へ、負数=左へ吹く）
// PLC        : ウィンドウ内で画像が発生する場所
//             （PLC=0:全体、1:中央、2:右側、3:左側）
//--------------------------------------------------------------------
//( function(){ //IIFE start
// Setting constants thar can be adjusted.
const NUM = 28;      // number of element:
const MSEC = 50;     // update interval(millimeters second)
const MAX_SIZE = 18; // maximum size(pixel)
const MIN_SIZE = 8;  // minimum size(pixel)
const DROP = 5;      // drop speed
const AMPL = 0.05;   // amplitude rate
const WIND = 0;      // quantity of wind(positive:right,negative:left)
const PLC = 0;       // place to display
                     // (0:all, 1:center, 2:right, 3:left)
//-------------------------------------------------------------------
const OBJ = new Array(); // stores the information of the object
var sizew = new Array(); // width of the image
var sizeh = new Array(); // height of the image
var posx = new Array();  // x coordinate position
var posy = new Array();  // y coordinate position
var ampl = new Array();  // stores a value of the amplitude
var steps = new Array(); // value of the amplitude every step
var speed = new Array(); // speed to fall
var freq = new Array();  // condition of the frequency
var ang = new Array();   // set the angle
var type = new Array();  // set rotate type
var winx = 800;          // width of the window(default:800px)
var winy = 600;          // height of the window(default:600px)

// Output of the element.
// 2017.5.17 要素の表示位置を固定「fixed」に変更
// 2017.10.27 'document.write' do not use
for( var i=0; i<NUM; i++ ){
  const ADD_DIV = document.createElement('div');
  ADD_DIV.setAttribute('id','Lay'+i);
  const DIVS = ADD_DIV.style;
  DIVS.position = 'fixed';
  DIVS.left = '-50px';
  DIVS.top  = '-50px';
  DIVS.width  = MAX_SIZE+'px';
  DIVS.height = MAX_SIZE+'px';
  DIVS.backgroundColor = '#fff';
  document.body.appendChild(ADD_DIV);
}

// Initial setting of the variable. 変数の初期設定
var le = 0;        // position from the left edge 左端からの位置
var dw = 0;        // size of the width to display 表示する幅のサイズ
var ms = MAX_SIZE; // largest size in the image 画像の中で最も大きなサイズ
document.addEventListener('DOMContentLoaded',initSet,false);
function initSet(){
  getWindowSize();
  const RANGE_SIZE = MAX_SIZE-MIN_SIZE+1;
  if(PLC==0)     { dw = winx-ms;   le = 0; }      //all
  else if(PLC==1){ dw = winx/3;    le = winx/3; } //center
  else if(PLC==2){ dw = winx/2-ms; le = winx/2; } //right
  else if(PLC==3){ dw = winx/2;    le = 0; }      //left
  for( var i=0; i<NUM; i++ ){
    ampl[i]  = Math.random()*(Math.PI*2);
    steps[i] = Math.random()*0.1+AMPL;
    speed[i] = Math.floor(Math.random()*5)+DROP;
    freq[i]  = Math.floor(Math.random()*3)+2;
    ang[i] = 0;
    type[i] = Math.floor(Math.random()*4);
    sizew[i] = Math.floor(Math.random()*RANGE_SIZE+MIN_SIZE);
    sizeh[i] = sizew[i];
    posx[i] = Math.floor(Math.random()*dw)+le;
    posy[i] = Math.floor(Math.random()*(winy-sizeh[i]));
    OBJ[i] = document.getElementById('Lay'+i).style;
    OBJ[i].zIndex = Math.floor(Math.random()*NUM);
    OBJ[i].left = posx[i] + 'px';
    OBJ[i].top  = posy[i] + 'px';
    OBJ[i].width  = sizew[i] + 'px';
    OBJ[i].height = sizeh[i] + 'px';
    OBJ[i].backgroundColor = setColor();
  }
  Moves();
}

// Main routine,Moving images.
function Moves(){
  getWindowSize();
  if(PLC==0)     { dw = winx-ms;   le = 0; }      //all
  else if(PLC==1){ dw = winx/3;    le = winx/3; } //center
  else if(PLC==2){ dw = winx/2-ms; le = winx/2; } //right
  else if(PLC==3){ dw = winx/2;    le = 0; }      //left
  for( var i=0; i<NUM; i++ ){
    ampl[i] += steps[i];
    posx[i] += Math.sin(ampl[i])*freq[i]+WIND;
    posy[i] += Math.cos(Math.PI/180)*speed[i];
    ang[i] = (ang[i]%360)+5;
    // If an image disappears from a screen, return to the top.
    // 画面から画像が消えたら上に戻す
    //if( posx[i]>(winx-sizew[i]) || posy[i]>(winy-sizeh[i]) ){ //absolute
    if( posx[i]>winx || posy[i]>winy ){
      posx[i] = Math.floor(Math.random()*dw)+le;
      posy[i] = -50;
      type[i] = Math.floor(Math.random()*4);
      OBJ[i].backgroundColor = setColor();
    }
    rotateElem( i, type[i], ang[i] );
    OBJ[i].left = posx[i] + 'px';
    OBJ[i].top  = posy[i] + 'px';
  }
  setTimeout( Moves, MSEC );
}

// ベンダープレフィックス（接頭辞）無し（CSS3標準）も併記する
// * : 角度
// transform: rotate( *deg );         // CSS3
// -moz-transform: rotate( *deg );    // Firefox
// -webkit-transform: rotate( *deg ); // Chrome,Safari
// -ms-transform: rotate( *deg );     // IE
// -o-transform: rotate( *deg );      // Opera
// rotateZ() = rotate() のため、ここでは記述なし
// IEでは、rotateX/Y/Z/3Dは、IE10からのサポートとなり、
// 接頭辞をつけても意味がないのでrorate()以外削除
// Rotate the element.
function rotateElem( n, t, ang ){
  if( t==0 ){
    OBJ[n].transform       = 'rotate('+ang+'deg)';
    OBJ[n].MozTransform    = 'rotate('+ang+'deg)';
    OBJ[n].WebkitTransform = 'rotate('+ang+'deg)';
    OBJ[n].msTransform     = 'rotate('+ang+'deg)';
  }else if( t==1 ){
    OBJ[n].transform       = 'rotateX('+ang+'deg)';
    OBJ[n].MozTransform    = 'rotateX('+ang+'deg)';
    OBJ[n].WebkitTransform = 'rotateX('+ang+'deg)';
  }else if( t==2 ){
    OBJ[n].transform       = 'rotateY('+ang+'deg)';
    OBJ[n].MozTransform    = 'rotateY('+ang+'deg)';
    OBJ[n].WebkitTransform = 'rotateY('+ang+'deg)';
  }else if( t==3 ){
    OBJ[n].transform       = 'rotate3D(1,0,1,'+ang+'deg)';
    OBJ[n].MozTransform    = 'rotate3D(1,0,1,'+ang+'deg)';
    OBJ[n].WebkitTransform = 'rotate3D(1,0,1,'+ang+'deg)';
  }
  else return;
}

// 色をアバウトに設定する場合 setColor()
// c.sort(function(){}) : 並び替え方法を示す関数
// 戻り値が正数なら昇順、負数なら降順、省略は文字コード順
// 16進数 表示
// Color settings.

function setColor() {
  // ランダムな0または1を生成
  var randomIndex = Math.round(Math.random());

  // 選択されたランダムな色
  var colors = ['#dea700', '#f9cb3f'];
  var selectedColor = colors[randomIndex];

  return selectedColor;
}

// Get size of the window.
window.addEventListener('resize',getWindowSize,false);
function getWindowSize(){
  const propType = (document.documentElement)?
    document.documentElement:document.body;
  if( typeof window.innerWidth != 'number' ){
    winx = window.innerWidth-18;
    winy = window.innerHeight-18;
  }else{
    winx = propType.clientWidth;
    winy = propType.clientHeight;
  }
}
//}() ); //IIFE end