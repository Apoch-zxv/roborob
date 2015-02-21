window.ToolboxCategoryView = Backbone.View.extend({

	tagName : "category", // Not required since 'div' is the default if no el or tagName specified

	initialize : function() {
		console.log("In ToolboxCategoryView initialize");
	},
	
	attributes : function() {
		// Return model data
		return {
			name : this.model.get('name'),
		};
	},

	render : function() {
		console.log("In ToolboxCategoryView render");
		_.each(this.model.get("operations"), function(operation) {
			$(this.el).append(new window.ToolboxBlockView({
				model : operation
			}).render().el);
		}, this);
		return this;
	}
});

window.ToolboxListView = Backbone.View.extend({

	tagName : "xml", // Not required since 'div' is the default if no el or tagName specified

	attributes : function() {
		// Return model data
		return {
			id : "toolbox",
		};
	},

	initialize : function() {
		console.log("In ToolboxListView initialize");
	},

	addDefaults : function() {
		default_category = ["controls_if", "controls_repeat_ext", "math_number", "math_arithmetic", "text", "text_print"];
		default_category_name_prefix = "<category name=\"Helpers\">";
		default_category_name_postix = "</category>";
		
		full_struct = "";
		full_struct += default_category_name_prefix;
		_.each(default_category, function(category_name) {
			full_struct += "<block type=\"" + category_name + "\"></block>";
		}, this);
		full_struct += default_category_name_postix;
		$(this.el).append(full_struct);
	},

	render : function() {
		console.log("In ToolboxListView render");
		$(this.el).empty();
		this.addDefaults();
		_.each(this.model.models, function(driver) {
			$(this.el).append(new ToolboxCategoryView({
				model : driver
			}).render().el);
		}, this);
		return this;
	}
}); 