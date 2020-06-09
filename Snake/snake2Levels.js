var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var sizeUnit = 20; 											// nombre de pixels selon lequel sera divisé la map, tracé ou déplacé les blocs du serpent & food

function roundX(number)
{
	let roundedNumber = Math.floor(number/10) *10;
	if (roundedNumber % 20 == 0) 
	{
		return roundedNumber-10;							// roundX renvoie un non multiple de 20, roundY renvoie un multiple de 20
	}
	else													// roundX pas limité aux x et idem pour roundY
	{
		return roundedNumber;							    // ligne verticale -> roundX puis roundY, ligne horizontale -> roundY puis roundX
	}
}

function roundY(number)
{
	let roundedNumber = Math.floor(number/10) *10;		
	if (roundedNumber % 20 == 0) 
	{
		return roundedNumber;
	}
	else
	{
		return roundedNumber-10;
	}
}

var levelLines = 
[
	[																			// LEVEL 2 -> 2 lignes verticales entre les 3 tiers en x et hauteur d'1/3
		['move', roundX(canvas.width/3), roundY(canvas.height/3)],			
		['line', roundX(canvas.width/3), roundY(canvas.height/3*2)],			// curseur en haut de la ligne gauche, trace vers le bas

		['move', roundX(canvas.width/3*2), roundY(canvas.height/3)],
		['line', roundX(canvas.width/3*2), roundY(canvas.height/3*2)]			// curseur en haut de la ligne droite, trace vers le bas
	],


	[																			// LEVEL 3 -> carré pas complètement fermé sur le bas
		['move', roundY(canvas.width/4 + sizeUnit), roundX(canvas.height/3*2 + sizeUnit*2)],
		['line', roundY(canvas.width/4 + sizeUnit*6), roundX(canvas.height/3*2 + sizeUnit*2)],

		['move', roundX(canvas.width/4 + sizeUnit), roundY(canvas.height/3 - sizeUnit)],			// toujours tracer les lignes de haut en bas ou de gauche à droite
		['line', roundX(canvas.width/4 + sizeUnit), roundY(canvas.height/3*2 + sizeUnit*2)],		// pour que collisionDetection() fonctionne comme il faut

		['move', roundY(canvas.width/4), roundX(canvas.height/3 - sizeUnit)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 - sizeUnit)],

		['move', roundX(canvas.width/4*3), roundY(canvas.height/3 - sizeUnit)],
		['line', roundX(canvas.width/4*3), roundY(canvas.height/3*2 + sizeUnit*2)],

		['move', roundY(canvas.width/4*3 - sizeUnit*6), roundX(canvas.height/3*2 + sizeUnit*2)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3*2 + sizeUnit*2)]
	],


	[																			// LEVEL 4 -> carré plein coupé en 2 horizontalement au milieu (2 lignes d'espace)
		['move', roundY(canvas.width/4), roundX(canvas.height/3 - sizeUnit*3)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 - sizeUnit*3)],

		['move', roundY(canvas.width/4), roundX(canvas.height/3 - sizeUnit*2)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 - sizeUnit*2)],

		['move', roundY(canvas.width/4), roundX(canvas.height/3 - sizeUnit)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 - sizeUnit)],

		['move', roundY(canvas.width/4), roundX(canvas.height/3)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3)],

		['move', roundY(canvas.width/4), roundX(canvas.height/3 + sizeUnit)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 + sizeUnit)],

		['move', roundY(canvas.width/4), roundX(canvas.height/3 + sizeUnit*2)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 + sizeUnit*2)],

		['move', roundY(canvas.width/4), roundX(canvas.height/3 + sizeUnit*3)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 + sizeUnit*3)],

		// ['move', roundY(canvas.width/4), roundX(canvas.height/3 + sizeUnit*4)],
		// ['line', roundY(canvas.width/4*3), roundX(canvas.height/3 + sizeUnit*4)],

		// ['move', roundY(canvas.width/4), roundX(canvas.height/3 + sizeUnit*5)],
		// ['line', roundY(canvas.width/4*3), roundX(canvas.height/3 + sizeUnit*5)],

		['move', roundY(canvas.width/4), roundX(canvas.height/3 + sizeUnit*6)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 + sizeUnit*6)],

		['move', roundY(canvas.width/4), roundX(canvas.height/3 + sizeUnit*7)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 + sizeUnit*7)],

		['move', roundY(canvas.width/4), roundX(canvas.height/3 + sizeUnit*8)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 + sizeUnit*8)],

		['move', roundY(canvas.width/4), roundX(canvas.height/3 + sizeUnit*9)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 + sizeUnit*9)],

		['move', roundY(canvas.width/4), roundX(canvas.height/3 + sizeUnit*10)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 + sizeUnit*10)],

		['move', roundY(canvas.width/4), roundX(canvas.height/3 + sizeUnit*11)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 + sizeUnit*11)],

		['move', roundY(canvas.width/4), roundX(canvas.height/3 + sizeUnit*12)],
		['line', roundY(canvas.width/4*3), roundX(canvas.height/3 + sizeUnit*12)]
	],


	[																	// LEVEL 5 -> 4 lignes, partant chacune du milieu d'un côté et allant vers le centre sur 1/3
		['move', 0, roundX(canvas.height/2)],
		['line', roundY(canvas.width/3), roundX(canvas.height/2)],			// gauche

		['move', roundY(canvas.width/3*2), roundX(canvas.height/2)],		// droite
		['line', canvas.width, roundX(canvas.height/2)],

		['move', roundX(canvas.width/2), 0],								// haut
		['line', roundX(canvas.width/2), roundY(canvas.height/3)],

		['move', roundX(canvas.width/2), roundY(canvas.height/3*2)],		// bas
		['line', roundX(canvas.width/2), canvas.height]		
	],


	[																	// LEVEL 6 -> 5 lignes verticales de 2/3 de longueur, partant du haut et du bas en alternance
		['move', roundX(canvas.width/6), 0],
		['line', roundX(canvas.width/6), roundY(canvas.height/3*2)],	

		['move', roundX(canvas.width/2), 0],
		['line', roundX(canvas.width/2), roundY(canvas.height/3*2)],	// 3 premières lignes tracées partent du haut

		['move', roundX(canvas.width/6*5), 0],
		['line', roundX(canvas.width/6*5), roundY(canvas.height/3*2)],	

		['move', roundX(canvas.width/6*2), roundY(canvas.height/3)],	// 2 qui partent du bas, leur pos x entre celles des 3 lignes partant du haut
		['line', roundX(canvas.width/6*2), roundY(canvas.height)],

		['move', roundX(canvas.width/3*2), roundY(canvas.height/3)],	
		['line', roundX(canvas.width/3*2), roundY(canvas.height)]
	]
];