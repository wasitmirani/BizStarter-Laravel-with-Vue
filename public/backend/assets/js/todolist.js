(function () {
    "use strict";

    /* AssignedDate Picker */
    flatpickr("#addignedDate", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    });

    /* TargetDate Picker */
    flatpickr("#targetDate", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    });

    /* multi select with remove button */
    const multipleCancelButton = new Choices(
        '#choices-multiple-remove-button',
        {
            allowHTML: true,
            removeItemButton: true,
        }
    );

    /* draggable js */
    dragula([document.getElementById('todo-drag')],{
        moves: function (el, container, handle) {
            return handle.classList.contains('todo-handle');
          }
    });

     const checkboxes = document.getElementsByClassName("todo-check");

     Array.from(checkboxes).forEach(function(checkbox) {
         const todoItem = checkbox.closest(".todo-handle");
 
         if (checkbox.checked) {
             todoItem.classList.add("checked-todo");
         } else {
            todoItem.classList.remove("checked-todo");
         }
 
         checkbox.addEventListener("change", function() {
             if (checkbox.checked) {
                 todoItem.classList.add("checked-todo");
             } else {
                 todoItem.classList.remove("checked-todo");
             }
         });
     });

})();