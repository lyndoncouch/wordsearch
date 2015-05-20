ko.bindingHandlers.answer = {
//     init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
//         // This will be called when the binding is first applied to an element
//         // Set up any initial state, event handlers, etc. here
//         var answer = valueAccessor();
//         $(element).text(answer.word.w.display());
//         if (answer.found) {
//             $(element).css("text-decoration", "line-through");
//         } else {
//             $(element).css("text-decoration", "normal");
//         }


//     },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
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