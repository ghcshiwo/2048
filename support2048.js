/**
 * Created by guo on 16/3/31.
 */

documentWidth = window.screen.availWidth;   //屏幕宽度
gridContainerWidth = 0.92 *documentWidth;   //网格背景板宽度
cellSideLength = 0.18 *documentWidth;       //小块大小
cellSpace = 0.04 * documentWidth;           //小块间隙

/**
 * [getPosTop 获取小块坐标 top]
 * @param     {[number]}    i [小块所在的行数]
 * @param     {[number]}    j [小块所在的列数]
 * @return    {[number]}      [小块距离背景板的Top的距离]
 */
function getPosTop(i,j){
    return cellSpace+i*(cellSpace+cellSideLength);
}

/**
 * [getPosLeft 获取小块坐标 left]
 * @param     {[number]}    i [小块所在的行数]
 * @param     {[number]}    j [小块所在的列数]
 * @return    {[number]}      [小块距离背景板的Left的距离]
 */
function getPosLeft(i,j){
    return cellSpace+j*(cellSpace+cellSideLength);
}

/**
 * [getNumBgColor 获取数字背景色]
 * @param     {[number]}    num [数字]
 * @return    {[string]}        [颜色]
 */
function getNumBgColor(num){
    switch (num){
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
        case 16384:return "#f00";break;
    }
    return "black";
}

/**
 * [getNumFontSize 获取数字字号]
 * @param     {[number]}    num [数字]
 * @return    {[string]}        [字号]
 */
function getNumFontSize(num){
    if(num <100){
        return "60px";
    }
    else if(num < 1000){
        return "50px";
    }
    else{
        return "40px";
    }
}

/**
 * [getNumColor 获取数字颜色]
 * @param     {[number]}    num [数字]
 * @return    {[string]}        [颜色]
 */
function getNumColor(num){
    if(num <= 4){
        return "#776e65";
    }
    return "white";
}

/**
 * [nospace 板块上是否有空]
 * @param     {[array]}    board [板块矩阵]
 * @return    {[boolean]}        [true：没空]
 */
function nospace(board){
    for(var i=0;i<4;i++) {
        for (var j = 0; j < 4; j++) {
            if(board[i][j] == 0){
                return false;
            }
        }
    }
    return true;
}

/**
 * [canMoveLeft 能否左移]
 * @param     {[array]}    board [板块矩阵]
 * @return    {[boolean]}        [true：能]
 */
function canMoveLeft(board){
    for(var i=0;i<4;i++) {
        for (var j = 1; j < 4; j++) {       //最左边不能左移，不需要遍历
            if(board[i][j] !=0){            //当前板块矩阵有值
                if(board[i][j-1] == 0 || board[i][j-1] == board[i][j]){  //左边板块为空，或者左边板块与当前版块数值一样
                    return true;
                }
            }
        }
    }
    return false;
}
/**
 * [canMoveUp 能否上移]
 * @param     {[array]}    board [板块矩阵]
 * @return    {[boolean]}        [true：能]
 */
function canMoveUp(board){
    for (var j = 0; j < 4; j++) {
        for(var i=1;i<4;i++) {  //最上边不能上移，不需要遍历
            if(board[i][j] !=0){
                if(board[i-1][j] == 0 || board[i-1][j] ==board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}
/**
 * [canMoveRight 能否右移]
 * @param     {[array]}    board [板块矩阵]
 * @return    {[boolean]}        [true：能]
 */
function canMoveRight(board){
    for(var i=0;i<4;i++) {
        for (var j = 2; j >=0; j--) { //最右边不能右移，不需要遍历，最近原则移动。
            if(board[i][j] !=0){
                if(board[i][j+1] == 0 || board[i][j+1] ==board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}
/**
 * [canMoveDown 能否下移]
 * @param     {[array]}    board [板块矩阵]
 * @return    {[boolean]}        [true：能]
 */
function canMoveDown(board){
    for (var j = 0; j < 4; j++) {
        for(var i=2;i>=0;i--) { //最下边不能下移，不需要遍历，最近原则移动。
            if(board[i][j] !=0){
                if(board[i+1][j] == 0 || board[i+1][j] ==board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}
/**
 * [noBlock 是否有阻挡]
 * @param     {[type]}    row   [行数/列数]
 * @param     {[type]}    col1  [起始位置]
 * @param     {[type]}    col2  [结束为值]
 * @param     {[type]}    board [板块矩阵]
 * @param     {[type]}    bool  [true ：左右移动，false : 上下移动]
 * @return    {[type]}          [true ：无阻挡]
 */
function noBlock(row,col1,col2,board,bool){
    if(bool) {
        for (var i = col1 + 1; i < col2; i++) {
            if (board[row][i] != 0) {
                return false;
            }
        }
    }
    else {
        for (var i = col1 + 1; i < col2; i++) {
            if (board[i][row] != 0) {
                return false;
            }
        }
    }
    return true;
}
/**
 * [nomove 不能移动]
 * @param     {[array]}    board [板块矩阵]
 * @return    {[boolean]}        [true：不能移动]
 */
function nomove(board){
    if(canMoveDown(board) || canMoveLeft(board) || canMoveRight(board) || canMoveUp(board)){
        return false;
    }
    return true;
}