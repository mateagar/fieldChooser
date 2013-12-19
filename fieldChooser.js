(function($) {
    $.fn.fieldChooser = function (options) {
        //----------------------------------------------------------------------
        // Poor man's singleton 
        //----------------------------------------------------------------------
        if (this.getOptions) {
            return this;
        }
        
        //----------------------------------------------------------------------
        // Private methods 
        //----------------------------------------------------------------------
        function getBounds(element) {
            var offset = element.offset();
            return {
                left: offset.left,
                right: offset.left + element.width(),
                top: offset.top,
                bottom: offset.top + element.height()
            }
        }
        
        function translateBounds(bounds, newPosition) {
            return {
                left: newPosition.left,
                right: bounds.right + newPosition.left - bounds.left,
                top: newPosition.top,
                bottom: bounds.bottom + newPosition.top - bounds.top
            }
        }
        
        function hitTest(container, element, newPosition) {
            var containerBounds = getBounds(container);
            var elementBounds = getBounds(element);
            elementBounds = translateBounds(elementBounds, newPosition);

            var hit = true;
            if (elementBounds.right < containerBounds.left) {
                hit = false;
            }
            else if (elementBounds.left > containerBounds.right) {
                hit = false;
            }
            else if (elementBounds.bottom < containerBounds.top) {
                hit = false;
            }
            else if (elementBounds.top > containerBounds.bottom) {
                hit = false;
            }
            return hit;
        }
        
        var _chooser = this;
        var _lastSelectionList = null;
        function onListSelectionChanged(event, list) {
            if (_lastSelectionList) {
                if (_lastSelectionList == list) {
                    // continue
                }
                else {
                    var otherList = _chooser.getSourceList();
                    if (list == _chooser.getSourceList()) {
                        otherList = _chooser.getDestinationList();
                    }
                    otherList.clearSelection();
                }
            }
            _lastSelectionList = list;
        }

        //----------------------------------------------------------------------
        // fieldList class 
        //----------------------------------------------------------------------
        var fieldList = function (parent, tabIndex) {
            var _list = $("<div class='fc-field-list' tabIndex='" + tabIndex + 
                          "'></div>");
            _list.appendTo(parent);
            
            var _selectedIndex = -1;
            var _extendedSelectionIndex = -1;
            
            _list.selectAt = function (index) {
                this.clearSelection();
                var fields = _list.getFields();
                if (index >= fields.length) {
                    index = fields.length - 1;
                }
                
                var selectedField = null;
                if (index >= 0) {
                    selectedField = fields.eq(index);
                }

                if (selectedField) {
                    selectedField.addClass("fc-selected");
                    _selectedIndex = index;
                }
                else {
                    _selectedIndex = -1;
                }
                _list.trigger("selectionChanged", [_list]);
            }
            
            _list.extendSelection = function (up) {
                var selectedIndex = this.getSelectedIndex();
                var extendedIndex = this.getExtendedSelectionIndex();
                var newIndex = extendedIndex;
                var extend = true;
                if (up) {
                    if (newIndex < 0) {
                        newIndex = _list.getFields().length;
                        _selectedIndex = newIndex - 1;
                    }

                    if (extendedIndex > selectedIndex) {
                        extend = false;
                    }
                    else {
                        newIndex--;
                    }
                }
                else {
                    if (newIndex < 0) {
                        _selectedIndex = 0;
                    }
                    
                    if (extendedIndex < selectedIndex) {
                        extend = false;
                    }
                    else {
                        newIndex++;
                    }
                }
                
                var fields = _list.getFields();
                if (newIndex < 0 || newIndex >= fields.length) {
                    // continue
                }
                else {
                    var selectedField = fields.eq(newIndex);
                    if (extend) {
                        selectedField.addClass("fc-selected");
                    }
                    else {
                        selectedField.removeClass("fc-selected");
                        if (up) {
                            newIndex--;
                        }
                        else {
                            newIndex++;
                        }
                    }
                    _list.trigger("selectionChanged", [_list]);
                    _extendedSelectionIndex = newIndex;
                }
            }
            
            _list.selectField = function (field) {
                this.clearSelection();
                field.addClass("fc-selected");
                _selectedIndex = field.index();
                _list.trigger("selectionChanged", [_list]);
            }
            
            _list.toggleFieldSelection = function (field) {
                field.toggleClass("fc-selected");
                if (field.hasClass("fc-selected")) {
                    _selectedIndex = field.index();
                    _extendedSelectionIndex = -1;
                }
                else {
                    if (_selectedIndex == field.index()) {
                        _selectedIndex = _list.children(".fc-selected").first().index();
                    }
                }
                _list.trigger("selectionChanged", [_list]);
            }
            
            _list.selectTo = function (fieldOrIndex) {
                var fieldIndex = fieldOrIndex;
                if (typeof fieldOrIndex == "object") {
                    fieldIndex = fieldOrIndex.index();
                }
                
                if (_selectedIndex == -1) {
                    _selectedIndex = 0;
                }
                
                var children = _list.children();
                if (fieldIndex > _selectedIndex) {
                    for (var counter = _selectedIndex; 
                         counter < children.length; 
                         counter++) {
                        if (counter <= fieldIndex) {
                            children.eq(counter).addClass("fc-selected");
                        }
                        else {
                            children.eq(counter).removeClass("fc-selected");
                        }
                    }                    
                }
                else {
                    for (var counter = _selectedIndex; 
                         counter >= 0; 
                         counter--) {
                        if (counter >= fieldIndex) {
                            children.eq(counter).addClass("fc-selected");
                        }
                        else {
                            children.eq(counter).removeClass("fc_selected");
                        }
                    }
                }
                
                _extendedSelectionIndex = fieldIndex;
                
                _list.trigger("selectionChanged", [_list]);
            }
            
            _list.getSelectedIndex = function () {
                return _selectedIndex;
            }
            
            _list.getExtendedSelectionIndex = function () {
                var index = _extendedSelectionIndex;
                if (index < 0) {
                    index = _selectedIndex;
                }
                return index;
            }
            
            _list.getSelection = function () {
                return this.children(".fc-selected");
            }
            
            _list.clearSelection = function () {
                _selectedIndex = -1;
                _extendedSelectionIndex = -1;
                this.children().removeClass("fc-selected");
                _list.trigger("selectionChanged", [_list]);
            }
            
            _list.add = function(content) {
                content.addClass("fc-field");
                content.attr("tabIndex", tabIndex);
                content.on("click", function(event) {
                    var $this = $(this);
                    if (event.ctrlKey || event.metaKey) {
                        _chooser.getFieldList($this).toggleFieldSelection($this);
                    }
                    else if (event.shiftKey) {
                        _chooser.getFieldList($this).selectTo($this);
                    }
                    else {
                        _chooser.getFieldList($this).selectField($this);
                    }
                    _currentList = _list;
                });
                content.appendTo(_list);

                return _list;
            };
            
            _list.getFields = function () {
                return _list.children();
            }
            
            _list.sortable({
                connectWith: ".fc-field-list",
                cursor: "move",
                opacity: 0.75,
                helper: function (event, field) {
                    if (field.hasClass("fc-selected")) {
                        // continue
                    }
                    else {
                        _list.selectField(field);
                    }
                    
                    var selection = _list.getSelection().clone();
                    field.data("selection", selection);
                    field.siblings(".fc-selected").remove();
                    var helper = $("<div/>").append(selection);
                    
                    return helper;
                }
            });
            
            return _list;
        };
    
        //----------------------------------------------------------------------
        // Private variables 
        //----------------------------------------------------------------------
        var _options = $.extend({}, $.fn.fieldChooser.defaults, options);
        var tabIndex = parseInt(this.attr("tabIndex"));
        if (isNaN(tabIndex)) {
            tabIndex = 0;
        }
        this.removeAttr("tabIndex");
        var _sourceList = new fieldList(this, tabIndex).addClass("fc-source-fields");
        var _destinationList = 
            new fieldList(this, tabIndex).addClass("fc-destination-fields");
        var _currentList = null;

        //----------------------------------------------------------------------
        // Public properties 
        //----------------------------------------------------------------------
        this.getOptions = function () {
            return _options;
        };
        
        this.getSourceList = function () {
            return _sourceList;
        };
        
        this.getDestinationList = function () {
            return _destinationList;
        };
        
        this.getFieldList = function (field) {
            var list = _destinationList;
            if (field.parent().hasClass("fc-source-fields")) {
                list = _sourceList;
            }
            return list;
        }
        
        //----------------------------------------------------------------------
        // Public methods
        //----------------------------------------------------------------------

        //----------------------------------------------------------------------
        // Event handlers 
        //----------------------------------------------------------------------
        _destinationList.on("sortstop", function (event, ui) {
            var selection = ui.item.data("selection");
            
            if (hitTest(_sourceList, ui.item, ui.offset)) {
                _sourceList.add(selection);
                _chooser.trigger("listChanged", [selection, _sourceList]);
                ui.item.after(selection).remove();
            }
            else if (hitTest(_destinationList, ui.item, ui.offset)) {
                ui.item.after(selection).remove();
            }
            else {
                _destinationList.getSelection().remove();
                _sourceList.add(selection);
                _lastSelectionList = _sourceList;
                _chooser.trigger("listChanged", [selection, _sourceList]);
            }
        });
        
        _sourceList.on("sortstop", function (event, ui) {
            var selection = ui.item.data("selection");

            if (hitTest(_destinationList, ui.item, ui.offset)) {
                _destinationList.add(selection);
                _chooser.trigger("listChanged", [selection, _destinationList]);
            }
            else if (hitTest(_sourceList, ui.item, ui.offset)) {
                // continue
            }
            else {
                _sourceList.sortable("cancel");
            }

            ui.item.after(selection).remove();
        });
        
        _destinationList.on("selectionChanged", onListSelectionChanged);
        _sourceList.on("selectionChanged", onListSelectionChanged);
        
        _destinationList.on("focusin", function () {
            _currentList = _destinationList;
        });
        
        _destinationList.on("focusout", function () {
            if (_currentList == _destinationList) {
                _currentList = null;
            }
        });
        
        _sourceList.on("focusin", function () {
            _currentList = _sourceList;
        });
        
        _sourceList.on("focusout", function () {
            if (_currentList == _sourceList) {
                _currentList = null;
            }
        });
        
        $(document).keydown(function () {
            if (_currentList) {
                if (event.which == 38) { // up arrow
                    if (event.shiftKey) {
                        _currentList.extendSelection(true);
                    }
                    else {
                        var selectedIndex = _currentList.getSelectedIndex();
                        var newIndex = selectedIndex - 1;
                        if (newIndex < 0) {
                            newIndex = 0;
                        }
                        _currentList.selectAt(newIndex);
                    }
                }
                else if (event.which == 40) { // down arrow 
                    if (event.shiftKey) {
                        _currentList.extendSelection(false);
                    }
                    else {
                        var selectedIndex = _currentList.getSelectedIndex();
                        var newIndex = selectedIndex + 1;
                        if (selectedIndex < 0) {
                            newIndex = _currentList.getFields().length - 1;
                        }
                        _currentList.selectAt(newIndex);
                    }
                }
                else if (event.which == 27) { // escape
                    _currentList.selectAt(-1);
                }
            }
        });
            
        return this;
    };
    
    //--------------------------------------------------------------------------
    // Class defaults
    //--------------------------------------------------------------------------
    $.fn.fieldChooser.defaults = {};
    
}(jQuery));