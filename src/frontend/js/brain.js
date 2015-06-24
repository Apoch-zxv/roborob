function DisplayElement(big_image_name, options_image_name, 
	                    inner_form_image_name, reference_name, 
	                    connector_height_px, interactive_location,
	                    open_interaction_window) {
	this.big_image_name = big_image_name;
	this.options_image_name = options_image_name;
	this.inner_form_image_name = inner_form_image_name;
	this.reference_name = reference_name;
	this.connector_height_px = connector_height_px;
	this.interactive_location = interactive_location;
	this.open_interaction_window = open_interaction_window;
}

function VisibleComponent(name, object) {
	this.name = name;
	this.object = object;
}

var MIN_GROUP_TOGETHER_DISTANCE = 100;
var MAIN_Y_AXIS = 388;
var X_CORRECTION_FACTOR = 1;

programming_components["go_forward"] = new DisplayElement("images/draw_board/go_forward_block.png", 
                                                          "images/draw_board/forward_icon.png", 
                                                          "images/draw_board/go_forward_block_inside_loop.png", 
                                                          "go_forward", 60, 
                                                          new ImagePosition(34, 90, 92 - 34, 149 - 90), open_calculator);
programming_components["go_backward"] = new DisplayElement("images/draw_board/go_backward_block.png", 
                                                           "images/draw_board/backward_icon.png", 
                                                           "images/draw_board/go_backward_block_inside_loop.png", 
                                                           "go_backward", 59, 
                                                           new ImagePosition(86, 87, 50, 50), open_calculator);
programming_components["turn_left"] = new DisplayElement("images/draw_board/turn_left_block.png", 
                                                         "images/draw_board/turn_left_icon.png", 
                                                         "images/draw_board/turn_left_block_inside_loop.png", 
                                                         "turn_left", 59, 
                                                         new ImagePosition(65, 99, 50, 50), open_angle);
programming_components["turn_right"] = new DisplayElement("images/draw_board/turn_right_block.png", 
                                                          "images/draw_board/turn_right_icon.png", 
                                                          "images/draw_board/turn_right_block_inside_loop.png", 
                                                          "turn_right", 59, 
                                                          new ImagePosition(100, 98, 50, 50), open_angle);
                                                          
decoration_component["arrows_menu"] = new DecorationElement("images/general/arrows_menu.png", null, 169);
decoration_component["add_block"] = new DecorationElement("images/draw_board/add_next_block.png", "images/draw_board/add_block_inside_loop.png", 0);
//decoration_component["switch_block"] = new DecorationElement("images/draw_board/switch_block.png", "images/draw_board/switch_block_inside_loop.png", 0);
decoration_component["switch_block"] = new DecorationElement("images/draw_board/first_add_block.png", "images/draw_board/first_add_block_inside_loop.png", 0);
decoration_component["start_code"] = new DecorationElement("images/draw_board/first_add_block.png", "images/draw_board/first_add_block_inside_loop.png", 0);
decoration_component["robot_face"] = new DecorationElement("images/general/robot_face.png", null, 0);

decoration_component["function_create"] = new DecorationElement(null, "images/draw_board/make_function_button.png", 93);
decoration_component["function_block"] = new DecorationElement("images/draw_board/function_block.png", null, 61);
decoration_component["loop_start"] = new DecorationElement(null, "images/draw_board/loop_block_left_side.png", 89);
decoration_component["loop_end"] = new DecorationElement(null, "images/draw_board/loop_block_rightt_side.png", 165, new ImagePosition(38, 15, 90 - 38, 68 - 15), open_calculator);
decoration_component["loop_bg"] = new DecorationElement(null, "images/draw_board/loop_block_middle.png", 89);

decoration_component["keyboard_field"] = new DecorationElement("images/keyboard/keyboard_field.png", null, 0);

decoration_component["angle_bg"] = new DecorationElement("images/angle/angels_window.png", null, 0);
decoration_component["angle_circle"] = new DecorationElement("images/angle/unchosen_red_angles_circle.png", null, 0);
decoration_component["angle_circle_selected"] = new DecorationElement("images/angle/chosen_yellow_angles_circle.png", null, 0);
decoration_component["angle_circle_transperent"] = new DecorationElement("images/angle/circle_transperent.png", null, 0);
decoration_component["angle_needle"] = new DecorationElement("images/angle/needle_angles.png", null, 0);

