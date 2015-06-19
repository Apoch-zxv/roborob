function KeyboardState() {
	this.is_capital = false;
}

function open_keyboard_caller(event) {
	open_keyboard(event.target);
}

function do_nothing(event) {
	
}

function keyboard_lower_upper(event) {
	event.target.parent.state.is_upper = !event.target.parent.state.is_upper;
}

function keyboard_remove_char(event) {
	if (event.target.parent.text_field.text.length != 0) {
		event.target.parent.text_field.text = event.target.parent.text_field.text.substr(0, event.target.parent.text_field.text.length - 1);
	}
}

function add_single_char(event, new_char) {
	event.target.parent.text_field.text = event.target.parent.text_field.text + new_char;
}

function add_char(event) {
	add_single_char(event, event.target.value);
}

function add_slash(event) {
	add_single_char(event, "/");
}

function add_space(event) {
	add_single_char(event, " ");
}

function submit_keyboard_text(event) {
	var target = event.target;	
	var initiator = target.parent.initiator;
	remove_gray_shadow();
	STAGE.removeChild(target.parent);
	
	if (initiator.on_keyboard_finish != null) {
		initiator.on_keyboard_finish(initiator, target.parent.text_field.text);
	}
	
	var event = new CustomEvent('keyboard_closed', {'detail': initiator.name});
	document.dispatchEvent(event);
}

function add_line (parent_obj, line, x, y) {
	var dist = 15;
	var special_sizes = {"enter": 99 + dist, "delete": 59 + dist, 
	                     "shift": 59 + dist, "123": 133 + dist,
	                     "slash": 58 + dist, "space": 369 + dist,
	                     "ok": 211 + dist};
	var special_callbacks = {"enter": do_nothing, "delete": keyboard_remove_char, 
	                     "shift": keyboard_lower_upper, "123": do_nothing,
	                     "slash": add_slash, "space": add_space,
	                     "ok": submit_keyboard_text};
	x_dist = 61 + dist;
	curr_x = x;
	for (var i = line.length - 1; i >= 0; i --) {
		var button = PIXI.Sprite.fromImage("images/keyboard_{0}_button.png".format(line[i]));
		button.anchor.set(1);
		button.interactive = true;
		button.position.y = y;
		button.position.x = curr_x;
		button.value = line[i];
		if (line[i] in special_sizes) {
			curr_x -= special_sizes[line[i]];
		} else {
			curr_x -= x_dist;
		}
		
		if (line[i] in special_callbacks) {
			button.click = button.tap = special_callbacks[line[i]];
		} else {
			button.click = button.tap = add_char;
		}
		parent_obj.addChild(button);
	}
}

function open_keyboard(initiator) {
	global_click_event();
	gray_shadow();
	
	first_line = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "delete"];
	second_line = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "enter"];
	third_line = ["shift", "z", "x", "c", "v", "b", "n", "m", "comma", "Period", "shift"];
	fourth_line = ["123", "slash", "space", "ok"];
	
	var keyboard_bg = PIXI.Sprite.fromImage("images/interaction/keyboard_window_BG.png");
	keyboard_bg.position.x = 100;
	keyboard_bg.position.y = 150;
	keyboard_bg.interactive = true;
	keyboard_bg.remove_on_bg_click = true;
	keyboard_bg.name = "keyboard";
	
	keyboard_bg.initiator = initiator;
	
	var state = new KeyboardState();
	keyboard_bg.state = state;
	
	var calc_field = PIXI.Sprite.fromImage(decoration_component["keyboard_field"].image_name);
	calc_field.position.x = 50;
	calc_field.position.y = 100;
	calc_field.interactive = true;
	keyboard_bg.addChild(calc_field);
	
	var text_field = new PIXI.Text('', {font: '45px Ariel', fill: '#FF9069'});
	text_field.position.x = 50;
	text_field.position.y = 100;
	text_field.interactive = true;
	keyboard_bg.addChild(text_field);
	
	keyboard_bg.text_field = text_field;
	
	var y_space = 70;
	var curr_y =  calc_field.position.y + 150;
	add_line(keyboard_bg, first_line, calc_field.position.x + calc_field.width, curr_y);
	curr_y =  curr_y + y_space;
	add_line(keyboard_bg, second_line, calc_field.position.x + calc_field.width, curr_y);
	curr_y =  curr_y + y_space;
	add_line(keyboard_bg, third_line, calc_field.position.x + calc_field.width, curr_y);
	curr_y =  curr_y + y_space;
	add_line(keyboard_bg, fourth_line, calc_field.position.x + calc_field.width, curr_y);
	
	STAGE.addChild(keyboard_bg);
	
	var event = new CustomEvent('keyboard_openned', {'detail': text_field});
	document.dispatchEvent(event);
}