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

function DecorationElement(image_name, inner_form_image_name, connector_height_px, interactive_location,
	                    open_interaction_window) {
	this.image_name = image_name;
	this.inner_form_image_name = inner_form_image_name;
	this.connector_height_px = connector_height_px;
	
	this.interactive_location = interactive_location || null;
	this.open_interaction_window = open_interaction_window || null;
}

function add_ok_button(parent, x, y, on_click) {
	var ok_button = create_pressable_object("images/general/window_ok_button.png");
	ok_button.position.x = x;
	ok_button.position.y = y;
	ok_button.interactive = true;
	ok_button.buttonMode = true;
	ok_button.click = ok_button.tap = on_click;
	parent.addChild(ok_button);
}

function ImagePosition(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width || 50;
	this.height = height || 50;
}

function gray_shadow() {
	fade_in(GRAY_BG, GRAY_BG_ALPHA, 0, null, APPEAR_SPEED);

}

function remove_gray_shadow() {
	STAGE.removeChild(GRAY_BG);
}

function move_object(object, dest, speed) {
	createjs.Tween.get(object)
                 .to({x:dest.x, y:dest.y}, speed);
}

function fade_in(object, dest_alpha, wait_time, after_fade, fade_speed) {
	object.alpha = 0;
	STAGE.addChild(GRAY_BG);
	createjs.Tween.get(object)
		.wait(wait_time)
		.to({alpha:dest_alpha}, fade_speed)
		.call(after_fade);
}

function fade_out(object, wait_time, after_fade, fade_speed, is_shrink) {
    if (typeof(is_shrink)==='undefined') is_shrink = false;
    if (is_shrink) {
        createjs.Tween.get(object)
            .wait(wait_time)
            .to({alpha:0, width:0, height:0}, fade_speed)
            .call(after_fade);
    }else {
        createjs.Tween.get(object)
            .wait(wait_time)
            .to({alpha:0}, fade_speed)
            .call(after_fade);
    }

}

function appear_effect(object, dest_width, dest_height) {
	object.alpha = 0;
	object.width = 0;
	object.height = 0;
    object.is_shrink = true;
    object.remove_func = remove_with_fade;
	STAGE.addChild(object);
	createjs.Tween.get(object)
		.to({alpha:1, width:dest_width, height: dest_height}, APPEAR_SPEED)
		.call();
	//, createjs.Ease.cubicIn
}

function side_disappear(object) {
    var drift_x, drift_y;
    var speed = 100;
    var drift = 20;
    switch(object.direction) {
        case "up":
            drift_x = 0;
            drift_y = -1 *drift;
            break;
        case "down":
            drift_x = 0;
            drift_y = drift;
            break;
        case "left":
            drift_x = -1 * drift;
            drift_y = 0;
            break;
        case "right":
            drift_x = drift;
            drift_y = 0;
            break;
    }

    function remover(event) {
        remove_from_stage_object(event.target);
    }

    createjs.Tween.get(object)
        .to({alpha:0, x:object.position.x - drift_x, y: object.position.y - drift_y}, speed, createjs.Ease.cubicIn)
        .call(remover);
}

function side_appear_effect(object, direction, drift, parent) {
    var drift_x, drift_y;
    if (typeof(drift)==='undefined') drift = 20;
    if (typeof(parent)==='undefined') parent = STAGE;
    var speed = 300;
    switch(direction) {
        case "up":
            drift_x = 0;
            drift_y = drift;
            break;
        case "down":
            drift_x = 0;
            drift_y = -1 * drift;
            break;
        case "left":
            drift_x = drift;
            drift_y = 0;
            break;
        case "right":
            drift_x = -1 * drift;
            drift_y = 0;
            break;
    }
    var original_x = object.position.x;
    var original_y = object.position.y;
    object.position.x += drift_x;
    object.position.y += drift_y;
    object.alpha = 0;
    object.direction = direction;
    object.remove_func = side_disappear;
    parent.addChild(object);
    createjs.Tween.get(object)
        .to({alpha:1, x:original_x, y: original_y}, speed, createjs.Ease.cubicIn)
        .call();
    //, createjs.Ease.cubicIn
}

