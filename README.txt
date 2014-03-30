Instructions:

1. copy minified/developer version of custoSelect.js to you javascript folder.
2. Copy the css code for custom select to your css file.
3. add a class to you html select element, say custom_select and call $('.custom-select').customSelect() to create custom select.

Dependencies:
Jquery version 8 or above.

Creating a custom select is best avoided since its adding a lot of javascript for something that would work without it. But due to the highspeed client side processing of javascript components now a days, it seems less of a concern to add javascript for decoration purposes.

I had a requirement for a select menu to have a custom look and also to conform to accessibility standards. I stumbled on finding one which had screen reader accessibility and decided to write one of my own.

Here is how the custom select works with various user inputs:

Mouse actions:
1. On click of select element dropdown toggles.
2. On click of any option on the dropdown the option gets selected and closes the dropdown.

Keyboard actions:
Actions on select element:
1. On tabbing select element gets selected. (In tabbing order).
2. On pressing down arrow open the dropdown.
Note: This action:
	- opens dropdown on webkit browsers
	- changes options without opening dropdown and selects option as well on firefox and IE browsers.
3. Alt + down arrow opens dropdown in all cases.
4. Tab moves focus to the next element in tabbing order.

Actions on options:
1. Key down moves down to next option.
2. Key up moves up to next option.
3. Page down, End moves to last option.
4. Page up, Home moves to first option.
Note: Above actions does not select the option in webkit browsera, selects in firefox and IE browsers. Here we do not select any options but just browse through them.

5. Key left moves to previous option. (same as up arrow)
6. Key right moves to next option.(same as down arrow)
Note: This actions do not work on most brosers.

7. Enter, Space selects option and closes the dropdown. (Space only in certain browsers)
8. Esc closes dropdown without changing option.
9. Tab makes the change in option, closes dropdown and moves to the  next element in tabbing order.

Note: I believe the best options in terms of user experience would be to show the dropdown on down arrow as thats what happens on mouse click. Browse through the options without selecting it on key down and up arrows as well left and right arrows. Select option and close dropdown if space, tab or Enter is pressed and close dropdown without selecting anything if esc is pressed. This may just be my opinion.

Approach:

1. Use an anchor tag for display of the select element widget with tabindex -1 so that we do not have it in the tabbing order.
2. An input element visually hidden that is used to put the select widget in tabbing order and has the selected options textual value that needs to be read out by the screen readers. This element represents the select widget and has the follow aria tags:
  role="combobox"
  aria-autocomplete="listbox"
  aria-labelledby="' + select.id + '_label"  where select id is the id of the select box which is being replaced by the custom widget.
  aria-activedescendant= '{select.id}_option' which is a unique id for the option being selected.
 3. A hidden input element that holds the value of the select element and has the same name as the select element being replaced.
 4. A list to display the dropdown options with the following aria tags:
 	Tags for ul element:
 		role="listbox"
 		aria-live="polite"
 		aria-expanded="true"
 	Tags for li elements:
 		role="option"
 		data-option-array-index={index of option starting from 1}
 		aria-selected= true for selected option, false otherwise
 		tabindex = -1 (0 when the element is in focus)
 		id = '{select.id}_option' when element is in focus '' (empty) otherwise

 Working: 
  - When tabbed into the widget the input element has focus and tabindex of 0. 
  - When clicking and mouse over options, or pressing down arrow to navigate through options, focus is transfered to the corresponding li tag with the necessary changes to aria tags and tab index as mentioned above.
  - Once the menu loses focus the list item tab index is reverted back to -1 and focus is transfered to the widget input tag (or the next element in focus in case of tabbing).

