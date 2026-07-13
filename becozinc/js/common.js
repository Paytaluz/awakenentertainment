// menu
$(function() {
    $(".arrow-up").hide();
    $(".sp-nav").hide();
    $(".menu").click(function(){
        $(".sp-nav").slideToggle("slow");
        $(this).find(".arrow-up, .arrow-down").toggle();
    });
});





