(function($) {
	window.GridViewModel = function(grid) {
		var self = this;
//		self.grid = ko.observable(grid);
		self.answers = ko.observableArray(grid.answers);
		self.lastClicked = ko.observable();
		self.latestHover = ko.observable();
		self.direction = ko.observable();
		self.highLightedWord = ko.observable();
		self.highlightCoords = ko.observable();

		var rowsArrays = [];
		

		for (var i = 0, length=grid.vSize; i < length; i++) {
			var cells = ko.observableArray(grid.getRow(i));
			rowsArrays.push(cells);
		}
		self.gridRowsArrays = ko.observableArray(rowsArrays);

		self.clickedLetter = function(element,event) {
			var id = event.target.id;
			var bits = id.split("_");
			self.lastClicked({x: bits[1], y:bits[2]});
			return true;
		};

		self.hoverLetter = function(element, event) {
			console.log("ll " + self.lastClicked());
			if (self.lastClicked()) {
				var id = event.target.id;
				var bits = id.split("_");
				self.latestHover({x: bits[1], y:bits[2]});
				calculateLine();
			}
			return true;
		}

		var calculateLine = function() {
			var x1 = self.lastClicked().x;
			var y1 = self.lastClicked().y;

			var x2 = self.latestHover().x;
			var y2 = self.latestHover().y;

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

			} else if(x1 = x2) {
				// vertical
				if (y1 < y2) {
					self.direction("N");
				} else {
					self.direction("S");
				}
			}
console.log("selected " + selected);

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