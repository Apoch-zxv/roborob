window.DebugCode = Backbone.Model.extend({
    url : "api/debug",
    defaults : function() {
        return {
            code : "nothing"
        };
    }
});

window.DebugView = Backbone.View.extend({
	el : $("#mainPage"),

	events : {
		"click #execute" : "execute_command"
    },
    
	initialize : function() {
	},
	
	execute_command : function() {
		new DebugCode({code: $("#code_area").val()}).save();
		console.log("Executing command changed");
	},

	render : function() {
		console.log("in render");
	}
});

window.app = new window.DebugView();
