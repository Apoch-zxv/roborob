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
	global_click_event();
	var target = data.target;
	var initiator = target.initiator;
	display_on_initiator(target.initiator, target.number.text);
	remove_gray_shadow();
	STAGE.removeChild(target.parent);
	
	var event = new CustomEvent('angle_closed');
	document.dispatchEvent(event);
}

function open_angle(initiator) {
	gray_shadow();
	
	var angle = PIXI.Sprite.fromImage(decoration_component["angle_bg"].image_name);
	angle.position.x = 450;
	angle.position.y = 150;
	angle.interactive = true;
	angle.remove_on_bg_click = true;
	angle.name = "angle";
	
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
	
	var middle_circle = PIXI.Sprite.fromImage("images/angle/midddle_angles_circle.png");
	middle_circle.position.x = circle.width / 2;
	middle_circle.position.y = circle.height / 2;
	middle_circle.interactive = true;
	middle_circle.anchor = new PIXI.Point(0.5, 0.5);
	needle_rectangle.addChild(middle_circle);
	
	angle.addChild(needle_rectangle);
	
	var number = new PIXI.extras.BitmapText('0', {font: '35px Fregat', align: "center"});
	number.tint = 0xEE7842;
	number.position.x = 125;
	number.position.y = 485;
	circle.number = number;
	angle.addChild(number);
	
	var submit_angle = PIXI.Sprite.fromImage("images/angle/angels_window_ok_button.png");
	submit_angle.position.x = number.position.x + 80;
	submit_angle.position.y = 485;
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
