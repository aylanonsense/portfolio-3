z=document.getElementById('canvas');
style='fillStyle';
draw='fillRect';
ctx=z.getContext('2d');
ctx.font="20px Arial";
function reset(fully){
	if(fully){
		positions=[0];
		nextMoveDir=moveDir=2
	}
	foodPos=~~(numTiles*Math.random());
	isGameOver=0
}
reset(numTiles=400);
document.onkeydown=function(evt){
	whichKey=evt.which;
	if(36<whichKey&whichKey<41&moveDir%2==whichKey%2){nextMoveDir=whichKey-37}
	if(isGameOver&whichKey==32){reset(1)}
};
setInterval(function(){
	//draw background
	ctx[style]="#cfb";
	ctx[draw](0,0,numTiles,numTiles);
	ctx[style]="#444";
	if(isGameOver){
		ctx.fillText("Game Over! Press Space to start",50,160)
	}
	else{
		//move snake
		moveDir=nextMoveDir;
		positions.unshift(tempPos0=positions[0]-[1,twenty=20,-1,-twenty][moveDir]);
		positions.pop();
		//eat food
		if(tempPos0==foodPos){
			positions.push(reset())
		}
		//draw snake
		for(i in positions){
			tempPos2=positions[i];
			if(i>0&tempPos0==tempPos2){isGameOver=1}
			ctx[draw](tempPos2%twenty*twenty,~~(tempPos2/twenty)*twenty,nineteen=19,nineteen)
		}
		//check for out of bounds
		outOfBoundsAlongEdges=tempPos0%twenty-moveDir;
		if(tempPos0<0|tempPos0>numTiles|!(moveDir%2|outOfBoundsAlongEdges!=-2&outOfBoundsAlongEdges!=nineteen)){isGameOver=1}
		//draw food
		ctx[style]="#f01";
		ctx[draw](foodPos%twenty*twenty,~~(foodPos/twenty)*twenty,nineteen,nineteen)
	}
},99);