function scrollHandler(){
    var pixelsScrolled = $(window).scrollTop();

    //console.log($("#container").offset().top);

    if(pixelsScrolled >= ($("header").height() - $("nav").height())){
        $("nav").addClass('fixed_background');
    }else{
        $("nav").removeClass('fixed_background');
    }
}

function resize(){
   if($("#alarm-map").length){
       $("#alarm-map").each(function(){
           $(this).height(
               $(this).width() * 10/16
           )
       });
   }
}

function setUserInfo(){
    var user = parent.User;

    $("#contact-name").val(
        user.getFullName()
    );
    $("#profile-firstname").val(
        user.firstname
    );
    $("#profile-lastname").val(
        user.lastname
    );
    $("#contact-email, #profile-email").val(
        user.email
    );
}

$(document).ready(function(){
    resize();


    $("#testParentFunction").click(function(){
        parent.testMeTestMeTestMeOooh();
    });

    $("#card-reached-button button").click(function(){
        $("#card-reached-button").addClass('hidden');
        $("#card-done-button").removeClass('hidden');
    });

    $("#navToggle, #navClose").on('click', toggleMenu);

    /**/
    $("body").click(function(e){
        //console.log('body click');
        if(
            $(e.target).attr('id')=='leftContainer'
            || $(e.target).parents('#leftContainer').length
            || $(e.target).attr('id')=='navToggle'
            || $(e.target).parents('#navToggle').length
        ){
            //console.log($(e.target).attr('id'));
            //console.log($(e.target).parents('#leftContainer'));
        }else{
            hideMenu();
        }
    });
    /**/

    $('a').on('click',anchorHandler);

    var hash = window.location.hash.substring(1);
    setPage(hash);

    setUserInfo();

    $(".doNotDisturb").click(function(){
        if($('.on', this).css('display')=='block'){
            $('.doNotDisturb .on').hide();
            $('.doNotDisturb .off').show();
        }else{
            $('.doNotDisturb .off').hide();
            $('.doNotDisturb .on').show();
        }
    })
});

$(window).resize(function(){
    resize();
});

$(window).scroll(function(){
    scrollHandler();
});