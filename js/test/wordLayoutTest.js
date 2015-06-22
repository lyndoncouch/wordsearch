// test for word layout

(function($) {
	var counter = {};
	var resetCounter = function() {
		for (var i=0; i < Grid.prototype.directions.length; i++) {
			counter[Grid.prototype.directions[i]] = 0;
		}
	}

	var countDirections = function(answers) {
		for (var i = 0; i < answers.length; i++) {
			var answer = answers[i];
			var c = counter[answer.d];
			counter[answer.d] = c + 1;
		}
	}

	resetCounter();

	var pic=[];
	for (var i=0; i < 100; i++) {
		var dir = Grid.prototype.pickADirection();
		pic.push({d:dir.n});
	}
	countDirections(pic);
	console.log("directions", counter);


	resetCounter();

	var w = ["horse","dog","cat","icecream","cow","fishfinger","chicken","snake"];
	var wordsList = [];
	for (var i = 0, length = w.length; i < length; i++) {
		var ww = w[i];
		wordsList.push(new Word(ww));
	}

	var grid = new Grid();
	grid.wordsList = wordsList;

	for (i=0 ; i < 100; i++) {
		grid.buildGrid();
		countDirections(grid.answers);
	}

	console.log("grid", counter);

})(jQuery);


