function showMenu(){
    $("#leftContainer").animate({
        left:0
    },500);
}

function hideMenu(){
    $("#leftContainer").animate({
        left:-($("#leftContainer").width() + 15)
    },500);
}

function toggleMenu(){
    if($("#leftContainer").css('left')==0 || $("#leftContainer").css('left')=='0px'){
        hideMenu();
    }else{
        showMenu();
    }
}

function setPage(page){
    if(!page || page==""){
        page = 'neuigkeiten';
        //page = 'verfuegbarkeit';
    }

    $('#menu li').removeClass('active');
    $(".page").addClass('hidden');

    if($("#page-" + page).length){
        $("#page-" + page).removeClass('hidden');
        $("#menu a[href='#"+page+"']").parent().addClass('active');

        var pagetitle = $("#page-" + page).attr('data-pagetitle');
        $("#header_title").html(
            pagetitle
        );

        if(page=='neuigkeiten'){
            $('nav').removeClass('fixed_background');
        }else{
            $('nav').addClass('fixed_background');
        }
    }

    hideMenu();
    $("html, body").animate({
        scrollTop: 0
    },500);
    resize();

    if(page=='alarm'){
        initMap()
    }
}

function anchorHandler(e){
    var anchor = this;
    if($(anchor).attr("id")=='menu-sign-out'){
        if(confirm(
                "Sind Sie sich sicher, dass Sie sich abmelden möchten?"
            )){
            parent.logout();
        }
    }else{
        var uri = $(anchor).attr('href').replace('#','');

        setPage(uri);
    }
}