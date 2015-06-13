if (!String.prototype.format) {
    String.prototype.format = function() {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var args = typeof arguments[0],
            args = (("string" == args || "number" == args) ? arguments : arguments[0]);
        for (arg in args)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
        return str;
    };
}

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

function DecorationElement(image_name, inner_form_image_name, connector_height_px) {
	this.image_name = image_name;
	this.inner_form_image_name = inner_form_image_name;
	this.connector_height_px = connector_height_px;
}

function ImagePosition(x, y) {
	this.x = x;
	this.y = y;
}

function VisibleComponent(name, object) {
	this.name = name;
	this.object = object;
}

function CalculatorState() {
	this.initial_state = true;
	
}

var MIN_GROUP_TOGETHER_DISTANCE = 30;
var DISPLAYED_ELEMENT = [];
var MAIN_Y_AXIS = 400;
var X_CORRECTION_FACTOR = 5;

var programming_components = {};
programming_components["go_forward"] = new DisplayElement("images/go_forward_block.png", 
                                                          "images/forward_icon.png", 
                                                          "images/go_forward_block_inside_loop.png", 
                                                          "go_forward", 59, 
                                                          new ImagePosition(30, 80), open_calculator);
programming_components["go_backward"] = new DisplayElement("images/go_forward_block.png", 
                                                           "images/backward_icon.png", 
                                                           "images/go_forward_block_inside_loop.png", 
                                                           "go_backward", 59, 
                                                           new ImagePosition(30, 80), open_calculator);
programming_components["turn_left"] = new DisplayElement("images/turn_right_block.png", 
                                                         "images/turn_left_icon.png", 
                                                         "images/go_forward_block_inside_loop.png", 
                                                         "turn_left", 55, 
                                                         new ImagePosition(80, 90), open_angle);
programming_components["turn_right"] = new DisplayElement("images/turn_right_block.png", 
                                                          "images/turn_right_icon.png", 
                                                          "images/turn_right_block_inside_loop.png", 
                                                          "turn_right", 55, 
                                                          new ImagePosition(80, 90), open_angle);
var decoration_component = {};
decoration_component["arrows_menu"] = new DecorationElement("images/arrows_menu.png", null, 157);
decoration_component["add_block"] = new DecorationElement("images/add_block.png", "images/add_block_inside_loop.png", 0);
decoration_component["start_code"] = new DecorationElement("images/start_code.png", "images/first_add_block_inside_loop.png", 0);
decoration_component["robot_face"] = new DecorationElement("images/robot_face.png", null, 0);
decoration_component["loop_start"] = new DecorationElement(null, "images/loop_block_left_side.png", 89);
decoration_component["loop_end"] = new DecorationElement(null, "images/loop_block_rightt_side.png", 152);
decoration_component["loop_bg"] = new DecorationElement(null, "images/loop_block_middle.png", 89);
decoration_component["window_field"] = new DecorationElement("images/interaction/calculator_window_field.png", null, 0);

decoration_component["keyboard_field"] = new DecorationElement("images/interaction/keyboard_window_field.png", null, 0);

decoration_component["angle_bg"] = new DecorationElement("images/interaction/angels_window.png", null, 0);
decoration_component["angle_circle"] = new DecorationElement("images/interaction/unchosen_pink_angles_circle.png", null, 0);
decoration_component["angle_circle_selected"] = new DecorationElement("images/interaction/chosen_yellow_angles_circle.png", null, 0);
decoration_component["angle_circle_transperent"] = new DecorationElement("images/interaction/circle_transperent.png", null, 0);
decoration_component["angle_needle"] = new DecorationElement("images/interaction/needle_angles.png", null, 0);

decoration_component["calculator_bg"] = new DecorationElement("images/interaction/calculator_window_BG_pink.png", null, 0);
decoration_component["calculator_window_--_button"] = new DecorationElement("images/interaction/calculator_window_--_button.png", null, 0);
decoration_component["calculator_window_0_button"] = new DecorationElement("images/interaction/calculator_window_0_button.png", null, 0);
decoration_component["calculator_window_delete_button"] = new DecorationElement("images/interaction/calculator_window_delete_button.png", null, 0);
decoration_component["calculator_window_ok_button"] = new DecorationElement("images/interaction/calculator_window_ok_button.png", null, 0);

