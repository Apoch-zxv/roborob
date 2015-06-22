function CalculatorState() {
	this.initial_state = true;
}

function add_digit(data) {
	global_click_event();
	var target = data.target;
	if (target.state.initial_state) {
		target.number.text = target.value.toString();
		target.state.initial_state = false;
		target.number.updateText();
		target.number.position.x = target.number.maximal_position.x - target.number.textWidth;
	} else {
		target.number.text = target.number.text + target.value.toString();
		target.number.updateText();
		target.number.position.x = target.number.maximal_position.x - target.number.textWidth;
	}
}

function remove_all(data) {
	global_click_event();
	var target = data.target;
	if (!target.state.initial_state) {
		target.number.text = "0";
		target.state.initial_state = true;
		target.number.updateText();
		target.number.position.x = target.number.maximal_position.x - target.number.textWidth;
	}
}

function remove_last(data) {
	global_click_event();
	var target = data.target;
	if (!target.state.initial_state) {
		if (target.number.text.length != 1) {
			target.number.text = target.number.text.substr(0, target.number.text.length - 1);
			target.number.updateText();
			target.number.position.x = target.number.maximal_position.x - target.number.textWidth;
		} else {
			target.number.text = "0";
			target.state.initial_state = true;
			target.number.updateText();
			target.number.position.x = target.number.maximal_position.x - target.number.textWidth;
		}
	}
}

function submit_number(data) {
	global_click_event();
	var target = data.target;
	if (!target.state.initial_state) {
		display_on_initiator(target.initiator, target.number.text);
		remove_gray_shadow();
		STAGE.removeChild(target.parent);
		
		var event = new CustomEvent('calculator_closed', {'detail': target.initiator.name});
		document.dispatchEvent(event);
	}
}

function exit_calculator_clicked(event) {
	bg_clicked(null);
}

function open_calculator(initiator) {
	gray_shadow();
	
	var calc_window = PIXI.Sprite.fromImage(decoration_component["calculator_bg"].image_name);
	var calc_field = PIXI.Sprite.fromImage(decoration_component["calculator_field"].image_name);
	
	var x_offset = (calc_window.width - calc_field.width) / 2;
	var y_offset = 107, y_space = 25, x_space = 18.5;
	var curr_x_position = x_offset;
	var curr_y_position = y_offset;
	
	var state = new CalculatorState();
	
	calc_window.position.x = 465;
	calc_window.position.y = 102;
	calc_window.interactive = true;
	calc_window.remove_on_bg_click = true;
	calc_window.name = "calculator";

	calc_field.position.x = curr_x_position;
	calc_field.position.y = curr_y_position;
	calc_window.addChild(calc_field);
	
	for (var key in PIXI.extras.BitmapText.fonts) {
		console.log(key);
		console.log(PIXI.extras.BitmapText.fonts[key]);
	}
	
	var number = new PIXI.extras.BitmapText('0', {font: '30px Fregat', align: "center"});
	number.tint = 0xEE7842;
	number.position.x = calc_field.width - 15;
	number.position.y = calc_field.height - 42;
	number.maximal_position = new PIXI.Point(number.position.x, number.position.y);
	number.updateText();
	number.position.x = number.maximal_position.x - number.textWidth;
	calc_field.addChild(number);
	
	curr_y_position += calc_field.height + 24;
	
	for (var i = 0; i <3; i ++) {
		curr_x_position = x_offset;
		for (var j = 1; j <=3; j ++) {
			var single_button = create_pressable_object(decoration_component["calculator_digit_{0}".format(i * 3 + j)].image_name);
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
		curr_y_position += 20 + single_button.height;
	}
	
	var last_line = [["calculator_window_--_button", remove_all], 
	                 ["calculator_window_0_button", add_digit], 
	                 ["calculator_window_delete_button", remove_last]];
	curr_x_position = x_offset;
	for (var j = 0; j <3; j ++) {
		var name = last_line[j][0];
		var on_click = last_line[j][1];
		var single_button = create_pressable_object(decoration_component[name].image_name);
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
	curr_y_position += 16 + single_button.height;
	
	curr_x_position = x_offset;
	var single_button = create_pressable_object(decoration_component["calculator_window_ok_button"].image_name);
	single_button.position.x = curr_x_position;
	single_button.position.y = curr_y_position;
	single_button.interactive = true;
	single_button.number = number;
	single_button.state = state;
	single_button.initiator = initiator;
	single_button.click = single_button.tap = submit_number;
	calc_window.addChild(single_button);

	var exit_calculator = PIXI.Sprite.fromImage("images/calculator/exit_calculator.png");
	exit_calculator.position.x = 11;
	exit_calculator.position.y = 10;
	exit_calculator.interactive = true;
	exit_calculator.click = exit_calculator.tap = exit_calculator_clicked;
	calc_window.addChild(exit_calculator);
	
	STAGE.addChild(calc_window);
	
	var event = new CustomEvent('calculator_openned', {'detail': number});
	document.dispatchEvent(event);
}
