What is it?
===========
`fieldChooser.js` is a [jQuery][] plugin for selecting from a list of fields or values (the source) and adding them to a new list (the destination). You move fields from the source to the destination by dragging and dropping. Fields themselves can be simple HTML elements or more complex containers. 

Why would I use it?
===================
`fieldChooser` builds off the jQuery UI [Sortable][] interaction, which allows for dragging and dropping of an HTML element between two containers. `fieldChooser` creates and manages the interaction between the containers, and adds the following capabilities:

- **Multi-select capability.** Shift-click for contiguous selections, control-click (Command-click on Mac) for discontiguous selections. Once selected, multiple items may be dragged and dropped.
- **Keyboard support.** Navigate through a list using the up and down arrow keys. Hold down the shift key while pressing up or down to select multiple items.


Dependencies
============
`fieldChooser.js` uses the [jQuery][] library for DOM manipulation, and [jQuery UI][] for drag and drop support. 

How do I use it?
================

1. Create a `<div>` to hold the field chooser. 
2. Within the field chooser `<div>`, add an additional `<div>` element which contain the source "fields" and another `<div>` containing the destination fields.
2. Create a [jQuery object][] for the `<div>`, and invoke the `fieldChooser()` method on it to instantiate and return the field chooser.

For example:  
```javascript  
var $sourceFields = $("#sourceFields");
var $destinationFields = $("#destinationFields");
var $chooser = $("#fieldChooser").fieldChooser($sourceFields, $destinationFields);

```

Function reference
==================

`fieldChooser` Methods
----------------------
The `fieldChooser` houses two containers, one for the source elements (fields), and another for the destination elements. Each of these two containers is a `fieldList` object.  

NOTE: In order to enable keyboard support, all clickable elements (field lists, fields) within a `fieldChooser` are assigned a `tabIndex` attribute. They will inherit this value from the parent element on which the `fieldChooser()` method is invoked, but if this element does not have one, they will assume a default `tabIndex` value of 0.

###fieldChooser(sourceFields, destinationFields, options)###
Creates a new field chooser and binds it to the `<div>` on which this method is called. If invoked more than once on the same [jQuery object][], will return a single instance; however, if you create a new [jQuery object][] for the same div, you will end up with more than one chooser.

**parameters**  
*sourceFields* ([jQuery object][]): A container element which holds all of the "field" elements you want to display in the source list.

*destinationFields* ([jQuery object][]): A container element which holds all of the "field" elements you want to display in the destination list.

*options* (object): Configuration options for the field chooser instance. Currently, there are no configuration options, so this is just a placeholder for future functionality.

**returns**  
The field chooser instance.

###getOptions()###
Retrieves the configuration options for the field chooser instance. 

**parameters**  
(none)

**returns**  
An object containing the configuration options for the instance.

###getSourceList()###
Retrieves the field list containing all of the source fields. (The source is the left-hand container in the field chooser.)

**parameters**  
(none)

**returns**  
A `fieldList` object containing the source fields.

###getDestinationList()###
Retrieves the field list containing all of the destination fields. (The destination is the right-hand container in the field chooser.)

**parameters**  
(none)

**returns**  
A `fieldList` object containing the destination fields.

###getFieldList(field)###
Gets the container for a particular field.

**parameters**  
*field* ([jQuery object][]): A field (or set of fields) in either the source or destination list within the chooser.

**returns**  
The `fieldList` object containing the field. 

###destroy()###
Removes the drag-drop capability from the list.

**parameters**
(none)

**returns**
(none)

`fieldChooser` Events
---------------------
###listChanged###
Fired when fields move from one list to another. 

**callback parameters**  
*event* ([jQuery event][]): The jQuery event invoking the callback.

*selection* ([jQuery object][]): The field (or set of fields) which has moved.

*list* (`fieldList`): The field list to which the selection has moved.

`fieldList` Methods
-------------------
A `fieldList` is a jQuery [Sortable][] container (a `<div>`) which holds the "fields" in the chooser. Fields can be whatever you need - any HTML element will work, so they can be as simple or complex as necessary. 

Because the `fieldList` is a [Sortable][] object, you can set any of the [Sortable][] options, call [Sortable][] methods, or handle [Sortable][] events. However, you should avoid overriding the following options, or you may interfere with `fieldChooser` functionality:

