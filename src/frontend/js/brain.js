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

var MIN_GROUP_TOGETHER_DISTANCE = 30;
var MAIN_Y_AXIS = 400;
var X_CORRECTION_FACTOR = 5;

programming_components["go_forward"] = new DisplayElement("images/draw_board/go_forward_block.png", 
                                                          "images/draw_board/forward_icon.png", 
                                                          "images/draw_board/go_forward_block_inside_loop.png", 
                                                          "go_forward", 59, 
                                                          new ImagePosition(30, 80), open_calculator);
programming_components["go_backward"] = new DisplayElement("images/draw_board/go_backward_block.png", 
                                                           "images/draw_board/backward_icon.png", 
                                                           "images/draw_board/go_backward_block_inside_loop.png", 
                                                           "go_backward", 59, 
                                                           new ImagePosition(30, 80), open_calculator);
programming_components["turn_left"] = new DisplayElement("images/draw_board/turn_left_block.png", 
                                                         "images/draw_board/turn_left_icon.png", 
                                                         "images/draw_board/turn_left_block_inside_loop.png", 
                                                         "turn_left", 55, 
                                                         new ImagePosition(80, 90), open_angle);
programming_components["turn_right"] = new DisplayElement("images/draw_board/turn_right_block.png", 
                                                          "images/draw_board/turn_right_icon.png", 
                                                          "images/draw_board/turn_right_block_inside_loop.png", 
                                                          "turn_right", 55, 
                                                          new ImagePosition(80, 90), open_angle);
                                                          
decoration_component["arrows_menu"] = new DecorationElement("images/general/arrows_menu.png", null, 157);
decoration_component["add_block"] = new DecorationElement("images/draw_board/add_next_block.png", "images/draw_board/add_block_inside_loop.png", 0);
decoration_component["start_code"] = new DecorationElement("images/draw_board/first_add_block.png", "images/draw_board/first_add_block_inside_loop.png", 0);
decoration_component["robot_face"] = new DecorationElement("images/general/robot_face.png", null, 0);

decoration_component["function_create"] = new DecorationElement(null, "images/draw_board/make_function_button.png", 89);
decoration_component["function_block"] = new DecorationElement("images/draw_board/function_block.png", null, 138);
decoration_component["loop_start"] = new DecorationElement(null, "images/draw_board/loop_block_left_side.png", 89);
decoration_component["loop_end"] = new DecorationElement(null, "images/draw_board/loop_block_rightt_side.png", 152, new ImagePosition(85, 63, 50, 50), open_calculator);
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

function animate() {
    requestAnimationFrame( animate );
 
        // render the STAGE   
    RENDERER.render(STAGE);
    
}

function display_on_initiator(initiator, display_text) {
	var display_object_index = find_displayed_object_index(initiator);
	var display_object = DISPLAYED_ELEMENT[display_object_index];
	var component = programming_components[display_object.name];
	
	display_object.object.parameter.text = display_text;
}


function init_options_window(next_object) {
	var options_window = PIXI.Sprite.fromImage(decoration_component["arrows_menu"].image_name);
	options_window.position.x = next_object.position.x + next_object.width - X_CORRECTION_FACTOR;	options_window.position.y = MAIN_Y_AXIS - decoration_component["arrows_menu"].connector_height_px;
	options_window.interactive = true;
	
	var x_offset = 50;
	var y_current_offset = 40;
	var extra_y = 15;
	var next_child = create_single_option(next_object, programming_components["go_forward"], x_offset, y_current_offset);
	y_current_offset += next_child.height + extra_y;
	options_window.addChild(next_child);
	
	next_child = create_single_option(next_object, programming_components["go_backward"], x_offset, y_current_offset);
	y_current_offset += next_child.height + extra_y;
	options_window.addChild(next_child);
	
	next_child = create_single_option(next_object, programming_components["turn_left"], x_offset, y_current_offset);
	y_current_offset += next_child.height + extra_y;
	options_window.addChild(next_child);
	
	next_child = create_single_option(next_object, programming_components["turn_right"], x_offset, y_current_offset);
	y_current_offset += next_child.height + extra_y;
	options_window.addChild(next_child);
	
	var event = new CustomEvent('options_window_openned');
	document.dispatchEvent(event);
	
	return options_window;
}

