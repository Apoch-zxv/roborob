function Lesson(name, image, callbacks) {
	this.lesson_name = name;
	this.lesson_image = image;
	this.callbacks = callbacks;
}

function select_lesson_click(data) {
	global_click_event();
	var lesson = data.target.lesson;
	console.log("Selecting " + lesson.lesson_name);
	select_lesson(lesson);
}

function remove_lesson_listener(lesson) {
	if (lesson.callbacks == null) {
		return ;
	}
	for (var key in lesson.callbacks) {
		document.removeEventListener(key, lesson.callbacks[key]);
	}
}

function add_lesson_listener(lesson) {
	if (lesson.callbacks == null) {
		return ;
	}
	for (var key in lesson.callbacks) {
		document.addEventListener(key, lesson.callbacks[key]);
	}
}

function select_lesson(lesson) {
	lesson.object.texture = lesson.texture_selected;
	if ((CURRENT_SELECTED_LESSON != null) && (CURRENT_SELECTED_LESSON != lesson)) {
		CURRENT_SELECTED_LESSON.object.texture = CURRENT_SELECTED_LESSON.texture_not_done;
	}
	
	//if (CURRENT_SELECTED_LESSON != lesson) {
		clear_board();
		if (CURRENT_SELECTED_LESSON != null) {
			remove_lesson_listener(CURRENT_SELECTED_LESSON);
		}
		CURRENT_SELECTED_LESSON = lesson;
		add_lesson_listener(lesson);
		
		var event = new CustomEvent('lesson_load', { 'detail': lesson });
		document.dispatchEvent(event);
	//}
	
	//reposition_all_lessons();
}

function reposition_all_lessons() {
	var curr_x = 650;
	for (var i = 0; i < LESSONS.length; i ++) {
		var lesson = LESSONS[i];
		var lesson_select = lesson.object;
		lesson_select.anchor.set(0.5);
		lesson_select.position.x = curr_x;
		lesson_select.position.y = 50;
		curr_x += 60;

	}
}

function square_lesson(data) {
	gray_shadow();
	var level1_window = PIXI.Sprite.fromImage("images/lessons/level_1_window.png");
	level1_window.position.x = 263 + 771 / 2;
	level1_window.position.y = 218 + 394 / 2;
	level1_window.interactive = true;
	level1_window.remove_on_bg_click = true;
	level1_window.anchor.set(0.5);
	level1_window.name = "level1_window";
	add_ok_button(level1_window, 666 - 771 / 2, 303 - 394 / 2, bg_clicked);

	appear_effect(level1_window, 771, 394);

    var seen_lesson = PIXI.Sprite.fromImage(CURRENT_SELECTED_LESSON.lesson_image);
    seen_lesson.position.x = CURRENT_SELECTED_LESSON.object.position.x;
    seen_lesson.position.y = CURRENT_SELECTED_LESSON.object.position.y;
    seen_lesson.remove_on_bg_click = true;
    seen_lesson.anchor.set(0.5);
    STAGE.addChild(seen_lesson);
}

function square_lesson_bg_click(data) {
	var removed_names = data.detail;
	
	for (var i = 0; i < removed_names.length; i ++) {
		var removed_name = removed_names[i];
		switch (removed_name) {
			case "level1_window":
				var first_block = PIXI.Sprite.fromImage("images/lessons/add_first_block_small_window.png");
				first_block.position.x = 36;
				first_block.position.y = 480;
				first_block.interactive = true;
				first_block.remove_on_bg_click = true;
				first_block.remove_on_obj_click = true;
				first_block.name = "square_first_block";
                side_appear_effect(first_block, "up");
                press_animation(DISPLAYED_ELEMENT[0].object);
				break;
			case "well_done_its_working_window":
				var first_block = PIXI.Sprite.fromImage("images/lessons/use_function_small_window.png");
				first_block.position.x = 74;
				first_block.position.y = 104;
				first_block.interactive = true;
				first_block.remove_on_bg_click = true;
				first_block.remove_on_obj_click = true;
				first_block.name = "use_function_small";
                side_appear_effect(first_block, "right");
				break;
		}
	}
}

