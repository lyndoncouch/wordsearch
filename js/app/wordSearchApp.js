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

	var gridEl = $("#grid");
	var canvEl = $("#drawing");

	$(".letter").mousedown(gridModel.mouseDownInGrid);
	gridEl.mouseup(gridModel.mouseUpInGrid);
	$(".letter").mouseenter(window.gridModel.letterEnter);

	var positioningProps = ["float","position","width","height","left","top","marginLeft","marginTop","paddingLeft","paddingTop"];

	for(var i in positioningProps){
		canvEl.css(positioningProps[i], gridEl.css(positioningProps[i])||"");
	}	
	gridEl.css("zindex",1);
	canvEl.css("zindex",10);
	var w = gridEl.css("width");
	var h = gridEl.css("height");
	canvEl.attr({width:w, height:h});

	var canvas = document.getElementById("drawing");
	window.gridModel.context = canvas.getContext("2d");

// window.gridModel.context.fillStyle = "#ff0000";
// window.gridModel.context.fillRect(0,0, window.gridModel.context.canvas.width, window.gridModel.context.canvas.height);

console.log("(" + window.gridModel.context.canvas.width + ", " + window.gridModel.context.canvas.height + ")")


	
console.log("should be set to " + w + "," +  h)
	
}(jQuery));