for (var i = 0; i <= 9; i++) {
	decoration_component["calculator_digit_{0}".format(i)] = new DecorationElement("images/interaction/calculator_window_{0}_button.png".format(i), null, 0);
}

// create a RENDERER instance.
var RENDERER = PIXI.autoDetectRenderer(1280, 800);
var STAGE = new PIXI.Stage(0xFFFFFF);

function animate() {
    requestAnimationFrame( animate );
 
        // render the STAGE   
    RENDERER.render(STAGE);
    TWEEN.update();
    
}

function add_digit(data) {
	var target = data.target;
	if (target.state.initial_state) {
		target.number.text = "";
		target.state.initial_state = false;
	}
	target.number.text = $.trim(target.number.text + target.value.toString());
}

function remove_all(data) {
	var target = data.target;
	if (!target.state.initial_state) {
		target.number.text = "0";
		target.state.initial_state = true;
	}
}

function remove_last(data) {
	var target = data.target;
	if (!target.state.initial_state) {
		if (target.number.text.length != 1) {
			target.number.text = target.number.text.substr(0, target.number.text.length - 1);
		} else {
			target.number.text = "0";
			target.state.initial_state = true;
		}
	}
}

function display_on_initiator(initiator, display_text) {
	var display_object_index = find_displayed_object_index(initiator);
	var display_object = DISPLAYED_ELEMENT[display_object_index];
	var component = programming_components[display_object.name];
	
	var text = new PIXI.Text(display_text, {font: '45px Ariel', fill: '#FF9069'});
	text.anchor.set(1);
	text.position.x = component.interactive_location.x + 50;
	text.position.y = component.interactive_location.y + 50;
	
	initiator.addChild(text);
}

function submit_number(data) {
	var target = data.target;
	if (!target.state.initial_state) {
		display_on_initiator(target.initiator, target.number.text);
		remove_gray_shadow();
		STAGE.removeChild(target.parent);
	}
}

function add_angle_events(object) {
	object
		// events for drag move
        .on('mousemove', angle_move_move)
        .on('touchmove', angle_move_move)
		// events for drag start
        .on('mousedown', angle_move_start)
        .on('touchstart', angle_move_start)
        // events for drag end
        .on('mouseup', angle_move_stop)
        .on('mouseupoutside', angle_move_stop)
        .on('touchend', angle_move_stop)
        .on('touchendoutside', angle_move_stop);
}

function angle_move_start(event) {
	this.dragging = true;
	this.data = event.data;
	this.target = event.target;
	this.circle = event.target.circle;
	this.start_position = this.data.getLocalPosition(this.circle);
	this.start_rotation = this.target.rotation;
}

function distance(a, b) {
	return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
}

function find_angle(center, start, dest) {
	var c = distance(start, dest);
	var a = distance(start, center);
	var b = distance(dest, center);
	var factor = 0;
	if (dest.x < start.x) {
		return 2 * Math.PI - Math.acos((a * a + b * b - c * c) / (2 * a * b));
	} else {
		return Math.acos((a * a + b * b - c * c) / (2 * a * b));
	}
}

function find_relative_point(angle, radius) {
	return new PIXI.Point(Math.sin(angle) * radius, Math.cos(angle) * radius);
}

function transform_point(real_center, relative_point) {
	return new PIXI.Point(real_center.x + relative_point.x, real_center.y - relative_point.y);
}

function transform_point_same_axis_system(real_center, relative_point) {
	return new PIXI.Point(real_center.x + relative_point.x, real_center.y + relative_point.y);
}

function set_number(circle) {
	var center = new PIXI.Point(circle.position.x, circle.position.y);
	var radius = circle.width / 2;
	
	var main_needle_relative_point = find_relative_point(circle.main_needle.rotation, radius);
	var main_needle_angle = find_single_relative_point_angle(main_needle_relative_point, radius);
	
	var move_needle_relative_point = find_relative_point(circle.move_needle.rotation, radius);
	var move_needle_angle = find_single_relative_point_angle(move_needle_relative_point, radius);
	
	var diff = null;
	if (main_needle_angle > move_needle_angle) {
		diff = (2 * Math.PI - main_needle_angle) + move_needle_angle;
	} else {
		diff = move_needle_angle - main_needle_angle;
	}
	
	var angle = diff * 57.2957795;
	circle.number.text = Math.floor(angle).toString();
}

