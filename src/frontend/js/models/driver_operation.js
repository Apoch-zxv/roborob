window.OperationArg = Backbone.Model.extend({
	defaults : function() {
		return {
			name : "nothing",
			type : "nothing"
		};
	},
});

window.DriverOpearionArgs = Backbone.Collection.extend({
	model : OperationArg
});

window.DriverOperation = Backbone.Model.extend({
	defaults : function() {
		return {
			name : "nothing",
			args : new DriverOpearionArgs()
		};
	},
});

window.DriverOperations = Backbone.Collection.extend({
	model : DriverOperation,
	
	url : "api/operations"
});

window.DriverDescription = Backbone.Model.extend({
	defaults : function() {
		return {
			name : "nothing",
			operations : new DriverOperations()
		};
	},
});

window.DriverDescriptions = Backbone.Collection.extend({
	model : DriverDescription,
	
	url : "api/operations"
});
