
var squareSize = 10;
var grid = [[]];
var wordsList = ["horse","dog","cat","icecream","cow","fishfinger","chicken","snake"];
var directions = ["N","NE","E","SE","S","SW","W","NW"];
var directionMap = {
	"N": 	{n: "N",  h: 0, v: -1},
	"NE": 	{n: "NE", h: 1, v: -1},
	"E": 	{n: "E",  h: 1, v: 0},
	"SE": 	{n: "SE", h: 1, v: 1},
	"S": 	{n: "S",  h: 0, v: 1},
	"SW": 	{n: "SW", h: -1, v: 1},
	"W": 	{n: "W",  h: -1, v: 0},
	"NW": 	{n: "NW", h: -1, v: -1}
};
var answers = [];
var _horiz = Array.prototype.join.call({length: (squareSize * 2) + 2}, '-') + "\n";

function initialiseGrid() {
	for (var i = 0; i < squareSize; i++) {
		grid[i] = [];
		for (var j = 0; j < squareSize; j++) {
			grid[i][j]="";
		}
	}
}

function showGrid() {
	var string = "";
	for (var i = 0; i < squareSize; i++ ) {
		string += _horiz + "|";
		for (var j = 0; j < squareSize; j++ ) {
			var char = grid[i][j];
			string += char?char:" ";
			string += "|";
		}
		string +="\n";	
	}
	string += _horiz;
	console.log(string);
	console.log("\n");
	_.each(answers, function(answer) {
		console.log(answer.w);
	})
}


function put(word, coords, direction) {
	console.error("putting " + word+ " (" + coords.x + ", " + coords.y + ") " + direction.n);

	var x = coords.x,
		y = coords.y;

	for (var i = 0, length = word.length; i < length; i++) {
		grid[x][y] = word.substring(i,i+1);
		x+=direction.h;
		y+=direction.v;
	}

	answers.push({w:word, p:coords, d:direction.n});
}

function physicallyFit(word, coords, direction) {
	var x = coords.x, 
		y = coords.y;

	if (grid[x][y] !== "" && grid[x][y] !== word.substring(0,1)) {
		return false;
	}
	for (var i = 0, length = word.length-1; i < length ; i++) {
		x+=direction.h;
		y+=direction.v;
		if (x<0 || x >= squareSize || y<0 || y>=squareSize) {
			return false;
		}
		if (grid[x][y] !== "" && grid[x][y] !== word.substring(i+1,i+2)) {
			return false;
		}
	}


	return true;
}



function buildGrid() {
	initialiseGrid();
	wordsList.sort(function(w1, w2) {
		return (w1.length - w2.length) * -1;
	});

	_.each(wordsList, function(word) {
		var cnt=0;
		do {
			var position = pickACoordinate();
			var direction = pickADirection();
			var fit = physicallyFit(word, position, direction);
		} while (!fit && cnt++ < 100);

console.log(word + " (" + position.x + ", " + position.y + ") " + direction.n + "   "  + fit);

		if (fit) {
			put(word, position, direction);
			showGrid();
		}  

	
	});

	fillGrid();
	showGrid();
}

function fillGrid() {
	for (var i = 0; i < squareSize; i++ ) {
		for (var j = 0; j < squareSize; j++ ) {
			var char = grid[i][j];
			if (char === "") {
				grid[i][j] = randomLetter();
			}
		}
	}
}

// nieve random letter. equal chance all 26.
function randomLetter() {
	var l = Math.floor(Math.random() * 26);
	return "abcdefghijklmnopqrstuvwxyz".substring(l,l+1);
}


function pickADirection() {
	var r = Math.floor(Math.random() * 8);
	return directionMap[directions[r]];
}

function pickACoordinate() {
	var x = Math.floor(Math.random() * squareSize);
	var y = Math.floor(Math.random() * squareSize);

	return {x:x, y:y};
}


buildGrid();