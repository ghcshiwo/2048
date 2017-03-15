/**
 * Created by guo on 16/3/31.
 */

var board = new Array();            //板块
var score = 0;                      //分数
var hasConflicted = new Array();    //是否合并过

var startx = 0;                     //开始位置坐标x
var starty = 0;                     //开始位置坐标y
var endx = 0;                       //结束位置坐标x
var endy = 0;                       //结束位置坐标y

$(document).ready(function(){
    prepareForMobile();
    newGame();
});

/**
 * [prepareForMobile 适配移动端]
 */
function  prepareForMobile(){
    // 屏幕大于500 ，网格背景板宽度为500，小块大小为100，小块间隔为20
    if(documentWidth >500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;

    }
    // 屏幕小于500时
    // 设置网格背景板宽、高、padding、圆角值
    $("#grid-container").css("width",gridContainerWidth-2*cellSpace);   //去除padding
    $("#grid-container").css("height",gridContainerWidth-2*cellSpace);
    $("#grid-container").css("padding",cellSpace);
    $("#grid-container").css("border-radius",0.02 * gridContainerWidth);

    // 设置小块宽、高、圆角值
    $(".grid-cell").css("width",cellSideLength);
    $(".grid-cell").css("height",cellSideLength);
    $(".grid-cell").css("border-radius",0.02 * cellSideLength);
}

/**
 * [newGame 重新开始游戏]
 */
function newGame(){
    init();
    generateOneNumber();
    generateOneNumber();
}

/**
 * [init 初始化]
 * @return    {[type]}    [description]
 */
function init(){

    //初始化小块的位置
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var gridcell = $("#grid-cell-"+i+"-"+j);
            gridcell.css('top',getPosTop(i,j));
            gridcell.css('left',getPosLeft(i,j));
        }
    }

    //初始化板块矩阵
    for(var i=0;i<4;i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    // 更新板块视图
    updateBoardView();

    // 分数清零
    score = 0;
    updateScore(score);
}

/**
 * [updateBoardView 更新板块视图]
 * @return    {[type]}    [description]
 */
function updateBoardView(){
    $(".num-cell").remove();    // 清除所有数字块
    // 遍历添加数字块，无数字的不显示，位置在小块中间
    for(var i=0;i<4;i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="num-cell" id="num-cell-'+i+'-'+j+'"></div>');
            var theNumCell = $("#num-cell-"+i+"-"+j);
            if(board[i][j] == 0){
                theNumCell.css("width","0px");
                theNumCell.css("height","0px");
                theNumCell.css("top",getPosTop(i,j)+cellSideLength/2);
                theNumCell.css("left",getPosLeft(i,j)+cellSideLength/2);
            }
            else{
                theNumCell.css("width",cellSideLength);
                theNumCell.css("height",cellSideLength);
                theNumCell.css("top",getPosTop(i,j));
                theNumCell.css("left",getPosLeft(i,j));
                theNumCell.css("background-color",getNumBgColor(board[i][j]));
                theNumCell.css("color",getNumColor(board[i][j]));
                theNumCell.text(board[i][j]);
                theNumCell.css("font-size",getNumFontSize(board[i][j]));
            }
            hasConflicted[i][j] = false;
        }
    }
    $(".num-cell").css("border-radius",0.02 * cellSideLength);
    $(".num-cell").css("line-height",cellSideLength+"px");
    // $(".num-cell").css("font-size",0.6 * cellSideLength+"px");
}
/**
 * [generateOneNumber 生成一个数字]
 * @return    {[type]}    [description]
 */
function generateOneNumber(){
    // 判断是否有空
    if(nospace(board)){
        return  false;
    }
    //随即一个位置，随机50次找空，五十次找不到就遍历找空
    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));
    var time = 0;
    while(time < 50){
        if(board[randx][randy] == 0){
            break;
        }

        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
        time++;
    }

    if(time == 50){
        outerloop:
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    randx = i;
                    randy = j;
                    break outerloop;
                }
            }
        }
    }
    //随机一个数字
    var randNum = Math.random()<0.5?2:4;
    //在随机位置显示随机数值
    board[randx][randy] = randNum;
    showNumWithAnimation(randx,randy,randNum);
    return true;
}

// 键盘事件
$(document).keydown(function(event){
    event.preventDefault();
   switch (event.keyCode)
   {
       case 37 ://left
           if(moveLeft()){
               moveAfter()
           }
           break;
       case 38 ://up
           if(moveUp()){
               moveAfter()
           }
           break;
       case 39 ://right
           if(moveRight()){
               moveAfter()
           }
           break;
       case 40 ://down
           if(moveDown()){
               moveAfter()
           }
           break;
       default ://other
           break;
   }
});
// 监听 ，获取touch起始位置坐标
document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});
// 监听 ，获取touch结束位置坐标，并判断动作
document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;
    // 始末距离太短，动作无效
    if(Math.abs(deltax) <0.3*documentWidth && Math.abs(deltay) <0.3*documentWidth){
        return;
    }

    if(Math.abs(deltax) >= Math.abs(deltay)){
        // 左右距离大，为正数，向右移动，否则向左移动
        if(deltax > 0){
            if(moveRight()){
                moveAfter()
            }
        }
        else{
            if(moveLeft()){
                moveAfter()
            }
        }
    }
    else{
        // 上下距离大，为正数，向下移动，否则向上移动
        if(deltay > 0){
            if(moveDown()){
                moveAfter()
            }
        }
        else{
            if(moveUp()){
                moveAfter()
            }
        }
    }
});

function moveLeft(){
    if(!canMoveLeft(board))
        return false;
    // move left
    for(var i=0;i<4;i++) {
        for (var j = 1; j < 4; j++) {
            if(board[i][j] !=0){
                for(var k=0;k<j;k++){
                    if(board[i][k] == 0 && noBlock(i,k,j,board,true)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                    continue;
                    }
                    else if(board[i][k] == board[i][j] && noBlock(i,k,j,board,true) && !hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score+=board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                    continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
function moveUp(){
    if(!canMoveUp(board))
        return false;
    // move up
    for (var j = 0; j < 4; j++) {
        for(var i=1;i<4;i++) {
            if(board[i][j] !=0){
                for(var k=0;k<i;k++){
                    if(board[k][j] == 0 && noBlock(j,k,i,board,false)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[k][j] == board[i][j] && noBlock(j,k,i,board,false) && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score+=board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
function moveRight(){
    if(!canMoveRight(board))
        return false;
    // move right
    for(var i=0;i<4;i++) {
        for (var j = 2; j >=0; j--) {
            if(board[i][j] !=0){
                for(var k=3;k>j;k--){
                    if(board[i][k] == 0 && noBlock(i,j,k,board,true)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[i][k] == board[i][j] && noBlock(i,j,k,board,true) && !hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
function moveDown(){
    if(!canMoveDown(board))
        return false;
    // move down
    for (var j = 0; j < 4; j++) {
        for(var i=2;i>=0;i--) {
            if(board[i][j] !=0){
                for(var k=3;k>i;k--){
                    if(board[k][j] == 0 && noBlock(j,i,k,board,false)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[k][j] == board[i][j] && noBlock(j,i,k,board,false) && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score+=board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
/**
 * [isGameOver 游戏是否结束]
 */
function isGameOver(){
    //没有空并且不能移动
    if(nospace(board) && nomove(board)){
        alert("Game Over!");
    }
}
/**
 * [moveAfter 可以移动之后的动作]
 */
function moveAfter(){
    // 延时是为了刨除动画时间
    setTimeout("generateOneNumber()",210);
    setTimeout("isGameOver()",420);
}