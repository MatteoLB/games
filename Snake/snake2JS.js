/* var canvas = document.getElementById("canvas");
   var ctx = canvas.getContext("2d"); */

var x = canvas.width/8;						// position x y de la tête -> modifier aussi dans draw pour les changer
var y = canvas.height/4*3+sizeUnit*3;
var snakeSize = sizeUnit;					// dimensions des parties du serpent et de la nourriture
var nbrBodyParts = 10;						// nombre de blocs du corps

var direction = 'right';					// direction actuelle et vitesse
var speed = sizeUnit;

var level = 1;								// niveau actuel et statut pause (vrai par défaut, appuyer sur une touche pour lancer le jeu)
var gameStatus = 'paused';
var score = 0;								// score et position actuelle de la nourriture + nourriture présente ou non sur la map (foodStatus)
var foodX = 0;
var foodY = 0;
var foodStatus = 0;
var foodWeight = 5;							// nombre de blocs gagnés par le snake par nourriture mangée

var bodyX = [];								// positions x et y des morceaux du corps
var bodyY = [];

for (var i = 0; i < nbrBodyParts; i++) 		// initie la position x de début pour les blocs du corps, les uns derrière les autres
{
	bodyX[i] = (x - snakeSize) - snakeSize * i;
}

for (var j = 0; j < nbrBodyParts; j++) 		// idem pour position y
{
	bodyY[j] = y;
}

document.addEventListener("keydown", keyDownHandler, false);	// eventlistener clavier touche appuyée
document.addEventListener("keyup", keyUpHandler, false);		// eventlistener clavier touche relachée


function keyDownHandler(e)
{
	if (e.keyCode == 37) 
	{
		direction = 'left';										// modifie la direction actuelle selon la touche appuyée
	}
	else if (e.keyCode == 38) 
	{
		direction = 'up';
	}
	else if (e.keyCode == 39) 
	{
		direction = 'right';
	}
	else if (e.keyCode == 40)
	{
		direction = 'down';
	}
	else if (e.keyCode == 32)									// si barre d'espace appuyée, vitesse doublée
	{
		speed = 60;
	}

	if (gameStatus != 'onGoing') 
	{
		if (gameStatus == 'paused') 							// appuyer sur une touche lance le jeu au début ou relance lors des changements de niveau
		{
			gameStatus = 'onGoing';
			direction = 'right';
		}
		else if (gameStatus == 'gameOver') 						// appuyer sur une touche à l'écran de défaite recharge la page
		{
			location.reload();
		}
	}
}

function keyUpHandler(e)										// si la touche appuyée était la barre d'espace, retour à la vitesse normale lorsque relâchée
{
	if (e.keyCode == 32) 
	{
		speed = 20;
	}
}

function getRandomInt(max) 										// génère un multiple de 20 aléatoire, utilisé pour générer l'élément food
{
  let random = (Math.floor(Math.floor(Math.random() * max)/10)*10);
  if (random % 20 == 0) 
  {
  	return random;
  }
  else
  {
  	return random-10;
  }
}

function drawFood()												// dessine l'élément food à chaque frame, lui attribue une nouvelle position si il a été mangé
{
	if (!foodStatus) 
	{
		foodX = getRandomInt(canvas.width);
		foodY = getRandomInt(canvas.height);
		if (level > 1 && collisionDetection(foodX, foodY)) 
		{
			drawFood();
		}
	}

	ctx.beginPath();
	ctx.rect(foodX, foodY, snakeSize, snakeSize);
	ctx.fillStyle = "green";
	ctx.fill();
	ctx.closePath(); 

	foodStatus = 1;
}

function getFood()												// rajoute des éléments body et leurs coordonnées aux tableaux bodyX et bodyY
{
	for (var i = 0; i < foodWeight; i++) 
	{
		var newBodyPartX = bodyX[bodyX.length -1]; 
		var newBodyPartY = bodyY[bodyY.length-1];
		bodyX.push(newBodyPartX);
		bodyY.push(newBodyPartY);
	}

	nbrBodyParts += foodWeight;
	score++;
	foodStatus = 0;												// food status à 0 pour que le prochain élément food ait une nouvelle position
}

