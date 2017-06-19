# Bootstrap Tile Multiselect
Another Bootstap v3 MultiSelect variation but using fancy tiles instead of select-like widget.

Bootstrap Tile Multiselect is jQuery based plugin to provide user interface for using select input.
UI is optimized for touch use with Bootstrap buttons and it serves for single and multiple options select.

This plugin is higly inspired by [Bootstrap Multiselect](http://davidstutz.github.io/bootstrap-multiselect/) plugin.

## Basic usage:

First you will need to link style sheet and script files from lib. Good way is to put in your head section:

```html
<link rel="stylesheet" href="css/bootstrap-tile-multiselect.css" />
<script type="application/javascript" src="js/bootstrap-tile-multiselect.js"></script>
```

Next you can use tileMultiselect as any other jQuery plugin.

```javascript
$('select.tile-multiselect').tileMultiselect();
```

## Options

Below is list of all options as can be set on widget initialization. Options may be provided as data attributes of
select element interchangebly.

1. `checkIcon`
	* **default value**: `glyphicon glyphicon-check`
	* **type**: string or function(element, value, text)
	* **description**:
There are 2 icons on tile: checkIcon for active/selected and uncheckIcon for inactive/unselected state. checkIcon 
parameter defines class for checkIcon. This allows you to define your own icon for selected state.

If callback function is provided it should return string which will be set as class for icon element. For example when
using Glyphicon it might return ```glyphicon glyphicon-check```.
2. `uncheckIcon`
	* **default value**: `glyphicon glyphicon-unchecked`
	* **type**: string or function(element, value, text)
	* **description**:
There are 2 icon on tile, uncheckIcon is showed for inactive/unselected state. Parameter defines class set for
uncheckIcon span. This allows you to define your own icon for unselected state. Default value contains 'framework'
class so you won't need to use any tricks to switch from glyphicon (default) to FontAwesome i.e.

If callback function is provided it should return string value to be set as class attribute value for icon element. For
example using Glyphicon it might return ```glyphicon glyphicon-uncheck```
3. `columns`
	* **default value**: 3
	* **type**: string
	* **description**:
Tiles are aranged in columns using Bootstrap grid system. This parameter is way to control number of columns. Value of 
this parameter should be total divisor of 12.
4. `tileActiveClass`
	* **default value**: btn-primary
	* **type**: string
	* **description**:
Defines class applied to whole tile when it is selected.
5. `tileInactiveClass`
	* **default value**: btn-default
	* **type**: string or function(element, value, text)
	* **description**:
Defines class applied to whole tile when it is in unselected state. It might be defined as callback, which will be invoked
for each button element during buttons initialization and each time its state is changed. Returned value is not copied
upon initialization, thus it might be used to set class dynamicly during whole TileMultiselect control lifespan.
Function return value should be string as it will be added to element `class` attribute value.
6. `limit`
	* **default value**: null
	* **type**: number
	* **description**:
Defines limit for maximum number of selected tiles. It has no affect when control is in single-select state.
7. `description`
	* default value: null
	* type: string or function(elem, value, text)
	* description:
Defines additional description for tile. If type of parameter is string, provided value will be applied to each tile.
The more usufull option is to use callback function which will be called for each tile upon initialization. Callback
function will be called with jQuery option element, its value and its text. Callback function is expected to return
string value with description or null for no description of tile.
Another way to define tile description is to set `data-description` attribute on corresponding option element. This 
attribute value has higher priority over description callback which mean it overrides it and callback function won't be
even called for this element.

## Methods

1. `disable`
Disables control.
```javascript
$('#tileMultiselect').tileMultiselect('disable');
````
2. `enable`
Enables control
```javascript
$('#tileMultiselect').tileMultiselect('enable');
```
3. `toggle`
Toggles control. It might be invoked with additional boolean parameter. If parameter is provided, control will be shown
according to its value rather than its current visibility.
```javascript
$('#tileMultiselect').tileMultiselect('toggle', condition);
```
4. `clearSelection`
Clears tiles selections and sets underlying `select` value to null.
5. `selectValue`
Selects value if it exists in underlying `select` element.

HTML code example:
```html
<select id="test-select">
    <option value="gb">Great Brittain</option>
    <option value="us">United States</option>
</select>
```
JavaScript code example:
```javascript
$('#test-select').tileMultiselect();
// (...)
$('#test-select').tileMultiselect('selectValue', 'gb');
```
