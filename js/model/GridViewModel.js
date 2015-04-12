(function($) {
	window.GridViewModel = function(grid) {
		var self = this;
		self.grid = ko.observable(grid);
		self.answers = ko.observableArray(grid.answers);
		var rowsArrays = [];
		

		for (var i = 0, length=grid.vSize; i < length; i++) {
			var cells = ko.observableArray(grid.getRow(i));
			rowsArrays.push(cells);
		}
		self.gridRowsArrays = ko.observableArray(rowsArrays);


		return self;
	}
}(jQuery));