"use strict";

(function($, ko) {
    ko.bindingHandlers.answer = {

        update: function(element, valueAccessor) {
            // This will be called once when the binding is first applied to an element,
            // and again whenever any observables/computeds that are accessed change
            // Update the DOM element based on the supplied values here.
            var answer = valueAccessor();
            $(element).text(answer.word.w.display());
            if (answer.found) {
                $(element).css("text-decoration", "line-through");
            } else {
                $(element).css("text-decoration", "normal");
            }
        }
    };
})(jQuery,ko);