function remove_on_any_click() {
	var to_remove = [];
	var remove_names = [];
	var array_length = STAGE.children.length;
	for (var i = 0; i < array_length; i++) {
		if (STAGE.children[i].remove_on_obj_click == true) {
			to_remove.push(STAGE.children[i]);
		}
	}
	
	for (var i = 0; i < to_remove.length; i++) {
        if (!(typeof(to_remove[i].remove_func)==='undefined')){
            to_remove[i].remove_func(to_remove[i]);
        } else {
            remove_from_stage_object(to_remove[i]);
        }
		if (to_remove[i].name != null) {
			remove_names.push(to_remove[i].name);
		}
	}
}

function global_click_event(data) {
	remove_on_any_click();
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

function distance(a, b) {
	return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function clear_board() {
	var to_remove = [];
	for (var i = 0; i < STAGE.children.length; i ++) {
		if (STAGE.children[i].not_remove_when_cleared != true) {
			to_remove.push(STAGE.children[i]);
		}
	}
	
	for (var i = 0; i < to_remove.length; i++) {
		STAGE.removeChild(to_remove[i]);
	}
	
	DISPLAYED_ELEMENT = []

	add_start_code();
}

function remove_with_fade(obj) {
    function actual_remove(obj) {
        remove_from_stage_object(obj.target);
    }
    var is_shrink = true;
    if (typeof(obj.is_shrink)==='undefined'){
        is_shrink = false;
    }
    fade_out(obj, 0, actual_remove, 100, is_shrink);
}

function bg_clicked(data) {
	var to_remove = [];
	var remove_names = [];
	var array_length = STAGE.children.length;
	for (var i = 0; i < array_length; i++) {
		if (STAGE.children[i].remove_on_bg_click == true) {
			to_remove.push(STAGE.children[i]);
		}
	}

	for (var i = 0; i < to_remove.length; i++) {
        if (!(typeof(to_remove[i].remove_func)==='undefined')){
            to_remove[i].remove_func(to_remove[i]);
        } else {
            remove_from_stage_object(to_remove[i]);
        }
		if (to_remove[i].name != null) {
			remove_names.push(to_remove[i].name);
		}
	}

    if (data != null) {
        data.stopPropagation();
        var event = new CustomEvent('back_ground_click', {'detail': remove_names});
        document.dispatchEvent(event);
    }
}

function press_animation(object) {
    var counter = 3;
    var time = 500;
    function press_off_animation_inner(param_counter, object) {
        display_not_pressed(object);
        param_counter --;
        if (param_counter != 0 ) {
            setTimeout(press_on_animation_inner, time, param_counter, object);
        }
    }
    function press_on_animation_inner(param_counter, object) {
        display_pressed(object);
        setTimeout(press_off_animation_inner, time, param_counter, object);
    }

    setTimeout(press_on_animation_inner, time, counter, object);
}

function display_pressed(object) {
    object.texture = object.pressed_texture;
}

function display_not_pressed(object) {
    object.texture = object.usual_texture;
}

function object_press(event) {
    display_pressed(event.target);
}

function object_release(event) {
    display_not_pressed(event.target);
}

function get_pressed_file_name(file_name) {
	return file_name.substring(0, file_name.length - 4) + "_pressed.png";
}

function create_pressable_object(image_name) {
	var object = PIXI.Sprite.fromImage(image_name);
	var pressed_texture = PIXI.Texture.fromImage(get_pressed_file_name(image_name));
	object.pressed_texture = pressed_texture;
	object.usual_texture = object.texture;
	object// events for drag start
		.on('mousedown', object_press)
		.on('touchstart', object_press)
		// events for drag end
		.on('mouseup', object_release)
		.on('mouseupoutside', object_release)
		.on('touchend', object_release)
		.on('touchendoutside', object_release);
	return object;
}

var GRAY_BG_ALPHA = 0.35;
var APPEAR_SPEED = 120;

var GRAY_BG = PIXI.Sprite.fromImage("images/general/gray_bg.png");
GRAY_BG.interactive = true;
GRAY_BG.alpha = 0.23;
GRAY_BG.remove_on_bg_click = true;
GRAY_BG.click = GRAY_BG.tap = bg_clicked;