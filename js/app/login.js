function resizeFrame(){
    $(".full-height").height(
        $(window).height()
    );
}

/**/
$(document).ready(function(){
    resizeFrame();

    $("#login").submit(function(e){
        e.preventDefault();
        parent.login(
            $("#username").val().trim(),
            $("#password").val()
        );
        return false;
    });
});

$(window).resize(function(){
    resizeFrame();
});
/**/