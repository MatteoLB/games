var caseSize = canvas.height/22;							// taille d'une case de tetrimino ou de la grille

var x = 3;													// coordonnées actuelles du coin haut gauche du tetrimino, et précédentes pour pouvoir l'y effacer
var y = 0;
var previousX = 3;
var previousY = 0;

var direction = 1;											// direction et direction précédente, compte à rebours avant chaque déplacement vertical
var previousDirection = 1;
var counter = 0;
var countDelay = 10;
var normalDelay = 10;
var softDrop = false;

var tetriminoStatus = 0;									// présence ou non d'un tetrimino, et liste des coordonnées Y des lignes à supprimer si il y en a
var fullLinesY = [];

var tetrimino = null;										// objet vide avant de contenir l'un des tetrimino, et tableau contenant les instructions
var pattern = [];											// de dessin de ce tetrimino selon sa direction
var nextTetrimino = null;									// objet vide contenant le prochain tetrimino


document.addEventListener("keydown", keyDownHandler, false);	// eventlistener clavier touche appuyée
document.addEventListener("keyup", keyUpHandler, false);		// eventlistener clavier touche relachée


function keyDownHandler(e)							// gère les changements de direction et déplacements via appui des touches
{
	if (e.keyCode == 32) 									
	{
		if (direction < 3 && checkWithin(direction+1)) 		// modifie la direction actuelle lorsqu'on presse la barre d'espace	
		{
			direction++;
		}
		else if (direction >= 3 && checkWithin(0)) 
		{
			direction = 0;
		}

		if (x + pattern[direction][0].length > 10) 			// décale l'objet vers la gauche si le changement de direction le fait dépasser des limites (>= 10 ?)
		{
			x -= (x + pattern[direction][0].length) -10;
		}
	}

	
	if (e.keyCode == 37 && x > 0 && checkAround('left')) 											// déplace vers la gauche						
	{
		x--;
	} 

	else if (e.keyCode == 39 && x + pattern[direction][0].length < 10 && checkAround('right')) 		// déplace vers la droite
	{
		x++;						
	}

	else if (e.keyCode == 38) 											// up -> hard drop, fait tomber aussi bas que possible d'un coup
	{
		hardDrop();					
	}

	else if (e.keyCode == 40)											// down -> soft drop, diminue l'intervalle entre les déplacements verticauxs
	{
		if (countDelay >= 3) 
		{
			countDelay = 2;
			softDrop = true;
		}					
	}
	
}

function keyUpHandler(e)								// si la touche appuyée était la flèche du bas, retour à la vitesse normale lorsque relâchée
{
	if (e.keyCode == 40) 
	{
		countDelay = normalDelay;
		softDrop = false;
	}
}

function getRandomInt(max) 								// génère un entier aléatoire entre 0 et max (non inclus)
{
  return Math.floor(Math.random() * Math.floor(max));
}


function getRandomShape()								// si statut = 0, obtient une forme de tetrimino aléatoire
{
	if (tetriminoStatus == 0) 									
	{
		tetrimino = nextTetrimino;
		nextTetrimino = Tetriminos[getRandomInt(Tetriminos.length)];
		pattern[0] = tetrimino.left;						
		pattern[1] = tetrimino.up;								// range ensuite ses différentes directions dans pattern[], et passe statut à 1
		pattern[2] = tetrimino.right;
		pattern[3] = tetrimino.down;							

		tetriminoStatus = 1;									
	}
}

function checkWithin(Direction)							// vérifie si un changement de direction du tetrimino est possible
{
	for (var i = 0; i < pattern[Direction].length; i++) 
	{
		for (var j = 0; j < pattern[Direction][i].length; j++)	 // vérifie chaque case selon la nouvelle direction hypothétique, renvoie faux si occupée
		{
			if (pattern[Direction][i][j] == 1 && typeof fullMap[y+i][x+j] == 'string') 
			{
				return false;									
			}
		}
	}
	return true;
}

