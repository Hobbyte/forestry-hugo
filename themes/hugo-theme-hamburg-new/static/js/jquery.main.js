jQuery(function () {
    initRetinaCover();
    initCustomForms();
    initBgParallax();
    initAccordion();
    initCarousel();
    initSameHeight();
    initStickyScrollBlock();
    initTouchNav();
    initMobileNav();
    initInViewport();
    initLoadMore();
    initDropdowns();
    initForm();
    initModal();
});

$(function () {

    $("#PhoneNumber").mask("(999) 999-9999");


    $("#PhoneNumber").on("blur", function () {
        var last = $(this).val().substr($(this).val().indexOf("-") + 1);

        if (last.length == 5) {
            var move = $(this).val().substr($(this).val().indexOf("-") + 1, 1);

            var lastfour = last.substr(1, 4);

            var first = $(this).val().substr(0, 9);

            $(this).val(first + move + '-' + lastfour);
        }
    });
});

jQuery(document).on("click", ".signup input[type=button]", function() {
    var emailBox = $(".signup input[type=email]");
    if (emailBox.val() !== "" && validateEmail(emailBox[0])) {
        emailBox.removeClass("error");

        $.post('/api/newslettersignup?email=' + emailBox.val(),
            function (data) {
                if (data === "success") {
                    $(".signup input[type=button]").val("Success!");
                    ga('send', 'event', 'Main Site', 'Newsletter sign up in footer');
                }
            });

    } else {
        if (emailBox.val() !== "") { emailBox.addClass("error"); }
    }
});

function uncheck_radio_before_click(radio) {
    if (radio.prop('checked'))
        radio.one('click', function () { radio.prop('checked', false); });
}

jQuery(document).on('mouseup', '#contactModal input[name="radio"]', function () {
    var radio = $(this);
    uncheck_radio_before_click(radio);
})

jQuery(document).on('mouseup', '#contactModal .btn-switch', function () {
    var label = $(this);
    var radio;
    if (label.attr('for'))
        radio = $('#' + label.attr('for')).filter('input[type="radio"]');
    else
        radio = label.children('input[type="radio"]');
    if (radio.length)
        uncheck_radio_before_click(radio);
})

function initModal() {
    var modal = jQuery("#contactModal");

    jQuery(document).on("click", "#contact", function () {
        modal.show();
    })

    jQuery(document).on("click", ".close", function () {
        modal.hide();
    })

    jQuery(document).on("change", ".form-area input", function () {
        $(this).removeClass("error");
    });

    jQuery(document).on("change", ".form-area .required", function () {
        $(this).next().removeClass("error");
    });

    jQuery(document).on("blur", "#Email", function() {

        if(validateEmail($(this)[0])) {
            $(this).removeClass("error");
        } else {
            $(this).addClass("error");
        }
    });

    jQuery(document).on("change", "input[name='optradio']", function() {
        if($(this).val()=="email") {
            $(".emailHolder").show();
            $(".phoneHolder").hide();
        }
        if($(this).val()=="call") {
            $(".phoneHolder").show();
            $(".emailHolder").hide();
        }

        $("input[name='optradio']").parent().removeClass("error");
    });

    jQuery(document).on("click", ".form-area input[type='button']", function () {
        var isValid = true;
       
        $(".form-area select.required:visible").each(function() {
            if ($(this).val() == "") {
                $(this).next().addClass("error");
                isValid = false;
            }
        });

        if ($("#FirstName").val() == "") {
            $("#FirstName").addClass("error");
            isValid = false;
        }
        if ($("#LastName").val() == "") {
            $("#LastName").addClass("error");
            isValid = false;
        }

        if ($("#PhoneNumber:visible").val() == "") {
            $("#PhoneNumber:visible").addClass("error");
            isValid = false;
        }

        if ($("#Email:visible").val() == "") {
            $("#Email:visible").addClass("error");
            isValid = false;
        }

        if($("input[name='optradio']:checked").val()==undefined) {
            $("input[name='optradio']").parent().addClass("error");
        }

        if (isValid) {
            $.ajax({
                url: "/api/customercareform",
                type: 'POST',
                data: $(".form-area :input").serialize(),
                beforeSend: function() {
                    $(".form-area input[type='button']").val("Submitting...");
                    $(".form-area input[type='button']").attr('disabled', 'disabled');
                },
                success: function (data) {
                    $(".form-area.message").html("Message successfully sent. We will be in touch with you soon!");
                },
                error: function (data) {
                    $(".form-area input[type='button']").val("Submit");
                    $(".form-area input[type='button']").removeAttr('disabled');
                    $(".form-area.message .error-message").html("<br/>There was an error sending your message. Please verify your information and try again.");
                }
            })
        }
    });
}

function validateEmail(emailField) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(emailField.value) == false) {
        return false;
    }

    return true;
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

function initForm() {
    jQuery(document).on("click", ".quote-form input[type='button']", function () {
        var breedId = jQuery(this).closest('.quote-form').find("select").val()
        var petName = jQuery(this).closest('.quote-form').find("input[type='text']").val();
        if (breedId > 0) {
            document.cookie = "PetBreedId=" + breedId;
        }
        if(petName!="") {
            document.cookie = "PetName=" + petName;
        }
        $(window).attr('location', window.location.origin + "/enroll");

    });
}

function initDropdowns() {
    jQuery(document).on('change', "input[name='switch_1'], input[name='switch_2']", function () {
        var species = $(this)[0].value;
        var $dropdown;
        if ($(this)[0].id.indexOf("-1") > 0) {
            $dropdown = $('.quote-form.second select');
        } else {
            $dropdown = $('.quote-form.first select');
        }
        updateDropdown(species, $dropdown);
    })
}

function updateDropdown(species, dropdown) {
    var $dropdown = dropdown;
    $.ajax({
        url: "/api/breeds?species=" + species,
        type: 'GET',
        success: function (data) {

            $dropdown.empty()
            $dropdown.removeAttr("selected")
            $dropdown.append($('<option class="placeholder-opt"/>').text("Pet Breed"));
            if (species == "Dog") {
                $dropdown.append($('<option value="161"/>').text("Mixed Breed (Unknown size)"));
                $dropdown.append($('<option value="221"/>').text("Mixed Breed (Up To 10 Lbs)"));
                $dropdown.append($('<option value="217"/>').text("Mixed Breed (10 - 20 Lbs)"));
                $dropdown.append($('<option value="218"/>').text("Mixed Breed (20 - 55 Lbs)"));
                $dropdown.append($('<option value="219"/>').text("Mixed Breed (55 - 90 Lbs)"));
                $dropdown.append($('<option value="220"/>').text("Mixed Breed (90 Lbs +)"));
            } else {
                $dropdown.append($('<option value="204"/>').text("Unknown / Mixed"));
            }
            
            $.each(data,
                function () {
                    if (this.name.indexOf("Unknown") == -1 && this.name.indexOf("Mixed Breed") == -1) {
                        $dropdown.append($("<option />").val(this.id).text(this.name))
                    }
                });
            jcf.replaceAll();
        }
    })
}

// init load more
function initLoadMore() {
    var win = jQuery(window);
    var winTop = win.scrollTop();
    var winHeight = win.height();

    jQuery('.ajax-holder').each(function () {
        var holder = jQuery(this);
        var initialSection = holder.find('.initial-section');
        var activeSection = initialSection;
        var nextSection = activeSection.data('target');
        var isBusy = false;
        var timer;

        function scrollHandler() {
            winTop = win.scrollTop();

            if (isBusy) return

            if (winTop + winHeight > activeSection.offset().top + activeSection.outerHeight() / 2) {
                if (nextSection) {
                    isBusy = true;
                    loadData();
                }
            }
        }

        resizeHandler();

        function loadData() {
            $.ajax({
                url: nextSection,
                type: 'GET',
                data: 'html',
                success: function (data) {
                    $data = jQuery(data);
                    holder.append($data);
                    activeSection = $data;
                    nextSection = activeSection.data('target');

                    if ($data.hasClass('viewport-section')) {
                        $data.itemInViewport({
                            visibleMode: 2
                        });
                    }

                    if ($data.find('.viewport-section')) {
                        $data.find('.viewport-section').itemInViewport({
                            visibleMode: 2
                        });
                    }

                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        if ($data.hasClass('same-height-holder')) {
                            $data.sameHeight({
                                elements: '.same-height',
                                flexible: true,
                                multiLine: true,
                                biggestHeight: true
                            });
                        }
                        if ($data.find('.same-height-holder').length) {
                            $data.find('.same-height-holder').sameHeight({
                                elements: '.same-height',
                                flexible: true,
                                multiLine: true,
                                biggestHeight: true
                            });
                        }
                    }, 50);

                    if ($data.find('.test-slider')) {
                        $data.find('.test-slider').scrollGallery({
                            mask: '.mask',
                            slider: '.slideset',
                            slides: '.slide',
                            step: 1
                        });
                    }

                    if ($data.hasClass('bg-holder')) {
                        $data.parallaxBlock({
                            image: 'img',
                            fallbackClass: 'is-touch-device'
                        });
                    }

                    if ($data.hasClass('bg-cover')) {
                        $data.retinaCover();
                    }

                    if ($data.find('.bg-cover')) {
                        $data.find('.bg-cover').retinaCover();
                    }
                    jcf.replaceAll();
                    isBusy = false;
                }
            });
        }

        function resizeHandler() {
            winHeight = win.height();
            scrollHandler();
        }

        win.on('resize orientationchange', resizeHandler);
        win.on('scroll', scrollHandler);
    });
}

// in view port init
function initInViewport() {
    jQuery('.viewport-section').itemInViewport({
        visibleMode: 2
    });
}

// mobile menu init
function initMobileNav() {
    jQuery('body').mobileNav({
        menuActiveClass: 'nav-active',
        menuOpener: '.nav-opener',
        hideOnClickOutside: true,
        menuDrop: '.nav-drop'
    });

    jQuery('body').mobileNav({
        menuActiveClass: 'home-active',
        menuOpener: '.home-opener',
        hideOnClickOutside: true,
        menuDrop: '.home-drop'
    });
}

// handle dropdowns on mobile devices
function initTouchNav() {
    jQuery('.navigation').each(function () {
        new TouchNav({
            navBlock: this
        });
    });

    jQuery('.header-tools >ul').each(function () {
        new TouchNav({
            navBlock: this
        });
    });
}

// initialize fixed blocks on scroll
function initStickyScrollBlock() {
    jQuery('#header').stickyScrollBlock({
        setBoxHeight: false,
        activeClass: 'fixed-position',
        positionType: 'fixed',
        extraTop: function () {
            var totalHeight = 0;
            jQuery('0').each(function () {
                totalHeight += jQuery(this).outerHeight();
            });
            return totalHeight;
        }
    });
}

// align blocks height
function initSameHeight() {
    jQuery('.same-height-holder').sameHeight({
        elements: '.same-height',
        flexible: true,
        multiLine: true,
        biggestHeight: true
    });

    jQuery('.same-height-js').sameHeight({
        elements: '.same-height-element',
        flexible: true,
        multiLine: true
    });
}

// scroll gallery init
function initCarousel() {
    jQuery('.test-slider').scrollGallery({
        mask: '.mask',
        slider: '.slideset',
        slides: '.slide',
        step: 1
    });
}


// accordion menu init
function initAccordion() {
    ResponsiveHelper.addRange({
        '..1023': {
            on: function () {
                jQuery('.footer-accordion').slideAccordion({
                    opener: '.accordion-opener',
                    slider: '.accordion-slide',
                    animSpeed: 300
                });
            },
            off: function () {
                jQuery('.footer-accordion').slideAccordion('destroy');
            }
        }
    });
}

// comment
function initBgParallax() {
    jQuery('.bg-holder').parallaxBlock({
        image: 'img',
        fallbackClass: 'is-touch-device'
    });
}


function initRetinaCover() {
    jQuery('.bg-cover').retinaCover();
}

var lhnAccountN = 13830; //LiveHelpNow account #
var lhnButtonN = 0; //Button #
var lhnInviteEnabled = 1; //Invite visitor to chat automatically
var lhnInviteChime = 0; //1 = disable invite beep sound,0 = keep invite beep sound enabled
var lhnWindowN = 14499; //Chat window #, leave 0 to open default window setup for your account
var lhnDepartmentN = 0; //Department #, leave 0 to not route by department
var lhnCustomInvitation = ''; //change to 1 to use custom invitation, see this article for customization instructions: http://help.livehelpnow.net/article.aspx?cid=1&aid=1739
var lhnCustom1 = ''; //Custom1 feed value please use encodeURIComponent() function to encode your values
var lhnCustom2 = ''; //Custom2 feed value please use encodeURIComponent() function to encode your values
var lhnCustom3 = ''; //Custom3 feed value please use encodeURIComponent() function to encode your values
var lhnTrackingEnabled = 't'; //change to 'f' to disable visitor tracking
var lhnVersion = 5.3; //LiveHelpNow version #
var lhnJsHost = (("https:" == document.location.protocol) ? "https://" : "http://"); //to force secure chat replace this line with: var lhnJsHost = 'https://';
var lhnScriptSrc = lhnJsHost + 'www.livehelpnow.net/lhn/scripts/livehelpnow.aspx?lhnid=' + lhnAccountN + '&iv=' + lhnInviteEnabled + '&d=' + lhnDepartmentN + '&ver=' + lhnVersion + '&rnd=' + Math.random();
var lhnScript = document.createElement("script"); lhnScript.type = "text/javascript"; lhnScript.src = lhnScriptSrc;

if (document.getElementById('lhnContainer') != undefined) {
    document.getElementById('lhnContainer').appendChild(lhnScript);
}

function CustomOpenLHNChat() {
    var wleft = (screen.width - 580 - 32) / 2;
    var wtop = (screen.height - 420 - 96) / 2;
    if (bLHNOnline == 0) {
        window.open('https://forms.petsbest.com/customer-care/', 'lhnchat', 'left=' + wleft + ',top=' + wtop + ',width=976,height=1100,toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=no,copyhistory=no,resizable=yes');
    }
    else {
        window.open('http://www.livehelpnow.net/clients/petsbest/pre_chat.html', 'lhnchat', 'left=' + wleft + ',top=' + wtop + ',width=650,height=593,toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=no,copyhistory=no,resizable=yes');
    }
}


/*
 * jQuery In Viewport plugin
*/
; (function ($, $win) {
    'use strict';

    var ScrollDetector = (function () {
        var data = {};

        return {
            init: function () {
                var self = this;

                this.addHolder('win', $win);

                $win.on('load.blockInViewport resize.blockInViewport orientationchange.blockInViewport', function () {
                    $.each(data, function (holderKey, holderData) {
                        self.calcHolderSize(holderData);

                        $.each(holderData.items, function (itemKey, itemData) {
                            self.calcItemSize(itemKey, itemData);
                        });
                    });
                });
            },

            addHolder: function (holderKey, $holder) {
                var self = this;
                var holderData = {
                    holder: $holder,
                    items: {},
                    props: {
                        height: 0,
                        scroll: 0
                    }
                };

                data[holderKey] = holderData;

                $holder.on('scroll.blockInViewport', function () {
                    self.calcHolderScroll(holderData);

                    $.each(holderData.items, function (itemKey, itemData) {
                        self.calcItemScroll(itemKey, itemData);
                    });
                });

                this.calcHolderSize(data[holderKey]);
            },

            calcHolderSize: function (holderData) {
                var holderOffset = window.self !== holderData.holder[0] ? holderData.holder.offset() : 0;

                holderData.props.height = holderData.holder.get(0) === window ? (window.innerHeight || document.documentElement.clientHeight) : holderData.holder.outerHeight();
                holderData.props.offset = holderOffset ? holderOffset.top : 0;

                this.calcHolderScroll(holderData);
            },

            calcItemSize: function (itemKey, itemData) {
                itemData.offset = itemData.$el.offset().top - itemData.holderProps.props.offset;
                itemData.height = itemData.$el.outerHeight();

                this.calcItemScroll(itemKey, itemData);
            },

            calcHolderScroll: function (holderData) {
                holderData.props.scroll = holderData.holder.scrollTop();
            },

            calcItemScroll: function (itemKey, itemData) {
                var itemInViewPortFromUp;
                var itemInViewPortFromDown;
                var itemOutViewPort;
                var holderProps = itemData.holderProps.props;

                switch (itemData.options.visibleMode) {
                    case 1:
                        itemInViewPortFromDown = itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height < holderProps.scroll + holderProps.height;
                        itemInViewPortFromUp = itemData.offset > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2;
                        break;

                    case 2:
                        itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height / 2 < holderProps.scroll + holderProps.height);
                        itemInViewPortFromUp = itemInViewPortFromUp || (itemData.offset + itemData.height / 2 > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
                        break;

                    case 3:
                        itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset < holderProps.scroll + holderProps.height);
                        itemInViewPortFromUp = itemInViewPortFromUp || (itemData.offset + itemData.height > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
                        break;

                    default:
                        itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + Math.min(itemData.options.visibleMode, itemData.height) < holderProps.scroll + holderProps.height);
                        itemInViewPortFromUp = itemInViewPortFromUp || (itemData.offset + itemData.height - Math.min(itemData.options.visibleMode, itemData.height) > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
                        break;
                }


                if (itemInViewPortFromUp && itemInViewPortFromDown) {
                    if (!itemData.state) {
                        itemData.state = true;
                        itemData.$el.addClass(itemData.options.activeClass)
                            .trigger('in-viewport', true);

                        if (itemData.options.once || ($.isFunction(itemData.options.onShow) && itemData.options.onShow(itemData))) {
                            delete itemData.holderProps.items[itemKey];
                        }
                    }
                } else {
                    itemOutViewPort = itemData.offset < holderProps.scroll + holderProps.height && itemData.offset + itemData.height > holderProps.scroll;

                    if ((itemData.state || isNaN(itemData.state)) && !itemOutViewPort) {
                        itemData.state = false;
                        itemData.$el.removeClass(itemData.options.activeClass)
                            .trigger('in-viewport', false);
                    }
                }
            },

            addItem: function (el, options) {
                var itemKey = 'item' + this.getRandomValue();
                var newItem = {
                    $el: $(el),
                    options: options
                };
                var holderKeyDataName = 'in-viewport-holder';

                var $holder = newItem.$el.closest(options.holder);
                var holderKey = $holder.data(holderKeyDataName);

                if (!$holder.length) {
                    holderKey = 'win';
                } else if (!holderKey) {
                    holderKey = 'holder' + this.getRandomValue();
                    $holder.data(holderKeyDataName, holderKey);

                    this.addHolder(holderKey, $holder);
                }

                newItem.holderProps = data[holderKey];

                data[holderKey].items[itemKey] = newItem;

                this.calcItemSize(itemKey, newItem);
            },

            getRandomValue: function () {
                return (Math.random() * 100000).toFixed(0);
            },

            destroy: function () {
                $win.off('.blockInViewport');

                $.each(data, function (key, value) {
                    value.holder.off('.blockInViewport');

                    $.each(value.items, function (key, value) {
                        value.$el.removeClass(value.options.activeClass);
                        value.$el.get(0).itemInViewportAdded = null;
                    });
                });

                data = {};
            }
        };
    }());

    ScrollDetector.init();

    $.fn.itemInViewport = function (options) {
        options = $.extend({
            activeClass: 'in-viewport',
            once: true,
            holder: '',
            visibleMode: 2 // 1 - full block, 2 - half block, 3 - immediate, 4... - custom
        }, options);

        return this.each(function () {
            if (this.itemInViewportAdded) {
                return;
            }

            this.itemInViewportAdded = true;

            ScrollDetector.addItem(this, options);
        });
    };
}(jQuery, jQuery(window)));

