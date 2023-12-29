//label文字変更
$("#stop").on("click", function(){
	$("#stopName").text("🎍もう一回！🎍");
  });


$(function(){

	//マウスカーソルの変更
	//=================================
	//カーソル要素
	var cursor=$("#cursor");
	//mousemoveイベントでカーソル要素を移動
	$(document).on("mousemove",function(e){
		//マウス位置を取得するプロパティ
		var x=e.clientX;
		var y=e.clientY;
		//カーソル要素のcssを書き換え
		cursor.css({
			"opacity":"1",
			"top":y+"px",
			"left":x+"px"
		});
	});

	//aタグホバー
	$("label").on({
		"mouseenter": function() {
			//activeクラス付与
			cursor.addClass("active");
		},
		"mouseleave": function() {
			cursor.removeClass("active");
		}
	});
});


//favicon
$(function() {
    const frameRate = 220; //フレームレート(ms)
    const $target = $('link[rel="icon"]');
    window.setInterval(function() {
        const favIcon = $target.attr('href');
        const altIcon = $target.attr('data-alt');
        $target.attr({ 'href': altIcon, 'data-alt': favIcon });
    }, frameRate);
});


