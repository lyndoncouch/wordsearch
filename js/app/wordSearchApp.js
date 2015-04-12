(function($) {

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

	window.gridModel = new GridViewModel(grid, grid.answers);

	ko.applyBindings(window.gridModel);

}(jQuery));

