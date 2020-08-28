/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

// window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// Vue.component('example', require('./components/Example.vue'));

// const app = new Vue({
// el: '#app'
// });

/**
 * import socket io client
 */
const socket = require('socket.io-client')('http://localhost:9090');

/**
 * Init Component
 */
const $window = $(window);
const $loginPage = $('.login.page');
const $chatPage = $('.chat.page');
const $usernameInput = $('.usernameInput');
const $messages = $('.messages');
const $inputMessage = $('.inputMessage');
const $messagebox = $('.messagebox');
const $receiver = $('.receiver');



/**
 * Vars
 */
let username;
// let $currentInput = $usernameInput.focus();

/**
 * Keyboard Events
 */
$window.keydown(function (event) {

    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        // $currentInput.focus();
    }

    /**
     * When user press enter key
     */
    if (event.which === 13) {
        chat.handlePressEnter();
    }
});
$('#send').click(function (event) {
    event.preventDefault();
    chat.sendMessage();
});

/**
 * Chat Functionalities
 */
const chat = {

    handlePressEnter: () => {
        if (username === undefined) {
            chat.loginUser($usernameInput.val().trim());
        } else {
            if (chat.isValidInputMessage()) {
                chat.sendMessage($messagebox.val().trim());
            } else {
                alert('Please type message');
                chat.setInputFocus();
            }
        }

    },

    isValidInputMessage: () => $messagebox.val().length > 0 ? true : false,

    sendMessage: (message) => {
        // $currentInput.val('');
        // chat.setInputFocus();
        var phone = chat.checknumber($receiver.val().trim());
        var message=chat.checkmessage($messagebox.val().trim());

        // console.log($messagebox.val().trim());
        // console.log(message);
        if (!phone||!message) {
            if (!phone) {
                $('input[name="tel"]').parent('div').append('<p class="error" style="color: red">Le numero de telephone n\'est pas valide</p>');
                setTimeout(function (){
                    $(".error").remove();
                }, 2000);
            } else {
                $('input[name="tel"]').siblings('p').empty();
            }
            if (!message) {
                $('textarea[name="msg"]').parent('div').append('<p class="error" style="color: red">Le champ message est vide </p>');
                setTimeout(function (){
                    $(".error").remove();
                }, 2000);
            } else {
                $('textarea[name="msg"]').siblings('p').empty();
            }
        } else{

            const data = {
                // time: (new Date()).getTime(),
                id: '',
                receiver:$receiver.val().trim(),
                message: $messagebox.val().trim()


            };
            $receiver.val('');
            $messagebox.val('');

            $.ajax({
                type:'post',
                url:'messages',
                data:{
                    message:data.message,
                    receiver:data.receiver
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                async:false,
                success:function (response) {
                    // console.log(response);
                    if(response.toString()!='NO MESSAGES LEFT'){
                        data.id=response['id'];
                        socket.emit('chat-message', data);
                        // console.log(response.toString());
                        return response;
                    }else{
                        // $('textarea[name="msg"]').siblings('p').html('<p style="color: red">No messages left :( </p>');
                        $('textarea[name="msg"]').parent('div').append('<p id="error" style="color: red">No messages left :( </p>');
                        setTimeout(function (){
                            $("#error").remove();
                        }, 4000);
                    }

                },
                error:function (e) {
                    console.log(e);
                }
            });

            // $currentInput ='';

        }
    },

    loginUser: (user) => {
        $loginPage.fadeOut();
        $chatPage.show();
        username = user;
        chat.setInputFocus();
        socket.emit('user-join', username);
    },

    setInputFocus: () => {
        $currentInput = $messagebox.focus();
    },

    log: (message, options) => {
        const element = $('<li>').addClass('log').text(message);
        chat.addMessageElement(element, options);
    },

    addChatMessage: (data) => {
        //const $usernameElement = $('<span class="username"/>').text(data.user);
        const $receiverElement = $('<p>').text('To : '+data.receiver);
        const $messageBodyElement = $('<p>').text('Message : '+data.message);
        // const $messageElement = $('<li class="message"/>')
        const $messageElement = $(' <li class="messageBody list-group-item-warning">')
        // .data('username', data.user)
            .append($receiverElement, $messageBodyElement);

        chat.addMessageElement($messageElement);
    },
    refresh : (data) =>{
        $messages.html('');
        for (var i=0;i<data.length;i++){
            // console.log(data[i]['status']) ;
            const $receiverElement = $('<p>').text('To : '+data[i]['receiver']);
            const $messageBodyElement = $('<p>').text('Message : '+data[i]['message']);
            var $messageElement=''
            if(data[i]['status']==10){
                $messageElement = $(' <li class="messageBody list-group-item-warning">')
                    .append($receiverElement, $messageBodyElement);
            }else if(data[i]['status']==11){
                $messageElement = $(' <li class="messageBody list-group-item-danger">')
                    .append($receiverElement, $messageBodyElement);
            }
            else{
                $messageElement = $(' <li class="messageBody list-group-item-success">')
                    .append($receiverElement, $messageBodyElement);
            }
            chat.addMessageElement($messageElement);
        }
    },

    checkmessage : (message)=> {
        // if ((inputtxt.match(/^6|2\(?([5-9]{2})\)?[-. ]?\(?[0-9]{3}\)?[-. ]?\(?[0-9]{3}\)?$/))) {
        if (!message=='') {
            return true;
        } else {
            return false;
        }
    },
    checknumber : (receiver)=> {
        // if ((inputtxt.match(/^6|2\(?([5-9]{2})\)?[-. ]?\(?[0-9]{3}\)?[-. ]?\(?[0-9]{3}\)?$/))) {
        if ((receiver.match(/^[6]{1}[56978]{1}[0-9]{7}$/))) {
            return true;
        } else {
            return false;
        }
    },
    addMessageElement: (element, options) => {
        const $element = $(element);

        if (!options) options = {};
        if (typeof options.fade === undefined) options.fade = true;
        if (typeof options.prepend === undefined) options.prepend = false;
        if (options.fade) $element.hide().fadeIn(150);

        if (options.prepend) {
            $messages.prepend($element);
        } else {
            $messages.append($element);
        }

        // $messages[0].scrollTop = $messages[0].scrollHeight;
    }
};


/**
 * Events
 */
socket.on('connect', () => {

    console.log('connected');
});
socket.on('chat-message', (data) => {
    // console.log(data);
    if(data.status=='error'){
        $.ajax({
            type:'post',
            url:'messages/status',
            data:{
                id:data.id,
                status: data.status

            },
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            async:false,
            success:function (data) {
                // console.log(data);
                chat.refresh(data);
                // return data;
            },
            error:function (e) {
                console.log(e);
            }
        });
    }else if(data.status=='success'){
        $.ajax({
            type:'post',
            url:'messages/status',
            data:{
                id:data.id,
                status:data.status
            },
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            async:false,
            success:function (data) {
                // console.log(data);
                chat.refresh(data);
                // return data;
            },
            error:function (e) {
                console.log(e);
            }
        });
    }
    if(data.receiver!=null && data.message!=null){
        chat.addChatMessage(data);
    }

});
socket.on('user-join', (data) => {

    // chat.log(data + ' joined at this room');
});
socket.on('user-unjoin', (data) => {

    // chat.log(data + ' left this room');
});