(function ($) {
    'use strict';
    $(function () {
        var body = $('body');
        var contentWrapper = $('.content-wrapper');
        var scroller = $('.container-scroller');
        var footer = $('.footer');
        var sidebar = $('.sidebar');

        //Add active class to nav-link based on url dynamically
        //Active class can be hard coded directly in html file also as required

        function addActiveClass(element) {
            if (current === "") {
                //for root url
                if (element.attr('href').indexOf("index.html") !== -1) {
                    element.parents('.nav-item').last().addClass('active');
                    if (element.parents('.sub-menu').length) {
                        element.closest('.collapse').addClass('show');
                        element.addClass('active');
                    }
                }
            } else {
                //for other url
                if (element.attr('href').indexOf(current) !== -1) {
                    element.parents('.nav-item').last().addClass('active');
                    if (element.parents('.sub-menu').length) {
                        element.closest('.collapse').addClass('show');
                        element.addClass('active');
                    }
                    if (element.parents('.submenu-item').length) {
                        element.addClass('active');
                    }
                }
            }
        }

        var current = location.pathname.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
        $('.nav li a', sidebar).each(function () {
            var $this = $(this);
            addActiveClass($this);
        })

        //Close other submenu in sidebar on opening any

        sidebar.on('show.bs.collapse', '.collapse', function () {
            sidebar.find('.collapse.show').collapse('hide');
        });

        //Change sidebar

        $('[data-toggle="minimize"]').on("click", function () {
            body.toggleClass('sidebar-icon-only');
        });

        // checkbox and radios
        $(".form-check label,.form-radio label").append('<i class="input-helper"></i>');
    });

    // testing ajax query to Controller
    function authenticate(_email, _pass, callback) {
        // create ajax 'instance'
        $.ajax({
            // request URL
            url: '/account/authenticate',
            // request method [post|get|delete|put]
            type: 'post',
            // request data
            data: { _email, _pass },
            // on request success (success = request retrieved and response sent by server)
            success: (response) => {
                // call callback method with status parameter (as sent from the server)
                callback(response.status, response.data);
            },

            // on request error (500|404|403)
            error: (requestObject, error, errorThrown) => {
                // log detailed error to console
                console.log(JSON.stringify(requestObject));
            }
        });
    }

    // on login form submission
    $('#loginForm').submit(function (e) {
        // prevents page from refreshing
        e.preventDefault();

        // grab input values from text boxes and assign into variables
        var _email = $('#txtUsername').val();
        var _pass = $('#txtPassword').val();

        // call method to authenticate credentials
        authenticate(_email, _pass,

            // callback method
            (status, data) => {
                console.log(JSON.stringify(data));
                // status (boolean) returned from controller action
                if (!status) {
                    $('#alrtLoginFail').html(`<div class="alert alert-danger alert-dismissible fade notify-bottom show" role="alert"> <strong>${data.outcome.outcome}</strong> ${data.outcome.outcomeMessage} <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div>`);
                } else {
                    document.location.href = '/home';
                }
            });
    });

    $('#btnLogout').click(function (e) {
        e.preventDefault();
        console.log('Button logout clicked');

        $.ajax({
            url: '/account/logout',
            type: 'post',
            success: function (response) {
                if (response.status) {
                    document.location.href = '/';
                }
            },
            error: function (x, y, z) {
                console.log(JSON.stringify(y));
            }
        });
    });
})(jQuery);