function find_closes_point_on_circle(point, radius) {
	var angle = Math.asin(distance(point, new PIXI.Point(0, point.y)) / distance(point, new PIXI.Point(0, 0)));
	var y_mult = 1;
	var x_mult = 1;
	if (point.x >= 0 && point.y >= 0) {
	} else if (point.x >= 0 && point.y < 0) {
		y_mult = -1;
	} else if (point.x < 0 && point.y <= 0) {
		y_mult = -1;
		x_mult = -1;
	} else if (point.x < 0 && point.y > 0) {
		x_mult = -1;
	}
	return new PIXI.Point(Math.sin(angle) * radius * x_mult, Math.cos(angle) * radius * y_mult);
}

function find_single_relative_point_angle(point, radius) {
	var point = find_closes_point_on_circle(point, radius);
	
	if ((point.x >= 0) && (point.y >= 0)) {
		return Math.acos(point.y / radius);
	} else if ((point.x >= 0) && (point.y < 0)) {
		return Math.acos(point.y / radius);
	} else if (point.x < 0 && point.y <= 0)  {
		return 2 * Math.PI - Math.acos(point.y / radius);
	} else if (point.x < 0 && point.y > 0) {
		return 2 * Math.PI - Math.acos(point.y / radius);
	}
}

function display_current_selected(circle) {
	var radius = circle.width / 2;
	var center = new PIXI.Point(circle.width / 2, circle.height / 2);
	var selected_mask = circle.selected_mask;
	
	var main_needle_relative_point = find_relative_point(circle.main_needle.rotation, radius);
	var main_needle_relative_circle = transform_point(center, main_needle_relative_point);
	var main_needle_angle = find_single_relative_point_angle(main_needle_relative_point, radius);
	
	var move_needle_relative_point = find_relative_point(circle.move_needle.rotation, radius);
	var move_needle_relative_circle = transform_point(center, move_needle_relative_point);
	var move_needle_angle = find_single_relative_point_angle(move_needle_relative_point, radius);
	
	
	selected_mask.clear();
	selected_mask.beginFill(0x8bc5ff, 0.4);
    selected_mask.moveTo(center.x, center.y);
    selected_mask.arc(center.x, center.y, radius, main_needle_angle - Math.PI / 2, move_needle_angle - Math.PI / 2);
}

function angle_move_move() {
	if (this.dragging) {
		var radius = this.target.circle.height / 2;
		var center_global = new PIXI.Point(this.target.circle.width / 2, this.target.circle.height / 2);
		var local_position = this.data.getLocalPosition(this.circle);
		var relative_click_position = new PIXI.Point(local_position.x - center_global.x, center_global.y - local_position.y);
		this.target.rotation = find_single_relative_point_angle(relative_click_position, radius);
		set_number(this.circle);
		display_current_selected(this.circle);
	}
}

function angle_move_stop() {
	this.dragging = false;
}

function submit_angle_initiator(data) {
	var target = data.target;
	var initiator = target.initiator;
	display_on_initiator(target.initiator, target.number.text);
	remove_gray_shadow();
	STAGE.removeChild(target.parent);
}

