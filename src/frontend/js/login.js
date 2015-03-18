/**
 * Created by USER on 3/7/2015.
 */
window.LoginView = Backbone.View.extend({
    el : $("#loginPage"),

    initialize : function() {
        operations = new window.DriverOperations;
    },

    render : function() {
        console.log("in render");
    }
});

window.app = new window.AppView();