// initialize custom form elements
function initCustomForms() {
    jcf.setOptions('Select', {
        wrapNative: false,
        wrapNativeOnMobile: false,
    });
    jcf.replaceAll();
}

/*
 * Simple Mobile Navigation
*/
; (function ($) {
    function MobileNav(options) {
        this.options = $.extend({
            container: null,
            hideOnClickOutside: false,
            menuActiveClass: 'nav-active',
            menuOpener: '.nav-opener',
            menuDrop: '.nav-drop',
            toggleEvent: 'click',
            outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
        }, options);
        this.initStructure();
        this.attachEvents();
    }
    MobileNav.prototype = {
        initStructure: function () {
            this.page = $('html');
            this.container = $(this.options.container);
            this.opener = this.container.find(this.options.menuOpener);
            this.drop = this.container.find(this.options.menuDrop);
        },
        attachEvents: function () {
            var self = this;

            if (activateResizeHandler) {
                activateResizeHandler();
                activateResizeHandler = null;
            }

            this.outsideClickHandler = function (e) {
                if (self.isOpened()) {
                    var target = $(e.target);
                    if (!target.closest(self.opener).length && !target.closest(self.drop).length) {
                        self.hide();
                    }
                }
            };

            this.openerClickHandler = function (e) {
                e.preventDefault();
                self.toggle();
            };

            this.opener.on(this.options.toggleEvent, this.openerClickHandler);
        },
        isOpened: function () {
            return this.container.hasClass(this.options.menuActiveClass);
        },
        show: function () {
            this.container.addClass(this.options.menuActiveClass);
            if (this.options.hideOnClickOutside) {
                this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        hide: function () {
            this.container.removeClass(this.options.menuActiveClass);
            if (this.options.hideOnClickOutside) {
                this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        toggle: function () {
            if (this.isOpened()) {
                this.hide();
            } else {
                this.show();
            }
        },
        destroy: function () {
            this.container.removeClass(this.options.menuActiveClass);
            this.opener.off(this.options.toggleEvent, this.clickHandler);
            this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
        }
    };

    var activateResizeHandler = function () {
        var win = $(window),
            doc = $('html'),
            resizeClass = 'resize-active',
            flag, timer;
        var removeClassHandler = function () {
            flag = false;
            doc.removeClass(resizeClass);
        };
        var resizeHandler = function () {
            if (!flag) {
                flag = true;
                doc.addClass(resizeClass);
            }
            clearTimeout(timer);
            timer = setTimeout(removeClassHandler, 500);
        };
        win.on('resize orientationchange', resizeHandler);
    };

    $.fn.mobileNav = function (opt) {
        var args = Array.prototype.slice.call(arguments);
        var method = args[0];

        return this.each(function () {
            var $container = jQuery(this);
            var instance = $container.data('MobileNav');

            if (typeof opt === 'object' || typeof opt === 'undefined') {
                $container.data('MobileNav', new MobileNav($.extend({
                    container: this
                }, opt)));
            } else if (typeof method === 'string' && instance) {
                if (typeof instance[method] === 'function') {
                    args.shift();
                    instance[method].apply(instance, args);
                }
            }
        });
    };
}(jQuery));

// navigation accesibility module
function TouchNav(opt) {
    this.options = {
        hoverClass: 'hover',
        menuItems: 'li',
        menuOpener: 'a',
        menuDrop: 'ul',
        navBlock: null
    };
    for (var p in opt) {
        if (opt.hasOwnProperty(p)) {
            this.options[p] = opt[p];
        }
    }
    this.init();
}
TouchNav.isActiveOn = function (elem) {
    return elem && elem.touchNavActive;
};
TouchNav.prototype = {
    init: function () {
        if (typeof this.options.navBlock === 'string') {
            this.menu = document.getElementById(this.options.navBlock);
        } else if (typeof this.options.navBlock === 'object') {
            this.menu = this.options.navBlock;
        }
        if (this.menu) {
            this.addEvents();
        }
    },
    addEvents: function () {
        // attach event handlers
        var self = this;
        var touchEvent = (navigator.pointerEnabled && 'pointerdown') || (navigator.msPointerEnabled && 'MSPointerDown') || (this.isTouchDevice && 'touchstart');
        this.menuItems = lib.queryElementsBySelector(this.options.menuItems, this.menu);

        var initMenuItem = function (item) {
            var currentDrop = lib.queryElementsBySelector(self.options.menuDrop, item)[0],
                currentOpener = lib.queryElementsBySelector(self.options.menuOpener, item)[0];

            // only for touch input devices
            if (currentDrop && currentOpener && (self.isTouchDevice || self.isPointerDevice)) {
                lib.event.add(currentOpener, 'click', lib.bind(self.clickHandler, self));
                lib.event.add(currentOpener, 'mousedown', lib.bind(self.mousedownHandler, self));
                lib.event.add(currentOpener, touchEvent, function (e) {
                    if (!self.isTouchPointerEvent(e)) {
                        self.preventCurrentClick = false;
                        return;
                    }
                    self.touchFlag = true;
                    self.currentItem = item;
                    self.currentLink = currentOpener;
                    self.pressHandler.apply(self, arguments);
                });
            }
            // for desktop computers and touch devices
            jQuery(item)
                .bind('mouseenter', function () {
                    if (!self.touchFlag) {
                        self.currentItem = item;
                        self.mouseoverHandler();
                    }
                });
            jQuery(item)
                .bind('mouseleave', function () {
                    if (!self.touchFlag) {
                        self.currentItem = item;
                        self.mouseoutHandler();
                    }
                });
            item.touchNavActive = true;
        };

        // addd handlers for all menu items
        for (var i = 0; i < this.menuItems.length; i++) {
            initMenuItem(self.menuItems[i]);
        }

        // hide dropdowns when clicking outside navigation
        if (this.isTouchDevice || this.isPointerDevice) {
            lib.event.add(document.documentElement, 'mousedown', lib.bind(this.clickOutsideHandler, this));
            lib.event.add(document.documentElement, touchEvent, lib.bind(this.clickOutsideHandler, this));
        }
    },
    mousedownHandler: function (e) {
        if (this.touchFlag) {
            e.preventDefault();
            this.touchFlag = false;
            this.preventCurrentClick = false;
        }
    },
    mouseoverHandler: function () {
        lib.addClass(this.currentItem, this.options.hoverClass);
        jQuery(this.currentItem)
            .trigger('itemhover');
    },
    mouseoutHandler: function () {
        lib.removeClass(this.currentItem, this.options.hoverClass);
        jQuery(this.currentItem)
            .trigger('itemleave');
    },
    hideActiveDropdown: function () {
        for (var i = 0; i < this.menuItems.length; i++) {
            if (lib.hasClass(this.menuItems[i], this.options.hoverClass)) {
                lib.removeClass(this.menuItems[i], this.options.hoverClass);
                jQuery(this.menuItems[i])
                    .trigger('itemleave');
            }
        }
        this.activeParent = null;
    },
    pressHandler: function (e) {
        // hide previous drop (if active)
        if (this.currentItem !== this.activeParent) {
            if (this.activeParent && this.currentItem.parentNode === this.activeParent.parentNode) {
                lib.removeClass(this.activeParent, this.options.hoverClass);
            } else if (!this.isParent(this.activeParent, this.currentLink)) {
                this.hideActiveDropdown();
            }
        }
        // handle current drop
        this.activeParent = this.currentItem;
        if (lib.hasClass(this.currentItem, this.options.hoverClass)) {
            this.preventCurrentClick = false;
        } else {
            e.preventDefault();
            this.preventCurrentClick = true;
            lib.addClass(this.currentItem, this.options.hoverClass);
            jQuery(this.currentItem)
                .trigger('itemhover');
        }
    },
    clickHandler: function (e) {
        // prevent first click on link
        if (this.preventCurrentClick) {
            e.preventDefault();
        }
    },
    clickOutsideHandler: function (event) {
        var e = event.changedTouches ? event.changedTouches[0] : event;
        if (this.activeParent && !this.isParent(this.menu, e.target)) {
            this.hideActiveDropdown();
            this.touchFlag = false;
        }
    },
    isParent: function (parent, child) {
        while (child.parentNode) {
            if (child.parentNode == parent) {
                return true;
            }
            child = child.parentNode;
        }
        return false;
    },
    isTouchPointerEvent: function (e) {
        return (e.type.indexOf('touch') > -1) ||
            (navigator.pointerEnabled && e.pointerType === 'touch') ||
            (navigator.msPointerEnabled && e.pointerType == e.MSPOINTER_TYPE_TOUCH);
    },
    isPointerDevice: (function () {
        return !!(navigator.pointerEnabled || navigator.msPointerEnabled);
    }()),
    isTouchDevice: (function () {
        return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    }())
};

/*
 * Utility module
 */
lib = {
    hasClass: function (el, cls) {
        return el && el.className ? el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)')) : false;
    },
    addClass: function (el, cls) {
        if (el && !this.hasClass(el, cls)) el.className += " " + cls;
    },
    removeClass: function (el, cls) {
        if (el && this.hasClass(el, cls)) { el.className = el.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), ' '); }
    },
    extend: function (obj) {
        for (var i = 1; i < arguments.length; i++) {
            for (var p in arguments[i]) {
                if (arguments[i].hasOwnProperty(p)) {
                    obj[p] = arguments[i][p];
                }
            }
        }
        return obj;
    },
    each: function (obj, callback) {
        var property, len;
        if (typeof obj.length === 'number') {
            for (property = 0, len = obj.length; property < len; property++) {
                if (callback.call(obj[property], property, obj[property]) === false) {
                    break;
                }
            }
        } else {
            for (property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (callback.call(obj[property], property, obj[property]) === false) {
                        break;
                    }
                }
            }
        }
    },
    event: (function () {
        var fixEvent = function (e) {
            e = e || window.event;
            if (e.isFixed) return e; else e.isFixed = true;
            if (!e.target) e.target = e.srcElement;
            e.preventDefault = e.preventDefault || function () { this.returnValue = false; };
            e.stopPropagation = e.stopPropagation || function () { this.cancelBubble = true; };
            return e;
        };
        return {
            add: function (elem, event, handler) {
                if (!elem.events) {
                    elem.events = {};
                    elem.handle = function (e) {
                        var ret, handlers = elem.events[e.type];
                        e = fixEvent(e);
                        for (var i = 0, len = handlers.length; i < len; i++) {
                            if (handlers[i]) {
                                ret = handlers[i].call(elem, e);
                                if (ret === false) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }
                        }
                    };
                }
                if (!elem.events[event]) {
                    elem.events[event] = [];
                    if (elem.addEventListener) elem.addEventListener(event, elem.handle, false);
                    else if (elem.attachEvent) elem.attachEvent('on' + event, elem.handle);
                }
                elem.events[event].push(handler);
            },
            remove: function (elem, event, handler) {
                var handlers = elem.events[event];
                for (var i = handlers.length - 1; i >= 0; i--) {
                    if (handlers[i] === handler) {
                        handlers.splice(i, 1);
                    }
                }
                if (!handlers.length) {
                    delete elem.events[event];
                    if (elem.removeEventListener) elem.removeEventListener(event, elem.handle, false);
                    else if (elem.detachEvent) elem.detachEvent('on' + event, elem.handle);
                }
            }
        };
    }()),
    queryElementsBySelector: function (selector, scope) {
        scope = scope || document;
        if (!selector) return [];
        if (selector === '>*') return scope.children;
        if (typeof document.querySelectorAll === 'function') {
            return scope.querySelectorAll(selector);
        }
        var selectors = selector.split(',');
        var resultList = [];
        for (var s = 0; s < selectors.length; s++) {
            var currentContext = [scope || document];
            var tokens = selectors[s].replace(/^\s+/, '').replace(/\s+$/, '').split(' ');
            for (var i = 0; i < tokens.length; i++) {
                token = tokens[i].replace(/^\s+/, '').replace(/\s+$/, '');
                if (token.indexOf('#') > -1) {
                    var bits = token.split('#'), tagName = bits[0], id = bits[1];
                    var element = document.getElementById(id);
                    if (element && tagName && element.nodeName.toLowerCase() != tagName) {
                        return [];
                    }
                    currentContext = element ? [element] : [];
                    continue;
                }
                if (token.indexOf('.') > -1) {
                    var bits = token.split('.'), tagName = bits[0] || '*', className = bits[1], found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; j < elements.length; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (found[k].className && found[k].className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
                    var tagName = RegExp.$1 || '*', attrName = RegExp.$2, attrOperator = RegExp.$3, attrValue = RegExp.$4;
                    if (attrName.toLowerCase() == 'for' && this.browser.msie && this.browser.version < 8) {
                        attrName = 'htmlFor';
                    }
                    var found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; elements[j]; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0, checkFunction;
                    switch (attrOperator) {
                        case '=': checkFunction = function (e) { return (e.getAttribute(attrName) == attrValue) }; break;
                        case '~': checkFunction = function (e) { return (e.getAttribute(attrName).match(new RegExp('(\\s|^)' + attrValue + '(\\s|$)'))) }; break;
                        case '|': checkFunction = function (e) { return (e.getAttribute(attrName).match(new RegExp('^' + attrValue + '-?'))) }; break;
                        case '^': checkFunction = function (e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0) }; break;
                        case '$': checkFunction = function (e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length) }; break;
                        case '*': checkFunction = function (e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1) }; break;
                        default: checkFunction = function (e) { return e.getAttribute(attrName) };
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (checkFunction(found[k])) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                tagName = token;
                var found = [], foundCount = 0;
                for (var h = 0; h < currentContext.length; h++) {
                    var elements = currentContext[h].getElementsByTagName(tagName);
                    for (var j = 0; j < elements.length; j++) {
                        found[foundCount++] = elements[j];
                    }
                }
                currentContext = found;
            }
            resultList = [].concat(resultList, currentContext);
        }
        return resultList;
    },
    trim: function (str) {
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    },
    bind: function (f, scope, forceArgs) {
        return function () { return f.apply(scope, typeof forceArgs !== 'undefined' ? [forceArgs] : arguments); };
    }
};

/*
 * jQuery sticky box plugin 
 */