decoration_component["calculator_bg"] = new DecorationElement("images/calculator/calculator.png", null, 0);
decoration_component["calculator_field"] = new DecorationElement("images/calculator/calculator_field.png", null, 0);
decoration_component["calculator_window_--_button"] = new DecorationElement("images/calculator/calculator_window_C_button.png", null, 0);
decoration_component["calculator_window_0_button"] = new DecorationElement("images/calculator/calculator_window_0_button.png", null, 0);
decoration_component["calculator_window_delete_button"] = new DecorationElement("images/calculator/calculator_window_delete_button.png", null, 0);
decoration_component["calculator_window_ok_button"] = new DecorationElement("images/calculator/calculator_window_ok_button.png", null, 0);

for (var i = 0; i <= 9; i++) {
	decoration_component["calculator_digit_{0}".format(i)] = new DecorationElement("images/calculator/calculator_window_{0}_button.png".format(i), null, 0);
}

var LOADING_CURVE = null;

function animate() {
    requestAnimationFrame( animate );

	if (LOADING_CURVE != null) {
		LOADING_CURVE.rotation += 0.1;
	}

        // render the STAGE
    RENDERER.render(STAGE);
    
}

function display_on_initiator(initiator, display_text) {
	var display_object_index = find_displayed_object_index(initiator);
	var display_object = DISPLAYED_ELEMENT[display_object_index];
	var component = programming_components[display_object.name];
	if (component == null) {
		component = decoration_component[display_object.name];
	}
	
	display_object.object.parameter.text = display_text;
	display_object.object.parameter.updateText();
	display_object.object.parameter.position.x = component.interactive_location.x + (component.interactive_location.width - display_object.object.parameter.textWidth) / 2;
	display_object.object.parameter.position.y = component.interactive_location.y + (component.interactive_location.height - display_object.object.parameter.textHeight) / 2;
}


function init_options_window(previous_object, previous_connector) {
	var options_window = PIXI.Sprite.fromImage(decoration_component["arrows_menu"].image_name);
	options_window.position.x = previous_object.position.x + previous_object.width - X_CORRECTION_FACTOR;
	options_window.position.y = MAIN_Y_AXIS - decoration_component["arrows_menu"].connector_height_px;
	options_window.interactive = true;
	
	var x_offset = 62;
	var y_current_offset = 42;
	var extra_y = 25;
	var next_child = create_single_option(previous_object, programming_components["go_forward"], x_offset, y_current_offset, previous_connector);
	y_current_offset += next_child.height + extra_y;
	options_window.addChild(next_child);
	
	next_child = create_single_option(previous_object, programming_components["go_backward"], x_offset, y_current_offset, previous_connector);
	y_current_offset += next_child.height + extra_y;
	options_window.addChild(next_child);
	
	next_child = create_single_option(previous_object, programming_components["turn_right"], x_offset, y_current_offset, previous_connector);
	y_current_offset += next_child.height + extra_y;
	options_window.addChild(next_child);
	
	next_child = create_single_option(previous_object, programming_components["turn_left"], x_offset, y_current_offset, previous_connector);
	y_current_offset += next_child.height + extra_y;
	options_window.addChild(next_child);
	
	var event = new CustomEvent('options_window_openned');
	document.dispatchEvent(event);
	
	return options_window;
}

function create_single_option(initiating_object, component, x_offset, y_offset, previous_connector) {
	var single_option = create_pressable_object(component.options_image_name);
	single_option.position.x = x_offset;
	single_option.position.y = y_offset;
	single_option.interactive = true;
	single_option.buttonMode = true;
	single_option.to_add_image = component;
	single_option.previous_connector = previous_connector;
	single_option.initiating_object = initiating_object;
	single_option.click = single_option.tap = add_bigger_image;
	return single_option;
}

