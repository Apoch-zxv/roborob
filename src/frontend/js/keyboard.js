function KeyboardState() {
	this.is_capital = false;
    this.is_initial = true;
}

function is_initial_state(obj) {
    return obj.parent.state.is_initial;
}

function set_not_initial_state(obj) {
    obj.parent.state.is_initial = false;;
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
    if (is_initial_state(event.target)) {
        return ;
    }
	if (event.target.parent.text_field.text.length != 0) {
		event.target.parent.text_field.text = event.target.parent.text_field.text.substr(0, event.target.parent.text_field.text.length - 1);
	}

    var event = new CustomEvent('key_pressed');
    document.dispatchEvent(event);
}

function add_single_char(event, new_char) {
    if (is_initial_state(event.target)) {
        set_not_initial_state(event.target);
        event.target.parent.text_field.text = "";
    }
	event.target.parent.text_field.text = event.target.parent.text_field.text + new_char;

    var event = new CustomEvent('key_pressed');
    document.dispatchEvent(event);

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

function add_comma(event) {
	add_single_char(event, ",");
}

function add_period(event) {
	add_single_char(event, ".");
}

function submit_keyboard_text(event) {
	var target = event.target;	
	var initiator = target.parent.initiator;
    var event2 = new CustomEvent('key_pressed');
    document.dispatchEvent(event2);
    bg_clicked(null);
	
	if (initiator.on_keyboard_finish != null) {
        var text_to_send = target.parent.text_field.text;
        if (text_to_send.charAt(0) == " ") {
            text_to_send = target.parent.text_field.text.substr(1, event.target.parent.text_field.text.length - 1);
        }
		initiator.on_keyboard_finish(initiator, text_to_send);
	}
	
	var event1 = new CustomEvent('keyboard_closed', {'detail': initiator.name});
	document.dispatchEvent(event1);
}

function add_line (parent_obj, line, x, y, overwrite_dist) {
	var dist = 16;
    if (overwrite_dist != null) {
        dist = overwrite_dist;
    }
	var special_sizes = {"enter": 99 + dist, "delete": 59 + dist, 
	                     "shift": 59 + dist, "123": 133 + dist,
	                     "slash": 58 + dist, "space": 369 + dist,
	                     "ok": 211 + dist};
	var special_callbacks = {"enter": do_nothing, "delete": keyboard_remove_char, 
	                     "shift": keyboard_lower_upper, "123": do_nothing,
	                     "slash": add_slash, "space": add_space, "comman": add_comma, "Period": add_period,
	                     "ok": submit_keyboard_text};
	x_dist = 61 + dist;
	curr_x = x;
	for (var i = line.length - 1; i >= 0; i --) {
		var button = create_pressable_object("images/keyboard/keyboard_{0}_button.png".format(line[i]));
		button.anchor.set(1);
		button.interactive = true;
		button.position.y = y - height / 2;
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

function exit_keyboard_clicked(event) {
    bg_clicked(null);
}

var width = 938;
var height = 520;

function open_keyboard(initiator) {
	global_click_event();
	gray_shadow();
	
	first_line = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "delete"];
	second_line = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "enter"];
	third_line = ["shift", "z", "x", "c", "v", "b", "n", "m", "comma", "Period", "shift"];
	fourth_line = ["123", "slash", "space", "ok"];

	var keyboard_bg = PIXI.Sprite.fromImage("images/keyboard//keyboard_window_BG.png");
	keyboard_bg.position.x = 172 + width / 2;
	keyboard_bg.position.y = 128 + height / 2;
	keyboard_bg.interactive = true;
	keyboard_bg.remove_on_bg_click = true;
    keyboard_bg.anchor.set(0.5);
	keyboard_bg.name = "keyboard";
	
	keyboard_bg.initiator = initiator;
	
	var state = new KeyboardState();
	keyboard_bg.state = state;

    var exit_keyboard = PIXI.Sprite.fromImage("images/keyboard/exit_keyboard_window.png");
    exit_keyboard.position.x = 13 - width / 2;
    exit_keyboard.position.y = 10 - height / 2;
    exit_keyboard.interactive = true;
    exit_keyboard.click = exit_keyboard.tap = exit_keyboard_clicked;
    keyboard_bg.addChild(exit_keyboard);
	
	var calc_field = PIXI.Sprite.fromImage(decoration_component["keyboard_field"].image_name);
	calc_field.position.x = 58 - width / 2;
	calc_field.position.y = 107 - height / 2;
	calc_field.interactive = true;
	keyboard_bg.addChild(calc_field);
	
	var text_field = new PIXI.extras.BitmapText('', {font: '30px Fregat', align: "center"});
    text_field.tint = 0xEE7842;
	text_field.position.x = 19;
	text_field.position.y = 10;
    calc_field.addChild(text_field);
	
	keyboard_bg.text_field = text_field;
	
	var y_space = 70;
	var curr_y = 253;
	add_line(keyboard_bg, first_line, calc_field.position.x + calc_field.width, curr_y, null);
	curr_y =  curr_y + y_space;
	add_line(keyboard_bg, second_line, calc_field.position.x + calc_field.width, curr_y, null);
	curr_y =  curr_y + y_space;
	add_line(keyboard_bg, third_line, calc_field.position.x + calc_field.width, curr_y, null);
	curr_y =  curr_y + y_space;
	add_line(keyboard_bg, fourth_line, calc_field.position.x + calc_field.width, curr_y, 19);
	
	appear_effect(keyboard_bg, width, height);

	var event = new CustomEvent('keyboard_openned', {'detail': text_field});
	document.dispatchEvent(event);
}