; (function ($, $win) {
    'use strict';

    function StickyScrollBlock($stickyBox, options) {
        this.options = options;
        this.$stickyBox = $stickyBox;
        this.init();
    }

    var StickyScrollBlockPrototype = {
        init: function () {
            this.findElements();
            this.attachEvents();
            this.makeCallback('onInit');
        },

        findElements: function () {
            // find parent container in which will be box move 
            this.$container = this.$stickyBox.closest(this.options.container);
            // define box wrap flag
            this.isWrap = this.options.positionType === 'fixed' && this.options.setBoxHeight;
            // define box move flag
            this.moveInContainer = !!this.$container.length;
            // wrapping box to set place in content
            if (this.isWrap) {
                this.$stickyBoxWrap = this.$stickyBox.wrap('<div class="' + this.getWrapClass() + '"/>').parent();
            }
            //define block to add active class
            this.parentForActive = this.getParentForActive();
            this.isInit = true;
        },

        attachEvents: function () {
            var self = this;

            // bind events
            this.onResize = function () {
                if (!self.isInit) return;
                self.resetState();
                self.recalculateOffsets();
                self.checkStickyPermission();
                self.scrollHandler();
            };

            this.onScroll = function () {
                self.scrollHandler();
            };

            // initial handler call
            this.onResize();

            // handle events
            $win.on('load resize orientationchange', this.onResize)
                .on('scroll', this.onScroll);
        },

        defineExtraTop: function () {
            // define box's extra top dimension
            var extraTop;

            if (typeof this.options.extraTop === 'number') {
                extraTop = this.options.extraTop;
            } else if (typeof this.options.extraTop === 'function') {
                extraTop = this.options.extraTop();
            }

            this.extraTop = this.options.positionType === 'absolute' ?
                extraTop :
                Math.min(this.winParams.height - this.data.boxFullHeight, extraTop);
        },

        checkStickyPermission: function () {
            // check the permission to set sticky
            this.isStickyEnabled = this.moveInContainer ?
                this.data.containerOffsetTop + this.data.containerHeight > this.data.boxFullHeight + this.data.boxOffsetTop + this.options.extraBottom :
                true;
        },

        getParentForActive: function () {
            if (this.isWrap) {
                return this.$stickyBoxWrap;
            }

            if (this.$container.length) {
                return this.$container;
            }

            return this.$stickyBox;
        },

        getWrapClass: function () {
            // get set of container classes
            try {
                return this.$stickyBox.attr('class').split(' ').map(function (name) {
                    return 'sticky-wrap-' + name;
                }).join(' ');
            } catch (err) {
                return 'sticky-wrap';
            }
        },

        resetState: function () {
            // reset dimensions and state
            this.stickyFlag = false;
            this.$stickyBox.css({
                '-webkit-transition': '',
                '-webkit-transform': '',
                transition: '',
                transform: '',
                position: '',
                width: '',
                left: '',
                top: ''
            }).removeClass(this.options.activeClass);

            if (this.isWrap) {
                this.$stickyBoxWrap.removeClass(this.options.activeClass).removeAttr('style');
            }

            if (this.moveInContainer) {
                this.$container.removeClass(this.options.activeClass);
            }
        },

        recalculateOffsets: function () {
            // define box and container dimensions
            this.winParams = this.getWindowParams();

            this.data = $.extend(
                this.getBoxOffsets(),
                this.getContainerOffsets()
            );

            this.defineExtraTop();
        },

        getBoxOffsets: function () {
            function offetTop(obj) {
                obj.top = 0;
                return obj
            }
            var boxOffset = this.$stickyBox.css('position') === 'fixed' ? offetTop(this.$stickyBox.offset()) : this.$stickyBox.offset();
            var boxPosition = this.$stickyBox.position();

            return {
                // sticky box offsets
                boxOffsetLeft: boxOffset.left,
                boxOffsetTop: boxOffset.top,
                // sticky box positions
                boxTopPosition: boxPosition.top,
                boxLeftPosition: boxPosition.left,
                // sticky box width/height
                boxFullHeight: this.$stickyBox.outerHeight(true),
                boxHeight: this.$stickyBox.outerHeight(),
                boxWidth: this.$stickyBox.outerWidth()
            };
        },

        getContainerOffsets: function () {
            var containerOffset = this.moveInContainer ? this.$container.offset() : null;

            return containerOffset ? {
                // container offsets
                containerOffsetLeft: containerOffset.left,
                containerOffsetTop: containerOffset.top,
                // container height
                containerHeight: this.$container.outerHeight()
            } : {};
        },

        getWindowParams: function () {
            return {
                height: window.innerHeight || document.documentElement.clientHeight
            };
        },

        makeCallback: function (name) {
            if (typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        },

        destroy: function () {
            this.isInit = false;
            // remove event handlers and styles
            $win.off('load resize orientationchange', this.onResize)
                .off('scroll', this.onScroll);
            this.resetState();
            this.$stickyBox.removeData('StickyScrollBlock');
            if (this.isWrap) {
                this.$stickyBox.unwrap();
            }
            this.makeCallback('onDestroy');
        }
    };

    var stickyMethods = {
        fixed: {
            scrollHandler: function () {
                this.winScrollTop = $win.scrollTop();
                var isActiveSticky = this.winScrollTop -
                    (this.options.showAfterScrolled ? this.extraTop : 0) -
                    (this.options.showAfterScrolled ? this.data.boxHeight + this.extraTop : 0) >
                    this.data.boxOffsetTop - this.extraTop;

                if (isActiveSticky) {
                    this.isStickyEnabled && this.stickyOn();
                } else {
                    this.stickyOff();
                }
            },

            stickyOn: function () {
                if (!this.stickyFlag) {
                    this.stickyFlag = true;
                    this.parentForActive.addClass(this.options.activeClass);
                    this.$stickyBox.css({
                        width: this.data.boxWidth,
                        position: this.options.positionType
                    });
                    if (this.isWrap) {
                        this.$stickyBoxWrap.css({
                            height: this.data.boxFullHeight
                        });
                    }
                    this.makeCallback('fixedOn');
                }
                this.setDynamicPosition();
            },

            stickyOff: function () {
                if (this.stickyFlag) {
                    this.stickyFlag = false;
                    this.resetState();
                    this.makeCallback('fixedOff');
                }
            },

            setDynamicPosition: function () {
                this.$stickyBox.css({
                    top: this.getTopPosition(),
                    left: this.data.boxOffsetLeft - $win.scrollLeft()
                });
            },

            getTopPosition: function () {
                if (this.moveInContainer) {
                    var currScrollTop = this.winScrollTop + this.data.boxHeight + this.options.extraBottom;

                    return Math.min(this.extraTop, (this.data.containerHeight + this.data.containerOffsetTop) - currScrollTop);
                } else {
                    return this.extraTop;
                }
            }
        },
        absolute: {
            scrollHandler: function () {
                this.winScrollTop = $win.scrollTop();
                var isActiveSticky = this.winScrollTop > this.data.boxOffsetTop - this.extraTop;

                if (isActiveSticky) {
                    this.isStickyEnabled && this.stickyOn();
                } else {
                    this.stickyOff();
                }
            },

            stickyOn: function () {
                if (!this.stickyFlag) {
                    this.stickyFlag = true;
                    this.parentForActive.addClass(this.options.activeClass);
                    this.$stickyBox.css({
                        width: this.data.boxWidth,
                        transition: 'transform ' + this.options.animSpeed + 's ease',
                        '-webkit-transition': 'transform ' + this.options.animSpeed + 's ease',
                    });

                    if (this.isWrap) {
                        this.$stickyBoxWrap.css({
                            height: this.data.boxFullHeight
                        });
                    }

                    this.makeCallback('fixedOn');
                }

                this.clearTimer();
                this.timer = setTimeout(function () {
                    this.setDynamicPosition();
                }.bind(this), this.options.animDelay * 1000);
            },

            stickyOff: function () {
                if (this.stickyFlag) {
                    this.clearTimer();
                    this.stickyFlag = false;

                    this.timer = setTimeout(function () {
                        this.setDynamicPosition();
                        setTimeout(function () {
                            this.resetState();
                        }.bind(this), this.options.animSpeed * 1000);
                    }.bind(this), this.options.animDelay * 1000);
                    this.makeCallback('fixedOff');
                }
            },

            clearTimer: function () {
                clearTimeout(this.timer);
            },

            setDynamicPosition: function () {
                var topPosition = Math.max(0, this.getTopPosition());

                this.$stickyBox.css({
                    transform: 'translateY(' + topPosition + 'px)',
                    '-webkit-transform': 'translateY(' + topPosition + 'px)'
                });
            },

            getTopPosition: function () {
                var currTopPosition = this.winScrollTop - this.data.boxOffsetTop + this.extraTop;

                if (this.moveInContainer) {
                    var currScrollTop = this.winScrollTop + this.data.boxHeight + this.options.extraBottom;
                    var diffOffset = Math.abs(Math.min(0, (this.data.containerHeight + this.data.containerOffsetTop) - currScrollTop - this.extraTop));

                    return currTopPosition - diffOffset;
                } else {
                    return currTopPosition;
                }
            }
        }
    };

    // jQuery plugin interface
    $.fn.stickyScrollBlock = function (opt) {
        var args = Array.prototype.slice.call(arguments);
        var method = args[0];

        var options = $.extend({
            container: null,
            positionType: 'fixed', // 'fixed' or 'absolute'
            activeClass: 'fixed-position',
            setBoxHeight: true,
            showAfterScrolled: false,
            extraTop: 0,
            extraBottom: 0,
            animDelay: 0.1,
            animSpeed: 0.2
        }, opt);

        return this.each(function () {
            var $stickyBox = jQuery(this);
            var instance = $stickyBox.data('StickyScrollBlock');

            if (typeof opt === 'object' || typeof opt === 'undefined') {
                StickyScrollBlock.prototype = $.extend(stickyMethods[options.positionType], StickyScrollBlockPrototype);
                $stickyBox.data('StickyScrollBlock', new StickyScrollBlock($stickyBox, options));
            } else if (typeof method === 'string' && instance) {
                if (typeof instance[method] === 'function') {
                    args.shift();
                    instance[method].apply(instance, args);
                }
            }
        });
    };

    // module exports
    window.StickyScrollBlock = StickyScrollBlock;
}(jQuery, jQuery(window)));

/*
 * jQuery SameHeight plugin
*/
; (function ($) {
    $.fn.sameHeight = function (opt) {
        var options = $.extend({
            skipClass: 'same-height-ignore',
            leftEdgeClass: 'same-height-left',
            rightEdgeClass: 'same-height-right',
            elements: '>*',
            flexible: false,
            multiLine: false,
            useMinHeight: false,
            biggestHeight: false
        }, opt);
        return this.each(function () {
            var holder = $(this), postResizeTimer, ignoreResize;
            var elements = holder.find(options.elements).not('.' + options.skipClass);
            if (!elements.length) return;

            // resize handler
            function doResize() {
                elements.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', '');
                if (options.multiLine) {
                    // resize elements row by row
                    resizeElementsByRows(elements, options);
                } else {
                    // resize elements by holder
                    resizeElements(elements, holder, options);
                }
            }
            doResize();

            // handle flexible layout / font resize
            var delayedResizeHandler = function () {
                if (!ignoreResize) {
                    ignoreResize = true;
                    doResize();
                    clearTimeout(postResizeTimer);
                    postResizeTimer = setTimeout(function () {
                        doResize();
                        setTimeout(function () {
                            ignoreResize = false;
                        }, 10);
                    }, 100);
                }
            };

            // handle flexible/responsive layout
            if (options.flexible) {
                $(window).bind('resize orientationchange fontresize', delayedResizeHandler);
            }

            // handle complete page load including images and fonts
            $(window).bind('load', delayedResizeHandler);
        });
    };

    // detect css min-height support
    var supportMinHeight = typeof document.documentElement.style.maxHeight !== 'undefined';

    // get elements by rows
    function resizeElementsByRows(boxes, options) {
        var currentRow = $(), maxHeight, maxCalcHeight = 0, firstOffset = boxes.eq(0).offset().top;
        boxes.each(function (ind) {
            var curItem = $(this);
            if (curItem.offset().top === firstOffset) {
                currentRow = currentRow.add(this);
            } else {
                maxHeight = getMaxHeight(currentRow);
                maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
                currentRow = curItem;
                firstOffset = curItem.offset().top;
            }
        });
        if (currentRow.length) {
            maxHeight = getMaxHeight(currentRow);
            maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
        }
        if (options.biggestHeight) {
            boxes.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', maxCalcHeight);
        }
    }

    // calculate max element height
    function getMaxHeight(boxes) {
        var maxHeight = 0;
        boxes.each(function () {
            maxHeight = Math.max(maxHeight, $(this).outerHeight());
        });
        return maxHeight;
    }

    // resize helper function
    function resizeElements(boxes, parent, options) {
        var calcHeight;
        var parentHeight = typeof parent === 'number' ? parent : parent.height();
        boxes.removeClass(options.leftEdgeClass).removeClass(options.rightEdgeClass).each(function (i) {
            var element = $(this);
            var depthDiffHeight = 0;
            var isBorderBox = element.css('boxSizing') === 'border-box' || element.css('-moz-box-sizing') === 'border-box' || element.css('-webkit-box-sizing') === 'border-box';

            if (typeof parent !== 'number') {
                element.parents().each(function () {
                    var tmpParent = $(this);
                    if (parent.is(this)) {
                        return false;
                    } else {
                        depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
                    }
                });
            }
            calcHeight = parentHeight - depthDiffHeight;
            calcHeight -= isBorderBox ? 0 : element.outerHeight() - element.height();

            if (calcHeight > 0) {
                element.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', calcHeight);
            }
        });
        boxes.filter(':first').addClass(options.leftEdgeClass);
        boxes.filter(':last').addClass(options.rightEdgeClass);
        return calcHeight;
    }
}(jQuery));


/*
 * jQuery retina cover plugin
*/
; (function ($) {
    'use strict';

    var styleRules = {};
    var templates = {
        '2x': [
            '(-webkit-min-device-pixel-ratio: 1.5)',
            '(min-resolution: 192dpi)',
            '(min-device-pixel-ratio: 1.5)',
            '(min-resolution: 1.5dppx)'
        ],
        '3x': [
            '(-webkit-min-device-pixel-ratio: 3)',
            '(min-resolution: 384dpi)',
            '(min-device-pixel-ratio: 3)',
            '(min-resolution: 3dppx)'
        ]
    };

    function addSimple(imageSrc, media, id) {
        var style = buildRule(id, imageSrc);

        addRule(media, style);
    }

    function addRetina(imageData, media, id) {
        var currentRules = templates[imageData[1]].slice();
        var patchedRules = currentRules;
        var style = buildRule(id, imageData[0]);

        if (media !== 'default') {
            patchedRules = $.map(currentRules, function (ele, i) {
                return ele + ' and ' + media;
            });
        }

        media = patchedRules.join(',');

        addRule(media, style);
    }

    function buildRule(id, src) {
        return '#' + id + '{background-image: url("' + src + '");}';
    }

    function addRule(media, rule) {
        var $styleTag = styleRules[media];
        var styleTagData;
        var rules = '';

        if (media === 'default') {
            rules = rule + ' ';
        } else {
            rules = '@media ' + media + '{' + rule + '}';
        }

        if (!$styleTag) {
            styleRules[media] = $('<style>').text(rules).appendTo('head');
        } else {
            styleTagData = $styleTag.text();
            styleTagData = styleTagData.substring(0, styleTagData.length - 2) + ' }' + rule + '}';
            $styleTag.text(styleTagData);
        }
    }

    $.fn.retinaCover = function () {
        return this.each(function () {
            var $block = $(this);
            var $items = $block.children('[data-srcset]');
            var id = 'bg-stretch' + Date.now() + (Math.random() * 1000).toFixed(0);

            if ($items.length) {
                $block.attr('id', id);

                $items.each(function () {
                    var $item = $(this);
                    var data = $item.data('srcset').split(', ');
                    var media = $item.data('media') || 'default';
                    var dataLength = data.length;
                    var itemData;
                    var i;

                    for (i = 0; i < dataLength; i++) {
                        itemData = data[i].split(' ');

                        if (itemData.length === 1) {
                            addSimple(itemData[0], media, id);
                        } else {
                            addRetina(itemData, media, id);
                        }
                    }
                });
            }

            $items.detach();
        });
    };
}(jQuery));

/*!
 * JavaScript Custom Forms
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
*/
; (function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        root.jcf = factory(jQuery);
    }
}(this, function ($) {
    'use strict';

    // define version
    var version = '1.1.3';

    // private variables
    var customInstances = [];

    // default global options
    var commonOptions = {
        optionsKey: 'jcf',
        dataKey: 'jcf-instance',
        rtlClass: 'jcf-rtl',
        focusClass: 'jcf-focus',
        pressedClass: 'jcf-pressed',
        disabledClass: 'jcf-disabled',
        hiddenClass: 'jcf-hidden',
        resetAppearanceClass: 'jcf-reset-appearance',
        unselectableClass: 'jcf-unselectable'
    };

    // detect device type
    var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
        isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);
    commonOptions.isMobileDevice = !!(isTouchDevice || isWinPhoneDevice);

    var isIOS = /(iPad|iPhone).*OS ([0-9_]*) .*/.exec(navigator.userAgent);
    if (isIOS) isIOS = parseFloat(isIOS[2].replace(/_/g, '.'));
    commonOptions.ios = isIOS;

    // create global stylesheet if custom forms are used
    var createStyleSheet = function () {
        var styleTag = $('<style>').appendTo('head'),
            styleSheet = styleTag.prop('sheet') || styleTag.prop('styleSheet');

        // crossbrowser style handling
        var addCSSRule = function (selector, rules, index) {
            if (styleSheet.insertRule) {
                styleSheet.insertRule(selector + '{' + rules + '}', index);
            } else {
                styleSheet.addRule(selector, rules, index);
            }
        };

        // add special rules
        addCSSRule('.' + commonOptions.hiddenClass, 'position:absolute !important;left:-9999px !important;height:1px !important;width:1px !important;margin:0 !important;border-width:0 !important;-webkit-appearance:none;-moz-appearance:none;appearance:none');
        addCSSRule('.' + commonOptions.rtlClass + ' .' + commonOptions.hiddenClass, 'right:-9999px !important; left: auto !important');
        addCSSRule('.' + commonOptions.unselectableClass, '-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-tap-highlight-color: rgba(0,0,0,0);');
        addCSSRule('.' + commonOptions.resetAppearanceClass, 'background: none; border: none; -webkit-appearance: none; appearance: none; opacity: 0; filter: alpha(opacity=0);');

        // detect rtl pages
        var html = $('html'), body = $('body');
        if (html.css('direction') === 'rtl' || body.css('direction') === 'rtl') {
            html.addClass(commonOptions.rtlClass);
        }

        // handle form reset event
        html.on('reset', function () {
            setTimeout(function () {
                api.refreshAll();
            }, 0);
        });

        // mark stylesheet as created
        commonOptions.styleSheetCreated = true;
    };

    // simplified pointer events handler
    (function () {
        var pointerEventsSupported = navigator.pointerEnabled || navigator.msPointerEnabled,
            touchEventsSupported = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
            eventList, eventMap = {}, eventPrefix = 'jcf-';

        // detect events to attach
        if (pointerEventsSupported) {
            eventList = {
                pointerover: navigator.pointerEnabled ? 'pointerover' : 'MSPointerOver',
                pointerdown: navigator.pointerEnabled ? 'pointerdown' : 'MSPointerDown',
                pointermove: navigator.pointerEnabled ? 'pointermove' : 'MSPointerMove',
                pointerup: navigator.pointerEnabled ? 'pointerup' : 'MSPointerUp'
            };
        } else {
            eventList = {
                pointerover: 'mouseover',
                pointerdown: 'mousedown' + (touchEventsSupported ? ' touchstart' : ''),
                pointermove: 'mousemove' + (touchEventsSupported ? ' touchmove' : ''),
                pointerup: 'mouseup' + (touchEventsSupported ? ' touchend' : '')
            };
        }

        // create event map
        $.each(eventList, function (targetEventName, fakeEventList) {
            $.each(fakeEventList.split(' '), function (index, fakeEventName) {
                eventMap[fakeEventName] = targetEventName;
            });
        });

        // jQuery event hooks
        $.each(eventList, function (eventName, eventHandlers) {
            eventHandlers = eventHandlers.split(' ');
            $.event.special[eventPrefix + eventName] = {
                setup: function () {
                    var self = this;
                    $.each(eventHandlers, function (index, fallbackEvent) {
                        if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, false);
                        else self['on' + fallbackEvent] = fixEvent;
                    });
                },
                teardown: function () {
                    var self = this;
                    $.each(eventHandlers, function (index, fallbackEvent) {
                        if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, false);
                        else self['on' + fallbackEvent] = null;
                    });
                }
            };
        });

        // check that mouse event are not simulated by mobile browsers
        var lastTouch = null;
        var mouseEventSimulated = function (e) {
            var dx = Math.abs(e.pageX - lastTouch.x),
                dy = Math.abs(e.pageY - lastTouch.y),
                rangeDistance = 25;

            if (dx <= rangeDistance && dy <= rangeDistance) {
                return true;
            }
        };

        // normalize event
        var fixEvent = function (e) {
            var origEvent = e || window.event,
                touchEventData = null,
                targetEventName = eventMap[origEvent.type];

            e = $.event.fix(origEvent);
            e.type = eventPrefix + targetEventName;

            if (origEvent.pointerType) {
                switch (origEvent.pointerType) {
                    case 2: e.pointerType = 'touch'; break;
                    case 3: e.pointerType = 'pen'; break;
                    case 4: e.pointerType = 'mouse'; break;
                    default: e.pointerType = origEvent.pointerType;
                }
            } else {
                e.pointerType = origEvent.type.substr(0, 5); // "mouse" or "touch" word length
            }

            if (!e.pageX && !e.pageY) {
                touchEventData = origEvent.changedTouches ? origEvent.changedTouches[0] : origEvent;
                e.pageX = touchEventData.pageX;
                e.pageY = touchEventData.pageY;
            }

            if (origEvent.type === 'touchend') {
                lastTouch = { x: e.pageX, y: e.pageY };
            }
            if (e.pointerType === 'mouse' && lastTouch && mouseEventSimulated(e)) {
                return;
            } else {
                return ($.event.dispatch || $.event.handle).call(this, e);
            }
        };
    }());

    // custom mousewheel/trackpad handler
    (function () {
        var wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll').split(' '),
            shimEventName = 'jcf-mousewheel';

        $.event.special[shimEventName] = {
            setup: function () {
                var self = this;
                $.each(wheelEvents, function (index, fallbackEvent) {
                    if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, false);
                    else self['on' + fallbackEvent] = fixEvent;
                });
            },
            teardown: function () {
                var self = this;
                $.each(wheelEvents, function (index, fallbackEvent) {
                    if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, false);
                    else self['on' + fallbackEvent] = null;
                });
            }
        };

        var fixEvent = function (e) {
            var origEvent = e || window.event;
            e = $.event.fix(origEvent);
            e.type = shimEventName;

            // old wheel events handler
            if ('detail' in origEvent) { e.deltaY = -origEvent.detail; }
            if ('wheelDelta' in origEvent) { e.deltaY = -origEvent.wheelDelta; }
            if ('wheelDeltaY' in origEvent) { e.deltaY = -origEvent.wheelDeltaY; }
            if ('wheelDeltaX' in origEvent) { e.deltaX = -origEvent.wheelDeltaX; }

            // modern wheel event handler
            if ('deltaY' in origEvent) {
                e.deltaY = origEvent.deltaY;
            }
            if ('deltaX' in origEvent) {
                e.deltaX = origEvent.deltaX;
            }

            // handle deltaMode for mouse wheel
            e.delta = e.deltaY || e.deltaX;
            if (origEvent.deltaMode === 1) {
                var lineHeight = 16;
                e.delta *= lineHeight;
                e.deltaY *= lineHeight;
                e.deltaX *= lineHeight;
            }

            return ($.event.dispatch || $.event.handle).call(this, e);
        };
    }());

    // extra module methods
    var moduleMixin = {
        // provide function for firing native events
        fireNativeEvent: function (elements, eventName) {
            $(elements).each(function () {
                var element = this, eventObject;
                if (element.dispatchEvent) {
                    eventObject = document.createEvent('HTMLEvents');
                    eventObject.initEvent(eventName, true, true);
                    element.dispatchEvent(eventObject);
                } else if (document.createEventObject) {
                    eventObject = document.createEventObject();
                    eventObject.target = element;
                    element.fireEvent('on' + eventName, eventObject);
                }
            });
        },
        // bind event handlers for module instance (functions beggining with "on")
        bindHandlers: function () {
            var self = this;
            $.each(self, function (propName, propValue) {
                if (propName.indexOf('on') === 0 && $.isFunction(propValue)) {
                    // dont use $.proxy here because it doesn't create unique handler
                    self[propName] = function () {
                        return propValue.apply(self, arguments);
                    };
                }
            });
        }
    };

    // public API
    var api = {
        version: version,
        modules: {},
        getOptions: function () {
            return $.extend({}, commonOptions);
        },
        setOptions: function (moduleName, moduleOptions) {
            if (arguments.length > 1) {
                // set module options
                if (this.modules[moduleName]) {
                    $.extend(this.modules[moduleName].prototype.options, moduleOptions);
                }
            } else {
                // set common options
                $.extend(commonOptions, moduleName);
            }
        },
        addModule: function (proto) {
            // add module to list
            var Module = function (options) {
                // save instance to collection
                if (!options.element.data(commonOptions.dataKey)) {
                    options.element.data(commonOptions.dataKey, this);
                }
                customInstances.push(this);

                // save options
                this.options = $.extend({}, commonOptions, this.options, getInlineOptions(options.element), options);

                // bind event handlers to instance
                this.bindHandlers();

                // call constructor
                this.init.apply(this, arguments);
            };

            // parse options from HTML attribute
            var getInlineOptions = function (element) {
                var dataOptions = element.data(commonOptions.optionsKey),
                    attrOptions = element.attr(commonOptions.optionsKey);

                if (dataOptions) {
                    return dataOptions;
                } else if (attrOptions) {
                    try {
                        return $.parseJSON(attrOptions);
                    } catch (e) {
                        // ignore invalid attributes
                    }
                }
            };

            // set proto as prototype for new module
            Module.prototype = proto;

            // add mixin methods to module proto
            $.extend(proto, moduleMixin);
            if (proto.plugins) {
                $.each(proto.plugins, function (pluginName, plugin) {
                    $.extend(plugin.prototype, moduleMixin);
                });
            }

            // override destroy method
            var originalDestroy = Module.prototype.destroy;
            Module.prototype.destroy = function () {
                this.options.element.removeData(this.options.dataKey);

                for (var i = customInstances.length - 1; i >= 0; i--) {
                    if (customInstances[i] === this) {
                        customInstances.splice(i, 1);
                        break;
                    }
                }

                if (originalDestroy) {
                    originalDestroy.apply(this, arguments);
                }
            };

            // save module to list
            this.modules[proto.name] = Module;
        },
        getInstance: function (element) {
            return $(element).data(commonOptions.dataKey);
        },
        replace: function (elements, moduleName, customOptions) {
            var self = this,
                instance;

            if (!commonOptions.styleSheetCreated) {
                createStyleSheet();
            }

            $(elements).each(function () {
                var moduleOptions,
                    element = $(this);

                instance = element.data(commonOptions.dataKey);
                if (instance) {
                    instance.refresh();
                } else {
                    if (!moduleName) {
                        $.each(self.modules, function (currentModuleName, module) {
                            if (module.prototype.matchElement.call(module.prototype, element)) {
                                moduleName = currentModuleName;
                                return false;
                            }
                        });
                    }
                    if (moduleName) {
                        moduleOptions = $.extend({ element: element }, customOptions);
                        instance = new self.modules[moduleName](moduleOptions);
                    }
                }
            });
            return instance;
        },
        refresh: function (elements) {
            $(elements).each(function () {
                var instance = $(this).data(commonOptions.dataKey);
                if (instance) {
                    instance.refresh();
                }
            });
        },
        destroy: function (elements) {
            $(elements).each(function () {
                var instance = $(this).data(commonOptions.dataKey);
                if (instance) {
                    instance.destroy();
                }
            });
        },
        replaceAll: function (context) {
            var self = this;
            $.each(this.modules, function (moduleName, module) {
                $(module.prototype.selector, context).each(function () {
                    if (this.className.indexOf('jcf-ignore') < 0) {
                        self.replace(this, moduleName);
                    }
                });
            });
        },
        refreshAll: function (context) {
            if (context) {
                $.each(this.modules, function (moduleName, module) {
                    $(module.prototype.selector, context).each(function () {
                        var instance = $(this).data(commonOptions.dataKey);
                        if (instance) {
                            instance.refresh();
                        }
                    });
                });
            } else {
                for (var i = customInstances.length - 1; i >= 0; i--) {
                    customInstances[i].refresh();
                }
            }
        },
        destroyAll: function (context) {
            if (context) {
                $.each(this.modules, function (moduleName, module) {
                    $(module.prototype.selector, context).each(function (index, element) {
                        var instance = $(element).data(commonOptions.dataKey);
                        if (instance) {
                            instance.destroy();
                        }
                    });
                });
            } else {
                while (customInstances.length) {
                    customInstances[0].destroy();
                }
            }
        }
    };

    // always export API to the global window object
    window.jcf = api;

    return api;
}));

