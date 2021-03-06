"use strict";
(function($, ko) {

	var pixelOffsetX = 16;
	var pixelOffsetY = 8;

	window.GridViewModel = function(grid) {
		var self = this;

		self.answers = ko.observableArray();

		var firstLetter = {};
		var latestLetter = {};
		var direction = "";
		var canvas = document.getElementById("drawing");
		var context = canvas.getContext("2d");
		var currentLine = {};
		var currentPosLine = {};

		var selectedWord;

		var canvasBackgroundColour = "#ffffff";
		var canvasAnswerColour = "#fe0011";
		var canvasCurrenctColour = "#00ff88";
		var currentPosColour = "#ff00ff";

		var gridOffset = $("#grid").offset();

		// setup the answers array
		(function() {
			var answers = [];
			$.each(grid.answers, function(i, answer) {
				answers.push( ko.observable({found:false, word:answer, line:{}}));
			});
			self.answers(answers);

			var rowsArrays = [];
			for (var i = 0, length=grid.vSize; i < length; i++) {
				var cells = ko.observableArray(grid.getRow(i));
				rowsArrays.push(cells);
			}
		   self.gridRowsArrays = ko.observableArray(rowsArrays);

		})();

		self.mouseUpInGrid = function(event) {
// 			currentLine = {};
			calculateLine(event);

			$.each(self.answers(), function(i,answer) {
				var answerObservable = answer();
				if (answerObservable.word.w.display() === selectedWord) {

					var start = {x:firstLetter.cX, y:firstLetter.cY};
					var end = getCanvasPositionFromEvent(event);
					var answerLine = new Line(currentLine.start, currentLine.end, currentLine.direction, canvasAnswerColour);
					answerObservable.line = answerLine;
					
					answerObservable.found = true;
					answer(answerObservable);

					alert("FOUND " + selectedWord);
					clearWord();
				}
			});	
		};

		self.mouseDownInGrid = function(event) {
			var letter = letterCoord(event.target.id);
			var pos = getCanvasPositionFromEvent(event);
			letter.cX = pos.x;
			letter.cY = pos.y;

			firstLetter = letter;	
			currentLine = {};
			currentPosLine = {};
		};

		self.letterEnter = function(event) {
			fixWhich(event);

			if (event.which == 1) {
				var letter = letterCoord(event.target.id);

				var pos = getCanvasPositionFromEvent(event);
				letter.cX=pos.x;
				letter.cY=pos.y;
				latestLetter = letter;

				currentPosLine = new Line({x:firstLetter.cX, y:firstLetter.cY},
					{x:pos.x, y:pos.y},null, currentPosColour);
					

				calculateLine();
			}
		};

		var getCanvasPositionFromEvent = function(event) {
			var target = $(event.target);

			var x = target[0].offsetLeft + pixelOffsetX;
			var y = target[0].offsetTop + pixelOffsetY;
			return {x:x, y:y};	
		};

		var getCanvasPositionFromLetterPos = function(x,y) {
			var id = "cell_" + x + "_" + y;
			var letterElement = $("#" + id);
			var offset = letterElement.offset();
			var cX = offset.left - gridOffset.left;
			var cY = offset.top - gridOffset.top;

			return {x:cX + pixelOffsetX, y:cY + pixelOffsetY};
		};


		var fixWhich = function(e) {
		  if (!e.which && e.button) {
			if (e.button & 1) {
				e.which = 1; // Left
			} else if (e.button & 4) {
				e.which = 2; // Middle
			} else if (e.button & 2) {
				e.which = 3; // Right
			}
		  }
		};


		var letterCoord = function(id) {
			var bits = id.split("_");
			var letter = {x: parseInt(bits[1],10), y: parseInt(bits[2],10)};

			return letter;			
		};

		var calculateLine = function(event) {
			if (!firstLetter) {
				return;
			}
			var x1 = firstLetter.x;
			var y1 = firstLetter.y;
			var x2,y2,i;

			if (event) {
				var pos = letterCoord(event.target.id);
				x2 = pos.x;
				y2 = pos.y;
			} else {
				x2 = (latestLetter && latestLetter.x );// || x1 ;
				y2 = (latestLetter && latestLetter.y );// || y1;
			}

			if (x1 == x2 && y1 == y2) {
				return;
			}

			var selected = "";
			// worry about e-w and n-s for the moment....
			if (y1 == y2) {
				// horizontal
				if (x1 < x2) {
					direction = "E";
					for (i =x1; i<=x2; i++) {
						selected += grid.getLetterAt(i,y1);
					}
				} else {
					direction = "W";
					for (i =x1; i>=x2; i--) {
						selected += grid.getLetterAt(i,y1);
					}
				}

			} else if(x1 == x2) {
				// vertical
				if (y1 < y2) {
					direction = "S";
					for (i=y1; i <= y2; i++) {
						selected += grid.getLetterAt(x1,i);
					}
				} else {
					direction = "N";
					for (i=y1; i >= y2; i--) {
						selected += grid.getLetterAt(x1,i);
					}					
				}
			} else if (Math.abs(x2-x1) == Math.abs(y2-y1)) {
				// diagonal
				var length = Math.abs(x2 - x1);				
				var sign = Math.sign(x2 - x1);
				for (i=0; i<= length ; i++) {
					var x = x1 + (sign * i);
					var y = y1 + (sign * i);
					selected += grid.getLetterAt(x,y);
				}
				if (y1 < y2) {
					direction = "S";
				} else {
					direction = "N";
				}
				if (x1 < x2) {
					direction += "E";
				} else {
					direction += "W";
				}
			}

			// draw a line....
			if (selected) {
				selectedWord = selected;
				currentLine = new Line(
						getCanvasPositionFromLetterPos(x1, y1), 
						getCanvasPositionFromLetterPos(x2, y2),
						direction,
						canvasCurrenctColour);
			}
		};

		var clearWord = function() {
			direction = "";
			firstLetter = undefined;
			latestLetter = undefined;
			selectedWord = undefined;
			currentLine = {};
			currentPosLine = {};
		};

		var drawCanvas = function() {
			// clear canvas
			context.fillStyle=canvasBackgroundColour;
			context.fillRect(0,0,canvas.width, canvas.height);

			// loop through all of the answered words and paint them
			$.each(self.answers(), function(i, answerObservable) {
				var answer = answerObservable();
				if (answer.found) {
//console.log("answer found", answer.line);
					answer.line.simpleDraw(context);
				}

			});

			if (currentPosLine && currentPosLine.start && currentPosLine.end) {
				currentPosLine.simpleDraw(context);
			}

			// draw the current line
			if (currentLine && currentLine.start && currentLine.end) {
				// draw current line
				currentLine.simpleDraw(context);
			}
		};

		var canvasInterval = setInterval(drawCanvas, 1000.0 / 5);

		self.stopC = function() {
			clearInterval(canvasInterval);
		};

		return self;
	};
}(jQuery, ko));