function open_angle(initiator) {
	gray_shadow();
	
	var angle = PIXI.Sprite.fromImage(decoration_component["angle_bg"].image_name);
	angle.position.x = 450;
	angle.position.y = 150;
	angle.interactive = true;
	angle.remove_on_bg_click = true;
	
	var circle = PIXI.Sprite.fromImage(decoration_component["angle_circle"].image_name);
	circle.position.x = 60;
	circle.position.y = 100;
	circle.interactive = true;
	angle.addChild(circle);
	
	var container = new PIXI.Container();
	container.position.x = 60;
	container.position.y = 100;
	
	var selected_circle = PIXI.Sprite.fromImage(decoration_component["angle_circle_selected"].image_name);
	selected_circle.position.x = 0;
	selected_circle.position.y = 0;
	selected_circle.interactive = true;
	container.addChild(selected_circle);
	
	angle.addChild(container);
	
	var selected_mask = new PIXI.Graphics();
	angle.addChild(selected_mask);
	selected_mask.position.x = 60;
	selected_mask.position.y = 100;
	circle.selected_mask = selected_mask;
	selected_mask.lineStyle(0);
	
	container.mask = selected_mask;
	
	var needle_rectangle = PIXI.Sprite.fromImage(decoration_component["angle_circle_transperent"].image_name);
	needle_rectangle.position.x = 60;
	needle_rectangle.position.y = 100;
	needle_rectangle.interactive = true;
	
	var first_needle = PIXI.Sprite.fromImage(decoration_component["angle_needle"].image_name);
	first_needle.anchor = new PIXI.Point(0.5, 1);
	first_needle.position.x = circle.width / 2;
	first_needle.position.y = circle.height / 2;
	first_needle.interactive = true;
	first_needle.circle = circle;
	add_angle_events(first_needle);
	circle.main_needle = first_needle;
	needle_rectangle.addChild(first_needle);
	
	var second_needle = PIXI.Sprite.fromImage(decoration_component["angle_needle"].image_name);
	second_needle.anchor = new PIXI.Point(0.5, 1);
	second_needle.position.x = circle.width / 2;
	second_needle.position.y = circle.height / 2;
	second_needle.rotation = 0.4;
	second_needle.interactive = true;
	second_needle.circle = circle;
	add_angle_events(second_needle);
	circle.move_needle = second_needle;
	needle_rectangle.addChild(second_needle);
	
	var middle_circle = PIXI.Sprite.fromImage("images/interaction/midddle_angles_circle.png");
	middle_circle.position.x = circle.width / 2;
	middle_circle.position.y = circle.height / 2;
	middle_circle.interactive = true;
	middle_circle.anchor = new PIXI.Point(0.5, 0.5);
	needle_rectangle.addChild(middle_circle);
	
	angle.addChild(needle_rectangle);
	
	var number = new PIXI.Text('0', {font: '45px Ariel', fill: '#FF9069'});
	number.anchor.set(1);
	number.position.x = 185;
	number.position.y = 535;
	circle.number = number;
	angle.addChild(number);
	
	var submit_angle = PIXI.Sprite.fromImage("images/interaction/angels_window_ok_button.png");
	submit_angle.position.x = number.position.x + number.width + 20;
	submit_angle.position.y = number.position.y - number.height - 13;
	submit_angle.interactive = true;
	submit_angle.buttonMode = true;
	submit_angle.initiator = initiator;
	submit_angle.click = submit_angle.tap = submit_angle_initiator;
	submit_angle.number = number;
	angle.addChild(submit_angle);
	
	STAGE.addChild(angle);
	
	set_number(circle);
	display_current_selected(circle);
}

function open_keyboard(initiator) {
	gray_shadow();
	
	var keyboard_bg = PIXI.Sprite.fromImage("images/interaction/keyboard_window_BG.png");
	keyboard_bg.position.x = 100;
	keyboard_bg.position.y = 150;
	keyboard_bg.interactive = true;
	keyboard_bg.remove_on_bg_click = true;
	
	var calc_field = PIXI.Sprite.fromImage(decoration_component["keyboard_field"].image_name);
	calc_field.position.x = 50;
	calc_field.position.y = 100;
	calc_field.interactive = true;
	keyboard_bg.addChild(calc_field);
	
	STAGE.addChild(keyboard_bg);
}

function gray_shadow() {
	STAGE.addChild(GRAY_BG);
}

function remove_gray_shadow() {
	STAGE.removeChild(GRAY_BG);
}

