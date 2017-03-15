/**
 * Created by guo on 16/3/31.
 */

/**
 * [showNumWithAnimation 显示数字动画]
 * @param     {[number]}    i   [行数]
 * @param     {[number]}    j   [列数]
 * @param     {[number]}    num [数字]
 */
function showNumWithAnimation(i,j,num){
    var numCell = $("#num-cell-"+i+"-"+j);
    numCell.css("background-color",getNumBgColor(num));
    numCell.css("color",getNumColor(num));
    numCell.text(num);
    numCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop(i,j),
        left:getPosLeft(i,j)
    });
}

/**
 * [showNumWithAnimation 移动动画]
 * @param     {[number]}    i   [行数]
 * @param     {[number]}    j   [列数]
 * @param     {[number]}    num [数字]
 */
function showMoveAnimation(fx,fy,tx,ty){
    var numCell = $("#num-cell-"+fx+"-"+fy);
    numCell.animate({
        top:getPosTop(tx,ty),
        left:getPosLeft(tx,ty)
    },200);
}
/**
 * [updateScore 更新分数]
 * @param     {[number]}    score [分数]
 */
function updateScore(score){
    $('#score').text(score);
}