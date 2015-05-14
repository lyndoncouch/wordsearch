(function($) {
	window.GridViewModel = function(grid) {
		var self = this;

		self.firstLetter = ko.observable();
		self.latestLetter = ko.observable();


		self.answers = ko.observableArray(grid.answers);
		self.lastClicked = ko.observable();
		self.latestHover = ko.observable();
		self.direction = ko.observable();



		self.highLightedWord = ko.observable();
		self.highlightCoords = ko.observable();
		self.selectedWord = ko.observable();

		var rowsArrays = [];
		
		self.mouseUpInGrid = function(event) {
			calculateLine();

			$.each(self.answers(), function(i,word) {
				if (word.w.display() == self.selectedWord()) {

					alert("FOUND " + self.selectedWord);

				}
			});	
		};

		self.mouseDownInGrid = function(event) {
			var id = event.target.id;
			var bits = id.split("_");
			var letter = letterCoord(event.target.id);
			self.firstLetter(letter);	
		}

		self.letterEnter = function(event) {
			fixWhich(event);

			console.log(event.which);
			if (event.which == 1) {
				var id = event.target.id;
				var bits = id.split("_");
				var letter = letterCoord(event.target.id);
				self.latestLetter(letter);

				calculateLine();
			}
		}

		var fixWhich = function(e) {
		  if (!e.which && e.button) {
			if (e.button & 1) e.which = 1      // Left
			else if (e.button & 4) e.which = 2 // Middle
			else if (e.button & 2) e.which = 3 // Right
		  }
		}


		var letterCoord = function(id) {
			var bits = id.split("_");
			var letter = {x: new Number(bits[1]).valueOf(), y:new Number(bits[2]).valueOf()};
			return letter;			
		}

		for (var i = 0, length=grid.vSize; i < length; i++) {
			var cells = ko.observableArray(grid.getRow(i));
			rowsArrays.push(cells);
		}
		self.gridRowsArrays = ko.observableArray(rowsArrays);

// 		self.clickedLetter = function(element,event) {
// 			var id = event.target.id;
// 			var bits = id.split("_");
// 			self.lastClicked({x: new Number(bits[1]).valueOf(), y:new Number(bits[2]).valueOf()});
// 			return true;
// 		};

// 		self.hoverLetter = function(element, event) {
// 			console.log("ll " + self.lastClicked());
// 			if (self.lastClicked()) {
// 				var id = event.target.id;
// 				var bits = id.split("_");
// 				self.latestHover({x: new Number(bits[1]).valueOf(), y:new Number(bits[2]).valueOf()});
// 				calculateLine();
// 			}
// 			return true;
// 		}

		var calculateLine = function() {
			var x1 = self.firstLetter().x;
			var y1 = self.firstLetter().y;

			var x2 = self.latestLetter().x;
			var y2 = self.latestLetter().y;

			if (x1 == x2 && y1 == y2) {
				return;
			}

			var selected = "";
			// worry about e-w and n-s for the moment....
			if (y1 == y2) {
				// horizontal
				if (x1 < x2) {
					self.direction("w");
					for (var i =x1; i<=x2; i++) {
						selected += grid.getLetterAt(i,y1);
					}
				} else {
					self.direction("E");
					for (var i =x1; i>=x2; i--) {
						selected += grid.getLetterAt(i,y1);
					}
				}

			} else if(x1 == x2) {
				// vertical
				if (y1 < y2) {
					self.direction("N");
					for (var i=y1; i <= y2; i++) {
						selected += grid.getLetterAt(x1,i);
					}
				} else {
					self.direction("S");
					for (var i=y1; i >= y2; i--) {
						selected += grid.getLetterAt(x1,i);
					}					
				}
			} else if (x2-x1 == y2-y1) {
				console.log("diag");
				// diagonal
				var length = Math.abs(x2 - x1);				
				var sign = Math.sign(x2 - x1);
				console.log(length + "  " + sign);
				for (var i=0; i<= length ; i++) {
					var x = x1 + (sign * i);
					var y = y1 + (sign * i);
					console.log(x + ", " + y);
					selected += grid.getLetterAt(x,y);
				}
				
			}


			self.selectedWord(selected);


		}

		var calcWord = function(x1,x2,y1,y2) {

		}


		var resetWord = function() {
			self.direction();
			self.highLightedWord();
			self.highlightCoords();
		}

		return self;
	}
}(jQuery));