function count_options_selector() {
	var count = 0;
	for (var i = 0; i < DISPLAYED_ELEMENT.length; i ++) {
		if ((DISPLAYED_ELEMENT[i].name == "switch_block") || (DISPLAYED_ELEMENT[i].name == "add_block") || (DISPLAYED_ELEMENT[i].name == "start_code")) {
			count ++;
		}
	}
	return count;
}

function square_lesson_options_window(data) {
	var options_selector_count = count_options_selector();
	if (options_selector_count == 1) {
		var touch_the_forward_block = PIXI.Sprite.fromImage("images/lessons/touch_the_forward_block_small_window.png");
		touch_the_forward_block.position.x = 292;
		touch_the_forward_block.position.y = 222;
		touch_the_forward_block.interactive = true;
		touch_the_forward_block.remove_on_bg_click = true;
		touch_the_forward_block.remove_on_obj_click = true;
		touch_the_forward_block.name = "touch_the_forward_block_small_window";
        side_appear_effect(touch_the_forward_block, "left");
        press_animation(data.originator.go_forward);
	} else {
		var touch_the_forward_block = PIXI.Sprite.fromImage("images/lessons/touch_the_turn_block_small_window.png");
		touch_the_forward_block.position.x = 558;
		touch_the_forward_block.position.y = 375;
		touch_the_forward_block.interactive = true;
		touch_the_forward_block.remove_on_bg_click = true;
		touch_the_forward_block.remove_on_obj_click = true;
		touch_the_forward_block.name = "touch_the_forward_block_small_window";
        side_appear_effect(touch_the_forward_block, "left");
        press_animation(data.originator.turn_right);
	}
}

function square_lesson_calculator(data) {
    switch(data.name) {
        case "go_forward":
            var number = data.detail;
            number.text = "Type 20";
            number.updateText();
            number.position.x = number.maximal_position.x - number.textWidth;
            break;
        case "loop_end":
            var number = data.detail;
            number.text = "0";
            number.updateText();
            number.position.x = number.maximal_position.x - number.textWidth;
            break;
    }

}

function square_lesson_calculator_closed(data) {
	var initiator_name = data.detail;
	switch (initiator_name) {
		case "loop_end":
			var add_next_block = PIXI.Sprite.fromImage("images/lessons/hit-_run_small_window.png");
			add_next_block.position.x = 477;
			add_next_block.position.y = 600;
			add_next_block.interactive = true;
			add_next_block.remove_on_bg_click = true;
			add_next_block.remove_on_obj_click = true;
			add_next_block.name = "_run_small_window";
            side_appear_effect(add_next_block, "right");
			break;
		case "go_forward":
			var add_next_block = PIXI.Sprite.fromImage("images/lessons/add_next_block_small_window.png");
			add_next_block.position.x = 287;
			add_next_block.position.y = 478;
			add_next_block.interactive = true;
			add_next_block.remove_on_bg_click = true;
			add_next_block.remove_on_obj_click = true;
			add_next_block.name = "add_next_block_small_window";
            side_appear_effect(add_next_block, "up");
            press_animation(DISPLAYED_ELEMENT[2].object);
			break;
	}
	
}

function square_lesson_angle_closed(data) {
	var add_next_block = PIXI.Sprite.fromImage("images/lessons/drag_thist_block_small_window.png");
	add_next_block.position.x = 366;
	add_next_block.position.y = 529;
	add_next_block.interactive = true;
	add_next_block.remove_on_bg_click = true;
	add_next_block.remove_on_obj_click = true;
	add_next_block.name = "drag_thist_block_small_window";
    side_appear_effect(add_next_block, "up");
}


function square_lesson_loop_created(data) {
	var add_next_block = PIXI.Sprite.fromImage("images/lessons/how_many_lines_small_window.png");
	add_next_block.position.x = 795;
	add_next_block.position.y = 165;
	add_next_block.interactive = true;
	add_next_block.remove_on_bg_click = true;
	add_next_block.remove_on_obj_click = true;
	add_next_block.name = "how_many_lines_small_window";
    side_appear_effect(add_next_block, "left");
    press_animation(data.detail);
}

