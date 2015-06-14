"use strict";

function Grid() {
	var self = this;
	var grid = [[]];

	var logging = window.logging;

	self.hSize = 10;
	self.vSize = 10;
	self.wordsList = [];
	self.answers = [];

	var initialiseGrid = function() {
		for (var i = 0; i < self.vSize; i++) {
			grid[i] = [];
			for (var j = 0; j < self.hSize; j++) {
				grid[i][j] = "";
			}
		}
		self.answers = [];
	};

	var doesWordFit = function (word, coords, direction) {
		var x = coords.x, 
			y = coords.y;

		if (grid[x][y] !== "" && grid[x][y] !== word.get(0)) {
			return false;
		}
		for (var i = 0, length = word.length()-1; i < length ; i++) {
			x+=direction.h;
			y+=direction.v;
			if (x<0 || x >= self.hSize || y<0 || y>=self.vSize) {
				return false;
			}
			if (grid[x][y] !== "" && grid[x][y] !== word.get(i+1)) {
				return false;
			}
		}
		return true;
	};

	var addWordToGrid = function(word, coords, direction) {
		if (logging) {
			console.log("putting " + word.display()+ " (" + coords.x + ", " + coords.y + ") " + direction.n);
		}

		var x = coords.x,
			y = coords.y;

		for (var i = 0, length = word.length(); i < length; i++) {
			grid[x][y] = word.get(i);
			x+=direction.h;
			y+=direction.v;
		}

		self.answers.push({w:word, p:coords, d:direction.n});
	};

	var fillGrid = function() {
		for (var i = 0; i < self.hSize; i++ ) {
			for (var j = 0; j < self.vSize; j++ ) {
				var char = grid[i][j];
				if (char === "") {
					grid[i][j] = self.randomLetter();
				}
			}
		}
	};

	self.buildGrid = function() {
		initialiseGrid();
		self.wordsList.sort(function(w1, w2) {
			return (w1.length() - w2.length()) * -1;
		});

		for (var i = 0; i< self.wordsList.length; i++) {
			var word = self.wordsList[i];
			var fit, position, direction;
			var cnt=0;
			do {
				position = self.pickACoordinate();
				direction = self.pickADirection();
				fit = doesWordFit(word, position, direction);
			} while (!fit && cnt++ < 100);

			if (fit) {
				addWordToGrid(word, position, direction);
			}  

		}

		fillGrid();

	};

	self.getLetterAt = function(x,y) {
		return grid[y][x];
	};

	self.getRow = function(y) {
		return grid[y];
	};

	return self;
}



Grid.prototype.directions = ["N","NE","E","SE","S","SW","W","NW"];
Grid.prototype.directionMap = {
	"N": 	{n: "N",  h: 0, v: -1},
	"NE": 	{n: "NE", h: 1, v: -1},
	"E": 	{n: "E",  h: 1, v: 0},
	"SE": 	{n: "SE", h: 1, v: 1},
	"S": 	{n: "S",  h: 0, v: 1},
	"SW": 	{n: "SW", h: -1, v: 1},
	"W": 	{n: "W",  h: -1, v: 0},
	"NW": 	{n: "NW", h: -1, v: -1}
};

Grid.prototype.letterList = 'abcdefghijklmnopqrstuvwxyz';

// nieve random letter. equal chance all 26.
Grid.prototype.randomLetter = function() {
	var l, letter;
	if ($.isArray(Grid.prototype.letterList)) {
		l = Math.floor(Math.random() * Grid.prototype.letterList.size());
		letter = Grid.prototype.letterList[l];
	} else {
		l = Math.floor(Math.random() * Grid.prototype.letterList.length);
		letter = Grid.prototype.letterList.substring(l, l+1);
	}

	return letter;
};

Grid.prototype.pickADirection = function() {
	var r = Math.floor(Math.random() * 8);
	var d = this.directionMap[this.directions[r]];
	return d;
};

Grid.prototype.pickACoordinate = function() {
	var x = Math.floor(Math.random() * this.hSize);
	var y = Math.floor(Math.random() * this.vSize);
	return {x:x, y:y};
};
