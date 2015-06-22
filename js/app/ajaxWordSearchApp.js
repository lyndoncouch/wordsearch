"use strict";
(function($) {

	var promise = $.ajax({
		url:"json/english-example.json",
		dataType: 'json'
	});

	promise.complete(function(d) {
		console.log("finished?", d.responseText);
	});

	promise.then(function(data) {

		console.log("Data", data);
		//var w = ["horse","dog","cat","icecream","cow","fishfinger","chicken","snake"];
		var w = data.words;
		var wordsList = [];
		for (var i = 0, length = w.length; i < length; i++) {
			var ww = w[i];
			wordsList.push(new Word(ww));
		}

		var grid = new Grid();
		grid.vSize = data.size.y;
		grid.hSize = data.size.x;
		grid.wordsList = wordsList;
		Grid.prototype.letterList = data.letters;
		grid.buildGrid();

		window.gridModel = new GridViewModel(grid, grid.answers);

		ko.applyBindings(window.gridModel);

	// setup the layout and the listeners
		(function() {
			var gridEl = $("#grid");
			var canvEl = $("#drawing");

			$(".letter").mousedown(window.gridModel.mouseDownInGrid);
			gridEl.mouseup(window.gridModel.mouseUpInGrid);
			$(".letter").mouseenter(window.gridModel.letterEnter);
			var positioningProps = ["float","position","width","height","left","top","marginLeft","marginTop","paddingLeft","paddingTop"];

			for(i in positioningProps){
				canvEl.css(positioningProps[i], gridEl.css(positioningProps[i])||"");
			}	
			gridEl.css("zindex",1);
			canvEl.css("zindex",10);
			var width = gridEl.css("width");
			var height = gridEl.css("height");
			canvEl.attr({width:width, height:height});
		})();
	},
	function(err) {
		console.log("error\nMalformed json?",err.error().responseText);
	});
}(jQuery));

