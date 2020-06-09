var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var rayon = 14;
var bubbleSize = rayon*2;

var colors = ['DarkBlue', 'purple', 'orange', '#c70000', 'green'];
var allBubblesColors = [];
var allBubblesPos = [];

var bubbleColor = '';
var bubbleX = canvas.width/2;
var bubbleY = bubbleSize*16;
var nextBubbles = [];

var bubbleDistX = 0;
var bubbleDistY = 0;
var shotAngle = 0;
var shotDirection = '';

var shot = false;
var bubbleSpeed = 14;
var direction = '';

var shooterX = canvas.width/2;
var shooterY = bubbleSize*16;

var arrowAngle = 0;
var arrowLength = 60;
var arrowHeadX = canvas.width/2;
var arrowHeadY = bubbleSize*16 - arrowLength;

var clearBubbleY = bubbleSize*10;
var clearArrowY = Math.floor(arrowHeadY / bubbleSize) * bubbleSize;

var intervalID;



function getRandomInt(max) 								// génère un entier aléatoire entre 0 et max (non inclus)
{
  return Math.floor(Math.random() * Math.floor(max));
}

function initGame()
{
	for (var i = 0; i < 8; i++) 						// i = lignes (donc y) j = cols (donc x)
	{
		allBubblesColors[i] = [];
		allBubblesPos[i] = [];

		for (var j = 0; j < 16; j++) 
		{
			allBubblesColors[i][j] = colors[getRandomInt(colors.length)];

			if (i % 2 == 0) 
			{
				allBubblesPos[i][j] = [j*bubbleSize+rayon+1, i*bubbleSize+rayon];
			}
			else
			{
				allBubblesPos[i][j] = [j*bubbleSize+rayon*2+1, i*bubbleSize+rayon];
			}
		}
	}

	for (var i = 8; i < 16; i++) 						// i = lignes (donc y) j = cols (donc x)
	{
		allBubblesColors[i] = [];
		allBubblesPos[i] = [];

		for (var j = 0; j < 16; j++) 
		{
			allBubblesColors[i][j] = 0;
			allBubblesPos[i][j] = [j*bubbleSize+rayon, i*bubbleSize+rayon];
		}
	}

	bubbleColor = colors[getRandomInt(colors.length)];

	for (var i = 0; i < 5; i++) 
	{
		nextBubbles[i] = colors[getRandomInt(colors.length)];
	}
}



canvas.addEventListener("mousemove", mouseMoveHandler, false);	// eventlistener souris
canvas.addEventListener("click", clickHandler, false);


function mouseMoveHandler(e)
{
	let mouseX = e.clientX - canvas.offsetLeft;
	let mouseY = e.clientY - canvas.offsetTop;

	arrowAngle = 90 - Math.atan(Math.abs(mouseX-shooterX)/Math.abs(mouseY-shooterY))*(180/Math.PI);

	let distX = Math.cos(arrowAngle*(Math.PI/180)) * arrowLength; // côté adjacent à l'angle
	let distY = Math.sin(arrowAngle*(Math.PI/180)) * arrowLength; // côté opposé

	if (mouseX < shooterX) 
	{
		arrowHeadX = shooterX - distX;
		arrowHeadY = shooterY - distY;
		direction = 'left';
	}
	else
	{
		arrowHeadX = shooterX + distX;
		arrowHeadY = shooterY - distY;
		direction = 'right';
	}

	draw(clearArrowY, 0, clearArrowY/bubbleSize);

	clearArrowY = Math.floor(arrowHeadY / bubbleSize) * bubbleSize;

}

function clickHandler(e)
{
	let mouseX = e.clientX - canvas.offsetLeft;
	let mouseY = e.clientY - canvas.offsetTop;

	if (shot) 
	{
		return;
	}

	if (mouseX > 0 && mouseX < canvas.width && mouseY > 0 && mouseY < canvas.height) 
	{
		shot = true;
		shotAngle = arrowAngle;
		shotDirection = direction;

		bubbleDistX = Math.cos(shotAngle*(Math.PI/180)) * bubbleSpeed;
		bubbleDistY = Math.sin(shotAngle*(Math.PI/180)) * bubbleSpeed;

		
		intervalID = setInterval(shotSystem, 40);

	}
}

function shotSystem()
{
	if (shotDirection == 'left') 
	{
		if (bubbleX - bubbleDistX >= rayon) 
		{
			bubbleX -= bubbleDistX;
			bubbleY -= bubbleDistY;
		}

		else
		{
			bubbleY -= Math.tan(shotAngle*(Math.PI/180)) * (bubbleX - rayon);
			bubbleX = rayon;

			shotDirection = 'right';
		}
	}

	else if (shotDirection == 'right') 
	{
		if (bubbleX + bubbleDistX <= canvas.width - rayon) 
		{
			bubbleX += bubbleDistX;
			bubbleY -= bubbleDistY;
		}

		else
		{
			bubbleY -= Math.tan(shotAngle*(Math.PI/180)) * ((canvas.width - rayon) - bubbleX);
			bubbleX = canvas.width - rayon;

			shotDirection = 'left';
		}
	}

	clearBubbleY = Math.floor(bubbleY/bubbleSize) * bubbleSize-bubbleSize;

	collisionDetection();
	draw(clearBubbleY, 0, clearBubbleY/bubbleSize);
}