function add_next_button_to_the_right(current_object, is_add_to_stage_param) {
	var is_add_to_stage = (typeof is_add_to_stage_param === 'undefined') ? true : is_add_to_stage_param;
	var start_code = create_pressable_object(decoration_component["add_block"].image_name);
	start_code.position.x = current_object.position.x + current_object.width - X_CORRECTION_FACTOR;
	start_code.position.y = MAIN_Y_AXIS - decoration_component["add_block"].connector_height_px;
	
	start_code.interactive = true;
	start_code.buttonMode = true;
	
	start_code.click = start_code.tap = open_options_window;
	if (is_add_to_stage) {
		add_stage_object(start_code, "add_block");
	}
	
	return start_code;
}

function add_dragging_events(object) {
	object// events for drag start
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);
}

function recalculate_positions() {
	var array_size = DISPLAYED_ELEMENT.length;
	for (var i = 1; i < array_size; i++) {
		var curr_element = DISPLAYED_ELEMENT[i];
		var prev_element = DISPLAYED_ELEMENT[i - 1];
		
		if (is_programmable_component(curr_element.name)) {
			curr_element.object.position.x = prev_element.object.position.x + prev_element.object.width - X_CORRECTION_FACTOR;
		} else if(is_decoration_component(curr_element.name)) {
			if (curr_element.name == "switch_block") {
				curr_element.object.position.x = prev_element.object.position.x - X_CORRECTION_FACTOR;
			} else if (curr_element.name == "loop_end") {
				curr_element.object.position.x = prev_element.object.position.x + prev_element.object.width - (curr_element.object.width - 43);
			} else if (prev_element.name == "loop_start") {
				curr_element.object.position.x = prev_element.object.position.x + 56;
			} else {
				curr_element.object.position.x = prev_element.object.position.x + prev_element.object.width - X_CORRECTION_FACTOR;
			}
		}
		
		if (curr_element.name == "loop_end") {
			curr_element.object.function_create.position.x = curr_element.object.position.x - 107;
		}
	}
}

function add_bigger_image(data) {
	global_click_event();
	var component = programming_components[this.to_add_image.reference_name];
	var bigger_image = PIXI.Sprite.fromImage(this.to_add_image.big_image_name);
	bigger_image.position.x = this.parent.position.x - X_CORRECTION_FACTOR;
	bigger_image.position.y = MAIN_Y_AXIS - component.connector_height_px;
	bigger_image.interactive = true;
	bigger_image.buttonMode = true;
	bigger_image.previous_connector = this.previous_connector;
	add_dragging_events(bigger_image);
	
	bigger_image.name = this.to_add_image.reference_name;
	bigger_image.open_interaction_window = component.open_interaction_window;
	bigger_image.interactive_rectangle = new PIXI.Rectangle(bigger_image.position.x + component.interactive_location.x, 
		                                                    bigger_image.position.y + component.interactive_location.y, 
		                                                    50, 50);
	
	var text = new PIXI.extras.BitmapText('', {font: '30px Fregat', align: "center"});
	text.tint = 0xE29D2B;
	text.position.x = component.interactive_location.x + 15;
	text.position.y = component.interactive_location.y + 17;
	bigger_image.addChild(text);
	bigger_image.parameter = text;
	
	var initiating_object_index = find_displayed_object_index(this.initiating_object);
	if (initiating_object_index != DISPLAYED_ELEMENT.length - 1) {
		console.log("Error replacement not supported");
	}
	add_stage_object(bigger_image, this.to_add_image.reference_name);
	bigger_image.next_connector = add_next_button_to_the_right(bigger_image);
	// TODO: We will add support for replacement later
	// } else {
		// replace_object(DISPLAYED_ELEMENT[initiating_object_index + 1], 
			// new VisibleComponent(this.to_add_image.reference_name, bigger_image));
		// recalculate_positions();
	// }
	remove_from_stage_object(this.parent);
	
	var event = new CustomEvent('options_window_selection_clicked', {'detail': this.to_add_image.reference_name});
	document.dispatchEvent(event);
	
	bigger_image.open_interaction_window(bigger_image);
}

function find_displayed_object_index(object) {
	var arrayLength = DISPLAYED_ELEMENT.length;
	for (var i = 0; i < arrayLength; i++) {
		if (DISPLAYED_ELEMENT[i].object == object) {
			return i;
		}	
	}
	return null;
}