/*!
* JavaScript Custom Forms : Select Module
*
* Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
* Released under the MIT license (LICENSE.txt)
*
* Version: 1.1.3
*/
; (function ($, window) {
    'use strict';

    jcf.addModule({
        name: 'Select',
        selector: 'select',
        options: {
            element: null,
            multipleCompactStyle: false
        },
        plugins: {
            ListBox: ListBox,
            ComboBox: ComboBox,
            SelectList: SelectList
        },
        matchElement: function (element) {
            return element.is('select');
        },
        init: function () {
            this.element = $(this.options.element);
            this.createInstance();
        },
        isListBox: function () {
            return this.element.is('[size]:not([jcf-size]), [multiple]');
        },
        createInstance: function () {
            if (this.instance) {
                this.instance.destroy();
            }
            if (this.isListBox() && !this.options.multipleCompactStyle) {
                this.instance = new ListBox(this.options);
            } else {
                this.instance = new ComboBox(this.options);
            }
        },
        refresh: function () {
            var typeMismatch = (this.isListBox() && this.instance instanceof ComboBox) ||
                (!this.isListBox() && this.instance instanceof ListBox);

            if (typeMismatch) {
                this.createInstance();
            } else {
                this.instance.refresh();
            }
        },
        destroy: function () {
            this.instance.destroy();
        }
    });

    // combobox module
    function ComboBox(options) {
        this.options = $.extend({
            wrapNative: true,
            wrapNativeOnMobile: true,
            fakeDropInBody: true,
            useCustomScroll: true,
            flipDropToFit: true,
            maxVisibleItems: 10,
            fakeAreaStructure: '<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>',
            fakeDropStructure: '<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>',
            optionClassPrefix: 'jcf-option-',
            selectClassPrefix: 'jcf-select-',
            dropContentSelector: '.jcf-select-drop-content',
            selectTextSelector: '.jcf-select-text',
            dropActiveClass: 'jcf-drop-active',
            flipDropClass: 'jcf-drop-flipped'
        }, options);
        this.init();
    }
    $.extend(ComboBox.prototype, {
        init: function () {
            this.initStructure();
            this.bindHandlers();
            this.attachEvents();
            this.refresh();
        },
        initStructure: function () {
            // prepare structure
            this.win = $(window);
            this.doc = $(document);
            this.realElement = $(this.options.element);
            this.fakeElement = $(this.options.fakeAreaStructure).insertAfter(this.realElement);
            this.selectTextContainer = this.fakeElement.find(this.options.selectTextSelector);
            this.selectText = $('<span></span>').appendTo(this.selectTextContainer);
            makeUnselectable(this.fakeElement);

            // copy classes from original select
            this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));

            // handle compact multiple style
            if (this.realElement.prop('multiple')) {
                this.fakeElement.addClass('jcf-compact-multiple');
            }

            // detect device type and dropdown behavior
            if (this.options.isMobileDevice && this.options.wrapNativeOnMobile && !this.options.wrapNative) {
                this.options.wrapNative = true;
            }

            if (this.options.wrapNative) {
                // wrap native select inside fake block
                this.realElement.prependTo(this.fakeElement).css({
                    position: 'absolute',
                    height: '100%',
                    width: '100%'
                }).addClass(this.options.resetAppearanceClass);
            } else {
                // just hide native select
                this.realElement.addClass(this.options.hiddenClass);
                this.fakeElement.attr('title', this.realElement.attr('title'));
                this.fakeDropTarget = this.options.fakeDropInBody ? $('body') : this.fakeElement;
            }
        },
        attachEvents: function () {
            // delayed refresh handler
            var self = this;
            this.delayedRefresh = function () {
                setTimeout(function () {
                    self.refresh();
                    if (self.list) {
                        self.list.refresh();
                        self.list.scrollToActiveOption();
                    }
                }, 1);
            };

            // native dropdown event handlers
            if (this.options.wrapNative) {
                this.realElement.on({
                    focus: this.onFocus,
                    change: this.onChange,
                    click: this.onChange,
                    keydown: this.onChange
                });
            } else {
                // custom dropdown event handlers
                this.realElement.on({
                    focus: this.onFocus,
                    change: this.onChange,
                    keydown: this.onKeyDown
                });
                this.fakeElement.on({
                    'jcf-pointerdown': this.onSelectAreaPress
                });
            }
        },
        onKeyDown: function (e) {
            if (e.which === 13) {
                this.toggleDropdown();
            } else if (this.dropActive) {
                this.delayedRefresh();
            }
        },
        onChange: function () {
            this.refresh();
        },
        onFocus: function () {
            if (!this.pressedFlag || !this.focusedFlag) {
                this.fakeElement.addClass(this.options.focusClass);
                this.realElement.on('blur', this.onBlur);
                this.toggleListMode(true);
                this.focusedFlag = true;
            }
        },
        onBlur: function () {
            if (!this.pressedFlag) {
                this.fakeElement.removeClass(this.options.focusClass);
                this.realElement.off('blur', this.onBlur);
                this.toggleListMode(false);
                this.focusedFlag = false;
            }
        },
        onResize: function () {
            if (this.dropActive) {
                this.hideDropdown();
            }
        },
        onSelectDropPress: function () {
            this.pressedFlag = true;
        },
        onSelectDropRelease: function (e, pointerEvent) {
            this.pressedFlag = false;
            if (pointerEvent.pointerType === 'mouse') {
                this.realElement.focus();
            }
        },
        onSelectAreaPress: function (e) {
            // skip click if drop inside fake element or real select is disabled
            var dropClickedInsideFakeElement = !this.options.fakeDropInBody && $(e.target).closest(this.dropdown).length;
            if (dropClickedInsideFakeElement || e.button > 1 || this.realElement.is(':disabled')) {
                return;
            }

            // toggle dropdown visibility
            this.selectOpenedByEvent = e.pointerType;
            this.toggleDropdown();

            // misc handlers
            if (!this.focusedFlag) {
                if (e.pointerType === 'mouse') {
                    this.realElement.focus();
                } else {
                    this.onFocus(e);
                }
            }
            this.pressedFlag = true;
            this.fakeElement.addClass(this.options.pressedClass);
            this.doc.on('jcf-pointerup', this.onSelectAreaRelease);
        },
        onSelectAreaRelease: function (e) {
            if (this.focusedFlag && e.pointerType === 'mouse') {
                this.realElement.focus();
            }
            this.pressedFlag = false;
            this.fakeElement.removeClass(this.options.pressedClass);
            this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
        },
        onOutsideClick: function (e) {
            var target = $(e.target),
                clickedInsideSelect = target.closest(this.fakeElement).length || target.closest(this.dropdown).length;

            if (!clickedInsideSelect) {
                this.hideDropdown();
            }
        },
        onSelect: function () {
            this.refresh();

            if (this.realElement.prop('multiple')) {
                this.repositionDropdown();
            } else {
                this.hideDropdown();
            }

            this.fireNativeEvent(this.realElement, 'change');
        },
        toggleListMode: function (state) {
            if (!this.options.wrapNative) {
                if (state) {
                    // temporary change select to list to avoid appearing of native dropdown
                    this.realElement.attr({
                        size: 4,
                        'jcf-size': ''
                    });
                } else {
                    // restore select from list mode to dropdown select
                    if (!this.options.wrapNative) {
                        this.realElement.removeAttr('size jcf-size');
                    }
                }
            }
        },
        createDropdown: function () {
            // destroy previous dropdown if needed
            if (this.dropdown) {
                this.list.destroy();
                this.dropdown.remove();
            }

            // create new drop container
            this.dropdown = $(this.options.fakeDropStructure).appendTo(this.fakeDropTarget);
            this.dropdown.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
            makeUnselectable(this.dropdown);

            // handle compact multiple style
            if (this.realElement.prop('multiple')) {
                this.dropdown.addClass('jcf-compact-multiple');
            }

            // set initial styles for dropdown in body
            if (this.options.fakeDropInBody) {
                this.dropdown.css({
                    position: 'absolute',
                    top: -9999
                });
            }

            // create new select list instance
            this.list = new SelectList({
                useHoverClass: true,
                handleResize: false,
                alwaysPreventMouseWheel: true,
                maxVisibleItems: this.options.maxVisibleItems,
                useCustomScroll: this.options.useCustomScroll,
                holder: this.dropdown.find(this.options.dropContentSelector),
                multipleSelectWithoutKey: this.realElement.prop('multiple'),
                element: this.realElement
            });
            $(this.list).on({
                select: this.onSelect,
                press: this.onSelectDropPress,
                release: this.onSelectDropRelease
            });
        },
        repositionDropdown: function () {
            var selectOffset = this.fakeElement.offset(),
                selectWidth = this.fakeElement.outerWidth(),
                selectHeight = this.fakeElement.outerHeight(),
                dropHeight = this.dropdown.css('width', selectWidth).outerHeight(),
                winScrollTop = this.win.scrollTop(),
                winHeight = this.win.height(),
                calcTop, calcLeft, bodyOffset, needFlipDrop = false;

            // check flip drop position
            if (selectOffset.top + selectHeight + dropHeight > winScrollTop + winHeight && selectOffset.top - dropHeight > winScrollTop) {
                needFlipDrop = true;
            }

            if (this.options.fakeDropInBody) {
                bodyOffset = this.fakeDropTarget.css('position') !== 'static' ? this.fakeDropTarget.offset().top : 0;
                if (this.options.flipDropToFit && needFlipDrop) {
                    // calculate flipped dropdown position
                    calcLeft = selectOffset.left;
                    calcTop = selectOffset.top - dropHeight - bodyOffset;
                } else {
                    // calculate default drop position
                    calcLeft = selectOffset.left;
                    calcTop = selectOffset.top + selectHeight - bodyOffset;
                }

                // update drop styles
                this.dropdown.css({
                    width: selectWidth,
                    left: calcLeft,
                    top: calcTop
                });
            }

            // refresh flipped class
            this.dropdown.add(this.fakeElement).toggleClass(this.options.flipDropClass, this.options.flipDropToFit && needFlipDrop);
        },
        showDropdown: function () {
            // do not show empty custom dropdown
            if (!this.realElement.prop('options').length) {
                return;
            }

            // create options list if not created
            if (!this.dropdown) {
                this.createDropdown();
            }

            // show dropdown
            this.dropActive = true;
            this.dropdown.appendTo(this.fakeDropTarget);
            this.fakeElement.addClass(this.options.dropActiveClass);
            this.refreshSelectedText();
            this.repositionDropdown();
            this.list.setScrollTop(this.savedScrollTop);
            this.list.refresh();

            // add temporary event handlers
            this.win.on('resize', this.onResize);
            this.doc.on('jcf-pointerdown', this.onOutsideClick);
        },
        hideDropdown: function () {
            if (this.dropdown) {
                this.savedScrollTop = this.list.getScrollTop();
                this.fakeElement.removeClass(this.options.dropActiveClass + ' ' + this.options.flipDropClass);
                this.dropdown.removeClass(this.options.flipDropClass).detach();
                this.doc.off('jcf-pointerdown', this.onOutsideClick);
                this.win.off('resize', this.onResize);
                this.dropActive = false;
                if (this.selectOpenedByEvent === 'touch') {
                    this.onBlur();
                }
            }
        },
        toggleDropdown: function () {
            if (this.dropActive) {
                this.hideDropdown();
            } else {
                this.showDropdown();
            }
        },
        refreshSelectedText: function () {
            // redraw selected area
            var selectedIndex = this.realElement.prop('selectedIndex'),
                selectedOption = this.realElement.prop('options')[selectedIndex],
                selectedOptionImage = selectedOption ? selectedOption.getAttribute('data-image') : null,
                selectedOptionText = '',
                selectedOptionClasses,
                self = this;

            if (this.realElement.prop('multiple')) {
                $.each(this.realElement.prop('options'), function (index, option) {
                    if (option.selected) {
                        selectedOptionText += (selectedOptionText ? ', ' : '') + option.innerHTML;
                    }
                });
                if (!selectedOptionText) {
                    selectedOptionText = self.realElement.attr('placeholder') || '';
                }
                this.selectText.removeAttr('class').html(selectedOptionText);
            } else if (!selectedOption) {
                if (this.selectImage) {
                    this.selectImage.hide();
                }
                this.selectText.removeAttr('class').empty();
            } else if (this.currentSelectedText !== selectedOption.innerHTML || this.currentSelectedImage !== selectedOptionImage) {
                selectedOptionClasses = getPrefixedClasses(selectedOption.className, this.options.optionClassPrefix);
                this.selectText.attr('class', selectedOptionClasses).html(selectedOption.innerHTML);

                if (selectedOptionImage) {
                    if (!this.selectImage) {
                        this.selectImage = $('<img>').prependTo(this.selectTextContainer).hide();
                    }
                    this.selectImage.attr('src', selectedOptionImage).show();
                } else if (this.selectImage) {
                    this.selectImage.hide();
                }

                this.currentSelectedText = selectedOption.innerHTML;
                this.currentSelectedImage = selectedOptionImage;
            }
        },
        refresh: function () {
            // refresh fake select visibility
            if (this.realElement.prop('style').display === 'none') {
                this.fakeElement.hide();
            } else {
                this.fakeElement.show();
            }

            // refresh selected text
            this.refreshSelectedText();

            // handle disabled state
            this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
        },
        destroy: function () {
            // restore structure
            if (this.options.wrapNative) {
                this.realElement.insertBefore(this.fakeElement).css({
                    position: '',
                    height: '',
                    width: ''
                }).removeClass(this.options.resetAppearanceClass);
            } else {
                this.realElement.removeClass(this.options.hiddenClass);
                if (this.realElement.is('[jcf-size]')) {
                    this.realElement.removeAttr('size jcf-size');
                }
            }

            // removing element will also remove its event handlers
            this.fakeElement.remove();

            // remove other event handlers
            this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
            this.realElement.off({
                focus: this.onFocus
            });
        }
    });

    // listbox module
    function ListBox(options) {
        this.options = $.extend({
            wrapNative: true,
            useCustomScroll: true,
            fakeStructure: '<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>',
            selectClassPrefix: 'jcf-select-',
            listHolder: '.jcf-list-wrapper'
        }, options);
        this.init();
    }
    $.extend(ListBox.prototype, {
        init: function () {
            this.bindHandlers();
            this.initStructure();
            this.attachEvents();
        },
        initStructure: function () {
            this.realElement = $(this.options.element);
            this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
            this.listHolder = this.fakeElement.find(this.options.listHolder);
            makeUnselectable(this.fakeElement);

            // copy classes from original select
            this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
            this.realElement.addClass(this.options.hiddenClass);

            this.list = new SelectList({
                useCustomScroll: this.options.useCustomScroll,
                holder: this.listHolder,
                selectOnClick: false,
                element: this.realElement
            });
        },
        attachEvents: function () {
            // delayed refresh handler
            var self = this;
            this.delayedRefresh = function (e) {
                if (e && e.which === 16) {
                    // ignore SHIFT key
                    return;
                } else {
                    clearTimeout(self.refreshTimer);
                    self.refreshTimer = setTimeout(function () {
                        self.refresh();
                        self.list.scrollToActiveOption();
                    }, 1);
                }
            };

            // other event handlers
            this.realElement.on({
                focus: this.onFocus,
                click: this.delayedRefresh,
                keydown: this.delayedRefresh
            });

            // select list event handlers
            $(this.list).on({
                select: this.onSelect,
                press: this.onFakeOptionsPress,
                release: this.onFakeOptionsRelease
            });
        },
        onFakeOptionsPress: function (e, pointerEvent) {
            this.pressedFlag = true;
            if (pointerEvent.pointerType === 'mouse') {
                this.realElement.focus();
            }
        },
        onFakeOptionsRelease: function (e, pointerEvent) {
            this.pressedFlag = false;
            if (pointerEvent.pointerType === 'mouse') {
                this.realElement.focus();
            }
        },
        onSelect: function () {
            this.fireNativeEvent(this.realElement, 'change');
            this.fireNativeEvent(this.realElement, 'click');
        },
        onFocus: function () {
            if (!this.pressedFlag || !this.focusedFlag) {
                this.fakeElement.addClass(this.options.focusClass);
                this.realElement.on('blur', this.onBlur);
                this.focusedFlag = true;
            }
        },
        onBlur: function () {
            if (!this.pressedFlag) {
                this.fakeElement.removeClass(this.options.focusClass);
                this.realElement.off('blur', this.onBlur);
                this.focusedFlag = false;
            }
        },
        refresh: function () {
            this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
            this.list.refresh();
        },
        destroy: function () {
            this.list.destroy();
            this.realElement.insertBefore(this.fakeElement).removeClass(this.options.hiddenClass);
            this.fakeElement.remove();
        }
    });

    // options list module
    function SelectList(options) {
        this.options = $.extend({
            holder: null,
            maxVisibleItems: 10,
            selectOnClick: true,
            useHoverClass: false,
            useCustomScroll: false,
            handleResize: true,
            multipleSelectWithoutKey: false,
            alwaysPreventMouseWheel: false,
            indexAttribute: 'data-index',
            cloneClassPrefix: 'jcf-option-',
            containerStructure: '<span class="jcf-list"><span class="jcf-list-content"></span></span>',
            containerSelector: '.jcf-list-content',
            captionClass: 'jcf-optgroup-caption',
            disabledClass: 'jcf-disabled',
            optionClass: 'jcf-option',
            groupClass: 'jcf-optgroup',
            hoverClass: 'jcf-hover',
            selectedClass: 'jcf-selected',
            scrollClass: 'jcf-scroll-active'
        }, options);
        this.init();
    }
    $.extend(SelectList.prototype, {
        init: function () {
            this.initStructure();
            this.refreshSelectedClass();
            this.attachEvents();
        },
        initStructure: function () {
            this.element = $(this.options.element);
            this.indexSelector = '[' + this.options.indexAttribute + ']';
            this.container = $(this.options.containerStructure).appendTo(this.options.holder);
            this.listHolder = this.container.find(this.options.containerSelector);
            this.lastClickedIndex = this.element.prop('selectedIndex');
            this.rebuildList();
        },
        attachEvents: function () {
            this.bindHandlers();
            this.listHolder.on('jcf-pointerdown', this.indexSelector, this.onItemPress);
            this.listHolder.on('jcf-pointerdown', this.onPress);

            if (this.options.useHoverClass) {
                this.listHolder.on('jcf-pointerover', this.indexSelector, this.onHoverItem);
            }
        },
        onPress: function (e) {
            $(this).trigger('press', e);
            this.listHolder.on('jcf-pointerup', this.onRelease);
        },
        onRelease: function (e) {
            $(this).trigger('release', e);
            this.listHolder.off('jcf-pointerup', this.onRelease);
        },
        onHoverItem: function (e) {
            var hoverIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute));
            this.fakeOptions.removeClass(this.options.hoverClass).eq(hoverIndex).addClass(this.options.hoverClass);
        },
        onItemPress: function (e) {
            if (e.pointerType === 'touch' || this.options.selectOnClick) {
                // select option after "click"
                this.tmpListOffsetTop = this.list.offset().top;
                this.listHolder.on('jcf-pointerup', this.indexSelector, this.onItemRelease);
            } else {
                // select option immediately
                this.onSelectItem(e);
            }
        },
        onItemRelease: function (e) {
            // remove event handlers and temporary data
            this.listHolder.off('jcf-pointerup', this.indexSelector, this.onItemRelease);

            // simulate item selection
            if (this.tmpListOffsetTop === this.list.offset().top) {
                this.listHolder.on('click', this.indexSelector, { savedPointerType: e.pointerType }, this.onSelectItem);
            }
            delete this.tmpListOffsetTop;
        },
        onSelectItem: function (e) {
            var clickedIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute)),
                pointerType = e.data && e.data.savedPointerType || e.pointerType || 'mouse',
                range;

            // remove click event handler
            this.listHolder.off('click', this.indexSelector, this.onSelectItem);

            // ignore clicks on disabled options
            if (e.button > 1 || this.realOptions[clickedIndex].disabled) {
                return;
            }

            if (this.element.prop('multiple')) {
                if (e.metaKey || e.ctrlKey || pointerType === 'touch' || this.options.multipleSelectWithoutKey) {
                    // if CTRL/CMD pressed or touch devices - toggle selected option
                    this.realOptions[clickedIndex].selected = !this.realOptions[clickedIndex].selected;
                } else if (e.shiftKey) {
                    // if SHIFT pressed - update selection
                    range = [this.lastClickedIndex, clickedIndex].sort(function (a, b) {
                        return a - b;
                    });
                    this.realOptions.each(function (index, option) {
                        option.selected = (index >= range[0] && index <= range[1]);
                    });
                } else {
                    // set single selected index
                    this.element.prop('selectedIndex', clickedIndex);
                }
            } else {
                this.element.prop('selectedIndex', clickedIndex);
            }

            // save last clicked option
            if (!e.shiftKey) {
                this.lastClickedIndex = clickedIndex;
            }

            // refresh classes
            this.refreshSelectedClass();

            // scroll to active item in desktop browsers
            if (pointerType === 'mouse') {
                this.scrollToActiveOption();
            }

            // make callback when item selected
            $(this).trigger('select');
        },
        rebuildList: function () {
            // rebuild options
            var self = this,
                rootElement = this.element[0];

            // recursively create fake options
            this.storedSelectHTML = rootElement.innerHTML;
            this.optionIndex = 0;
            this.list = $(this.createOptionsList(rootElement));
            this.listHolder.empty().append(this.list);
            this.realOptions = this.element.find('option');
            this.fakeOptions = this.list.find(this.indexSelector);
            this.fakeListItems = this.list.find('.' + this.options.captionClass + ',' + this.indexSelector);
            delete this.optionIndex;

            // detect max visible items
            var maxCount = this.options.maxVisibleItems,
                sizeValue = this.element.prop('size');
            if (sizeValue > 1 && !this.element.is('[jcf-size]')) {
                maxCount = sizeValue;
            }

            // handle scrollbar
            var needScrollBar = this.fakeOptions.length > maxCount;
            this.container.toggleClass(this.options.scrollClass, needScrollBar);
            if (needScrollBar) {
                // change max-height
                this.listHolder.css({
                    maxHeight: this.getOverflowHeight(maxCount),
                    overflow: 'auto'
                });

                if (this.options.useCustomScroll && jcf.modules.Scrollable) {
                    // add custom scrollbar if specified in options
                    jcf.replace(this.listHolder, 'Scrollable', {
                        handleResize: this.options.handleResize,
                        alwaysPreventMouseWheel: this.options.alwaysPreventMouseWheel
                    });
                    return;
                }
            }

            // disable edge wheel scrolling
            if (this.options.alwaysPreventMouseWheel) {
                this.preventWheelHandler = function (e) {
                    var currentScrollTop = self.listHolder.scrollTop(),
                        maxScrollTop = self.listHolder.prop('scrollHeight') - self.listHolder.innerHeight();

                    // check edge cases
                    if ((currentScrollTop <= 0 && e.deltaY < 0) || (currentScrollTop >= maxScrollTop && e.deltaY > 0)) {
                        e.preventDefault();
                    }
                };
                this.listHolder.on('jcf-mousewheel', this.preventWheelHandler);
            }
        },
        refreshSelectedClass: function () {
            var self = this,
                selectedItem,
                isMultiple = this.element.prop('multiple'),
                selectedIndex = this.element.prop('selectedIndex');

            if (isMultiple) {
                this.realOptions.each(function (index, option) {
                    self.fakeOptions.eq(index).toggleClass(self.options.selectedClass, !!option.selected);
                });
            } else {
                this.fakeOptions.removeClass(this.options.selectedClass + ' ' + this.options.hoverClass);
                selectedItem = this.fakeOptions.eq(selectedIndex).addClass(this.options.selectedClass);
                if (this.options.useHoverClass) {
                    selectedItem.addClass(this.options.hoverClass);
                }
            }
        },
        scrollToActiveOption: function () {
            // scroll to target option
            var targetOffset = this.getActiveOptionOffset();
            if (typeof targetOffset === 'number') {
                this.listHolder.prop('scrollTop', targetOffset);
            }
        },
        getSelectedIndexRange: function () {
            var firstSelected = -1, lastSelected = -1;
            this.realOptions.each(function (index, option) {
                if (option.selected) {
                    if (firstSelected < 0) {
                        firstSelected = index;
                    }
                    lastSelected = index;
                }
            });
            return [firstSelected, lastSelected];
        },
        getChangedSelectedIndex: function () {
            var selectedIndex = this.element.prop('selectedIndex'),
                targetIndex;

            if (this.element.prop('multiple')) {
                // multiple selects handling
                if (!this.previousRange) {
                    this.previousRange = [selectedIndex, selectedIndex];
                }
                this.currentRange = this.getSelectedIndexRange();
                targetIndex = this.currentRange[this.currentRange[0] !== this.previousRange[0] ? 0 : 1];
                this.previousRange = this.currentRange;
                return targetIndex;
            } else {
                // single choice selects handling
                return selectedIndex;
            }
        },
        getActiveOptionOffset: function () {
            // calc values
            var dropHeight = this.listHolder.height(),
                dropScrollTop = this.listHolder.prop('scrollTop'),
                currentIndex = this.getChangedSelectedIndex(),
                fakeOption = this.fakeOptions.eq(currentIndex),
                fakeOptionOffset = fakeOption.offset().top - this.list.offset().top,
                fakeOptionHeight = fakeOption.innerHeight();

            // scroll list
            if (fakeOptionOffset + fakeOptionHeight >= dropScrollTop + dropHeight) {
                // scroll down (always scroll to option)
                return fakeOptionOffset - dropHeight + fakeOptionHeight;
            } else if (fakeOptionOffset < dropScrollTop) {
                // scroll up to option
                return fakeOptionOffset;
            }
        },
        getOverflowHeight: function (sizeValue) {
            var item = this.fakeListItems.eq(sizeValue - 1),
                listOffset = this.list.offset().top,
                itemOffset = item.offset().top,
                itemHeight = item.innerHeight();

            return itemOffset + itemHeight - listOffset;
        },
        getScrollTop: function () {
            return this.listHolder.scrollTop();
        },
        setScrollTop: function (value) {
            this.listHolder.scrollTop(value);
        },
        createOption: function (option) {
            var newOption = document.createElement('span');
            newOption.className = this.options.optionClass;
            newOption.innerHTML = option.innerHTML;
            newOption.setAttribute(this.options.indexAttribute, this.optionIndex++);

            var optionImage, optionImageSrc = option.getAttribute('data-image');
            if (optionImageSrc) {
                optionImage = document.createElement('img');
                optionImage.src = optionImageSrc;
                newOption.insertBefore(optionImage, newOption.childNodes[0]);
            }
            if (option.disabled) {
                newOption.className += ' ' + this.options.disabledClass;
            }
            if (option.className) {
                newOption.className += ' ' + getPrefixedClasses(option.className, this.options.cloneClassPrefix);
            }
            return newOption;
        },
        createOptGroup: function (optgroup) {
            var optGroupContainer = document.createElement('span'),
                optGroupName = optgroup.getAttribute('label'),
                optGroupCaption, optGroupList;

            // create caption
            optGroupCaption = document.createElement('span');
            optGroupCaption.className = this.options.captionClass;
            optGroupCaption.innerHTML = optGroupName;
            optGroupContainer.appendChild(optGroupCaption);

            // create list of options
            if (optgroup.children.length) {
                optGroupList = this.createOptionsList(optgroup);
                optGroupContainer.appendChild(optGroupList);
            }

            optGroupContainer.className = this.options.groupClass;
            return optGroupContainer;
        },
        createOptionContainer: function () {
            var optionContainer = document.createElement('li');
            return optionContainer;
        },
        createOptionsList: function (container) {
            var self = this,
                list = document.createElement('ul');

            $.each(container.children, function (index, currentNode) {
                var item = self.createOptionContainer(currentNode),
                    newNode;

                switch (currentNode.tagName.toLowerCase()) {
                    case 'option': newNode = self.createOption(currentNode); break;
                    case 'optgroup': newNode = self.createOptGroup(currentNode); break;
                }
                list.appendChild(item).appendChild(newNode);
            });
            return list;
        },
        refresh: function () {
            // check for select innerHTML changes
            if (this.storedSelectHTML !== this.element.prop('innerHTML')) {
                this.rebuildList();
            }

            // refresh custom scrollbar
            var scrollInstance = jcf.getInstance(this.listHolder);
            if (scrollInstance) {
                scrollInstance.refresh();
            }

            // refresh selectes classes
            this.refreshSelectedClass();
        },
        destroy: function () {
            this.listHolder.off('jcf-mousewheel', this.preventWheelHandler);
            this.listHolder.off('jcf-pointerdown', this.indexSelector, this.onSelectItem);
            this.listHolder.off('jcf-pointerover', this.indexSelector, this.onHoverItem);
            this.listHolder.off('jcf-pointerdown', this.onPress);
        }
    });

    // helper functions
    var getPrefixedClasses = function (className, prefixToAdd) {
        return className ? className.replace(/[\s]*([\S]+)+[\s]*/gi, prefixToAdd + '$1 ') : '';
    };
    var makeUnselectable = (function () {
        var unselectableClass = jcf.getOptions().unselectableClass;
        function preventHandler(e) {
            e.preventDefault();
        }
        return function (node) {
            node.addClass(unselectableClass).on('selectstart', preventHandler);
        };
    }());

}(jQuery, this));