function drawSnakeHead()										// dessine la tête du serpent
{
	ctx.beginPath();
	ctx.rect(x, y, snakeSize, snakeSize);
	ctx.fillStyle = "#434343"; // #2a2a2a #393939 #434343 #646464 #898989 #a8a8a8
	ctx.fill();
	ctx.closePath();
}

function drawSnakeBody()										// dessine les éléments corps selon le nbrBodyParts et leurs coordonnées dans bodyX et bodyY
{
	for (var i = 0; i < nbrBodyParts; i++) 
	{
		ctx.beginPath();
		ctx.rect(bodyX[i], bodyY[i], snakeSize, snakeSize);
		ctx.fillStyle = "#646464"; // #2a2a2a #393939 #434343 #646464 #898989 #a8a8a8
		ctx.fill();
		ctx.closePath();
	}
}

function drawObstacles()										// dessine les obstacles selon les coordonnées et instructions dans levelLine
{
	ctx.beginPath();
	for (var i = 0; i < levelLines[level-2].length; i++) 
	{
		if (levelLines[level-2][i][0] == 'move') 
		{
			ctx.moveTo(levelLines[level-2][i][1], levelLines[level-2][i][2]);
		}
		else if (levelLines[level-2][i][0] == 'line') 
		{
			ctx.lineTo(levelLines[level-2][i][1], levelLines[level-2][i][2]);
		}
	}
	ctx.lineWidth = 20;
	ctx.stroke();
	ctx.closePath();
}

function collisionDetection(x, y)								// détecte si un objet donné est sur un obstacle (utilisé pour snake & food)
{
	
	let previousX = levelLines[level-2][0][1];
	let previousY = levelLines[level-2][0][2];

	for (var i = 0; i < levelLines[level-2].length; i++) 		// renvoie vrai si collision détectée, sinon renvoie faux
	{
		if (levelLines[level-2][i][0] == 'line') 				// vérifie les lineTo et pas les moveTo
		{
			if (previousY == levelLines[level-2][i][2]) 		// gère les lignes horizontales
			{
				if (x >= previousX && x < levelLines[level-2][i][1] && y >= previousY-10 && y <= levelLines[level-2][i][2]-10) 
				{
					return true;
				}
			}
			else 												// gère les lignes verticales
			{
				if (x >= previousX-10 && x <= levelLines[level-2][i][1]-10 && y >= previousY && y <= levelLines[level-2][i][2]-snakeSize) 
				{
					return true;									
				}
			}
		}
		previousX = levelLines[level-2][i][1];					
		previousY = levelLines[level-2][i][2];
	}
	return false;
}

function clearBodyPosition()									// réinitialise les coordonnées des éléments du corps pour les débuts de niveau
{
	for (var i = 0; i < nbrBodyParts; i++) 
	{
		bodyX[i] = -50;
		bodyY[i] = -50;
	}
}

function updateBodyPosition()									// donne à chaque élément les coordonnées de l'élément précédent dans la liste
{
	for (var i = nbrBodyParts - 1; i >= 0; i--) 
	{
		if (bodyX[i] == x && bodyY[i] == y) 
		{ 
			gameStatus = 'gameOver';							// vérifie au passage si l'un d'eux a les mêmes coordonnées que la tête (si oui game over)
		}
		if (i == 0) 
		{
			bodyX[i] = x;
			bodyY[i] = y;
		}
		else
		{
			bodyX[i] = bodyX[i-1];
			bodyY[i] = bodyY[i-1];
		}
	}
}

