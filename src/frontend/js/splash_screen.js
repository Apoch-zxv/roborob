function init_splash_screen() {
    init_choose_screen();
	var bg = PIXI.Sprite.fromImage("images/splash_screen/white_bg.png");
	var logo = PIXI.Sprite.fromImage("images/splash_screen/logo.png");
	logo.position.x = 436;
	logo.position.y = 242;
	bg.addChild(logo);
	STAGE.addChild(bg);

    setTimeout(make_choose_window_visible, 2000);

    function after_fade() {
        STAGE.removeChild(bg);
        show_choose_robot();
    }

	fade_out(bg, 5000, after_fade, 400);
}