- `connectWith`: This is already set by the parent `fieldChooser`, so modifying this value will break the drag/drop operation of the chooser.  
- `helper`: The `fieldChooser` uses a custom helper to manage the movement of multiple items at once. 

###add(content)###
Adds content (fields) to the list.

**parameters**  
*content* ([jQuery object][]): A field (or set of fields) to add to the list.

**returns**  
The list (for chaining).

###getFields()###
Retrieves all of the fields in the list.

**parameters**  
(none)

**returns**  
A [jQuery object][] containing all of the fields in the list.

###getSelection()###
Retrieves the selected fields in the list.

**parameters**  
(none)

**returns**  
A [jQuery object][] containing all of the selected fields in the list.

###getSelectedIndex()###
Retrieves the index of the current selection. This is a single value pointing to the last individually selected item in the list. 

**parameters**  
(none)

**returns**  
The index value (an integer) of the last individually selected item in the list. If there is no selection, returns -1. 

###getExtendedSelectionIndex()###
Retrieves the index of the last item to which the selection was extended. You can extend a selection by using the shift key, or invoking the `selectTo()` or `extendSelection()` method.

**parameters**  
(none)

**returns**  
The index value (an integer) of the last item in an extended selection. If there is no selection, or if the selection has not been extended, returns the same value as `getSelectedIndex()`. 

###clearSelection()###
Clears the set of selected fields in the list.

**parameters**  
(none)

**returns**  
(none)

###selectField(field)###
Selects a single field in the list. If other fields are selected, they will be deselected after this operation. This is the programmatic equivalent of clicking on a field.

**parameters**  
*field* ([jQuery object][]): The field to select.

**returns**  
(none)

###selectAt(index)###
Selects the field at a given index. If other fields are selected, they will be deselected after this operation. This is the programmatic equivalent of clicking on a field. 

**parameters**  
*index* (integer): The index of the field to select. 

**returns**  
(none)

###toggleFieldSelection(field)###
Toggles a field between selected or deselected states. Retains any previous field selections. This is the programmatic equivalent of control-clicking on a field.

**parameters**  
*field* ([jQuery object][]): The field to toggle. 

**returns**  
(none)

###selectTo(fieldOrIndex)###
Extends the current selection to the field or field index specified. If there is no existing selection, starts a new one beginning with the first field.

**parameters**  
*fieldOrIndex* ([jQuery object][] or integer): The field or the index of the field to which the selection should be extended.

**returns**  
(none)

###extendSelection(up)###
Extends the current selection by a single field in the direction specified. If there is no existing selection, begins a new one at the far end of the list - i.e., if the direction is up, starts at the bottom; if the direction is down, starts at the top.

**parameters**  
*up* (boolean): Indicates the direction in which the selection should be extended. Pass `true` to extend the selection "up" the list (i.e., decreasing index values); `false` to extend down.

**returns**  
(none)

`fieldList` Events
------------------
###selectionChanged###
Fired when the selection changes on a list. 

**callback parameters**  
*list* (`fieldList`): The list on which the selection changed.

Styling reference
==================
`fieldChooser` uses classes to identify subcomponents, so you can freely style the entire control using CSS. It defines the following classes:

###fc-field-list###
Applied to all `fieldList` objects (source and destination) in the control. 

**Recommended properties**  
Some kid of border
overflow: scroll

###fc-source-fields###
Applied to the "source" field list. 

**Recommended properties**  
float: left

###fc-destination-fields###
Applied to the "destination" field list.

**Recommended properties**  
float: right

###fc-field###
Applied to fields in a `fieldList`.

###fc-selected###
Applied to selected fields in a `fieldList`.


License
=======
`fieldChooser.js` is free to use under the MIT license, which is included at the top of the un-minified version of the source. If you use the un-minified version, please include the license text as provided. 

I wrote this plugin while working for [Intuit][]'s [QuickBase][] team; Intuit is the copyright holder. 


[jQuery]: http://jquery.com/ 
[jQuery UI]: http://jqueryui.com/
[Sortable]: http://jqueryui.com/sortable/
[jQuery object]: http://api.jquery.com/Types/#jQuery
[jQuery event]: http://api.jquery.com/Types/#Event
[Intuit]: http://www.intuit.com/ 
[QuickBase]: http://quickbase.intuit.com/ 