function drawScore() 												// dessine le score actuel, position 8, 20 par rapport au haut gauche du canvas
{
    ctx.font = "18px Arial";
    ctx.fillStyle = "rgba(100,100,100,0.7)";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawSize() 												// dessine la taille du serpent
{
    ctx.font = "18px Arial";
    ctx.fillStyle = "rgba(100,100,100,0.7)";
    ctx.fillText("Size "+nbrBodyParts, canvas.width-75, 20);
}

function drawLevelTransition()										// affiche le niveau actuel lors d'un changement de niveau ou début de partie
{
	ctx.font = "72px Arial";
    ctx.fillStyle = "rgba(100,100,100,0.8)";
    ctx.fillText("Level "+level, canvas.width/3+sizeUnit, canvas.height/2);

    ctx.font = "36px Arial";
    ctx.fillStyle = "rgba(100,100,100,0.6)";
    ctx.fillText("Press any key to continue", canvas.width/4, canvas.height/3*2);
}

function drawGameOver()												// affiche Game Over et le score final
{
	ctx.font = "80px Arial";
    ctx.fillStyle = "rgba(134,0,0,0.8)";
    ctx.fillText("Game Over", canvas.width/4-sizeUnit, canvas.height/2-sizeUnit);

    ctx.font = "30px Arial";
    ctx.fillStyle = "rgba(20,20,20,0.9)";
    ctx.fillText("Score : "+score, canvas.width/2-sizeUnit*4, canvas.height/2+sizeUnit*2);

    ctx.font = "36px Arial";
    ctx.fillStyle = "rgba(100,100,100,0.6)";
    ctx.fillText("Press any key to try again", canvas.width/4-sizeUnit, canvas.height/4*3);
}

function autoWin()													// garantis score max via algorithme qui parcourt toutes les cases sans jamais croiser sa queue
{
	if (x == canvas.width - snakeSize && direction == 'right') 
	{
		direction = 'up';
	}
	else if (y == 0 && direction == 'up') 
	{
		direction = 'left';
	}
	else if (y == 0 && direction == 'left') 
	{
		direction = 'down';
	}
	else if (y == canvas.height - (snakeSize*2) && direction == 'down' && x > 0) 
	{
		direction = 'left'
	}
	else if (y == canvas.height - (snakeSize*2) && direction == 'left') 
	{
		direction = 'up';
	}
	else if (y == canvas.height- snakeSize && x == 0 && direction == 'down') 
	{
		direction = 'right';
	}
	else if (x == 0 && direction == 'left') 
	{
		direction = 'down';
	}
}

function draw()												// fonction principale, vide le canvas et redessine chaque élément a sa nouvelle position à chaque appel
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);		// vide le canvas

	if (score/10 == level || gameStatus == 'paused' || gameStatus == 'gameOver') // si changement de lvl, partie non démarrée, ou défaite
	{

		if (gameStatus == 'gameOver') 						// si défaite, écrit game over et le score
		{
			drawGameOver();
		}

		else 												// sinon, prépare le changement de niveau
		{
			x = canvas.width/8;
			y = canvas.height/4*3+sizeUnit*3;				// réinitialise la position du snake, place l'état en pause et met à jour level si nécessaire
			gameStatus = 'paused';
			level = Math.floor(score/10 + 1);

			clearBodyPosition();							// réinitialise le corps du serpent et réduit sa taille de 5
			nbrBodyParts = 10 + score/2;

			drawLevelTransition();
		}
	}

	else 													// sinon effectue les fonctions normales du jeu
	{
		drawSnakeHead();
		drawSnakeBody();

		if (level>1) 										// si le niveau est supérieur à 1, dessine les obstaches et détecte les collisions
		{
			drawObstacles();
			if (collisionDetection(x,y)) 
			{
				gameStatus = 'gameOver';
			}
		}

		updateBodyPosition();
		drawScore();
		drawSize();
		drawFood();
		// autoWin();

		if (foodStatus && foodX == x && foodY == y) 		// si les coordonnées de la tête et de la nourriture concordent, active la fonction qui agrandit le serpent
		{
			getFood();
		}

		if (x < canvas.width && y < canvas.height && x > 0 - speed && y > 0 - speed) // si la tête est dans les limites du canvas, déplace dans la direction actuelle
		{	
			if (direction == 'right') 
			{
				x += speed;
			}
			else if (direction == 'down') 
			{
				y += speed;
			}
			else if (direction == 'left') 
			{
				x -= speed;
			}
			else if (direction == 'up') 
			{
				y -= speed;
			}
		}
		else 								// sinon, si la tête touche les murs, game over et interrompt le programme
		{
			gameStatus = 'gameOver';
		}
	}
}



var intervalID = setInterval(draw, 100); 					// appelle la fonction draw toutes les 80ms (60ms sinon)