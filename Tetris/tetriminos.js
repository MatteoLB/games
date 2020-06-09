var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


function changeDirection(pattern)
{
	let newPattern = [];
	let k = 0;

	for (var i = pattern[0].length - 1; i >= 0; i--) 
	{
		newPattern[k] = [];

		for (var j = 0; j < pattern.length; j++) 
		{
			newPattern[k][j] = pattern[j][i];
		}
		k++;
	}

	return newPattern;
}


var I = 
{
	color: 'cyan',

	up: [
			[1, 1, 1, 1]
		  ],

	left: [
		 [1],
		 [1],
		 [1],
		 [1]
		]
};

I.down = I.up;
I.right = I.left

var J =
{
	color: 'blue',

	up: [
		  [1, 1, 1],
		  [0, 0, 1]
		]
};

J.left = changeDirection(J.up);
J.down = changeDirection(J.left);
J.right = changeDirection(J.down);

var L =
{
	color: 'orange',

	up: [
		  [1, 1, 1],
		  [1, 0, 0]
		]
};

L.left = changeDirection(L.up);
L.down = changeDirection(L.left);
L.right = changeDirection(L.down);

var O =
{
	color: 'gold',

	up: [
		  [1, 1],
		  [1, 1]
		]
};

O.left = O.up;
O.down = O.up;
O.right = O.up;

var S =
{
	color: 'green',

	up: [
		  [0, 1, 1],
		  [1, 1, 0]
		]
};

S.left = changeDirection(S.up);
S.down = changeDirection(S.left);
S.right = changeDirection(S.down);

var T = 
{
	color: 'purple',

	up: [
		  [0, 1, 0],
		  [1, 1, 1]
		]
};

T.left = changeDirection(T.up);
T.down = changeDirection(T.left);
T.right = changeDirection(T.down);

var Z =
{
	color: 'red',

	up: [
		  [1, 1, 0],
		  [0, 1, 1]
		]
};

Z.left = changeDirection(Z.up);
Z.down = changeDirection(Z.left);
Z.right = changeDirection(Z.down);

var Tetriminos = [I, J, L, O, S, T, Z];


var fullMap = [];

for (var i = 0; i < 22; i++) 
{
	fullMap[i] = [];
	for (var j = 0; j < 10; j++) 
	{
		fullMap[i][j] = 0;
	}
}