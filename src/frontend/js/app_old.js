window.AppView = Backbone.View.extend({
	el : $("#mainPage"),

	events : {
		"click #submit_to_server" : "execute_command"
    },
    
	initialize : function() {
		operations = new window.DriverOperations;
		operations.fetch({
            success:function (data) {
            	console.log("Operations fetched successfully");
            	console.log(data);

            	$('#generated_toolbox').html(new ToolboxListView({model: data}).render().el);

            	Blockly.inject(document.getElementById('blocklyDiv'), {
					toolbox : document.getElementById('toolbox')
				});
            },
            error:function (data) {
            	console.log("Operations fetch failed");
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