function create_single_option(initiating_object, component, x_offset, y_offset) {
	var single_option = PIXI.Sprite.fromImage(component.options_image_name);
	single_option.position.x = x_offset;
	single_option.position.y = y_offset;
	single_option.interactive = true;
	single_option.buttonMode = true;
	single_option.to_add_image = component;
	single_option.initiating_object = initiating_object;
	single_option.click = single_option.tap = add_bigger_image;
	return single_option;
}

function add_next_button_to_the_right(current_object) {
	var start_code = PIXI.Sprite.fromImage(decoration_component["add_block"].image_name);
	start_code.position.x = current_object.position.x + current_object.width - X_CORRECTION_FACTOR;
	start_code.position.y = MAIN_Y_AXIS - decoration_component["add_block"].connector_height_px;
	
	start_code.interactive = true;
	start_code.buttonMode = true;
	
	start_code.click = start_code.tap = open_options_window;
	add_stage_object(start_code, "add_block");
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
			curr_element.object.position.x = prev_element.object.position.x + prev_element.object.width - X_CORRECTION_FACTOR;
		}
		
		if (curr_element.name == "loop_end") {
			curr_element.object.function_create.position.x = curr_element.object.position.x - 100;
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
	add_dragging_events(bigger_image);
	
	bigger_image.name = this.to_add_image.reference_name;
	bigger_image.open_interaction_window = component.open_interaction_window;
	bigger_image.interactive_rectangle = new PIXI.Rectangle(bigger_image.position.x + component.interactive_location.x, 
		                                                    bigger_image.position.y + component.interactive_location.y, 
		                                                    50, 50);
	
	var text = new PIXI.Text("", {font: '45px Ariel', fill: '#FF9069'});
	text.anchor.set(1);
	text.position.x = component.interactive_location.x + 50;
	text.position.y = component.interactive_location.y + 50;
	bigger_image.addChild(text);
	bigger_image.parameter = text;
	
	var initiating_object_index = find_displayed_object_index(this.initiating_object);
	if (initiating_object_index == DISPLAYED_ELEMENT.length - 1) {
		add_stage_object(bigger_image, this.to_add_image.reference_name);
		add_next_button_to_the_right(bigger_image);
	} else {
		replace_object(DISPLAYED_ELEMENT[initiating_object_index + 1], 
			new VisibleComponent(this.to_add_image.reference_name, bigger_image));
		recalculate_positions();
	}
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

function create_inner_object(object) {
	var component = null;
	if (is_programmable_component(object.name)) {
		component = programming_components[object.name];
	} else if (is_decoration_component(object.name)) {
		component = decoration_component[object.name];
	} else {
		console.log("ERROR not a decorative / programming component");
		return;
	}
	
	var inner_image = PIXI.Sprite.fromImage(component.inner_form_image_name);
	inner_image.position.x = object.object.position.x;
	inner_image.position.y = object.object.position.y;
	inner_image.interactive = true;
	inner_image.buttonMode = true;
	add_dragging_events(inner_image);
	
	return inner_image;
}

function create_decorative_sprite(reference_name, image_name, x, y, force_y) {
	var inner_image = PIXI.Sprite.fromImage(image_name);
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
	
	var start_x = first_element.object.position.x;
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
	
	var interactive_rectangle = new PIXI.Rectangle(interactive_location.x - interactive_location.width, 
		                                     interactive_location.y - interactive_location.height, 
		                                     interactive_location.width, interactive_location.height);
	sprite.interactive_rectangle = interactive_rectangle;
	
	sprite.interactive = true;
	sprite.click = sprite.tap = touchable_image_click_event;	
	sprite.open_interaction_window = component.open_interaction_window;    
	sprite.name = name;                               
	
	var text = new PIXI.Text("", {font: '45px Ariel', fill: '#FF9069'});
	text.anchor.set(1);
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

function function_init(function_name, function_code, x) {
	var function_sprite = create_decorative_sprite("function_block", decoration_component["function_block"].image_name, x);
	var text = new PIXI.Text(function_name, {font: '45px Ariel', fill: '#FF9069'});
	text.anchor.set(1);
	text.position.x = 225;
	text.position.y = 212;
	function_sprite.addChild(text);
	
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
		var inner_object = create_inner_object(current);
		replace_object(current, new VisibleComponent(current.name, inner_object));
	}	
	
	var first_element = DISPLAYED_ELEMENT[start_index];
	var start_sprite = create_decorative_sprite("loop_start", decoration_component["loop_start"].inner_form_image_name, 
														first_element.object.position.x, first_element.object.position.y);
	DISPLAYED_ELEMENT.splice(start_index, 0, new VisibleComponent("loop_start", start_sprite));
	STAGE.addChild(start_sprite);
																	  
	var end_element = DISPLAYED_ELEMENT[end_index + 1];
	var end_sprite = create_decorative_sprite("loop_end", decoration_component["loop_end"].inner_form_image_name, 
														end_element.object.position.x, end_element.object.position.y);
														
	add_interactive_part("loop_end", decoration_component["loop_end"], end_sprite);
	DISPLAYED_ELEMENT.splice(end_index + 2, 0, new VisibleComponent("loop_end", end_sprite));
	STAGE.addChild(end_sprite);
	
	end_sprite.function_create = create_decorative_sprite("function_create", decoration_component["function_create"].inner_form_image_name, 
														end_sprite.position.x - 100, end_sprite.position.y, true);
	init_function_create(end_sprite.function_create, end_sprite);												
	STAGE.addChild(end_sprite.function_create);
	return end_sprite;
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
	
	var end_sprite = convert_to_combines_structure(start_index, end_index);
	recalculate_positions();
	fill_with_back_ground(start_index + 1, end_index + 2, "loop_bg", decoration_component["loop_bg"].inner_form_image_name);
	
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
		this.previous_x = this.data.global.x;
		this.alpha = 0.5;
		this.dragging = true;
	}
}