/*
 * jQuery BG Parallax plugin
*/
; (function ($) {
    'use strict';

    var isTouchDevice = /MSIE 10.*Touch/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    var ParallaxController = (function () {
        var $win = $(window);
        var items = [];
        var winProps = {
            width: 0,
            height: 0,
            scrollTop: 0
        };

        return {
            init: function () {
                $win.on('load resize orientationchange', this.resizeHandler.bind(this));
                $win.on('scroll', this.scrollHandler.bind(this));

                this.resizeHandler();
            },

            resizeHandler: function () {
                winProps.width = $win.width();
                winProps.height = $win.height();

                $.each(items, this.calculateSize.bind(this));
            },

            scrollHandler: function () {
                winProps.scrollTop = $win.scrollTop();

                $.each(items, this.calculateScroll.bind(this));
            },

            calculateSize: function (i) {
                var item = items[i];

                item.height = Math.max(item.$el.outerHeight(), winProps.height);
                item.width = item.$el.outerWidth();
                item.topOffset = item.$el.offset().top;

                var styles = this.getDimensions({
                    imageRatio: item.imageRatio,
                    itemWidth: item.width,
                    itemHeight: item.height
                });

                item.$el.css({
                    backgroundSize: Math.round(styles.width) + 'px ' + Math.round(styles.height) + 'px'
                });

                this.calculateScroll(i);
            },

            calculateScroll: function (i) {
                var item = items[i];

                if (winProps.scrollTop + winProps.height > item.topOffset && winProps.scrollTop < item.topOffset + item.height) {
                    var ratio = (winProps.scrollTop + winProps.height - item.topOffset) / (winProps.height + item.height);

                    item.$el.css({
                        backgroundPosition: '50% ' + (winProps.height * (item.options.parallaxOffset / 100) - (winProps.height + item.height) * ratio * (item.options.parallaxOffset / 100)) + 'px'
                    });
                }
            },

            getDimensions: function (data) {
                var slideHeight = data.itemWidth / data.imageRatio;

                if (slideHeight < data.itemHeight) {
                    slideHeight = data.itemHeight;
                    data.itemWidth = slideHeight * data.imageRatio;
                }
                return {
                    width: data.itemWidth,
                    height: slideHeight,
                    top: (data.itemHeight - slideHeight) / 2,
                    left: (data.itemWidth - data.itemWidth) / 2
                };
            },

            getRatio: function (image) {
                if (image.prop('naturalWidth')) {
                    return image.prop('naturalWidth') / image.prop('naturalHeight');
                } else {
                    var img = new Image();
                    img.src = image.prop('src');
                    return img.width / img.height;
                }
            },

            imageLoaded: function (image, callback) {
                var self = this;
                var loadHandler = function () {
                    callback.call(self);
                };
                if (image.prop('complete')) {
                    loadHandler();
                } else {
                    image.one('load', loadHandler);
                }
            },

            add: function (el, options) {
                var $el = $(el);
                var $image = $el.find(options.image);

                this.imageLoaded($image, function () {
                    var imageRatio = this.getRatio($image);

                    $el.css({
                        backgroundImage: 'url(' + $image.attr('src') + ')',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: !isTouchDevice ? 'fixed' : 'scroll',
                        backgroundSize: 'cover'
                    });

                    $image.remove();

                    if (isTouchDevice) {
                        $el.addClass(options.fallbackClass);
                        return;
                    }

                    options.parallaxOffset = Math.abs(options.parallaxOffset);

                    var newIndex = items.push({
                        $el: $(el),
                        options: options,
                        imageRatio: imageRatio
                    });

                    this.calculateSize(newIndex - 1);
                });
            }
        };
    }());

    ParallaxController.init();

    $.fn.parallaxBlock = function (options) {
        options = $.extend({
            parallaxOffset: 5, // percent from 0 - top 100 (from window height)
            fallbackClass: 'is-touch-device',
            image: 'img'
        }, options);

        return this.each(function () {
            if (this.added) {
                return;
            }

            this.added = true;
            ParallaxController.add(this, options);
        });
    };
}(jQuery));