function open_calculator(initiator) {
	gray_shadow();
	
	var calc_window = PIXI.Sprite.fromImage(decoration_component["calculator_bg"].image_name);
	var calc_field = PIXI.Sprite.fromImage(decoration_component["window_field"].image_name);
	
	var x_offset = (calc_window.width - calc_field.width) / 2;
	var y_offset = 90, y_space = 25, x_space = 20;
	var curr_x_position = x_offset;
	var curr_y_position = y_offset;
	
	var state = new CalculatorState();
	
	calc_window.position.x = 450;
	calc_window.position.y = 150;
	calc_window.interactive = true;
	calc_window.remove_on_bg_click = true;

	calc_field.position.x = curr_x_position;
	calc_field.position.y = curr_y_position;
	calc_window.addChild(calc_field);
	
	var number = new PIXI.Text('0', {font: '45px Ariel', fill: '#FF9069'});
	number.anchor.set(1);
	number.position.x = calc_field.width;
	number.position.y = calc_field.height;
	calc_field.addChild(number);
	
	curr_y_position += calc_field.height + y_space;
	
	for (var i = 0; i <3; i ++) {
		curr_x_position = x_offset;
		for (var j = 1; j <=3; j ++) {
			var single_button = PIXI.Sprite.fromImage(decoration_component["calculator_digit_{0}".format(i * 3 + j)].image_name);
			single_button.position.x = curr_x_position;
			single_button.position.y = curr_y_position;
			single_button.value = i * 3 + j;
			single_button.interactive = true;
			single_button.number = number;
			single_button.state = state;
			single_button.click = single_button.tap = add_digit;
			curr_x_position += x_space + single_button.width;
			calc_window.addChild(single_button);
		}
		curr_y_position += y_space + single_button.height;
	}
	
	var last_line = [["calculator_window_--_button", remove_all], 
	                 ["calculator_window_0_button", add_digit], 
	                 ["calculator_window_delete_button", remove_last]];
	curr_x_position = x_offset;
	for (var j = 0; j <3; j ++) {
		var name = last_line[j][0];
		var on_click = last_line[j][1];
		var single_button = PIXI.Sprite.fromImage(decoration_component[name].image_name);
		single_button.position.x = curr_x_position;
		single_button.position.y = curr_y_position;
		single_button.interactive = true;
		single_button.number = number;
		single_button.state = state;
		curr_x_position += x_space + single_button.width;
		single_button.click = single_button.tap = on_click;
		if (name == "calculator_window_0_button") {
			single_button.value = 0;
			single_button.number = number;
		}
		calc_window.addChild(single_button);
	}
	curr_y_position += y_space + single_button.height;
	
	curr_x_position = x_offset;
	var single_button = PIXI.Sprite.fromImage(decoration_component["calculator_window_ok_button"].image_name);
	single_button.position.x = curr_x_position;
	single_button.position.y = curr_y_position;
	single_button.interactive = true;
	single_button.number = number;
	single_button.state = state;
	single_button.initiator = initiator;
	single_button.click = single_button.tap = submit_number;
	calc_window.addChild(single_button);
	
	STAGE.addChild(calc_window);
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
	}
}

function add_bigger_image(data) {
	var component = programming_components[this.to_add_image.reference_name];
	var bigger_image = PIXI.Sprite.fromImage(this.to_add_image.big_image_name);
	bigger_image.position.x = this.parent.position.x - X_CORRECTION_FACTOR;
	bigger_image.position.y = MAIN_Y_AXIS - component.connector_height_px;
	bigger_image.interactive = true;
	bigger_image.buttonMode = true;
	add_dragging_events(bigger_image);
	
	bigger_image.open_interaction_window = component.open_interaction_window;
	bigger_image.interactive_rectangle = new PIXI.Rectangle(bigger_image.position.x + component.interactive_location.x, 
		                                                    bigger_image.position.y + component.interactive_location.y, 
		                                                    50, 50);
	
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
}

function move_object(object, dest) {
	new TWEEN.Tween(object)
                 .to({x:dest.x, y:dest.y}, 600)
                 .easing(TWEEN.Easing.Linear.None)
            .start();
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

function create_decorative_sprite(reference_name, image_name, x, y) {
	var inner_image = PIXI.Sprite.fromImage(image_name);
	inner_image.position.x = x;
	inner_image.position.y = MAIN_Y_AXIS - decoration_component[reference_name].connector_height_px;
	inner_image.interactive = true;
	return inner_image;
}

function fill_with_back_ground(start_index, end_index, reference_name, image_name) {
	var first_element = DISPLAYED_ELEMENT[start_index];
	var end_element = DISPLAYED_ELEMENT[end_index];
	
	var start_x = first_element.object.position.x;
	var stop_x = end_element.object.position.x;
	var bg_y_axis = MAIN_Y_AXIS - decoration_component[reference_name].connector_height_px;
	
	var curr_x = start_x;
	while (curr_x <= stop_x) {
		var single_component = create_decorative_sprite(reference_name, image_name, curr_x, bg_y_axis);
		STAGE.addChildAt(single_component, 1);
		//STAGE.addChild(single_component);
		curr_x += single_component.width;
	}
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
	DISPLAYED_ELEMENT.splice(end_index + 2, 0, new VisibleComponent("loop_end", end_sprite));
	STAGE.addChild(end_sprite);
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
	
	convert_to_combines_structure(start_index, end_index);
	recalculate_positions();
	fill_with_back_ground(start_index + 1, end_index + 2, "loop_bg", decoration_component["loop_bg"].inner_form_image_name);
}

function distance(a, b) {
	return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
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
			move_object(this, this.original_position);
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
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
    }
}
    
