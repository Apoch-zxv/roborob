function init_splash_screen() {
	var bg = PIXI.Sprite.fromImage("images/splash_screen/white_bg.png");
	var logo = PIXI.Sprite.fromImage("images/splash_screen/logo.png");
	logo.position.x = 400;
	logo.position.y = 300;
	bg.addChild(logo);
	STAGE.addChild(bg);
	
	function after_fade() {
		STAGE.removeChild(bg);
		init_choose_screen();
	}
	
	fade_out(bg, 5000, after_fade, 150);
}
