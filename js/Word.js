"use strict";

function Word(initial) {
	var self = this;

	if (initial) {
		if (initial instanceof Array) {
			self.letters = initial;
		} else {
			self.letters = initial.split("");
		}
	}	else {// an array of letters for each word.
		self.letters = [];
	}

	return self;
}

Word.prototype.length = function() {
	return this.letters.length;	
};

Word.prototype.display = function() {
	return this.letters.join("");
};

Word.prototype.get = function(n) {
	return this.letters[n];
};