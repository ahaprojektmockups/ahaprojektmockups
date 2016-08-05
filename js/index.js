function unexpectedError(){
    alert("An unexpected error occured. Please restart the app and try again.");
}

function consoleInfo(data) {
    console.log(data);
}

function consoleLog(data) {
    console.log(data);
}

function consoleError(data) {
    console.log(data);
}

var API = {
    request: function(request, params, callbackSuccess, callbackError, form){
        var that = this;

        consoleInfo("API request: " + request);
        consoleLog(params);

        $.ajax({
            url:'http://aha.dielissen.eu/',
            type:"POST",
            data:{
                request:request,
                params:params
            },
            success:function(response){
                consoleInfo("API response: " + request);
                consoleLog(response);
                callbackSuccess(response);
            },
            error:function(response){
                that.handleError(
                    response,
                    request
                );
                consoleError(response);
                if(callbackError){
                    callbackError(response);
                }
            }
        })
    },

    handleError: function(response, request){
        consoleInfo("API error: " + request);
        consoleError(
            response.responseText
        );
    },

    showErrorMessage: function(form, message){
        if(form){
            $('.error-message .message', form).html('<i class="fa fa-warning fa-fw"></i> ' + message);
            $('.error-message', form).show();
        }
    },

    hideErrorMessage: function(form){
        if(form){
            $('.error-message', form).hide();
        }
    },

    showSuccess: function(form, timeout){
        if(form){
            if(!timeout){
                timeout = 1000;
            }
            $('.success-button', form).show();
            setTimeout(function(){
                $('.success-button', form).fadeOut(750);
            },timeout);
        }
    }
};

var User = {
    id: false,
    uid: false,
    firstname: '',
    lastname: '',
    email: '',
    male: '',
    setData: function(data) {
        this.id = data.id;
        this.uid = data.uid;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.email = data.email;
        this.male = data.male;
    },
    getFullName: function(){
        return this.firstname + ' ' + this.lastname;
    }
};

function resizeFrame(){
    $(".full-height").height(
        $(window).height()
    );
}

function setFrame(src){
    $('#app-frame').removeAttr(
        'src'
    );
    $('#app-frame').attr(
        'src',
        src
    );

    if(src=='call.html'){
        navigator.vibrate(
            [1500,750,1500,750,1500,750,1500,750,1500,750,1500,750,1500,750,1500,750,1500,750,1500,750,1500,750,1500,750,1500,750,1500,750,1500,750,1500,750,1500,750,1500,750]
        );
    }
}

function checkForCalls(){
    API.request(
        'checkForCalls',
        {
            session:sessionStorage.sessionUID
        },
        function(response){
            if(response.success){
                if(response.call){

                    setFrame('call.html');
                    sessionStorage.callUID = response.call.uid;

                }else{
                    setTimeout(function(){
                        checkForCalls();
                    },5000);
                }
            }else{
                //unexpectedError();
                setTimeout(function(){
                    checkForCalls();
                },5000);
            }
        },
        function(response){
            //unexpectedError();
            setTimeout(function(){
                checkForCalls();
            },5000);
        }
    );
}

function setUser(userData){
    User.setData(userData);

    localStorage.setItem('user', User.uid);

    API.request(
        'startSession',
        {
            device:localStorage.device,
            user:localStorage.user
        },
        function(response){
            if(response.success){
                sessionStorage.sessionUID = response.uid;
                checkForCalls();
            }else{
                unexpectedError();
            }
        },
        function(response){
            unexpectedError();
        }
    );

    console.log(localStorage.user);
}

function unsetUser(){
    localStorage.removeItem('user');
    API.request(
        'CloseSession',
        {
            session:sessionStorage.sessionUID
        },
        function(response){

        },
        function(response){

        }
    );
}

function incorrectCredentials(){
    alert("Benutzername und Passwort stimmen nicht überein");
}

function login(username, password){

    API.request(
        'SignIn',
        {
            username: username,
            password: password
        },
        function(response){
            if(response.success){
                setUser(
                    response.user
                );
                setFrame(
                    'app.html'
                );
            }else{
                incorrectCredentials();
            }

        },
        function(response){
            incorrectCredentials();
        }
    );

    /*
    setUser( 'DUMMYID' );

    setFrame('app.html#alarm');
    //setFrame('app.html#alarm');
    /**/
}

function logout(){
    unsetUser();
    setFrame('login.html');
}


function acceptCall(){
    navigator.vibrate(0);
    API.request(
        'acceptCall',
        {
            call:sessionStorage.callUID
        },
        function(response){
            if(response.success){
                setFrame('app.html#alarm');
            }else{
                unexpectedError();
            }
        },
        function(response){
            unexpectedError();
        }
    );
}



function setAppOrLogin(){
    console.log("User: " + localStorage.user);

    if(localStorage.user && localStorage.user!='false'){
        API.request(
            'getUser',
            {
                uid:localStorage.user
            },
            function(response){
                if(response.success){
                    setUser(response.user);
                    setFrame(
                        'app.html'
                    );
                }else{
                    setFrame(
                        'login.html'
                    );
                }
            },
            function(response){
                setFrame(
                    'login.html'
                );
            }
        );
    }else{
        setFrame(
            'login.html'
        );
    }

    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
        appwindow.hideMenu();
    }, false );
}



/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        $('body').append(
            '<iframe name="appwindow" class="full-height" id="app-frame" />'
        );

        /**/
        resizeFrame();
        $(window).resize(function(){
            resizeFrame();
        });

        //localStorage.removeItem('user');
        console.log("Device: " + localStorage.device);

        if(!localStorage.device || localStorage.device=='false'){
            API.request(
                'RegisterDevice',
                {},
                function(response){
                    if(response.success){
                        localStorage.setItem('device', response.uid);
                        setAppOrLogin();
                    }else{
                        unexpectedError();
                    }
                },
                function(response){
                    unexpectedError();
                }
            );
        }else{
            setAppOrLogin();
        }

    }
};