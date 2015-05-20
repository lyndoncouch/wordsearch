(function($) {
	window.GridViewModel = function(grid) {
		var self = this;

		self.firstLetter = ko.observable();
		self.latestLetter = ko.observable();

		self.firstLetterPos = {};

		self.answers = ko.observableArray();
		self.lastClicked = ko.observable();
		self.latestHover = ko.observable();
		self.direction = ko.observable();

		
// 		var canvas = document.getElementById("drawing");
// 		self.context = canvas.getContext("2d");

// self.context.fillStyle = "#ff0000";
// self.context.fillRect(0,0, self.context.canvas.width, self.context.canvas.height);

// console.log("(" + self.context.canvas.width + ", " + self.context.canvas.height + ")")

		self.highLightedWord = ko.observable();
		self.highlightCoords = ko.observable();
		self.selectedWord = ko.observable();

		var rowsArrays = [];


		// setup the answers array
		var answers = [];
		$.each(grid.answers, function(i, answer) {
			answers.push( ko.observable({found:false, word:answer}));
		});
		self.answers(answers);
		

		self.mouseUpInGrid = function(event) {
			calculateLine();

			$.each(self.answers(), function(i,answer) {
				var answerObservable = answer();
				if (answerObservable.word.w.display() == self.selectedWord()) {
					answerObservable.found = true;
					answer(answerObservable);
					self.firstLetter(undefined);
					self.latestLetter(undefined);

					alert("FOUND " + self.selectedWord());
				}
			});	
		};

		self.mouseDownInGrid = function(event) {
			var id = event.target.id;
			var bits = id.split("_");
			var letter = letterCoord(event.target.id);

			var tt = $(event.target);

			letter.cX=tt[0].offsetLeft + 16;
			letter.cY=tt[0].offsetTop + 16;

			self.context.moveTo(event.originalEvent.x, event.originalEvent.y);
			self.firstLetter(letter);	

		}

		self.letterEnter = function(event) {
			fixWhich(event);

			if (event.which == 1) {
				var id = event.target.id;
				var bits = id.split("_");
				var letter = letterCoord(event.target.id);
				var tt = $(event.target);
				letter.cX=tt[0].offsetLeft + 16;
				letter.cY=tt[0].offsetTop + 16;
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

		var calculateLine = function() {
			var x1 = self.firstLetter().x;
			var y1 = self.firstLetter().y;

			var x2 = (self.latestLetter() && self.latestLetter().x) || x1 ;
			var y2 = (self.latestLetter() && self.latestLetter().y) || y1;

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

			// draw a line....
			if (selected) {
self.drawCurrentLine()

			}


		}

		var calcWord = function(x1,x2,y1,y2) {

		}

		self.drawCurrentLine = function() {
			var cx1 = self.firstLetter().cX;
			var cy1 = self.firstLetter().cY;

			var cx2 = (self.latestLetter() && self.latestLetter().cX) || cx1;
			var cy2 = (self.latestLetter() && self.latestLetter().cY) || cy1;

			var ctx = self.context;
			ctx.beginPath();
			ctx.lineWidth=10;
									
			ctx.strokeStyle = "#ff00ff";			
			

			ctx.lineCap="round";
			ctx.moveTo(cx1,cy1);
			ctx.lineTo(cx2,cy2);
			console.log("(" + cx1 + ", " + cy1 + ")  to (" + cx2 + ", " + cy2 + ")");
			ctx.stroke();			
		}


		var resetWord = function() {
			self.direction();
			self.highLightedWord();
			self.highlightCoords();
		}

		return self;
	}
}(jQuery));