function replace_to_inner_texture(object) {
	var component = null;
	if (is_programmable_component(object.name)) {
		component = programming_components[object.name];
	} else if (is_decoration_component(object.name)) {
		component = decoration_component[object.name];
	} else {
		console.log("ERROR not a decorative / programming component");
		return;
	}
	
	var inner_texture = PIXI.Texture.fromImage(component.inner_form_image_name);
	object.object.texture = inner_texture;
}

function create_decorative_sprite(reference_name, image_name, x, y, force_y, pressable) {
	var inner_image = null;
    if (pressable) {
        inner_image = create_pressable_object(image_name);
    } else {
        inner_image = PIXI.Sprite.fromImage(image_name);
    }
	inner_image.position.x = x;
	inner_image.position.y = MAIN_Y_AXIS - decoration_component[reference_name].connector_height_px;
	if (force_y) {
		inner_image.position.y = y;
	}
	inner_image.interactive = true;
	return inner_image;
}

function fill_with_back_ground(start_index, end_index, reference_name, image_name) {
	var first_element = DISPLAYED_ELEMENT[start_index];
	var end_element = DISPLAYED_ELEMENT[end_index];
	var bg_elements = [];
	
	var start_x = first_element.object.position.x + first_element.object.width;
	var stop_x = end_element.object.position.x;
	var bg_y_axis = MAIN_Y_AXIS - decoration_component[reference_name].connector_height_px;
	
	var curr_x = start_x;
	while (curr_x <= stop_x) {
		var single_component = create_decorative_sprite(reference_name, image_name, curr_x, bg_y_axis);
		STAGE.addChildAt(single_component, 1);
		bg_elements.push(single_component);
		curr_x += single_component.width;
	}
	
	end_element.bg_elements = bg_elements;
}

function touchable_image_click_event(data) {
	var local_location = data.data.getLocalPosition(data.target);
    if (data.target.interactive_rectangle.contains(local_location.x, local_location.y)) {
    	global_click_event();
    	data.target.open_interaction_window(data.target);
    } 
}

function add_interactive_part(name, component, sprite) {
	var interactive_location = component.interactive_location;
	
	var interactive_rectangle = new PIXI.Rectangle(interactive_location.x, interactive_location.y, interactive_location.width,
		                                     interactive_location.height);
	sprite.interactive_rectangle = interactive_rectangle;
	
	sprite.interactive = true;
	sprite.click = sprite.tap = touchable_image_click_event;	
	sprite.open_interaction_window = component.open_interaction_window;    
	sprite.name = name;                               
	
	var text = new PIXI.extras.BitmapText('', {font: '30px Fregat', align: "center"});
	text.tint = 0x60A860;
	text.position.x = interactive_location.x;
	text.position.y = interactive_location.y;
	sprite.addChild(text);
	
	sprite.parameter = text;
}