function collisionDetection()
{
	let caseY = Math.floor(bubbleY / bubbleSize);
	let caseX = 0;

	let inContact = [];

	if (caseY % 2 == 0) 
	{
		caseX = Math.floor(bubbleX / bubbleSize);

		checkCase((caseY-1), (caseX-1), inContact);				// bulle haut gauche
		checkCase((caseY-1), caseX, inContact); 				// bulle haut droite
		checkCase((caseY+1), (caseX-1), inContact);				// bulle bas gauche
		checkCase((caseY+1), caseX, inContact);					// bulle bas droite	
	}
	else
	{
		caseX = Math.floor((bubbleX - rayon) / bubbleSize);

		checkCase((caseY-1), caseX, inContact);					// haut gauche
		checkCase((caseY-1), (caseX+1), inContact);				// haut droite
		checkCase((caseY+1), caseX, inContact);					// bas gauche		-> if (caseY > 15) ? évite messages d'erreur
		checkCase((caseY+1), (caseX+1), inContact);				// bas droite		-> et permettrait d'animer les déplacements depuis le début
	}

	checkCase((caseY), (caseX-1), inContact);					// gauche
	checkCase((caseY), (caseX+1), inContact);					// droite


	if (typeof allBubblesColors[caseY][caseX] == 'string') 		// vérifie la case actuelle, si oui descend la bulle à la case inférieure
	{
		if (allBubblesColors[caseY][caseX] == bubbleColor) 
			{
				bubblesInContact.push([checkY, checkX]);
			}

		shot = false;
		bubbleStop(caseY+1, caseX);
	}

	else if (!shot) 
	{
		bubbleStop(caseY, caseX);
	}

}

function checkCase(checkY, checkX, bubblesInContact)
{
	if (typeof allBubblesColors[checkY][checkX] == 'string') 							
		{
			if (allBubblesColors[checkY][checkX] == bubbleColor) 
			{
				bubblesInContact.push([checkY, checkX]);
			}

			let spaceBetweenX = Math.abs(bubbleX - allBubblesPos[checkY][checkX][0])
			let spaceBetweenY = Math.abs(bubbleY - allBubblesPos[checkY][checkX][1]);

			if (Math.pow(spaceBetweenX, 2)+Math.pow(spaceBetweenY, 2) <= Math.pow(bubbleSize, 2)) 
			{
				shot = false;
			}
		}
}

function bubbleStop(Y, X)
{
	clearInterval(intervalID);

	allBubblesColors[Y][X] = bubbleColor;

	if (Y % 2 == 0) 
	{
		allBubblesPos[Y][X] = [X*bubbleSize+rayon+1, Y*bubbleSize+rayon];
	}
	else
	{
		allBubblesPos[Y][X] = [X*bubbleSize+rayon*2+1, Y*bubbleSize+rayon];
	}

	bubbleX = canvas.width/2;
	bubbleY = bubbleSize*16;

	bubbleColor = nextBubbles[nextBubbles.length-1];

	for (var i = nextBubbles.length - 1; i > 0; i--) 
	{
		nextBubbles[i] = nextBubbles[i-1];
	}

	nextBubbles[0] = colors[getRandomInt(colors.length)];
}

function drawBubbles(x, y, color)
{
	ctx.beginPath();
	ctx.arc(x, y, rayon, 0, Math.PI*2);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.strokeStyle = "#cccccc";
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.closePath();
}

function drawNextBubbles(x, color)
{
	ctx.beginPath();
	ctx.arc( (x * bubbleSize) + (x * 6) + bubbleSize, shooterY + bubbleSize - 3, rayon, 0, Math.PI*2 );
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawBottomPart()
{
	ctx.beginPath();																	// bottom part and next bubble place
	ctx.rect(0, shooterY, canvas.width, canvas.height - shooterY);
	ctx.arc(shooterX, shooterY, rayon+4, 0, Math.PI*2);
	ctx.fillStyle = '#a7a7a7';
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();														// trace le pointeur
	ctx.moveTo(shooterX, shooterY);
	ctx.lineTo(arrowHeadX, arrowHeadY);
	ctx.strokeStyle = '#a7a7a7';
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.closePath();


	for (var i = 0; i < nextBubbles.length; i++) 
	{
		drawNextBubbles(i, nextBubbles[i]);
	}
}

function drawFullMap(startX, startY)
{
	for (var i = startY; i < allBubblesColors.length; i++) 
	{
		for (var j = startX; j < allBubblesColors[i].length; j++) 
		{
			if (allBubblesColors[i][j] != 0) 
			{
				if (i % 2 == 0) 														// i = ligne (y)
				{
					drawBubbles(j*bubbleSize+rayon+1, i*bubbleSize+rayon, allBubblesColors[i][j]);
				}
				else
				{
					drawBubbles((j+0.5)*bubbleSize+rayon+1, i*bubbleSize+rayon, allBubblesColors[i][j]);
				}
			}
		}
	}
}

function draw(clearY, drawFullStartX, drawFullStartY)
{
	ctx.clearRect(0, clearY, canvas.width, canvas.height - clearY);

	drawFullMap(drawFullStartX, drawFullStartY);
	drawBottomPart();
	drawBubbles(bubbleX, bubbleY, bubbleColor);
}

initGame();
draw(0, 0, 0);

