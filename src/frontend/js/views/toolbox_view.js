window.ToolboxBlockView = Backbone.View.extend({

	tagName : "block", // Not required since 'div' is the default if no el or tagName specified

	initialize : function() {
		console.log("In ToolboxBlockView initialize");
		console.log(this.model);

		_.bindAll(this, 'attributes');

		that = this;
		Blockly.Blocks[this.model.inner_name] = {
			init : function() {
				this.appendDummyInput().appendField(that.model.name);
				this.setHelpUrl('http://www.example.com/');
				_.each(that.model.args, function(argument) {
					this.appendValueInput(argument.name).setCheck("null").appendField(argument.name);
				}, this);
				this.setPreviousStatement(true);
				this.setNextStatement(true);
				this.setTooltip('');
			}
		};

		Blockly.Python[this.model.inner_name] = function(block) {
			var all_args = "";
			_.each(that.model.args, function(argument) {
				all_args = all_args.concat(Blockly.Python.valueToCode(block, argument.name, Blockly.Python.ORDER_ATOMIC));
			}, this);
			// TODO: Assemble Python into code variable.
			var code = that.model.inner_name + '(' + all_args + ')\n';
			return code;
		};
	},

	attributes : function() {
		// Return model data
		return {
			type : this.model.inner_name,
		};
	},

	render : function() {
		console.log("In ToolboxBlockView render");
		return this;
	}
});