function find_function_start_index(last_target) {
	var loop_start_index = -1;
	for (var i = 0; i < DISPLAYED_ELEMENT.length; i ++) {
		var curr_element = DISPLAYED_ELEMENT[i];
		
		if (curr_element.name == "loop_start") {
			loop_start_index = i;
		}
		
		if (curr_element.object == last_target) {
			break;
		}
	}
	
	if (loop_start_index == -1) {
		console.log("Error failed locating function start");
	}
	
	return loop_start_index;
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function function_init(function_name, function_code, x) {
	var function_sprite = create_decorative_sprite("function_block", decoration_component["function_block"].image_name, x);
    var text = new PIXI.extras.BitmapText(capitalize(function_name), {font: '30px Fregat', align: "center"});
    text.tint = 0x5E668D;
	text.position.x = 102;
	text.position.y = 80;
	function_sprite.addChild(text);

    var expand_function = PIXI.Sprite.fromImage("images/draw_board/open_function_button.png");
    expand_function.position.x = 269;
    expand_function.position.y = 249;
    STAGE.addChild(expand_function);
	
	return function_sprite;
}

function position_function(function_sprite, function_start_index, function_end_index) {
	for (var i = function_start_index; i <= function_end_index; i++) {
		var curr_component = DISPLAYED_ELEMENT[i];
		
		remove_from_stage_object(curr_component.object);
		if (curr_component.name == "loop_end") {
			remove_from_stage_object(curr_component.object.function_create);
			for (var i = 0; i < curr_component.bg_elements.length; i ++) {
				remove_from_stage_object(curr_component.bg_elements[i]);
			}
		} 
	}
	
	DISPLAYED_ELEMENT.splice(function_start_index, function_end_index - function_start_index + 1, new VisibleComponent("function_block", function_sprite));
	STAGE.addChild(function_sprite);
}

function function_create_shrink(target, function_name) {
	var last_function_element = target.container_element;
	var function_start_index = find_function_start_index(last_function_element);
	var function_end_index = find_displayed_object_index(last_function_element);
	
	var function_code = extract_code(DISPLAYED_ELEMENT, function_start_index, function_end_index);
	var function_sprite = function_init(function_name, function_code, DISPLAYED_ELEMENT[function_start_index].object.position.x);	
	position_function(function_sprite, function_start_index, function_end_index);
	recalculate_positions();
	
	var event = new CustomEvent('function_block_created');
	document.dispatchEvent(event);
}

function init_function_create(function_create, container_element) {
	function_create.interactive = true;
	function_create.name = "function_create";
	function_create.click = function_create.tap = open_keyboard_caller;
	function_create.on_keyboard_finish = function_create_shrink;
	function_create.container_element = container_element;
}

function convert_to_combines_structure(start_index, end_index) {
	for (var i = start_index; i <= end_index; i++) {
		var current = DISPLAYED_ELEMENT[i];
		replace_to_inner_texture(current);
	}	
	
	var first_element = DISPLAYED_ELEMENT[start_index];
	var start_sprite = create_decorative_sprite("loop_start", decoration_component["loop_start"].inner_form_image_name, 
														first_element.object.position.x, first_element.object.position.y);
	DISPLAYED_ELEMENT.splice(start_index, 0, new VisibleComponent("loop_start", start_sprite));
	STAGE.addChildAt(start_sprite, 1);
				
	// Because we've added an element "loop_start"			
	end_index ++;										  
	var end_element = DISPLAYED_ELEMENT[end_index];
	var end_sprite = create_decorative_sprite("loop_end", decoration_component["loop_end"].inner_form_image_name, 
														end_element.object.position.x, end_element.object.position.y);
														
	add_interactive_part("loop_end", decoration_component["loop_end"], end_sprite);
	DISPLAYED_ELEMENT.splice(end_index + 1, 0, new VisibleComponent("loop_end", end_sprite));
	end_index ++;
	STAGE.addChildAt(end_sprite, 1);
	
	end_sprite.function_create = create_decorative_sprite("function_create", decoration_component["function_create"].inner_form_image_name, 
														end_sprite.position.x - 100, end_sprite.position.y, true, true);
	init_function_create(end_sprite.function_create, end_sprite);												

	STAGE.addChild(end_sprite.function_create);
	
	var previous_connector = init_previous_connector(DISPLAYED_ELEMENT[start_index].object.position.x);
	DISPLAYED_ELEMENT.splice(start_index, 0, new VisibleComponent("switch_block", previous_connector));
	STAGE.addChild(previous_connector);
	start_index ++;
	end_index ++;
	
	var next_connector = add_next_button_to_the_right(end_sprite, false);
	if (end_index + 1 == DISPLAYED_ELEMENT.length) {
		DISPLAYED_ELEMENT.push(new VisibleComponent("add_block", next_connector));
	} else {
		DISPLAYED_ELEMENT.splice(end_index + 1, 0, new VisibleComponent("add_block", next_connector));
	}
	STAGE.addChild(next_connector);
	
	return {"end_sprite": end_sprite, "start_index": start_index, "end_index": end_index};
}

function group_elements(initiating, dragged_to) {
	initiating_index = find_displayed_object_index(initiating);
	dragged_to_index = find_displayed_object_index(dragged_to);
	
	if (initiating_index < dragged_to_index) {
		start_index = initiating_index;
		end_index = dragged_to_index;
	} else {
		start_index = dragged_to_index;
		end_index = initiating_index;
	}
	
	// Including the connectors
	start_index --;
	end_index ++;
	
	var res = convert_to_combines_structure(start_index, end_index);
	var end_sprite = res["end_sprite"];
	recalculate_positions();
	fill_with_back_ground(res["start_index"], res["end_index"], "loop_bg", decoration_component["loop_bg"].inner_form_image_name);
	
	var event = new CustomEvent('loop_creation_end', {'detail': end_sprite});
	document.dispatchEvent(event);
}

function is_programmable_component(component_name) {
	return component_name in programming_components;
}

function is_decoration_component(component_name) {
	return component_name in decoration_component;
}

function find_close_enough(object, min_dist) {
	var arrayLength = DISPLAYED_ELEMENT.length;
	var min_distance = null;
	var closest_object = null; 
	for (var i = 0; i < arrayLength; i++) {
		var curr_element = DISPLAYED_ELEMENT[i];
		if (curr_element.object == object) {
			continue;
		}
		else if (is_programmable_component(curr_element.name)) {
			if (min_distance == null) {
				min_distance = distance(curr_element.object.position, object.position);
				closest_object = curr_element;
			} else {
				var dist = distance(curr_element.object.position, object.position);
				if (dist < min_distance) {
					min_distance = dist;
					closest_object = curr_element;
				}
			}
		}	
	}
	
	if (min_distance > min_dist) {
		return null;
	}
	return closest_object;
}

function onDragStart(event)
{
	global_click_event();
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.target = event.target;
    if (event.target.interactive_rectangle.contains(event.data.global.x, event.data.global.y)) {
    	this.dragging = false;
    } else {
	    this.original_position = {
	    	x: this.position.x, 
	    	y: this.position.y
		};
		this.previous_original_position = {
	    	x: this.previous_connector.position.x, 
	    	y: this.previous_connector.position.y
		};
		this.next_original_position = {
	    	x: this.next_connector.position.x, 
	    	y: this.next_connector.position.y
		};
		this.previous_x = this.data.global.x;
		this.alpha = 0.5;
		this.previous_connector.alpha = 0.5;
		this.next_connector.alpha = 0.5;
		this.dragging = true;
	}
}

function onDragEnd()
{
	if (this.dragging) {
	    this.alpha = 1;
	    this.previous_connector.alpha = 1;
		this.next_connector.alpha = 1;
	
	    this.dragging = false;
	
	    // set the interaction data to null
	    this.data = null;
	    var closest_object = find_close_enough(this, MIN_GROUP_TOGETHER_DISTANCE); 
	    
	    if (closest_object == null) {
			move_object(this, this.original_position, 300);
			move_object(this.previous_connector, this.previous_original_position, 300);
			move_object(this.next_connector, this.next_original_position, 300);
	    } else {
	    	this.position = this.original_position;
	    	group_elements(this, closest_object.object);
	    }
    } else {
    	this.target.open_interaction_window(this.target);
    }
}

function onDragMove()
{
    if (this.dragging)
    {
    	var diff = this.data.global.x - this.previous_x;
        this.position.x = this.position.x + diff;
        this.target.previous_connector.position.x = this.target.previous_connector.position.x + diff;
        this.target.next_connector.position.x = this.target.next_connector.position.x + diff;
        this.previous_x = this.data.global.x;
    }
}

function init_previous_connector(x) {
	var switch_block = PIXI.Sprite.fromImage(decoration_component["switch_block"].image_name);
	switch_block.position.x = x - X_CORRECTION_FACTOR;
	switch_block.position.y = MAIN_Y_AXIS - decoration_component["switch_block"].connector_height_px;
	switch_block.interactive = true;
	return switch_block;
}
    
function open_options_window(data) {
	global_click_event();
	var connector_index = find_displayed_object_index(this);
	var previous_connector = this;
	if (connector_index != 0) {
		previous_connector = init_previous_connector(this.position.x);
		STAGE.addChild(previous_connector);
		DISPLAYED_ELEMENT.splice(connector_index + 1, 0, new VisibleComponent("switch_block", previous_connector));
	}
	
	var options_window = init_options_window(this, previous_connector);
	options_window.remove_on_bg_click = true;
	options_window.name = "options_window";
	STAGE.addChild(options_window);
}

function remove_from_stage_object(object) {
	STAGE.removeChild(object);
}

function add_stage_object(object, name) {
	DISPLAYED_ELEMENT.push(new VisibleComponent(name, object));
	STAGE.addChild(object);
}

function add_display_object(object, name) {
	STAGE.addChild(object);
}

function replace_object(old_object, new_object) {
	var index = find_displayed_object_index(old_object.object);
	if (index == null) {
		console.log("ERROR ! failed locating old object");
		return;
	}
	remove_from_stage_object(old_object.object);
	DISPLAYED_ELEMENT[index] = new_object;
	STAGE.addChild(new_object.object);
}

function switch_to_waiting(button) {
	var original_texture = button.texture;
	button.texture = PIXI.Texture.fromImage("images/general/run_button_loading_back_ground.png");
	var loading_circle = PIXI.Sprite.fromImage("images/general/loading_circle.png");
	loading_circle.position.x = 50;
	loading_circle.position.y = 50;
	button.addChild(loading_circle);

	var curve = PIXI.Sprite.fromImage("images/general/test_curve.png");
	curve.position.x = 50 + 28;
	curve.position.y = 50 + 28;
	curve.anchor = new PIXI.Point(1, 1);
	button.addChild(curve);
	LOADING_CURVE = curve;

	setTimeout(function(){
    	button.texture = original_texture;
		button.removeChild(loading_circle);
		button.removeChild(curve);
		LOADING_CURVE = null;
    	var event = new CustomEvent('code_submition_done');
		document.dispatchEvent(event);
	}, 5000);
}

function extract_code(data, start_index, end_index) {
	var code = [];
	var curr_code = code;
	for (var i = start_index; i <= end_index; i++) {
		var curr_component = DISPLAYED_ELEMENT[i];
		
		if (curr_component.name == "loop_start") {
			var inner_loop = [];
			inner_loop.parent = curr_code;
			curr_code.push(inner_loop);
			curr_code = inner_loop;
		} else if (curr_component.name == "loop_end") {
			curr_code = curr_code.parent;
		} else if (is_programmable_component(curr_component.name)) {
			curr_code.push(curr_component.name);		
		}
	}
	
	return code;
}

function submit_code(data) {
	global_click_event();
	var code = extract_code(DISPLAYED_ELEMENT, 0, DISPLAYED_ELEMENT.length - 1);
	
	send_to_server(code, "/api/execute_code");
	
	switch_to_waiting(data.target);
}

function send_keep_alive_request() {
	send_to_server("hi", "/api/keep_alive");
}

function start_keep_alive() {
	setInterval(send_keep_alive_request, 2000);
}


function add_start_code() {
	//var start_code = PIXI.Sprite.fromImage(decoration_component["start_code"].image_name);
	var start_code = create_pressable_object(decoration_component["start_code"].image_name);
	start_code.position.x = 40;
	start_code.position.y = MAIN_Y_AXIS + decoration_component["start_code"].connector_height_px;

	start_code.interactive = true;
	start_code.buttonMode = true;

	start_code.click = start_code.tap = open_options_window;
	add_stage_object(start_code, "start_code");
}

function welcome_window() {
	var welcome_window = PIXI.Sprite.fromImage("images/lessons/Welcome_window.png");
	welcome_window.position.x = 600;
	welcome_window.position.y = 400;
	welcome_window.interactive = true;
	welcome_window.remove_on_bg_click = true;
	welcome_window.remove_on_obj_click = true;
	welcome_window.name = "Welcome_window";
	welcome_window.anchor.set(0.5);

	var surface = PIXI.Sprite.fromImage("images/lessons/paper_welcome_window.png");
	surface.position.x = -200;
	surface.position.y = 60;
	surface.interactive = true;
	welcome_window.addChild(surface);

	var ruler = PIXI.Sprite.fromImage("images/lessons/ruler_welcome_window.png");
	ruler.position.x = surface.position.x + 100;
	ruler.position.y = surface.position.y - 120;
	ruler.original_y = ruler.position.y;
	ruler.dest_y = surface.position.y - 50;
	ruler.interactive = true;
	welcome_window.addChild(ruler);

	add_ok_button(welcome_window, 300, 200, bg_clicked);

	appear_effect(welcome_window, 650, 500);

	createjs.Tween.get(ruler).wait(200).play(
		createjs.Tween.get(ruler,{paused:true, loop:true})
			.to({y:ruler.dest_y},1500)
			.to({y:ruler.original_y},1500)
	);
}

function show_first_lesson(event) {
	document.removeEventListener("back_ground_click", show_first_lesson);
	var next_event = {"target": {"lesson": LESSONS[0]}}
	select_lesson_click(next_event)
}

function init_draw_board() {
	// create a texture from an image path
	var bg = PIXI.Sprite.fromImage("images/general/BG.png");
	bg.interactive = true;
	bg.click = bg.tab = bg_clicked;
	bg.not_remove_when_cleared = true;
	STAGE.addChild(bg);

	add_start_code();

	var robot_face = PIXI.Sprite.fromImage(decoration_component["robot_face"].image_name);
	robot_face.position.x = 94;
	robot_face.position.y = 39;
	robot_face.not_remove_when_cleared = true;
	add_display_object(robot_face, "robot_face");

	var back_button = PIXI.Sprite.fromImage("images/general/back_button.png");
	back_button.position.x = 40;
	back_button.position.y = 50;
	back_button.not_remove_when_cleared = true;
	add_display_object(back_button, "back_button");

	var execute_code = create_pressable_object("images/general/run_button_status_on.png");
	execute_code.position.x = 1079;
	execute_code.position.y = 594;
	execute_code.interactive = true;
	execute_code.buttonMode = true;
	execute_code.not_remove_when_cleared = true;

	execute_code.click = execute_code.tap = submit_code;
	add_display_object(execute_code, "execute_code");

	add_lesson_icons();

	document.addEventListener("back_ground_click", show_first_lesson);

	welcome_window();
}

function init() {
	// create an new instance of a pixi STAGE
    STAGE.interactive = true;
    
    RENDERER.view.style.position = "absolute";
	RENDERER.view.style.width = window.innerWidth + "px";
	RENDERER.view.style.height = window.innerHeight + "px";
	RENDERER.view.style.display = "block";
 
    // add the RENDERER view element to the DOM
    document.body.appendChild(RENDERER.view);
    
    // var assetsToLoad = ["images/draw_board/go_forward_block.png", "images/draw_board/backward_icon.png", 
                        // "images/draw_board/forward_icon.png", "images/draw_board/turn_left_icon.png", 
                        // "images/draw_board/turn_right_block.png", "images/draw_board/arrows_menu.png", 
                        // "images/draw_board/add_block.png"];
    var assetsToLoad = [];
                     
    for (var key in programming_components) {
    	if (programming_components[key].inner_form_image_name != null) {
    		if (assetsToLoad.indexOf(programming_components[key].big_image_name) == -1) {
	    		assetsToLoad.push(programming_components[key].big_image_name);
	    	}
    		
	    	if (assetsToLoad.indexOf(programming_components[key].inner_form_image_name) == -1) {
	    		assetsToLoad.push(programming_components[key].inner_form_image_name);
	    	}
	    	
	    	if (assetsToLoad.indexOf(programming_components[key].options_image_name) == -1) {
	    		assetsToLoad.push(programming_components[key].options_image_name);
	    	}
    	}
    }
    
    for (var key in decoration_component) {
    	if (decoration_component[key].inner_form_image_name != null) {
    		if (assetsToLoad.indexOf(decoration_component[key].inner_form_image_name) == -1) {
    			assetsToLoad.push(decoration_component[key].inner_form_image_name);
    		}
    	}
    	
    	if (decoration_component[key].image_name != null) {
    		if (assetsToLoad.indexOf(decoration_component[key].image_name) == -1) {
    			assetsToLoad.push(decoration_component[key].image_name);
    		}
    	}
    }
    
	// create a new loader
	loader = new PIXI.loaders.Loader();
	var arrayLength = assetsToLoad.length;
	for (var i = 0; i < arrayLength; i++) {
	    loader.add(assetsToLoad[i], assetsToLoad[i]);
	}
	loader.add("fonts/fregat.fnt", { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.DOCUMENT });
	loader.load(function () {
    	console.log('Finished loading');
	});

	init_splash_screen();
	//init_draw_board();
	//createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.setFPS(500);

    requestAnimationFrame( animate );
}

