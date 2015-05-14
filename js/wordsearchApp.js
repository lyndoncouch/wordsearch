	var words = [];
	var w = ["horse","dog","cat","icecream","cow","fishfinger","chicken","snake"];
	var wordsList = [];
	for (var i = 0, length = w.length; i < length; i++) {
		var ww = w[i];
		wordsList.push(new Word(ww));
	};
	var grid = new Grid();
	grid.wordsList = wordsList;
	grid.buildGrid();


	var _horiz = Array.prototype.join.call({length: (10 * 2) + 2}, '-') + "\n";

	var string = "";
	for (var i = 0; i < 10; i++ ) {
		string += _horiz + "|";
		for (var j = 0; j < 10; j++ ) {
			var char = grid.getLetterAt(i,j);
			string += char?char:" ";
			string += "|";
		}
		string +="\n";	
	}
	string += _horiz;
	console.log(string);
	console.log("\n");
	for (var i = 0, length = answers.length; i < length; i++) {
		var answer = answers[i];
		console.log(answer.w.display());
	};


