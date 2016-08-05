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

function showAvailabilityTimes(){
    $('.availability-day .off').hide();
    $('.availability-day .on').show();
    $(".availability-starttime-container, .availability-endtime-container").show();
}

function hideAvailabilityTimes(){
    $('.availability-day .on').hide();
    $('.availability-day .off').show();
    $(".availability-starttime-container, .availability-endtime-container").hide();
}

$(document).ready(function(){
    resize();

    $("#card-reached-button button").click(function(){
        $("#card-reached-button").addClass('hidden');
        $("#card-done-button").removeClass('hidden');

        parent.API.request(
            'reachedCall',
            {
                call:sessionStorage.callUID
            },
            function(response){},
            function(response){}
        );
    });

    $("#card-done-button button").click(function(){
        $("#card-done-button .card-date").addClass('hidden');
        $("#card-done-button .card-body").html(
            '<span style="font-weight:600;"><i class="fa fa-check fa-fw"></i> Herzlichen Dank für Ihre Einsatz.</span>'
        );

        $("#card-call-button, #card-cancel-button").hide();

        parent.API.request(
            'finishedCall',
            {
                call:sessionStorage.callUID
            },
            function(response){},
            function(response){}
        );
    });

    $("#card-call-button button").click(function(){
        alert(
            "Ein Disponent wird Sie in kurzer Zeit anrufen."
        );
    });

    $("#card-cancel-button button").click(function(){
        if(confirm(
                "Sind Sie sich sicher, dass Sie den Einsatz abbrechen möchten?"
            )){
            setPage(
                'neuigkeiten'
            );
        }
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
    });

    $(".availability-day").click(function(){
        if($('.on', this).css('display')=='block'){
            hideAvailabilityTimes();
        }else{
            showAvailabilityTimes();
        }
    });

    $(".day-times").click(function(){
        var times = $(this);
        if($(times).attr('data-available')=='false') {
            hideAvailabilityTimes();
        }else{
            showAvailabilityTimes();
            $('#availability-starttime').val(
                $(times).attr('data-start')
            );
            $('#availability-endtime').val(
                $(times).attr('data-end')
            );
        }

        var row = $(this).parent();
        var day = $(row).attr('data-day');
        $("#save-availability").attr('data-day', day);

        var dayName = $('.day-name', row).text();

        var setAvailabilityCard = $("#set-availability-day");
        $('.card-title', setAvailabilityCard).html(
            dayName
        );

        $(setAvailabilityCard).show();
        $("#availability-table-container").hide();
    });

    $("#save-availability").click(function(e){
        e.preventDefault();

        var day = $(this).attr('data-day');
        var row = $("#availability-table tr[data-day=" + day +"]");

        $("#set-availability-day").hide();
        $("#availability-table-container").show();

        if($('#set-availability-day .on').css('display')=='block'){
            $('.day-times', row).attr('data-available', 'true');
            var start = $('#availability-starttime').val();
            var end = $("#availability-endtime").val();
            $('.day-times', row).attr('data-start', start);
            $('.day-times', row).attr('data-end', end);
            $('.day-times', row).html(
                start + ' - ' + end + ' <i class="fa fa-angle-right fa-fw"></i>'
            );
        }else{
            $('.day-times', row).attr('data-available', 'false');
            $('.day-times', row).html(
                'Nicht verfügbar <i class="fa fa-angle-right fa-fw"></i>'
            );
        }

        return false;
    });

    $('#save-profile').click(function(){
        var button = this;
        $(this).prop('disabled',true);
        $(this).html(
            '<i class="fa fa-spinner fa-pulse fa-fw"></i> Speichern...'
        );
        setTimeout(function(){
            $(button).prop('disabled',false);
            $(button).html(
                '<i class="fa fa-save fa-fw"></i> Speichern'
            );
            $("#profile-saved").show();
            setTimeout(function(){
                $("#profile-saved").fadeOut(1500);
            },1500);
        },1500);
    });

    $("#send-form").click(function(){
        $('input, button, textarea', $("#formular")).prop('disabled',true);
        $(this).html(
            '<i class="fa fa-spinner fa-pulse fa-fw"></i> Senden...'
        );
        setTimeout(function(){
            $("#formular").hide(500);
            $("#form-sent").show(500);
        },1500);
    })
});

$(window).resize(function(){
    resize();
});

$(window).scroll(function(){
    scrollHandler();
});