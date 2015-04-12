
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
		answers = [];
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
	}

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
	}

	var fillGrid = function() {
		for (var i = 0; i < self.hSize; i++ ) {
			for (var j = 0; j < self.vSize; j++ ) {
				var char = grid[i][j];
				if (char === "") {
					grid[i][j] = self.randomLetter();
				}
			}
		}
	}

	self.buildGrid = function() {
		initialiseGrid();
		self.wordsList.sort(function(w1, w2) {
			return (w1.length() - w2.length()) * -1;
		});

		for (var i = 0; i< self.wordsList.length; i++) {
			var word = self.wordsList[i];

			var cnt=0;
			do {
				var position = self.pickACoordinate();
				var direction = self.pickADirection();
				var fit = doesWordFit(word, position, direction);
			} while (!fit && cnt++ < 100);

			if(logging) {
				console.log(word.display() + " (" + position.x + ", " + position.y + ") " + direction.n + "   "  + fit);
			}

			if (fit) {
				addWordToGrid(word, position, direction);
				if (logging) {
					showGrid();
				}
			}  

		}

		fillGrid();

	}

// 	self.getLetterAt = function(x,y) {
// 		return grid[x][y];
// 	}

	self.getLetterAt = function(x,y) {
		return grid[y][x];
	}

	self.getRow = function(y) {
		return grid[y];
	}

	return self;
};



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

// nieve random letter. equal chance all 26.
Grid.prototype.randomLetter = function() {
	var l = Math.floor(Math.random() * 26);
	return "abcdefghijklmnopqrstuvwxyz".substring(l,l+1);
};

Grid.prototype.pickADirection = function() {
	var r = Math.floor(Math.random() * 8);
	return this.directionMap[this.directions[r]];
};

Grid.prototype.pickACoordinate = function() {
	var x = Math.floor(Math.random() * this.hSize);
	var y = Math.floor(Math.random() * this.vSize);
	return {x:x, y:y};
};