function checkAround(moveDirection)						// vérifie si un déplacement dans la direction indiquée est possible ou non
{
	if (moveDirection == 'down') 								
	{
		for (var i = 0; i < pattern[direction].length; i++) 	// vérifie pour chaque bloc du tetrimino si un obstacle se trouve ou non en dessous	
		{
			for (var j = 0; j < pattern[direction][i].length; j++) 
			{
				if (pattern[direction][i][j] == 1) 				
				{
					if (typeof fullMap[y+i+1][x+j] == 'string') 
					{
						return false;							// si il y en a un, renvoie faux
					}
				}
			}
		}
		return true;											// sinon, renvoie vrai si il n'y a pas d'obstacle
	}

	else if (moveDirection == 'left') 							
	{
		for (var i = 0; i < pattern[direction].length; i++) 		// idem à gauche
		{
			for (var j = 0; j < pattern[direction][i].length; j++) 
			{
				if (pattern[direction][i][j] == 1) 
				{
					if (typeof fullMap[y+i][x+j-1] == 'string') 
					{
						return false;
					}
				}
			}
		}
		return true;
	}

	else if (moveDirection == 'right') 								// et à droite
	{
		for (var i = 0; i < pattern[direction].length; i++) 
		{
			for (var j = 0; j < pattern[direction][i].length; j++) 
			{
				if (pattern[direction][i][j] == 1) 
				{
					if (typeof fullMap[y+i][x+j+1] == 'string') 
					{
						return false;
					}
				}
			}
		}
		return true;
	}
}

function resetTetrimino()								// réinitialise statut, coordonnées, compteur et direction après avoir posé un tetrimino
{
	if (y == 0) 
	{
		clearInterval(intervalID);								// si y est déjà égal à 0, alors le haut a été atteint et game over
		alert("Game Over");
	}
	tetriminoStatus = 0;
	x = 3;
	y = 0;
	counter = 0;
	direction = 1;
}

function clearPreviousTetrimino()						// retire le tetrimino de son emplacement précédent dans fullMap, avant de l'y replacer
{
	for (var i = 0; i < pattern[previousDirection].length; i++) 
		{
			for (var j = 0; j < pattern[previousDirection][i].length; j++) 
			{
				if (fullMap[previousY+i][previousX+j] == 1) 
				{
					fullMap[previousY+i][previousX+j] = 0;
				}
				
			}
		}
}

function hardDrop()										// gère la chute instantanée via déplacements répétés rapidement jusqu'à trouver un obstacle
{
	let dist = 22 - (y + pattern[direction].length);

	for (var i = 0; i < dist; i++) 
	{
		if (checkAround('down')) 								// vérifie la disponibilité de la ligne suivante à chaque itération
		{
			y++;
			score += 2;
		}
	}
	clearPreviousTetrimino();									// retire ensuite de fullMap le dernier emplacement tracé du tetrimino et le pose
	dropTetrimino();
}

function dropTetrimino()								// pose un tetrimino en enregistrant ses couleurs dans fullMap au lieu de 1
{
	for (var i = 0; i < pattern[direction].length; i++) 
		{
			for (var j = 0; j < pattern[direction][i].length; j++) 
			{
				if (pattern[direction][i][j] == 1) 
				{
					fullMap[y+i][x+j] = tetrimino.color;		// permet de distinguer le tetrimino actuel de ceux déjà posés, et les dessiner aux bonnes couleurs
				}
			}
		}

	resetTetrimino();											// lance aussi la réinitialisation des coordonnées et vérification du cas de défaite					
}


function updateFullMap()							// met à jour la position du tetrimino actuel					
{																
	counter++;

	if (counter % countDelay == 0) 								// met à jour le compteur, et vérifie si le délai est écoulé
	{
		if (checkAround('down')) 								// si oui, vérifie si la voie est libre pour descendre le tetrimino
		{
			y++;

			if (softDrop) 
			{
				score++;
			}
		}
		else 													// si oui, incrémente y, sinon clean et pose le tetrimino et met fin à la fonction
		{
			clearPreviousTetrimino();
			dropTetrimino();
			return;
		}
	}

	clearPreviousTetrimino();									// marque les coordonnées précédemment occupées par le tetrimino comme vides


	if (y + pattern[direction].length < 22) 					// si le tetrimino est toujours dans les limites verticales
	{
		for (var i = 0; i < pattern[direction].length; i++) 	// (limites horizontales gérées directement lors des appuis touches)
		{
			for (var j = 0; j < pattern[direction][i].length; j++) 
			{
				if (pattern[direction][i][j] == 1) 				// replace le tetri dans fullMap via son pattern selon sa direction et coordonnées actuelles
				{
					fullMap[y+i][x+j] = pattern[direction][i][j];
				}
			}
		}
	}
	else 														// si le tetrimino a atteint les limites verticales, pose le tetrimino (clear déjà fait plus haut)
	{
		dropTetrimino();
	}
}

