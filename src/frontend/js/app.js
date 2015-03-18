window.AppView = Backbone.View.extend({
	el : $("#mainPage"),

	events : {
		"click #submit_to_server" : "execute_command"
    },
    
	initialize : function() {
        var users = new window.Users;
        users.fetch({
            success:function (data) {
                console.log("Fetched users");
                console.log(data);
                if (data.length == 0) {
                    console.log("No users found openning sign up");
                    $("#signupModal").modal('show');
                }
            },
            error:function (data) {
                console.log("Failed fetching users");
                console.log(data);
            }
        });
	},
	
	execute_command : function() {
		new ExecutionCode({name: "test", code: Blockly.Python.workspaceToCode()}).save();
		console.log("Executing command");
	},

	render : function() {
		console.log("in render");
	}
});

window.app = new window.AppView();
