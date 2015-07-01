var ROBOT_SCREEN_BG = null;

function add_dragging_events_child(object) {
	object// events for drag start
        .on('mousedown', drag_start_child)
        .on('touchstart', drag_start_child)
        // events for drag end
        .on('mouseup', drag_end_child)
        .on('mouseupoutside', drag_end_child)
        .on('touchend', drag_end_child)
        .on('touchendoutside', drag_end_child)
        // events for drag move
        .on('mousemove', drag_move_child)
        .on('touchmove', drag_move_child);
}

function add_dragging_events_parent(object) {
	object// events for drag start
        .on('mousedown', drag_start)
        .on('touchstart', drag_start)
        // events for drag end
        .on('mouseup', drag_end)
        .on('mouseupoutside', drag_end)
        .on('touchend', drag_end)
        .on('touchendoutside', drag_end)
        // events for drag move
        .on('mousemove', drag_move)
        .on('touchmove', drag_move);
}

function display_robot(parent, image_name, x, y, is_pressable) {
	var single_robot = null;
    if (is_pressable) {
        single_robot = create_pressable_object(image_name);
    } else {
        single_robot = PIXI.Sprite.fromImage(image_name);
    }
	single_robot.anchor.x = 0;
	single_robot.anchor.y = 1;
	single_robot.position.x = x;
	single_robot.position.y = y;
	single_robot.move_on_swipe = true;
	parent.addChild(single_robot);
	return single_robot;
}

function display_additional_options(parent, x, y) {
	var single_robot = PIXI.Sprite.fromImage("images/robot_select/robot_screen_buttons.png");
	single_robot.position.x = x;
	single_robot.position.y = y;
    side_appear_effect(single_robot, "up", 50, parent);
	return single_robot;
}

function open_application() {
	STAGE.removeChild(ROBOT_SCREEN_BG);
    show_draw_board();
}

function start_wifi_animation(cur_x) {
    var textures = [], i;
    for (i = 0; i < 30; i++) {
        var texture = PIXI.Texture.fromImage("images/robot_select/Comp 1_{0}.png".format(i));
        textures.push(texture);
    }

    var wifi_ruler = new PIXI.extras.MovieClip(textures);
    wifi_ruler.position.x = cur_x + 149;
    wifi_ruler.position.y = 62;
    wifi_ruler.move_on_swipe = true;
    wifi_ruler.animationSpeed = 0.5;
    wifi_ruler.play();
    ROBOT_SCREEN_BG.addChild(wifi_ruler);
}

function show_choose_robot() {
    setTimeout(function(){
        display_additional_options(ROBOT_SCREEN_BG, 40, 694);
    }, 300);
}

function make_choose_window_visible() {
    ROBOT_SCREEN_BG.visible = true;
    setTimeout(draw_board_make_visible, 1000);


}

function init_choose_screen() {
    init_draw_board();

	ROBOT_SCREEN_BG = PIXI.Sprite.fromImage("images/robot_select/robots_screen_BG.png");
	ROBOT_SCREEN_BG.interactive = true;
    ROBOT_SCREEN_BG.visible = false;
	STAGE.addChild(ROBOT_SCREEN_BG);
	
	add_dragging_events_parent(ROBOT_SCREEN_BG);
	
	var x_dist = 270;
	var x_start = 90;
	var cur_x = x_start;
	var cur_y = 546;
	var rainbow = display_robot(ROBOT_SCREEN_BG, "images/robot_select/rainbow_robot.png", cur_x, cur_y, false);
	cur_x += 315;
	var splash = display_robot(ROBOT_SCREEN_BG, "images/robot_select/splash_robot.png", cur_x, cur_y, false);
	cur_x += 352;
	var rubber = display_robot(ROBOT_SCREEN_BG, "images/robot_select/rubber_robot.png", cur_x, cur_y, false);
	cur_x += 352;
	var scrawl = display_robot(ROBOT_SCREEN_BG, "images/robot_select/scrawl_robot.png", cur_x, cur_y, false);
	cur_x += 350;
	var ruler = display_robot(ROBOT_SCREEN_BG, "images/robot_select/ruler_robot_buttton.png", cur_x, cur_y, true);

    //var wifi_ruler = PIXI.Sprite.fromImage("images/robot_select/wifi_icon.png");
    //wifi_ruler.position.x = cur_x + 149;
    //wifi_ruler.position.y = 62;
    //wifi_ruler.move_on_swipe = true;
    //ROBOT_SCREEN_BG.addChild(wifi_ruler);
    start_wifi_animation(cur_x);

    var name_ruler = PIXI.Sprite.fromImage("images/robot_select/ruler_name.png");
    name_ruler.position.x = cur_x + 143;
    name_ruler.position.y = 600;
    name_ruler.move_on_swipe = true;
    ROBOT_SCREEN_BG.addChild(name_ruler);

	ruler.interactive = true;
	//ruler.buttonMode = true;
	ruler.click = ruler.tap = open_application;

}

function drag_start_child(event)
{
	event.target = event.target.parent;
	drag_start(event);
}

function drag_end_child()
{
	this.drag_end();
}

function drag_move_child()
{
	this.drag_move();
}

function drag_start(event)
{
	this.swiping = true;
	this.container = event.target;
	this.data = event.data;
	this.last_position = this.data.global.x;
	this.current_position = this.data.global.x;
}

function drag_end()
{
	this.swiping = false;
}

function drag_move()
{
	if (this.swiping) {
		var left_range = 25;
		var right_range = 950;
		
		this.current_position = this.data.global.x;
		var diff = this.current_position - this.last_position;
		var array_length = ROBOT_SCREEN_BG.children.length;
		var right_most = 0;
		var left_most = 1000;
		for (var i = 0; i < array_length; i++) {
			var child = ROBOT_SCREEN_BG.children[i];
			if (child.move_on_swipe) {
				if (child.position.x > right_most) {
					right_most = child.position.x;
				}
				
				if (child.position.x < left_most) {
					left_most = child.position.x;
				}
			}
		}
		
		if (((left_most > left_range) && (diff > 0)) || ((right_most <= right_range) && (diff < 0))) {
			return;
		}
		
		for (var i = 0; i < array_length; i++) {
			var child = ROBOT_SCREEN_BG.children[i];
			if (child.move_on_swipe) {
				child.position.x += diff;
			}
		}
		
		this.last_position = this.current_position;
	}
}