function drawBlock(j, i, color)						// dessine chaque bloc de tetrimino selon ses coordonnées actuelles et sa couleur
{
	ctx.beginPath();
	ctx.rect(j*caseSize, i*caseSize, caseSize, caseSize);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.strokeStyle = "white";									// ajoute un contour blanc à chaque case #696969 pour foncé
	ctx.stroke();
	ctx.closePath();
}

function drawFullMap()								// parcourt chaque case de la map, les dessine si nécessaire et vérifie si les lignes sont complètes
{
	for (var i = 0; i < fullMap.length; i++) 
	{
		let blocks = 0;											// stocke pour chaque ligne le nombre de bloc qu'elle contient (si 10, ligne complète)

		for (var j = 0; j < fullMap[i].length; j++) 
		{
			if (fullMap[i][j] == 1 && tetriminoStatus == 1) 	// pour un bloc de tetrimino actif, lance drawblock avec la couleur stockée dans l'objet
			{
				drawBlock(j, i, tetrimino.color);				
			}
			else if (typeof fullMap[i][j] === 'string') 		// si ce qui est stocké est une chaîne -> un bloc déjà posé, la chaine = la couleur
			{
				drawBlock(j, i, fullMap[i][j]);					// lance drawblock avec la chaine stockée dans fullMap en argument pour la couleur
				blocks++;										
			}													// incrémente le nombre de blocs posés dans cette ligne
		}

		if (blocks == 10) 										// si la ligne actuelle contient 10 blocs, ajoute son index à la liste des lignes actuellement full
		{
			fullLinesY.push(i);
		}
	}

	previousDirection = direction;								// met à jour les coordonnées previous -> les dernières coordonnéees où l'objet a été dessiné
	previousX = x;
	previousY = y;
}

function destroyLines()								// vide la ou les lignes complètes 1 par 1, et redescend tout le reste d'un cran
{
	for (var i = fullMap.length - 1; i >= 0; i--)				// parcourt toutes les lignes à partir de la fin 
	{

		if (i == fullLinesY[fullLinesY.length-1]) 				// si l'index actuel correspond à celui enregistré dans fullLines
		{
			for (var j = 0; j < fullMap[i].length; j++) 		// vide la ligne
			{
				fullMap[i][j] = 0;
			}
		}

		else if (i < fullLinesY[fullLinesY.length-1]) 			// sinon, si l'index est inférieur (c'est à dire que c'est une ligne au dessus de celle supprimée)
		{
			for (var j = 0; j < fullMap[i].length; j++) 
			{
				if (typeof fullMap[i][j] == 'string') 			// parcourt chaque bloc, si il s'agit d'un bloc posé, le descend d'un cran et vide sa précédente case
				{
					fullMap[i+1][j] = fullMap[i][j];
					fullMap[i][j] = 0;
				}
			}
		}
	}
}


function main()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);				// vide le canvas


	if (fullLinesY.length > 0) 										// si il y a 1 ou plusieurs lignes à supprimer, qui en détruit 1
	{
		score += 100*fullLinesY.length*fullLinesY.length*level;
		lines += fullLinesY.length;
		for (var i = 0; i < fullLinesY.length; i++) 				// les lignes à supprimer le sont 1 par une, et forcément après que le tetrimino ait été posé
		{
			destroyLines();											// -> empêche donc d'en générer un autre le temps que chaque ligne complète ait été supprimée
		}

		fullLinesY.length = 0;										// vide l'array fullLinesY
	}																

	else 													
	{
		getRandomShape();											// si il n'y a pas de lignes à supprimer, génère un nouveau tetrimino si status = 0
		updateFullMap();											// met à jour les coordonnées de l'objet en cours
	}
	
	if (score/level/level >= 2000) 
	{
		level += 1;

		if (countDelay > 2 && level % 2 == 0) 
		{
			countDelay--;
			normalDelay--;
		}
	}

	drawSideInfos();
	drawFullMap();													// parcourt chaque case et dessine les cases occupées nécessaire
}


nextTetrimino = Tetriminos[getRandomInt(Tetriminos.length)];

var intervalID = setInterval(main, 100);