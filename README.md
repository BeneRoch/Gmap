# Gmap
- Description
- Objects / Classes
    - BB.base
    - BB.data
    - BB.gmap.controller
    - BB.gmap.infobox
    - BB.gmap.obj
    - BB.gmap.line
    - BB.gmap.polygon
    - BB.gmap.marker
- Examples
    - Map initialization
    - Add place
        - Marker
        - Line
        - Polygon
    - Add place by address
    - Change styles
    - Add callback functions for events
        - click
        - mouseover / mouseout


## Description
This is a set of classes built to manager the google objects easily, with a controller.
This allows to keep track of items on the map, make them editable or selectable and do
pretty much whatever you want.

`This plugin does not require jQuery`

The only dependencies are:
- `MarkerClusterer` (included in the build)
- `Google Maps api` http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&language=fr


## Objects / Classes
- BB.base
- BB.data
- BB.gmap.controller
- BB.gmap.infobox
- BB.gmap.obj
- BB.gmap.line
- BB.gmap.polygon
- BB.gmap.marker


### BB.base
Base Class for all Gmap objects. This allows all objects to have some basic methods:

| Method        |       Param       |   Description
| --------------|-------------------|----------------
| set_data      | {Object} data     |   Sets the data for hte object. Accepts JSON object
| data          | {String} key (falcultative)   |   Returns the data pointed by the `key` param. If no key param specified, returns all the data as set by the set_data methods
| remove_data   | {String} key (falcultative)   | Removes the data pointed by the `key` param. If no key specified, resets the data to `{}`
| sanitize      | null              |   Escape all data in order to prevent bugs caused by unescaped caracters such as `\`. Call the native `escape()` javascript function recursively on all datas
| unsanitize    | null              | Unescape all data. Exact opposite of `sanitize()`
| ident         | null              | Returns the ident of the object.
| set_ident     | {String} Ident    | Sets the ident of the object
| error         | {String} error_msg | If the BB_DEBUG is set to `true`, throw an error with the message.
| is_empty_object | {Object} obj    | Check if the object is empty, using the `hasOwnProperty` javascript method
| extend        | {Object} Defaults - {Object} options | Merge objects together, override data with the options param


### BB.data
This class is used internally to store the object data. There is certainly no reason to use it anywhere else.


### BB.gmap.controller
The controller is the main piece of the plugin. It allows the user to have control on every items on the map, keep track by adding listeners and accessing the different `places` easily

Method          |   Param               |   Description
----------------|-----------------------|-----------------------------------
constructor     | {DOMElement} container - {Object} data    | Call the plugin by creating a new BB.gmap.controller( DOMObject, data).


#### Getters
Method          |   Param               |   Description
----------------|-----------------------|-----------------------------------
map             |   null                | Returns the associated map {google.maps.Map}
container       |   null                | Returns the associated container passed in the constructor {DOMElement}
get_place       |   {string} Ident      | Returns the matching object according to the ident specified, or undefined
get_places      |   null                | Returns a list of all objects on the map, separated by types. { markers:{}, lines:{}, polygons:{} }
focused         |   null                | Returns the currently focused item on the map. Clicking on an item sets the focus on that item.
get_all_markers |   null                | Used for the markerclusterer. Returns all `markers` on the map
clusterer       |   null                | Returns the markerclusterer object associated with the controller, if one.


#### Setters
Method          |   Param               |   Description
----------------|-----------------------|-----------------------------------
set_styles      |   {Object} Styles     | Sets the styles for the map and automatically refreshes the map if it's instanciated
set_place       |   {String} type, {String} ident, {Object} data | Set a place in the controller memory. This should not be used. @todo Make that one protected, private, or whatever
set_focus       |   {BB.gmap.object} item   | Sets the focus on the current object, blurs the previously focused item
set_zoom        |   {int} zoom          | Sets the zoom of the map. Same as calling `self.map().setZoom( zoom )`


#### Other methods
Method                  |   Param                                           |   Description
------------------------|---------------------------------------------------|-----------------------------------
add_place       		| {String} ident, {Object} data 			        | Adds a place on the map, as long as the data are filled up. You need the exact coordinates to use this method
add_place_by_address    | {String} ident, {String} address, {Object} data   | Adds a place by geolocating the specified address. If the address is invalid, chances are that the marker is gonna be added in the Indian Ocean (0, 0). This method is asynchronus, it looks for the geocode with the google api geocoder before adding the marker to the map.
geocode_address 		|   {String} address, {Function} callback 	        | Geocodes an address and then uses the callback function to do what you wanted with the address
translate_coords   		| {Array} coords [lat, lon] 				        | Returns a google.maps.LatLng() object with the specified coords
create_new  			| {String} ident    						        | Sets the listeners to add points on the map byclicking. The type has to be defined
_loop_all 				| {Function} callback     					        | Loops through all objects instanciated in that controller. Calls the callback function on each of them with the `place` as argument
fit_bounds              | null                                              | Fit bounds to all objects on the map. Call after "Ready"
ready                   | {Function}                                        | Callback function called after everything is loaded on the map

#### Options

Name                |   Type                |   Description
--------------------|-----------------------|-----------------------------------
map                 |   {Array}             |   Map options passed to the map instance. @see https://developers.google.com/maps/documentation/javascript/tutorial#MapOptions
places              |   {Array}             |   Places to be found on the map. 3 types availables: Marker, Line, Polygon. @see options for all BB.gmap.object, BB.gmap.marker, BB.gmap.line, BB.gmap.polygon
use_clusterer       |   {Boolean}           |   Map uses or not the clusterer (unfinished)
max_fitbounds_zoom  |   {Boolean}           |   Max zoom value when asking a "fit_bounds", not to be confused with map.maxZoom
default_styles      |   {Array}             |   Default polygon and line styles. @see BB.gmap.line styles

### BB.gmap.object

Method          |   Param               |   Description
----------------|-----------------------|-----------------------------------



