function onDragEnd()
{
	if (this.dragging) {
	    this.alpha = 1;
	
	    this.dragging = false;
	
	    // set the interaction data to null
	    this.data = null;
	    var closest_object = find_close_enough(this, MIN_GROUP_TOGETHER_DISTANCE); 
	    
	    if (closest_object == null) {
			move_object(this, this.original_position, 100);
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
        this.position.x = this.position.x + this.data.global.x - this.previous_x;
        this.previous_x = this.data.global.x;
    }
}
    
function open_options_window(data) {
	global_click_event();
	var options_window = init_options_window(this);
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
	setTimeout(function(){
    	button.texture = original_texture;
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

function init() {
	// create an new instance of a pixi STAGE
    STAGE.interactive = true;
    
    // create a texture from an image path
    var bg = PIXI.Sprite.fromImage("images/general/BG.png");
    bg.interactive = true;
    bg.click = bg.tab = bg_clicked;
    bg.not_remove_when_cleared = true;
	STAGE.addChild(bg);
	
	var start_code = PIXI.Sprite.fromImage(decoration_component["start_code"].image_name);
	start_code.position.x = 50;
	start_code.position.y = MAIN_Y_AXIS + decoration_component["start_code"].connector_height_px;
	
	start_code.interactive = true;
	start_code.buttonMode = true;
	start_code.not_remove_when_cleared = true;
	
	start_code.click = start_code.tap = open_options_window;
	add_stage_object(start_code, "start_code");
	
	var robot_face = PIXI.Sprite.fromImage(decoration_component["robot_face"].image_name);
	robot_face.position.x = 0;
	robot_face.position.y = 50;
	robot_face.interactive = true;
	robot_face.click = robot_face.tap = open_keyboard;
	robot_face.not_remove_when_cleared = true;
	add_display_object(robot_face, "robot_face");
	
	var execute_code = PIXI.Sprite.fromImage("images/general/run_button_status_on.png");
	execute_code.position.x = 1100;
	execute_code.position.y = 600;
	execute_code.interactive = true;
	execute_code.buttonMode = true;
	execute_code.not_remove_when_cleared = true;
	execute_code.click = execute_code.tap = submit_code;
	add_display_object(execute_code, "execute_code");
	
	add_lesson_icons();
 
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
		console.log(assetsToLoad[i]);
	    loader.add(assetsToLoad[i], assetsToLoad[i]);
	}
	
	// init_choose_screen();
	// init_splash_screen();
	
	loader.load();
 
    requestAnimationFrame( animate );
}