/*
 * jQuery Accordion plugin new
*/
; (function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        root.SlideAccordion = factory(jQuery);
    }
}(this, function ($) {
    'use strict';
    var accHiddenClass = 'js-acc-hidden';

    function SlideAccordion(options) {
        this.options = $.extend(true, {
            allowClickWhenExpanded: false,
            activeClass: 'active',
            opener: '.opener',
            slider: '.slide',
            animSpeed: 300,
            collapsible: true,
            event: 'click',
            scrollToActiveItem: {
                enable: false,
                breakpoint: 767, // max-width
                animSpeed: 600,
                extraOffset: null
            }
        }, options);
        this.init();
    }

    SlideAccordion.prototype = {
        init: function () {
            if (this.options.holder) {
                this.findElements();
                this.setStateOnInit();
                this.attachEvents();
                this.makeCallback('onInit');
            }
        },

        findElements: function () {
            this.$holder = $(this.options.holder).data('SlideAccordion', this);
            this.$items = this.$holder.find(':has(' + this.options.slider + ')');
        },

        setStateOnInit: function () {
            var self = this;

            this.$items.each(function () {
                if (!$(this).hasClass(self.options.activeClass)) {
                    $(this).find(self.options.slider).addClass(accHiddenClass);
                }
            });
        },

        attachEvents: function () {
            var self = this;

            this.accordionToggle = function (e) {
                var $item = jQuery(this).closest(self.$items);
                var $actiItem = self.getActiveItem($item);

                if (!self.options.allowClickWhenExpanded || !$item.hasClass(self.options.activeClass)) {
                    e.preventDefault();
                    self.toggle($item, $actiItem);
                }
            };

            this.$items.on(this.options.event, this.options.opener, this.accordionToggle);
        },

        toggle: function ($item, $prevItem) {
            if (!$item.hasClass(this.options.activeClass)) {
                this.show($item);
            } else if (this.options.collapsible) {
                this.hide($item);
            }

            if (!$item.is($prevItem) && $prevItem.length) {
                this.hide($prevItem);
            }

            this.makeCallback('beforeToggle');
        },

        show: function ($item) {
            var $slider = $item.find(this.options.slider);

            $item.addClass(this.options.activeClass);
            $slider.stop().hide().removeClass(accHiddenClass).slideDown({
                duration: this.options.animSpeed,
                complete: function () {
                    $slider.removeAttr('style');
                    if (
                        this.options.scrollToActiveItem.enable &&
                        window.innerWidth <= this.options.scrollToActiveItem.breakpoint
                    ) {
                        this.goToItem($item);
                    }
                    this.makeCallback('onShow', $item);
                }.bind(this)
            });

            this.makeCallback('beforeShow', $item);
        },

        hide: function ($item) {
            var $slider = $item.find(this.options.slider);

            $item.removeClass(this.options.activeClass);
            $slider.stop().show().slideUp({
                duration: this.options.animSpeed,
                complete: function () {
                    $slider.addClass(accHiddenClass);
                    $slider.removeAttr('style');
                    this.makeCallback('onHide', $item);
                }.bind(this)
            });

            this.makeCallback('beforeHide', $item);
        },

        goToItem: function ($item) {
            var itemOffset = $item.offset().top;

            if (itemOffset < $(window).scrollTop()) {
                // handle extra offset
                if (typeof this.options.scrollToActiveItem.extraOffset === 'number') {
                    itemOffset -= this.options.scrollToActiveItem.extraOffset;
                } else if (typeof this.options.scrollToActiveItem.extraOffset === 'function') {
                    itemOffset -= this.options.scrollToActiveItem.extraOffset();
                }

                $('body, html').animate({
                    scrollTop: itemOffset
                }, this.options.scrollToActiveItem.animSpeed);
            }
        },

        getActiveItem: function ($item) {
            return $item.siblings().filter('.' + this.options.activeClass);
        },

        makeCallback: function (name) {
            if (typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        },

        destroy: function () {
            this.$holder.removeData('SlideAccordion');
            this.$items.off(this.options.event, this.options.opener, this.accordionToggle);
            this.$items.removeClass(this.options.activeClass).each(function (i, item) {
                $(item).find(this.options.slider).removeAttr('style').removeClass(accHiddenClass);
            }.bind(this));
            this.makeCallback('onDestroy');
        }
    };

    $.fn.slideAccordion = function (opt) {
        var args = Array.prototype.slice.call(arguments);
        var method = args[0];

        return this.each(function () {
            var $holder = jQuery(this);
            var instance = $holder.data('SlideAccordion');

            if (typeof opt === 'object' || typeof opt === 'undefined') {
                new SlideAccordion($.extend(true, {
                    holder: this
                }, opt));
            } else if (typeof method === 'string' && instance) {
                if (typeof instance[method] === 'function') {
                    args.shift();
                    instance[method].apply(instance, args);
                }
            }
        });
    };

    (function () {
        var tabStyleSheet = $('<style type="text/css">')[0];
        var tabStyleRule = '.' + accHiddenClass;
        tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important; width: 100% !important;}';
        if (tabStyleSheet.styleSheet) {
            tabStyleSheet.styleSheet.cssText = tabStyleRule;
        } else {
            tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
        }
        $('head').append(tabStyleSheet);
    }());

    return SlideAccordion;
}));

/*
 * Responsive Layout helper
*/
window.ResponsiveHelper = (function ($) {
    // init variables
    var handlers = [],
        prevWinWidth,
        win = $(window),
        nativeMatchMedia = false;

    // detect match media support
    if (window.matchMedia) {
        if (window.Window && window.matchMedia === Window.prototype.matchMedia) {
            nativeMatchMedia = true;
        } else if (window.matchMedia.toString().indexOf('native') > -1) {
            nativeMatchMedia = true;
        }
    }

    // prepare resize handler
    function resizeHandler() {
        var winWidth = win.width();
        if (winWidth !== prevWinWidth) {
            prevWinWidth = winWidth;

            // loop through range groups
            $.each(handlers, function (index, rangeObject) {
                // disable current active area if needed
                $.each(rangeObject.data, function (property, item) {
                    if (item.currentActive && !matchRange(item.range[0], item.range[1])) {
                        item.currentActive = false;
                        if (typeof item.disableCallback === 'function') {
                            item.disableCallback();
                        }
                    }
                });

                // enable areas that match current width
                $.each(rangeObject.data, function (property, item) {
                    if (!item.currentActive && matchRange(item.range[0], item.range[1])) {
                        // make callback
                        item.currentActive = true;
                        if (typeof item.enableCallback === 'function') {
                            item.enableCallback();
                        }
                    }
                });
            });
        }
    }
    win.bind('load resize orientationchange', resizeHandler);

    // test range
    function matchRange(r1, r2) {
        var mediaQueryString = '';
        if (r1 > 0) {
            mediaQueryString += '(min-width: ' + r1 + 'px)';
        }
        if (r2 < Infinity) {
            mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';
        }
        return matchQuery(mediaQueryString, r1, r2);
    }

    // media query function
    function matchQuery(query, r1, r2) {
        if (window.matchMedia && nativeMatchMedia) {
            return matchMedia(query).matches;
        } else if (window.styleMedia) {
            return styleMedia.matchMedium(query);
        } else if (window.media) {
            return media.matchMedium(query);
        } else {
            return prevWinWidth >= r1 && prevWinWidth <= r2;
        }
    }

    // range parser
    function parseRange(rangeStr) {
        var rangeData = rangeStr.split('..');
        var x1 = parseInt(rangeData[0], 10) || -Infinity;
        var x2 = parseInt(rangeData[1], 10) || Infinity;
        return [x1, x2].sort(function (a, b) {
            return a - b;
        });
    }

    // export public functions
    return {
        addRange: function (ranges) {
            // parse data and add items to collection
            var result = { data: {} };
            $.each(ranges, function (property, data) {
                result.data[property] = {
                    range: parseRange(property),
                    enableCallback: data.on,
                    disableCallback: data.off
                };
            });
            handlers.push(result);

            // call resizeHandler to recalculate all events
            prevWinWidth = null;
            resizeHandler();
        }
    };
}(jQuery));

(function (jQuery, window, undefined) {
    "use strict";

    var matched, browser;

    jQuery.uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(opr)[\/]([\w.]+)/.exec(ua) ||
            /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        var platform_match = /(ipad)/.exec(ua) ||
            /(iphone)/.exec(ua) ||
            /(android)/.exec(ua) ||
            /(windows phone)/.exec(ua) ||
            /(win)/.exec(ua) ||
            /(mac)/.exec(ua) ||
            /(linux)/.exec(ua) ||
            /(cros)/i.exec(ua) ||
            [];

        return {
            browser: match[3] || match[1] || "",
            version: match[2] || "0",
            platform: platform_match[0] || ""
        };
    };

    matched = jQuery.uaMatch(window.navigator.userAgent);
    browser = {};

    if (matched.browser) {
        browser[matched.browser] = true;
        browser.version = matched.version;
        browser.versionNumber = parseInt(matched.version);
    }

    if (matched.platform) {
        browser[matched.platform] = true;
    }

    // These are all considered mobile platforms, meaning they run a mobile browser
    if (browser.android || browser.ipad || browser.iphone || browser["windows phone"]) {
        browser.mobile = true;
    }

    // These are all considered desktop platforms, meaning they run a desktop browser
    if (browser.cros || browser.mac || browser.linux || browser.win) {
        browser.desktop = true;
    }

    // Chrome, Opera 15+ and Safari are webkit based browsers
    if (browser.chrome || browser.opr || browser.safari) {
        browser.webkit = true;
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    if (browser.rv) {
        var ie = "msie";

        matched.browser = ie;
        browser[ie] = true;
    }

    // Opera 15+ are identified as opr
    if (browser.opr) {
        var opera = "opera";

        matched.browser = opera;
        browser[opera] = true;
    }

    // Stock Android browsers are marked as Safari on Android.
    if (browser.safari && browser.android) {
        var android = "android";

        matched.browser = android;
        browser[android] = true;
    }

    // Assign the name and platform variable
    browser.name = matched.browser;
    browser.platform = matched.platform;


    jQuery.browser = browser;
})(jQuery, window);