function open_options_window(data) {
	var options_window = init_options_window(this);
	options_window.remove_on_bg_click = true;
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

function bg_clicked(data) {
	var to_remove = [];
	var array_length = STAGE.children.length;
	for (var i = 0; i < array_length; i++) {
		if (STAGE.children[i].remove_on_bg_click == true) {
			to_remove.push(STAGE.children[i]);
		}
	}
	
	for (var i = 0; i < to_remove.length; i++) {
		remove_from_stage_object(to_remove[i]);
	}
}

function send_to_server(data, url) {
   $.ajax
   ({
      type: "POST",
      //the url where you want to sent the userName and password to
      url: url,
      //json object to sent to the authentication url
      data:"json=" + JSON.stringify(data) ,
      success: function () {
      }
  });
}

function submit_code(data) {
	var components_size = DISPLAYED_ELEMENT.length;
	var code = [];
	var curr_code = code;
	for (var i = 0; i < components_size; i++) {
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
	
	send_to_server(code, "/api/execute_code");
}

function init() {
	// create an new instance of a pixi STAGE
    STAGE.interactive = true;
    
    // create a texture from an image path
    var bg = PIXI.Sprite.fromImage("images/BG.png");
    bg.interactive = true;
    bg.click = bg.tab = bg_clicked;
	STAGE.addChild(bg);
	
	var start_code = PIXI.Sprite.fromImage(decoration_component["start_code"].image_name);
	start_code.position.x = 50;
	start_code.position.y = MAIN_Y_AXIS + decoration_component["start_code"].connector_height_px;
	
	start_code.interactive = true;
	start_code.buttonMode = true;
	
	start_code.click = start_code.tap = open_options_window;
	add_stage_object(start_code, "start_code");
	
	var robot_face = PIXI.Sprite.fromImage(decoration_component["robot_face"].image_name);
	robot_face.position.x = 0;
	robot_face.position.y = 50;
	robot_face.interactive = true;
	robot_face.click = robot_face.tap = open_keyboard;
	add_display_object(robot_face, "robot_face");
	
	var execute_code = PIXI.Sprite.fromImage("images/run_button_status_on.png");
	execute_code.position.x = 1100;
	execute_code.position.y = 600;
	execute_code.interactive = true;
	execute_code.buttonMode = true;
	execute_code.click = execute_code.tap = submit_code;
	add_display_object(execute_code, "execute_code");
 
    RENDERER.view.style.position = "absolute";
	RENDERER.view.style.width = window.innerWidth + "px";
	RENDERER.view.style.height = window.innerHeight + "px";
	RENDERER.view.style.display = "block";
 
    // add the RENDERER view element to the DOM
    document.body.appendChild(RENDERER.view);
    
    var assetsToLoad = ["images/go_forward_block.png", "images/backward_icon.png", 
                        "images/forward_icon.png", "images/turn_left_icon.png", 
                        "images/turn_right_block.png", "images/arrows_menu.png", 
                        "images/add_block.png"];
                     
    for (var key in programming_components) {
    	if (programming_components[key].inner_form_image_name != null) {
	    	if (assetsToLoad.indexOf(programming_components[key].inner_form_image_name) == -1) {
	    		assetsToLoad.push(programming_components[key].inner_form_image_name);
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
	loader.load();
 
    requestAnimationFrame( animate );
}

var GRAY_BG = PIXI.Sprite.fromImage("images/gray_bg.png");
GRAY_BG.interactive = true;
GRAY_BG.alpha = 0.5;
GRAY_BG.remove_on_bg_click = true;
GRAY_BG.click = GRAY_BG.tab = bg_clicked;
