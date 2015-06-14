"use strict";
/*
    A representation of a line.

    start and end should be point objects : {x:x, y:y}
    direction should be a String of N, S, NE etc.

    The position of the points should be in the centre of the character that they are 
    aligned with (ie. offsetLeft + 16).

    The direction can then be used to calculate where to offset the start and end to in order
    to make a pretty line.

    The default line colour is black. 

    The default line width is 10;

*/

function Line(start, end, direction, colour, lineWidth) {
    var self = this;

    self.start = start;
    self.end = end;
    self.direction = direction;
    self.colour = colour || "#000000";
    self.lineWidth = lineWidth || 10;

    self.simpleDraw = function(context) {
        // set up line details
        context.lineWidth = self.lineWidth;
        context.strokeStyle = self.colour;
        context.lineCap = 'round';

        // draw the line
        context.beginPath();
        context.moveTo(self.start.x, self.start.y);
        context.lineTo(self.end.x, self.end.y);
        context.stroke();
    };

    return self;
}