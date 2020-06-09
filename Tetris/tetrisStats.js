var score = 0;
var level = 1;
var lines = 0;
var startTime = Date.now();

function drawColumns()											// dessine les colonnes de l'écran de jeu
{
	for (var i = 0; i < 10; i++) 
	{
		ctx.beginPath();
		ctx.moveTo(caseSize+(caseSize*i), 0);
		ctx.lineTo(caseSize+(caseSize*i), canvas.height);
		ctx.strokeStyle = '#c1c1c1'; // clair #e4e4e4 foncé #c1c1c1 + foncé #9c9c9c
		ctx.stroke();
		ctx.closePath();
	}
}


function drawStats() 											// dessine le niveau actuel, le score, le temps écoulé, et le nombre de lignes complétées
{
	let seconds = Math.floor( (Date.now() - startTime) / 1000);
	let minutes = Math.floor(seconds/60);									// calcule le temps écoulé en minutes et secondes depuis le début de la partie
	seconds -= minutes*60;

	ctx.font = "32px Arial";										
    ctx.fillStyle = "Black";
    ctx.fillText("LEVEL "+level, 300, 80);

	ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score : "+score, 280, 340);

    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Lines : "+lines, 280, 380);

    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Time : "+minutes+" min "+seconds+" s", 280, 420);
}

function drawNextTetrimino()									// dessine quel sera le prochain tetrimino
{
	let rectPosX = canvas.width/2+(caseSize*2);								// position X à partir duquel sera tracé le carré contenant le prochain tetrimino

	let posX = rectPosX + (caseSize*6 - nextTetrimino.up[0].length*caseSize)/2;
	let posY = 140+(caseSize*5 - nextTetrimino.up.length*caseSize)/2;		// calcule pour que le prochain tetrimino soit centré dans le carré conteneur

	ctx.beginPath();
	ctx.rect(rectPosX, 140, caseSize*6, caseSize*5);						// tracé le carré conteneur
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.closePath();

	for (var i = 0; i < nextTetrimino.up.length; i++) 						// trace ensuite le tetrimino case par case
	{
		for (var j = 0; j < nextTetrimino.up[i].length; j++) 
		{
			if (nextTetrimino.up[i][j] == 1) 
			{
				ctx.beginPath();
				ctx.rect(posX + j*caseSize, posY + i*caseSize, caseSize, caseSize);
				ctx.fillStyle = nextTetrimino.color;
				ctx.fill();
				ctx.strokeStyle = "white";									// ajoute un contour blanc à chaque case
				ctx.stroke();
				ctx.closePath();
			}
		}
	}
}

function drawGameOver()
{
	ctx.font = "80px Arial";
    ctx.fillStyle = "rgba(134,0,0,0.8)";
    ctx.fillText("Game Over", canvas.width/5, canvas.height/2);
}

function drawSideInfos()
{
	drawColumns();

	ctx.beginPath();
	ctx.rect(canvas.width/2, 0, canvas.width/2, canvas.height);
	ctx.fillStyle = 'silver';
	ctx.fill();
	ctx.closePath();

	drawNextTetrimino();
	drawStats();
}