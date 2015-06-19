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

function ImagePosition(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width || 50;
	this.height = height || 50;
}

function gray_shadow() {
	STAGE.addChild(GRAY_BG);
}

function remove_gray_shadow() {
	STAGE.removeChild(GRAY_BG);
}

function move_object(object, dest) {
	new TWEEN.Tween(object)
                 .to({x:dest.x, y:dest.y}, 600)
                 .easing(TWEEN.Easing.Linear.None)
            .start();
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
		remove_from_stage_object(to_remove[i]);
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