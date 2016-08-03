function resizeFrame(){
    $(".full-height").height(
        $(window).height()
    );
    /*

    $("#accept-button").width(
        $("#accept-slide-container").width() - 20
    );
    console.log(
        $("#accept-button").innerWidth()
    );
    /**/
}

var accepted = false;

$(document).ready(function(){
    resizeFrame();

    $("#accept-button").draggable({
        axis: "x",
        containment: $("#accept-slide-container"),
        drag: function( event, ui ) {

            if(!accepted){
                var left = ui.position.left;

                //console.log('left: ' + left);
                //console.log('checkpoint: ' + ($("#accept-slide-container").width() - $("#accept-button").width() - 30));

                if(left>($("#accept-slide-container").width() - $("#accept-button").width() - 30)){
                    accepted = true;
                    parent.acceptCall();
                }
            }

        }
    });
});

$(window).resize(function(){
    resizeFrame();
});