/*
	Masked Input plugin for jQuery
	Copyright (c) 2007-2011 Josh Bush (digitalbush.com)
	Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license) 
	Version: 1.3
  https://cloud.github.com/downloads/digitalBush/jquery.maskedinput/jquery.maskedinput-1.3.min.js
*/
(function (a) { var b = (a.browser.msie ? "paste" : "input") + ".mask", c = window.orientation != undefined; a.mask = { definitions: { 9: "[0-9]", a: "[A-Za-z]", "*": "[A-Za-z0-9]" }, dataName: "rawMaskFn" }, a.fn.extend({ caret: function (a, b) { if (this.length != 0) { if (typeof a == "number") { b = typeof b == "number" ? b : a; return this.each(function () { if (this.setSelectionRange) this.setSelectionRange(a, b); else if (this.createTextRange) { var c = this.createTextRange(); c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", a), c.select() } }) } if (this[0].setSelectionRange) a = this[0].selectionStart, b = this[0].selectionEnd; else if (document.selection && document.selection.createRange) { var c = document.selection.createRange(); a = 0 - c.duplicate().moveStart("character", -1e5), b = a + c.text.length } return { begin: a, end: b } } }, unmask: function () { return this.trigger("unmask") }, mask: function (d, e) { if (!d && this.length > 0) { var f = a(this[0]); return f.data(a.mask.dataName)() } e = a.extend({ placeholder: "_", completed: null }, e); var g = a.mask.definitions, h = [], i = d.length, j = null, k = d.length; a.each(d.split(""), function (a, b) { b == "?" ? (k-- , i = a) : g[b] ? (h.push(new RegExp(g[b])), j == null && (j = h.length - 1)) : h.push(null) }); return this.trigger("unmask").each(function () { function v(a) { var b = f.val(), c = -1; for (var d = 0, g = 0; d < k; d++)if (h[d]) { l[d] = e.placeholder; while (g++ < b.length) { var m = b.charAt(g - 1); if (h[d].test(m)) { l[d] = m, c = d; break } } if (g > b.length) break } else l[d] == b.charAt(g) && d != i && (g++ , c = d); if (!a && c + 1 < i) f.val(""), t(0, k); else if (a || c + 1 >= i) u(), a || f.val(f.val().substring(0, c + 1)); return i ? d : j } function u() { return f.val(l.join("")).val() } function t(a, b) { for (var c = a; c < b && c < k; c++)h[c] && (l[c] = e.placeholder) } function s(a) { var b = a.which, c = f.caret(); if (a.ctrlKey || a.altKey || a.metaKey || b < 32) return !0; if (b) { c.end - c.begin != 0 && (t(c.begin, c.end), p(c.begin, c.end - 1)); var d = n(c.begin - 1); if (d < k) { var g = String.fromCharCode(b); if (h[d].test(g)) { q(d), l[d] = g, u(); var i = n(d); f.caret(i), e.completed && i >= k && e.completed.call(f) } } return !1 } } function r(a) { var b = a.which; if (b == 8 || b == 46 || c && b == 127) { var d = f.caret(), e = d.begin, g = d.end; g - e == 0 && (e = b != 46 ? o(e) : g = n(e - 1), g = b == 46 ? n(g) : g), t(e, g), p(e, g - 1); return !1 } if (b == 27) { f.val(m), f.caret(0, v()); return !1 } } function q(a) { for (var b = a, c = e.placeholder; b < k; b++)if (h[b]) { var d = n(b), f = l[b]; l[b] = c; if (d < k && h[d].test(f)) c = f; else break } } function p(a, b) { if (!(a < 0)) { for (var c = a, d = n(b); c < k; c++)if (h[c]) { if (d < k && h[c].test(l[d])) l[c] = l[d], l[d] = e.placeholder; else break; d = n(d) } u(), f.caret(Math.max(j, a)) } } function o(a) { while (--a >= 0 && !h[a]); return a } function n(a) { while (++a <= k && !h[a]); return a } var f = a(this), l = a.map(d.split(""), function (a, b) { if (a != "?") return g[a] ? e.placeholder : a }), m = f.val(); f.data(a.mask.dataName, function () { return a.map(l, function (a, b) { return h[b] && a != e.placeholder ? a : null }).join("") }), f.attr("readonly") || f.one("unmask", function () { f.unbind(".mask").removeData(a.mask.dataName) }).bind("focus.mask", function () { m = f.val(); var b = v(); u(); var c = function () { b == d.length ? f.caret(0, b) : f.caret(b) }; (a.browser.msie ? c : function () { setTimeout(c, 0) })() }).bind("blur.mask", function () { v(), f.val() != m && f.change() }).bind("keydown.mask", r).bind("keypress.mask", s).bind(b, function () { setTimeout(function () { f.caret(v(!0)) }, 0) }), v() }) } }) })(jQuery);

/*
 * jQuery Carousel plugin
 */
; (function ($) {
    'use strict';
    // detect device type
    var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    function ScrollGallery(options) {
        this.options = $.extend({
            mask: 'div.mask',
            slider: '>*',
            slides: '>*',
            activeClass: 'active',
            disabledClass: 'disabled',
            btnPrev: 'a.btn-prev',
            btnNext: 'a.btn-next',
            generatePagination: false,
            pagerList: '<ul>',
            pagerListItem: '<li><a href="#"></a></li>',
            pagerListItemText: 'a',
            pagerLinks: '.pagination li',
            currentNumber: 'span.current-num',
            totalNumber: 'span.total-num',
            btnPlay: '.btn-play',
            btnPause: '.btn-pause',
            btnPlayPause: '.btn-play-pause',
            galleryReadyClass: 'gallery-js-ready',
            autorotationActiveClass: 'autorotation-active',
            autorotationDisabledClass: 'autorotation-disabled',
            stretchSlideToMask: false,
            circularRotation: true,
            disableWhileAnimating: false,
            autoRotation: false,
            pauseOnHover: isTouchDevice ? false : true,
            maskAutoSize: false,
            switchTime: 4000,
            animSpeed: 600,
            event: 'click',
            swipeThreshold: 15,
            handleTouch: true,
            vertical: false,
            useTranslate3D: false,
            step: false
        }, options);
        this.init();
    }
    ScrollGallery.prototype = {
        init: function () {
            if (this.options.holder) {
                this.findElements();
                this.attachEvents();
                this.refreshPosition();
                this.refreshState(true);
                this.resumeRotation();
                this.makeCallback('onInit', this);
            }
        },
        findElements: function () {
            // define dimensions proporties
            this.fullSizeFunction = this.options.vertical ? 'outerHeight' : 'outerWidth';
            this.innerSizeFunction = this.options.vertical ? 'height' : 'width';
            this.slideSizeFunction = 'outerHeight';
            this.maskSizeProperty = 'height';
            this.animProperty = this.options.vertical ? 'marginTop' : 'marginLeft';

            // control elements
            this.gallery = $(this.options.holder).addClass(this.options.galleryReadyClass);
            this.mask = this.gallery.find(this.options.mask);
            this.slider = this.mask.find(this.options.slider);
            this.slides = this.slider.find(this.options.slides);
            this.btnPrev = this.gallery.find(this.options.btnPrev);
            this.btnNext = this.gallery.find(this.options.btnNext);
            this.currentStep = 0;
            this.stepsCount = 0;

            // get start index
            if (this.options.step === false) {
                var activeSlide = this.slides.filter('.' + this.options.activeClass);
                if (activeSlide.length) {
                    this.currentStep = this.slides.index(activeSlide);
                }
            }

            // calculate offsets
            this.calculateOffsets();

            // create gallery pagination
            if (typeof this.options.generatePagination === 'string') {
                this.pagerLinks = $();
                this.buildPagination();
            } else {
                this.pagerLinks = this.gallery.find(this.options.pagerLinks);
                this.attachPaginationEvents();
            }

            // autorotation control buttons
            this.btnPlay = this.gallery.find(this.options.btnPlay);
            this.btnPause = this.gallery.find(this.options.btnPause);
            this.btnPlayPause = this.gallery.find(this.options.btnPlayPause);

            // misc elements
            this.curNum = this.gallery.find(this.options.currentNumber);
            this.allNum = this.gallery.find(this.options.totalNumber);
            this.isInit = true;
        },
        attachEvents: function () {
            // bind handlers scope
            var self = this;
            this.bindHandlers(['onWindowResize']);
            $(window).bind('load resize orientationchange', this.onWindowResize);

            // previous and next button handlers
            if (this.btnPrev.length) {
                this.prevSlideHandler = function (e) {
                    e.preventDefault();
                    self.prevSlide();
                };
                this.btnPrev.bind(this.options.event, this.prevSlideHandler);
            }
            if (this.btnNext.length) {
                this.nextSlideHandler = function (e) {
                    e.preventDefault();
                    self.nextSlide();
                };
                this.btnNext.bind(this.options.event, this.nextSlideHandler);
            }

            // pause on hover handling
            if (this.options.pauseOnHover && !isTouchDevice) {
                this.hoverHandler = function () {
                    if (self.options.autoRotation) {
                        self.galleryHover = true;
                        self.pauseRotation();
                    }
                };
                this.leaveHandler = function () {
                    if (self.options.autoRotation) {
                        self.galleryHover = false;
                        self.resumeRotation();
                    }
                };
                this.gallery.bind({
                    mouseenter: this.hoverHandler,
                    mouseleave: this.leaveHandler
                });
            }

            // autorotation buttons handler
            if (this.btnPlay.length) {
                this.btnPlayHandler = function (e) {
                    e.preventDefault();
                    self.startRotation();
                };
                this.btnPlay.bind(this.options.event, this.btnPlayHandler);
            }
            if (this.btnPause.length) {
                this.btnPauseHandler = function (e) {
                    e.preventDefault();
                    self.stopRotation();
                };
                this.btnPause.bind(this.options.event, this.btnPauseHandler);
            }
            if (this.btnPlayPause.length) {
                this.btnPlayPauseHandler = function (e) {
                    e.preventDefault();
                    if (!self.gallery.hasClass(self.options.autorotationActiveClass)) {
                        self.startRotation();
                    } else {
                        self.stopRotation();
                    }
                };
                this.btnPlayPause.bind(this.options.event, this.btnPlayPauseHandler);
            }

            // enable hardware acceleration
            if (isTouchDevice && this.options.useTranslate3D) {
                this.slider.css({
                    '-webkit-transform': 'translate3d(0px, 0px, 0px)'
                });
            }

            // swipe event handling
            if (isTouchDevice && this.options.handleTouch && window.Hammer && this.mask.length) {
                this.swipeHandler = new Hammer.Manager(this.mask[0]);
                this.swipeHandler.add(new Hammer.Pan({
                    direction: self.options.vertical ? Hammer.DIRECTION_VERTICAL : Hammer.DIRECTION_HORIZONTAL,
                    threshold: self.options.swipeThreshold
                }));

                this.swipeHandler.on('panstart', function () {
                    if (self.galleryAnimating) {
                        self.swipeHandler.stop();
                    } else {
                        self.pauseRotation();
                        self.originalOffset = parseFloat(self.slider.css(self.animProperty));
                    }
                }).on('panmove', function (e) {
                    var tmpOffset = self.originalOffset + e[self.options.vertical ? 'deltaY' : 'deltaX'];
                    tmpOffset = Math.max(Math.min(0, tmpOffset), self.maxOffset);
                    self.slider.css(self.animProperty, tmpOffset);
                }).on('panend', function (e) {
                    self.resumeRotation();
                    if (e.distance > self.options.swipeThreshold) {
                        if (e.offsetDirection === Hammer.DIRECTION_RIGHT || e.offsetDirection === Hammer.DIRECTION_DOWN) {
                            self.prevSlide();
                        } else {
                            self.nextSlide();
                        }
                    } else {
                        self.switchSlide();
                    }
                });
            }
        },
        onWindowResize: function () {
            if (!this.isInit) return;
            if (!this.galleryAnimating) {
                this.calculateOffsets();
                this.refreshPosition();
                this.buildPagination();
                this.refreshState();
                this.resizeQueue = false;
            } else {
                this.resizeQueue = true;
            }
        },
        refreshPosition: function () {
            this.currentStep = Math.min(this.currentStep, this.stepsCount - 1);
            this.tmpProps = {};
            this.tmpProps[this.animProperty] = this.getStepOffset();
            this.slider.stop().css(this.tmpProps);
        },
        calculateOffsets: function () {
            var self = this,
                tmpOffset, tmpStep;
            if (this.options.stretchSlideToMask) {
                var tmpObj = {};
                tmpObj[this.innerSizeFunction] = this.mask[this.innerSizeFunction]();
                this.slides.css(tmpObj);
            }

            this.maskSize = this.mask[this.innerSizeFunction]();
            this.sumSize = this.getSumSize();
            this.maxOffset = this.maskSize - this.sumSize;

            // vertical gallery with single size step custom behavior
            if (this.options.vertical && this.options.maskAutoSize) {
                this.options.step = 1;
                this.stepsCount = this.slides.length;
                this.stepOffsets = [0];
                tmpOffset = 0;
                for (var i = 0; i < this.slides.length; i++) {
                    tmpOffset -= $(this.slides[i])[this.fullSizeFunction](true);
                    this.stepOffsets.push(tmpOffset);
                }
                this.maxOffset = tmpOffset;
                return;
            }

            // scroll by slide size
            if (typeof this.options.step === 'number' && this.options.step > 0) {
                this.slideDimensions = [];
                this.slides.each($.proxy(function (ind, obj) {
                    self.slideDimensions.push($(obj)[self.fullSizeFunction](true));
                }, this));

                // calculate steps count
                this.stepOffsets = [0];
                this.stepsCount = 1;
                tmpOffset = tmpStep = 0;
                while (tmpOffset > this.maxOffset) {
                    tmpOffset -= this.getSlideSize(tmpStep, tmpStep + this.options.step);
                    tmpStep += this.options.step;
                    this.stepOffsets.push(Math.max(tmpOffset, this.maxOffset));
                    this.stepsCount++;
                }
            }
            // scroll by mask size
            else {
                // define step size
                this.stepSize = this.maskSize;

                // calculate steps count
                this.stepsCount = 1;
                tmpOffset = 0;
                while (tmpOffset > this.maxOffset) {
                    tmpOffset -= this.stepSize;
                    this.stepsCount++;
                }
            }
        },
        getSumSize: function () {
            var sum = 0;
            this.slides.each($.proxy(function (ind, obj) {
                sum += $(obj)[this.fullSizeFunction](true);
            }, this));
            this.slider.css(this.innerSizeFunction, sum);
            return sum;
        },
        getStepOffset: function (step) {
            step = step || this.currentStep;
            if (typeof this.options.step === 'number') {
                return this.stepOffsets[this.currentStep];
            } else {
                return Math.min(0, Math.max(-this.currentStep * this.stepSize, this.maxOffset));
            }
        },
        getSlideSize: function (i1, i2) {
            var sum = 0;
            for (var i = i1; i < Math.min(i2, this.slideDimensions.length); i++) {
                sum += this.slideDimensions[i];
            }
            return sum;
        },
        buildPagination: function () {
            if (typeof this.options.generatePagination === 'string') {
                if (!this.pagerHolder) {
                    this.pagerHolder = this.gallery.find(this.options.generatePagination);
                }
                if (this.pagerHolder.length && this.oldStepsCount != this.stepsCount) {
                    this.oldStepsCount = this.stepsCount;
                    this.pagerHolder.empty();
                    this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
                    for (var i = 0; i < this.stepsCount; i++) {
                        $(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i + 1);
                    }
                    this.pagerLinks = this.pagerList.children();
                    this.attachPaginationEvents();
                }
            }
        },
        attachPaginationEvents: function () {
            var self = this;
            this.pagerLinksHandler = function (e) {
                e.preventDefault();
                self.numSlide(self.pagerLinks.index(e.currentTarget));
            };
            this.pagerLinks.bind(this.options.event, this.pagerLinksHandler);
        },
        prevSlide: function () {
            if (!(this.options.disableWhileAnimating && this.galleryAnimating)) {
                if (this.currentStep > 0) {
                    this.currentStep--;
                    this.switchSlide();
                } else if (this.options.circularRotation) {
                    this.currentStep = this.stepsCount - 1;
                    this.switchSlide();
                }
            }
        },
        nextSlide: function (fromAutoRotation) {
            if (!(this.options.disableWhileAnimating && this.galleryAnimating)) {
                if (this.currentStep < this.stepsCount - 1) {
                    this.currentStep++;
                    this.switchSlide();
                } else if (this.options.circularRotation || fromAutoRotation === true) {
                    this.currentStep = 0;
                    this.switchSlide();
                }
            }
        },
        numSlide: function (c) {
            if (this.currentStep != c) {
                this.currentStep = c;
                this.switchSlide();
            }
        },
        switchSlide: function () {
            var self = this;
            this.galleryAnimating = true;
            this.tmpProps = {};
            this.tmpProps[this.animProperty] = this.getStepOffset();
            this.slider.stop().animate(this.tmpProps, {
                duration: this.options.animSpeed,
                complete: function () {
                    // animation complete
                    self.galleryAnimating = false;
                    if (self.resizeQueue) {
                        self.onWindowResize();
                    }

                    // onchange callback
                    self.makeCallback('onChange', self);
                    self.autoRotate();
                }
            });
            this.refreshState();

            // onchange callback
            this.makeCallback('onBeforeChange', this);
        },
        refreshState: function (initial) {
            if (this.options.step === 1 || this.stepsCount === this.slides.length) {
                this.slides.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
            }
            this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
            this.curNum.html(this.currentStep + 1);
            this.allNum.html(this.stepsCount);

            // initial refresh
            if (this.options.maskAutoSize && typeof this.options.step === 'number') {
                this.tmpProps = {};
                this.tmpProps[this.maskSizeProperty] = this.slides.eq(Math.min(this.currentStep, this.slides.length - 1))[this.slideSizeFunction](true);
                this.mask.stop()[initial ? 'css' : 'animate'](this.tmpProps);
            }

            // disabled state
            if (!this.options.circularRotation) {
                this.btnPrev.add(this.btnNext).removeClass(this.options.disabledClass);
                if (this.currentStep === 0) this.btnPrev.addClass(this.options.disabledClass);
                if (this.currentStep === this.stepsCount - 1) this.btnNext.addClass(this.options.disabledClass);
            }

            // add class if not enough slides
            this.gallery.toggleClass('not-enough-slides', this.sumSize <= this.maskSize);
        },
        startRotation: function () {
            this.options.autoRotation = true;
            this.galleryHover = false;
            this.autoRotationStopped = false;
            this.resumeRotation();
        },
        stopRotation: function () {
            this.galleryHover = true;
            this.autoRotationStopped = true;
            this.pauseRotation();
        },
        pauseRotation: function () {
            this.gallery.addClass(this.options.autorotationDisabledClass);
            this.gallery.removeClass(this.options.autorotationActiveClass);
            clearTimeout(this.timer);
        },
        resumeRotation: function () {
            if (!this.autoRotationStopped) {
                this.gallery.addClass(this.options.autorotationActiveClass);
                this.gallery.removeClass(this.options.autorotationDisabledClass);
                this.autoRotate();
            }
        },
        autoRotate: function () {
            var self = this;
            clearTimeout(this.timer);
            if (this.options.autoRotation && !this.galleryHover && !this.autoRotationStopped) {
                this.timer = setTimeout(function () {
                    self.nextSlide(true);
                }, this.options.switchTime);
            } else {
                this.pauseRotation();
            }
        },
        bindHandlers: function (handlersList) {
            var self = this;
            $.each(handlersList, function (index, handler) {
                var origHandler = self[handler];
                self[handler] = function () {
                    return origHandler.apply(self, arguments);
                };
            });
        },
        makeCallback: function (name) {
            if (typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        },
        destroy: function () {
            // destroy handler
            this.isInit = false;
            $(window).unbind('load resize orientationchange', this.onWindowResize);
            this.btnPrev.unbind(this.options.event, this.prevSlideHandler);
            this.btnNext.unbind(this.options.event, this.nextSlideHandler);
            this.pagerLinks.unbind(this.options.event, this.pagerLinksHandler);
            this.gallery.unbind('mouseenter', this.hoverHandler);
            this.gallery.unbind('mouseleave', this.leaveHandler);

            // autorotation buttons handlers
            this.stopRotation();
            this.btnPlay.unbind(this.options.event, this.btnPlayHandler);
            this.btnPause.unbind(this.options.event, this.btnPauseHandler);
            this.btnPlayPause.unbind(this.options.event, this.btnPlayPauseHandler);

            // destroy swipe handler
            if (this.swipeHandler) {
                this.swipeHandler.destroy();
            }

            // remove inline styles, classes and pagination
            var unneededClasses = [this.options.galleryReadyClass, this.options.autorotationActiveClass, this.options.autorotationDisabledClass];
            this.gallery.removeClass(unneededClasses.join(' ')).removeData('ScrollGallery');
            this.slider.add(this.slides).add(this.mask).removeAttr('style');
            this.slides.removeClass(this.options.activeClass);
            if (typeof this.options.generatePagination === 'string') {
                this.pagerHolder.empty();
            }
        }
    };

    // jquery plugin
    $.fn.scrollGallery = function (opt) {
        var args = Array.prototype.slice.call(arguments);
        var method = args[0];

        return this.each(function () {
            var $holder = jQuery(this);
            var instance = $holder.data('ScrollGallery');

            if (typeof opt === 'object' || typeof opt === 'undefined') {
                $holder.data('ScrollGallery', new ScrollGallery($.extend({
                    holder: this
                }, opt)));
            } else if (typeof method === 'string' && instance) {
                if (typeof instance[method] === 'function') {
                    args.shift();
                    instance[method].apply(instance, args);
                }
            }
        });
    };
}(jQuery));

/*! Hammer.JS - v2.0.8 - 2016-04-23
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
!function (a, b, c, d) { "use strict"; function e(a, b, c) { return setTimeout(j(a, c), b) } function f(a, b, c) { return Array.isArray(a) ? (g(a, c[b], c), !0) : !1 } function g(a, b, c) { var e; if (a) if (a.forEach) a.forEach(b, c); else if (a.length !== d) for (e = 0; e < a.length;)b.call(c, a[e], e, a), e++; else for (e in a) a.hasOwnProperty(e) && b.call(c, a[e], e, a) } function h(b, c, d) { var e = "DEPRECATED METHOD: " + c + "\n" + d + " AT \n"; return function () { var c = new Error("get-stack-trace"), d = c && c.stack ? c.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace", f = a.console && (a.console.warn || a.console.log); return f && f.call(a.console, e, d), b.apply(this, arguments) } } function i(a, b, c) { var d, e = b.prototype; d = a.prototype = Object.create(e), d.constructor = a, d._super = e, c && la(d, c) } function j(a, b) { return function () { return a.apply(b, arguments) } } function k(a, b) { return typeof a == oa ? a.apply(b ? b[0] || d : d, b) : a } function l(a, b) { return a === d ? b : a } function m(a, b, c) { g(q(b), function (b) { a.addEventListener(b, c, !1) }) } function n(a, b, c) { g(q(b), function (b) { a.removeEventListener(b, c, !1) }) } function o(a, b) { for (; a;) { if (a == b) return !0; a = a.parentNode } return !1 } function p(a, b) { return a.indexOf(b) > -1 } function q(a) { return a.trim().split(/\s+/g) } function r(a, b, c) { if (a.indexOf && !c) return a.indexOf(b); for (var d = 0; d < a.length;) { if (c && a[d][c] == b || !c && a[d] === b) return d; d++ } return -1 } function s(a) { return Array.prototype.slice.call(a, 0) } function t(a, b, c) { for (var d = [], e = [], f = 0; f < a.length;) { var g = b ? a[f][b] : a[f]; r(e, g) < 0 && d.push(a[f]), e[f] = g, f++ } return c && (d = b ? d.sort(function (a, c) { return a[b] > c[b] }) : d.sort()), d } function u(a, b) { for (var c, e, f = b[0].toUpperCase() + b.slice(1), g = 0; g < ma.length;) { if (c = ma[g], e = c ? c + f : b, e in a) return e; g++ } return d } function v() { return ua++ } function w(b) { var c = b.ownerDocument || b; return c.defaultView || c.parentWindow || a } function x(a, b) { var c = this; this.manager = a, this.callback = b, this.element = a.element, this.target = a.options.inputTarget, this.domHandler = function (b) { k(a.options.enable, [a]) && c.handler(b) }, this.init() } function y(a) { var b, c = a.options.inputClass; return new (b = c ? c : xa ? M : ya ? P : wa ? R : L)(a, z) } function z(a, b, c) { var d = c.pointers.length, e = c.changedPointers.length, f = b & Ea && d - e === 0, g = b & (Ga | Ha) && d - e === 0; c.isFirst = !!f, c.isFinal = !!g, f && (a.session = {}), c.eventType = b, A(a, c), a.emit("hammer.input", c), a.recognize(c), a.session.prevInput = c } function A(a, b) { var c = a.session, d = b.pointers, e = d.length; c.firstInput || (c.firstInput = D(b)), e > 1 && !c.firstMultiple ? c.firstMultiple = D(b) : 1 === e && (c.firstMultiple = !1); var f = c.firstInput, g = c.firstMultiple, h = g ? g.center : f.center, i = b.center = E(d); b.timeStamp = ra(), b.deltaTime = b.timeStamp - f.timeStamp, b.angle = I(h, i), b.distance = H(h, i), B(c, b), b.offsetDirection = G(b.deltaX, b.deltaY); var j = F(b.deltaTime, b.deltaX, b.deltaY); b.overallVelocityX = j.x, b.overallVelocityY = j.y, b.overallVelocity = qa(j.x) > qa(j.y) ? j.x : j.y, b.scale = g ? K(g.pointers, d) : 1, b.rotation = g ? J(g.pointers, d) : 0, b.maxPointers = c.prevInput ? b.pointers.length > c.prevInput.maxPointers ? b.pointers.length : c.prevInput.maxPointers : b.pointers.length, C(c, b); var k = a.element; o(b.srcEvent.target, k) && (k = b.srcEvent.target), b.target = k } function B(a, b) { var c = b.center, d = a.offsetDelta || {}, e = a.prevDelta || {}, f = a.prevInput || {}; b.eventType !== Ea && f.eventType !== Ga || (e = a.prevDelta = { x: f.deltaX || 0, y: f.deltaY || 0 }, d = a.offsetDelta = { x: c.x, y: c.y }), b.deltaX = e.x + (c.x - d.x), b.deltaY = e.y + (c.y - d.y) } function C(a, b) { var c, e, f, g, h = a.lastInterval || b, i = b.timeStamp - h.timeStamp; if (b.eventType != Ha && (i > Da || h.velocity === d)) { var j = b.deltaX - h.deltaX, k = b.deltaY - h.deltaY, l = F(i, j, k); e = l.x, f = l.y, c = qa(l.x) > qa(l.y) ? l.x : l.y, g = G(j, k), a.lastInterval = b } else c = h.velocity, e = h.velocityX, f = h.velocityY, g = h.direction; b.velocity = c, b.velocityX = e, b.velocityY = f, b.direction = g } function D(a) { for (var b = [], c = 0; c < a.pointers.length;)b[c] = { clientX: pa(a.pointers[c].clientX), clientY: pa(a.pointers[c].clientY) }, c++; return { timeStamp: ra(), pointers: b, center: E(b), deltaX: a.deltaX, deltaY: a.deltaY } } function E(a) { var b = a.length; if (1 === b) return { x: pa(a[0].clientX), y: pa(a[0].clientY) }; for (var c = 0, d = 0, e = 0; b > e;)c += a[e].clientX, d += a[e].clientY, e++; return { x: pa(c / b), y: pa(d / b) } } function F(a, b, c) { return { x: b / a || 0, y: c / a || 0 } } function G(a, b) { return a === b ? Ia : qa(a) >= qa(b) ? 0 > a ? Ja : Ka : 0 > b ? La : Ma } function H(a, b, c) { c || (c = Qa); var d = b[c[0]] - a[c[0]], e = b[c[1]] - a[c[1]]; return Math.sqrt(d * d + e * e) } function I(a, b, c) { c || (c = Qa); var d = b[c[0]] - a[c[0]], e = b[c[1]] - a[c[1]]; return 180 * Math.atan2(e, d) / Math.PI } function J(a, b) { return I(b[1], b[0], Ra) + I(a[1], a[0], Ra) } function K(a, b) { return H(b[0], b[1], Ra) / H(a[0], a[1], Ra) } function L() { this.evEl = Ta, this.evWin = Ua, this.pressed = !1, x.apply(this, arguments) } function M() { this.evEl = Xa, this.evWin = Ya, x.apply(this, arguments), this.store = this.manager.session.pointerEvents = [] } function N() { this.evTarget = $a, this.evWin = _a, this.started = !1, x.apply(this, arguments) } function O(a, b) { var c = s(a.touches), d = s(a.changedTouches); return b & (Ga | Ha) && (c = t(c.concat(d), "identifier", !0)), [c, d] } function P() { this.evTarget = bb, this.targetIds = {}, x.apply(this, arguments) } function Q(a, b) { var c = s(a.touches), d = this.targetIds; if (b & (Ea | Fa) && 1 === c.length) return d[c[0].identifier] = !0, [c, c]; var e, f, g = s(a.changedTouches), h = [], i = this.target; if (f = c.filter(function (a) { return o(a.target, i) }), b === Ea) for (e = 0; e < f.length;)d[f[e].identifier] = !0, e++; for (e = 0; e < g.length;)d[g[e].identifier] && h.push(g[e]), b & (Ga | Ha) && delete d[g[e].identifier], e++; return h.length ? [t(f.concat(h), "identifier", !0), h] : void 0 } function R() { x.apply(this, arguments); var a = j(this.handler, this); this.touch = new P(this.manager, a), this.mouse = new L(this.manager, a), this.primaryTouch = null, this.lastTouches = [] } function S(a, b) { a & Ea ? (this.primaryTouch = b.changedPointers[0].identifier, T.call(this, b)) : a & (Ga | Ha) && T.call(this, b) } function T(a) { var b = a.changedPointers[0]; if (b.identifier === this.primaryTouch) { var c = { x: b.clientX, y: b.clientY }; this.lastTouches.push(c); var d = this.lastTouches, e = function () { var a = d.indexOf(c); a > -1 && d.splice(a, 1) }; setTimeout(e, cb) } } function U(a) { for (var b = a.srcEvent.clientX, c = a.srcEvent.clientY, d = 0; d < this.lastTouches.length; d++) { var e = this.lastTouches[d], f = Math.abs(b - e.x), g = Math.abs(c - e.y); if (db >= f && db >= g) return !0 } return !1 } function V(a, b) { this.manager = a, this.set(b) } function W(a) { if (p(a, jb)) return jb; var b = p(a, kb), c = p(a, lb); return b && c ? jb : b || c ? b ? kb : lb : p(a, ib) ? ib : hb } function X() { if (!fb) return !1; var b = {}, c = a.CSS && a.CSS.supports; return ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function (d) { b[d] = c ? a.CSS.supports("touch-action", d) : !0 }), b } function Y(a) { this.options = la({}, this.defaults, a || {}), this.id = v(), this.manager = null, this.options.enable = l(this.options.enable, !0), this.state = nb, this.simultaneous = {}, this.requireFail = [] } function Z(a) { return a & sb ? "cancel" : a & qb ? "end" : a & pb ? "move" : a & ob ? "start" : "" } function $(a) { return a == Ma ? "down" : a == La ? "up" : a == Ja ? "left" : a == Ka ? "right" : "" } function _(a, b) { var c = b.manager; return c ? c.get(a) : a } function aa() { Y.apply(this, arguments) } function ba() { aa.apply(this, arguments), this.pX = null, this.pY = null } function ca() { aa.apply(this, arguments) } function da() { Y.apply(this, arguments), this._timer = null, this._input = null } function ea() { aa.apply(this, arguments) } function fa() { aa.apply(this, arguments) } function ga() { Y.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0 } function ha(a, b) { return b = b || {}, b.recognizers = l(b.recognizers, ha.defaults.preset), new ia(a, b) } function ia(a, b) { this.options = la({}, ha.defaults, b || {}), this.options.inputTarget = this.options.inputTarget || a, this.handlers = {}, this.session = {}, this.recognizers = [], this.oldCssProps = {}, this.element = a, this.input = y(this), this.touchAction = new V(this, this.options.touchAction), ja(this, !0), g(this.options.recognizers, function (a) { var b = this.add(new a[0](a[1])); a[2] && b.recognizeWith(a[2]), a[3] && b.requireFailure(a[3]) }, this) } function ja(a, b) { var c = a.element; if (c.style) { var d; g(a.options.cssProps, function (e, f) { d = u(c.style, f), b ? (a.oldCssProps[d] = c.style[d], c.style[d] = e) : c.style[d] = a.oldCssProps[d] || "" }), b || (a.oldCssProps = {}) } } function ka(a, c) { var d = b.createEvent("Event"); d.initEvent(a, !0, !0), d.gesture = c, c.target.dispatchEvent(d) } var la, ma = ["", "webkit", "Moz", "MS", "ms", "o"], na = b.createElement("div"), oa = "function", pa = Math.round, qa = Math.abs, ra = Date.now; la = "function" != typeof Object.assign ? function (a) { if (a === d || null === a) throw new TypeError("Cannot convert undefined or null to object"); for (var b = Object(a), c = 1; c < arguments.length; c++) { var e = arguments[c]; if (e !== d && null !== e) for (var f in e) e.hasOwnProperty(f) && (b[f] = e[f]) } return b } : Object.assign; var sa = h(function (a, b, c) { for (var e = Object.keys(b), f = 0; f < e.length;)(!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]), f++; return a }, "extend", "Use `assign`."), ta = h(function (a, b) { return sa(a, b, !0) }, "merge", "Use `assign`."), ua = 1, va = /mobile|tablet|ip(ad|hone|od)|android/i, wa = "ontouchstart" in a, xa = u(a, "PointerEvent") !== d, ya = wa && va.test(navigator.userAgent), za = "touch", Aa = "pen", Ba = "mouse", Ca = "kinect", Da = 25, Ea = 1, Fa = 2, Ga = 4, Ha = 8, Ia = 1, Ja = 2, Ka = 4, La = 8, Ma = 16, Na = Ja | Ka, Oa = La | Ma, Pa = Na | Oa, Qa = ["x", "y"], Ra = ["clientX", "clientY"]; x.prototype = { handler: function () { }, init: function () { this.evEl && m(this.element, this.evEl, this.domHandler), this.evTarget && m(this.target, this.evTarget, this.domHandler), this.evWin && m(w(this.element), this.evWin, this.domHandler) }, destroy: function () { this.evEl && n(this.element, this.evEl, this.domHandler), this.evTarget && n(this.target, this.evTarget, this.domHandler), this.evWin && n(w(this.element), this.evWin, this.domHandler) } }; var Sa = { mousedown: Ea, mousemove: Fa, mouseup: Ga }, Ta = "mousedown", Ua = "mousemove mouseup"; i(L, x, { handler: function (a) { var b = Sa[a.type]; b & Ea && 0 === a.button && (this.pressed = !0), b & Fa && 1 !== a.which && (b = Ga), this.pressed && (b & Ga && (this.pressed = !1), this.callback(this.manager, b, { pointers: [a], changedPointers: [a], pointerType: Ba, srcEvent: a })) } }); var Va = { pointerdown: Ea, pointermove: Fa, pointerup: Ga, pointercancel: Ha, pointerout: Ha }, Wa = { 2: za, 3: Aa, 4: Ba, 5: Ca }, Xa = "pointerdown", Ya = "pointermove pointerup pointercancel"; a.MSPointerEvent && !a.PointerEvent && (Xa = "MSPointerDown", Ya = "MSPointerMove MSPointerUp MSPointerCancel"), i(M, x, { handler: function (a) { var b = this.store, c = !1, d = a.type.toLowerCase().replace("ms", ""), e = Va[d], f = Wa[a.pointerType] || a.pointerType, g = f == za, h = r(b, a.pointerId, "pointerId"); e & Ea && (0 === a.button || g) ? 0 > h && (b.push(a), h = b.length - 1) : e & (Ga | Ha) && (c = !0), 0 > h || (b[h] = a, this.callback(this.manager, e, { pointers: b, changedPointers: [a], pointerType: f, srcEvent: a }), c && b.splice(h, 1)) } }); var Za = { touchstart: Ea, touchmove: Fa, touchend: Ga, touchcancel: Ha }, $a = "touchstart", _a = "touchstart touchmove touchend touchcancel"; i(N, x, { handler: function (a) { var b = Za[a.type]; if (b === Ea && (this.started = !0), this.started) { var c = O.call(this, a, b); b & (Ga | Ha) && c[0].length - c[1].length === 0 && (this.started = !1), this.callback(this.manager, b, { pointers: c[0], changedPointers: c[1], pointerType: za, srcEvent: a }) } } }); var ab = { touchstart: Ea, touchmove: Fa, touchend: Ga, touchcancel: Ha }, bb = "touchstart touchmove touchend touchcancel"; i(P, x, { handler: function (a) { var b = ab[a.type], c = Q.call(this, a, b); c && this.callback(this.manager, b, { pointers: c[0], changedPointers: c[1], pointerType: za, srcEvent: a }) } }); var cb = 2500, db = 25; i(R, x, { handler: function (a, b, c) { var d = c.pointerType == za, e = c.pointerType == Ba; if (!(e && c.sourceCapabilities && c.sourceCapabilities.firesTouchEvents)) { if (d) S.call(this, b, c); else if (e && U.call(this, c)) return; this.callback(a, b, c) } }, destroy: function () { this.touch.destroy(), this.mouse.destroy() } }); var eb = u(na.style, "touchAction"), fb = eb !== d, gb = "compute", hb = "auto", ib = "manipulation", jb = "none", kb = "pan-x", lb = "pan-y", mb = X(); V.prototype = { set: function (a) { a == gb && (a = this.compute()), fb && this.manager.element.style && mb[a] && (this.manager.element.style[eb] = a), this.actions = a.toLowerCase().trim() }, update: function () { this.set(this.manager.options.touchAction) }, compute: function () { var a = []; return g(this.manager.recognizers, function (b) { k(b.options.enable, [b]) && (a = a.concat(b.getTouchAction())) }), W(a.join(" ")) }, preventDefaults: function (a) { var b = a.srcEvent, c = a.offsetDirection; if (this.manager.session.prevented) return void b.preventDefault(); var d = this.actions, e = p(d, jb) && !mb[jb], f = p(d, lb) && !mb[lb], g = p(d, kb) && !mb[kb]; if (e) { var h = 1 === a.pointers.length, i = a.distance < 2, j = a.deltaTime < 250; if (h && i && j) return } return g && f ? void 0 : e || f && c & Na || g && c & Oa ? this.preventSrc(b) : void 0 }, preventSrc: function (a) { this.manager.session.prevented = !0, a.preventDefault() } }; var nb = 1, ob = 2, pb = 4, qb = 8, rb = qb, sb = 16, tb = 32; Y.prototype = { defaults: {}, set: function (a) { return la(this.options, a), this.manager && this.manager.touchAction.update(), this }, recognizeWith: function (a) { if (f(a, "recognizeWith", this)) return this; var b = this.simultaneous; return a = _(a, this), b[a.id] || (b[a.id] = a, a.recognizeWith(this)), this }, dropRecognizeWith: function (a) { return f(a, "dropRecognizeWith", this) ? this : (a = _(a, this), delete this.simultaneous[a.id], this) }, requireFailure: function (a) { if (f(a, "requireFailure", this)) return this; var b = this.requireFail; return a = _(a, this), -1 === r(b, a) && (b.push(a), a.requireFailure(this)), this }, dropRequireFailure: function (a) { if (f(a, "dropRequireFailure", this)) return this; a = _(a, this); var b = r(this.requireFail, a); return b > -1 && this.requireFail.splice(b, 1), this }, hasRequireFailures: function () { return this.requireFail.length > 0 }, canRecognizeWith: function (a) { return !!this.simultaneous[a.id] }, emit: function (a) { function b(b) { c.manager.emit(b, a) } var c = this, d = this.state; qb > d && b(c.options.event + Z(d)), b(c.options.event), a.additionalEvent && b(a.additionalEvent), d >= qb && b(c.options.event + Z(d)) }, tryEmit: function (a) { return this.canEmit() ? this.emit(a) : void (this.state = tb) }, canEmit: function () { for (var a = 0; a < this.requireFail.length;) { if (!(this.requireFail[a].state & (tb | nb))) return !1; a++ } return !0 }, recognize: function (a) { var b = la({}, a); return k(this.options.enable, [this, b]) ? (this.state & (rb | sb | tb) && (this.state = nb), this.state = this.process(b), void (this.state & (ob | pb | qb | sb) && this.tryEmit(b))) : (this.reset(), void (this.state = tb)) }, process: function (a) { }, getTouchAction: function () { }, reset: function () { } }, i(aa, Y, { defaults: { pointers: 1 }, attrTest: function (a) { var b = this.options.pointers; return 0 === b || a.pointers.length === b }, process: function (a) { var b = this.state, c = a.eventType, d = b & (ob | pb), e = this.attrTest(a); return d && (c & Ha || !e) ? b | sb : d || e ? c & Ga ? b | qb : b & ob ? b | pb : ob : tb } }), i(ba, aa, { defaults: { event: "pan", threshold: 10, pointers: 1, direction: Pa }, getTouchAction: function () { var a = this.options.direction, b = []; return a & Na && b.push(lb), a & Oa && b.push(kb), b }, directionTest: function (a) { var b = this.options, c = !0, d = a.distance, e = a.direction, f = a.deltaX, g = a.deltaY; return e & b.direction || (b.direction & Na ? (e = 0 === f ? Ia : 0 > f ? Ja : Ka, c = f != this.pX, d = Math.abs(a.deltaX)) : (e = 0 === g ? Ia : 0 > g ? La : Ma, c = g != this.pY, d = Math.abs(a.deltaY))), a.direction = e, c && d > b.threshold && e & b.direction }, attrTest: function (a) { return aa.prototype.attrTest.call(this, a) && (this.state & ob || !(this.state & ob) && this.directionTest(a)) }, emit: function (a) { this.pX = a.deltaX, this.pY = a.deltaY; var b = $(a.direction); b && (a.additionalEvent = this.options.event + b), this._super.emit.call(this, a) } }), i(ca, aa, { defaults: { event: "pinch", threshold: 0, pointers: 2 }, getTouchAction: function () { return [jb] }, attrTest: function (a) { return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & ob) }, emit: function (a) { if (1 !== a.scale) { var b = a.scale < 1 ? "in" : "out"; a.additionalEvent = this.options.event + b } this._super.emit.call(this, a) } }), i(da, Y, { defaults: { event: "press", pointers: 1, time: 251, threshold: 9 }, getTouchAction: function () { return [hb] }, process: function (a) { var b = this.options, c = a.pointers.length === b.pointers, d = a.distance < b.threshold, f = a.deltaTime > b.time; if (this._input = a, !d || !c || a.eventType & (Ga | Ha) && !f) this.reset(); else if (a.eventType & Ea) this.reset(), this._timer = e(function () { this.state = rb, this.tryEmit() }, b.time, this); else if (a.eventType & Ga) return rb; return tb }, reset: function () { clearTimeout(this._timer) }, emit: function (a) { this.state === rb && (a && a.eventType & Ga ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = ra(), this.manager.emit(this.options.event, this._input))) } }), i(ea, aa, { defaults: { event: "rotate", threshold: 0, pointers: 2 }, getTouchAction: function () { return [jb] }, attrTest: function (a) { return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & ob) } }), i(fa, aa, { defaults: { event: "swipe", threshold: 10, velocity: .3, direction: Na | Oa, pointers: 1 }, getTouchAction: function () { return ba.prototype.getTouchAction.call(this) }, attrTest: function (a) { var b, c = this.options.direction; return c & (Na | Oa) ? b = a.overallVelocity : c & Na ? b = a.overallVelocityX : c & Oa && (b = a.overallVelocityY), this._super.attrTest.call(this, a) && c & a.offsetDirection && a.distance > this.options.threshold && a.maxPointers == this.options.pointers && qa(b) > this.options.velocity && a.eventType & Ga }, emit: function (a) { var b = $(a.offsetDirection); b && this.manager.emit(this.options.event + b, a), this.manager.emit(this.options.event, a) } }), i(ga, Y, { defaults: { event: "tap", pointers: 1, taps: 1, interval: 300, time: 250, threshold: 9, posThreshold: 10 }, getTouchAction: function () { return [ib] }, process: function (a) { var b = this.options, c = a.pointers.length === b.pointers, d = a.distance < b.threshold, f = a.deltaTime < b.time; if (this.reset(), a.eventType & Ea && 0 === this.count) return this.failTimeout(); if (d && f && c) { if (a.eventType != Ga) return this.failTimeout(); var g = this.pTime ? a.timeStamp - this.pTime < b.interval : !0, h = !this.pCenter || H(this.pCenter, a.center) < b.posThreshold; this.pTime = a.timeStamp, this.pCenter = a.center, h && g ? this.count += 1 : this.count = 1, this._input = a; var i = this.count % b.taps; if (0 === i) return this.hasRequireFailures() ? (this._timer = e(function () { this.state = rb, this.tryEmit() }, b.interval, this), ob) : rb } return tb }, failTimeout: function () { return this._timer = e(function () { this.state = tb }, this.options.interval, this), tb }, reset: function () { clearTimeout(this._timer) }, emit: function () { this.state == rb && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input)) } }), ha.VERSION = "2.0.8", ha.defaults = { domEvents: !1, touchAction: gb, enable: !0, inputTarget: null, inputClass: null, preset: [[ea, { enable: !1 }], [ca, { enable: !1 }, ["rotate"]], [fa, { direction: Na }], [ba, { direction: Na }, ["swipe"]], [ga], [ga, { event: "doubletap", taps: 2 }, ["tap"]], [da]], cssProps: { userSelect: "none", touchSelect: "none", touchCallout: "none", contentZooming: "none", userDrag: "none", tapHighlightColor: "rgba(0,0,0,0)" } }; var ub = 1, vb = 2; ia.prototype = { set: function (a) { return la(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), this.input.target = a.inputTarget, this.input.init()), this }, stop: function (a) { this.session.stopped = a ? vb : ub }, recognize: function (a) { var b = this.session; if (!b.stopped) { this.touchAction.preventDefaults(a); var c, d = this.recognizers, e = b.curRecognizer; (!e || e && e.state & rb) && (e = b.curRecognizer = null); for (var f = 0; f < d.length;)c = d[f], b.stopped === vb || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a), !e && c.state & (ob | pb | qb) && (e = b.curRecognizer = c), f++ } }, get: function (a) { if (a instanceof Y) return a; for (var b = this.recognizers, c = 0; c < b.length; c++)if (b[c].options.event == a) return b[c]; return null }, add: function (a) { if (f(a, "add", this)) return this; var b = this.get(a.options.event); return b && this.remove(b), this.recognizers.push(a), a.manager = this, this.touchAction.update(), a }, remove: function (a) { if (f(a, "remove", this)) return this; if (a = this.get(a)) { var b = this.recognizers, c = r(b, a); -1 !== c && (b.splice(c, 1), this.touchAction.update()) } return this }, on: function (a, b) { if (a !== d && b !== d) { var c = this.handlers; return g(q(a), function (a) { c[a] = c[a] || [], c[a].push(b) }), this } }, off: function (a, b) { if (a !== d) { var c = this.handlers; return g(q(a), function (a) { b ? c[a] && c[a].splice(r(c[a], b), 1) : delete c[a] }), this } }, emit: function (a, b) { this.options.domEvents && ka(a, b); var c = this.handlers[a] && this.handlers[a].slice(); if (c && c.length) { b.type = a, b.preventDefault = function () { b.srcEvent.preventDefault() }; for (var d = 0; d < c.length;)c[d](b), d++ } }, destroy: function () { this.element && ja(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null } }, la(ha, { INPUT_START: Ea, INPUT_MOVE: Fa, INPUT_END: Ga, INPUT_CANCEL: Ha, STATE_POSSIBLE: nb, STATE_BEGAN: ob, STATE_CHANGED: pb, STATE_ENDED: qb, STATE_RECOGNIZED: rb, STATE_CANCELLED: sb, STATE_FAILED: tb, DIRECTION_NONE: Ia, DIRECTION_LEFT: Ja, DIRECTION_RIGHT: Ka, DIRECTION_UP: La, DIRECTION_DOWN: Ma, DIRECTION_HORIZONTAL: Na, DIRECTION_VERTICAL: Oa, DIRECTION_ALL: Pa, Manager: ia, Input: x, TouchAction: V, TouchInput: P, MouseInput: L, PointerEventInput: M, TouchMouseInput: R, SingleTouchInput: N, Recognizer: Y, AttrRecognizer: aa, Tap: ga, Pan: ba, Swipe: fa, Pinch: ca, Rotate: ea, Press: da, on: m, off: n, each: g, merge: ta, extend: sa, assign: la, inherit: i, bindFn: j, prefixed: u }); var wb = "undefined" != typeof a ? a : "undefined" != typeof self ? self : {}; wb.Hammer = ha, "function" == typeof define && define.amd ? define(function () { return ha }) : "undefined" != typeof module && module.exports ? module.exports = ha : a[c] = ha }(window, document, "Hammer");