function square_lesson_code_submition_done(data) {
	gray_shadow();
	var add_next_block = PIXI.Sprite.fromImage("images/lessons/well_done_its_working_window.png");
	add_next_block.position.x = 254 + 767 /2;
	add_next_block.position.y = 269 + 355 / 2;
	add_next_block.interactive = true;
    add_next_block.anchor.set(0.5);
	add_next_block.remove_on_bg_click = true;
	add_next_block.remove_on_obj_click = true;
	add_next_block.name = "well_done_its_working_window";

	add_ok_button(add_next_block, 631 - 767 /2, 260 - 355 / 2, bg_clicked);
    appear_effect(add_next_block, 767, 355);
}

function square_lesson_keyboard_opened(data) {
	var keyboard_text = data.detail;
	keyboard_text.text = "Type \"Square\"";
}

function square_lesson_keyboard_closed(data) {
	var add_next_block = PIXI.Sprite.fromImage("images/lessons/end_level_1_window.png");
	add_next_block.position.x = 234 + 799 / 2;
	add_next_block.position.y = 215 + 403 / 2;
	add_next_block.interactive = true;
    add_next_block.anchor.set(0.5);
	add_next_block.remove_on_bg_click = true;
	add_next_block.remove_on_obj_click = true;
	add_next_block.name = "end_level_1_window";

    setTimeout(function(){
		gray_shadow();
		add_ok_button(add_next_block, 698 - 799 / 2, 317 - 403 / 2, bg_clicked);;
        appear_effect(add_next_block, 799, 403);
	}, 8000);
}

decoration_component["lesson_not_done"] = new DecorationElement("images/lessons/undone_lesson_icon.png", null, 0);

for (var i = 1; i <= 10; i++) {
	decoration_component["lesson_{0}".format(i)] = new DecorationElement("images/lessons/{0}_lesson_icon.png".format(i), null, 0);
}

var CURRENT_SELECTED_LESSON = null;
var LESSONS = [new Lesson("Square", decoration_component["lesson_1"].image_name, {'lesson_load': square_lesson, 
																					   'back_ground_click': square_lesson_bg_click, 
																					   'calculator_openned': square_lesson_calculator, 
																					   'calculator_closed': square_lesson_calculator_closed, 
																					   'angle_closed': square_lesson_angle_closed,
																					   'loop_creation_end': square_lesson_loop_created,
																					   'code_submition_done': square_lesson_code_submition_done,
																					   "keyboard_openned": square_lesson_keyboard_opened,
																					   "keyboard_closed": square_lesson_keyboard_closed,
																					   "options_window_openned": square_lesson_options_window}), 
               new Lesson("2", decoration_component["lesson_2"].image_name, null), 
               new Lesson("3", decoration_component["lesson_3"].image_name, null),
               new Lesson("4", decoration_component["lesson_4"].image_name, null), 
               new Lesson("5", decoration_component["lesson_5"].image_name, null), 
               new Lesson("6", decoration_component["lesson_6"].image_name, null),
               new Lesson("7", decoration_component["lesson_7"].image_name, null), 
               new Lesson("8", decoration_component["lesson_8"].image_name, null), 
               new Lesson("9", decoration_component["lesson_9"].image_name, null),
               new Lesson("10", decoration_component["lesson_10"].image_name, null)];

function add_lesson_icons() {
    var cur_x = 630 + 68 / 2;
	for (var i = 0; i < LESSONS.length; i ++) {
		var lesson = LESSONS[i];
		var lesson_select = PIXI.Sprite.fromImage(decoration_component["lesson_not_done"].image_name);
		var lesson_selected = PIXI.Texture.fromImage(lesson.lesson_image);
		lesson.texture_not_done = lesson_select.texture;
		lesson.texture_selected = lesson_selected;
        if (i == 0) {
            lesson_select.texture = lesson.texture_selected;
        }
		lesson_select.anchor.set(0.5);
		lesson_select.position.x = cur_x;
		lesson_select.position.y = 59;
		lesson_select.interactive = true;
		lesson_select.buttonMode = true;
		lesson_select.lesson = lesson;
		lesson_select.not_remove_when_cleared = true;
		lesson.object = lesson_select;
        lesson_select.visible = false;
        lesson_select.visible_draw_board = true;
		lesson_select.click = lesson_select.tap = select_lesson_click;
		add_display_object(lesson_select, "lesson_select");

        if (i == 0) {
            cur_x += 80;
        } else {
            cur_x += 60 ;
        }
	}
}