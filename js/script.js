NodeList.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.filter = Array.prototype.filter;
NodeList.prototype.map = Array.prototype.map;
Array.prototype.random = function() { return this[Math.floor(Math.random() * this.length)]; }
Object.defineProperty(Array.prototype, 'random', { enumerable: false });

var showDebug = getParameterByName('debug') || false;

if (!showDebug) {
    console.log = function() {};
    console.debug = function() {};
    console.table = function() {};
}

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

function declension(forms, val) {
    const cases = [ 2, 0, 1, 1, 1, 2 ];
    return forms[(val % 100 > 4 && val % 100 < 20) ? 2 : cases[(val % 10 < 5) ? val % 10 : 5]];
}

function ajax(url, data, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.open(data ? 'POST' : 'GET', url, true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            try {
                data = JSON.parse(xhr.responseText);
            } catch($e) {
                data = xhr.responseText;
            }
            if (typeof success == 'function') success(data);
        } else {
            if (typeof error == 'function') error(xhr.status);
        }
    };
    xhr.onerror = function(err) {
        if (typeof error == 'function') error(err);
    };
    if (data) {
        if (typeof data == 'string') xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        if (typeof data == 'object') data = JSON.stringify(data);
        xhr.send(data);
    } else {
        xhr.send();
    }
}

function ajax2(url, data, success, error, cors) {
    if (typeof success == 'function') success = success.bind(this);
    if (typeof error == 'function') error = error.bind(this);
    var xhr = new XMLHttpRequest();
    xhr.open(data ? 'POST' : 'GET', url, true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            try {
                data = JSON.parse(xhr.responseText);
            } catch($e) {
                data = xhr.responseText;
            }
            if (typeof success == 'function') success(data);
        } else {
            if (typeof error == 'function') error(xhr.status);
        }
    };
    xhr.onerror = function(err) {
        if (typeof error == 'function') error(err);
    };
    if (data) xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if (data) {
        xhr.send(data);
    } else {
        xhr.send();
    }
};

function short(link, callback) {
    ajax('https://short.ajaxfeed.com/?short=' + encodeURIComponent(link), null, function(data) {
        callback(data.url.shortLink);
    });
}

function qrcode(link) {
    var sms = document.querySelector('input[name="link"]');
    var fields = { text: 'qrText', width: 'qrWidth', height: 'qrHeight', colorDark: 'qrColorDark', colorLight: 'qrColorLight', correctLevel: 'qrCorrectLevel' };
    document.querySelectorAll('[data-content="QR"]').forEach(function(elem) {
        var config = {};
        if (sms) config.text = sms.value;
        if (link) config.text = link;
        for (var i in fields) if (elem.dataset[fields[i]]) config[i] = elem.dataset[fields[i]];
        if (config.correctLevel) config.correctLevel = parseInt(config.correctLevel);
        if (config.text) {
            elem.innerHTML = '';
            new QRCode(elem, config);
        }
    });
}

window.addEventListener('hashchange', function() {
    if (window.location.hash == '#qrcode' || window.location.hash == '#qr_code' || window.location.hash == '#qrform') {
        var sms = document.querySelector('input[name="link"]');
        if (sms) short(sms.value, qrcode);
    }
});

function rules(callback) {
    if (!window.fonapi) window.fonapi = {};
    if (callback) window.fonapi.callback = callback;

    if (!window.fonapi.urls) {
        ajax(
            '/urls.json',
            null,
            function(data) {
                window.fonapi.urls = data.common;
                rules();
            });
        window.fonapi.urls = 'loading';
    }

    if (window.fonapi.urls == 'loading') return;

    if (!window.fonapi.rules) {
        window.fonapi.rules = {};
        var lang = (navigator.language || navigator.userLanguage).match(/(\d+)/);
        lang = lang ? lang[1] : 'ru';
        document.querySelectorAll('[data-alias]').forEach(function(el) {
            if (!el.innerHTML) window.fonapi.rules[el.getAttribute('data-alias') + '/' + (el.getAttribute('data-lang') || el.getAttribute('data-locale') || lang)] = '';
        });
        if (window.fonapi.callback) {
            document.querySelectorAll('[name="gtm_name"]').forEach(function(el) {
                window.fonapi.rules['data_' + el.content + '/' + lang] = '';
            });
        }
    }

    for (var rule in window.fonapi.rules) {
        if (!window.fonapi.rules[rule]) {
            ajax(
                window.fonapi.urls.random() + '/content/getActualContentByAlias',
                {
                    alias: rule.split('/')[0],
                    className: 'Content.UserPage',
                    lang: rule.split('/')[1],
                    lastVersion: '0',
                    sysId: 21
                },
                function(data) {
                    if (data.content && data.content.object && data.content.object.body) {
                        if (rule.indexOf('data_') === 0) {
                            window.fonapi.rules[rule] = data.content.object.body.split("\n").map(function(str) {
                                return str.split('=');
                            }).reduce(function(data, arr) {
                                if (arr.length > 1) {
                                    data.key = arr.shift();
                                    data[data.key] = '';
                                }
                                if (data.key) data[data.key] += arr.join('=') + "\n";
                                return data;
                            }, {});
                            for (var key in window.fonapi.rules[rule]) {
                                window.fonapi.rules[rule][key] = window.fonapi.rules[rule][key].trim();
                                if (window.fonapi.rules[rule][key].indexOf('#') > -1) window.fonapi.rules[rule][key] = marked(window.fonapi.rules[rule][key]);
                            }
                        } else {
                            window.fonapi.rules[rule] = marked(data.content.object.body);
                        }
                    } else {
                        if (rule.indexOf('data_') === 0) {
                            window.fonapi.rules[rule] = {};
                        } else {
                            window.fonapi.rules[rule] = ' ';
                        }
                    }
                    rules();
                });
            window.fonapi.rules[rule] = 'loading';
        }

        if (window.fonapi.rules[rule] == 'loading') return;

        if (rule.indexOf('data_') === 0) {
            for (var key in window.fonapi.rules[rule]) {
                document.querySelectorAll('[data-alias="' + rule.split('/')[0] + '"][data-lang="' + rule.split('/')[1] + '"][data-key="' + key + '"], [data-alias="' + rule.split('/')[0] + '"][data-locale="' + rule.split('/')[1] + '"][data-key="' + key + '"]').forEach(function(el) {
                    if (!el.innerHTML) el.innerHTML = window.fonapi.rules[rule][key];
                });
            }
            if (typeof window.fonapi.callback == 'function') window.fonapi.callback(window.fonapi.rules[rule]);
        } else {
            document.querySelectorAll('[data-alias="' + rule.split('/')[0] + '"][data-lang="' + rule.split('/')[1] + '"], [data-alias="' + rule.split('/')[0] + '"][data-locale="' + rule.split('/')[1] + '"]').forEach(function(el) {
                if (!el.innerHTML) el.innerHTML = window.fonapi.rules[rule];
            });
        }
    }
}


function error(xhr) {
    document.querySelector('#message').innerText = xhr.responseText || status;
    window.location.hash = '#error';
}

function initReg() {
    // if (window.urlsConfig) {
    //     var script = document.createElement('script');
    //     script.src = window.urlsConfig.cdnUrl + '/' + window.urlsConfig.registrationLoader;
    //     document.head.appendChild(script);
    // }
}

function userAgent() {
    var attribute = '';
    var devices = {
        android: /android/i,
        iphone: /iphone/i,
        ipad: /ipad/i,
        ipod: /ipod/i,
        ios: /iphone|ipod|ipad/i
    };

    for (var device in devices)
        if (devices[device].test(window.navigator.userAgent))
            attribute += ' ' + device;

    document.querySelector('html').setAttribute('device', attribute);
}


var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


function action(action, data, el) {
    if (typeof window[action] == 'function') window[action](data);
    if (/^#.+/i.test(action)) {
        document.documentElement.beforeScrollTop = document.documentElement.scrollTop;
        window.location.hash = action;
        document.documentElement.scrollTop = document.documentElement.beforeScrollTop;
    }
}

function show(el,event) {
    if (!el) return false;
    if (el.parentNode.clientWidth + el.parentNode.clientHeight == 0) show(el.parentNode);
    if (el.dataset.group) document.querySelectorAll('[data-group="' + el.dataset.group + '"]').filter(function(e) { return e != el; }).forEach(hide);
    if (el.clientWidth + el.clientHeight == 0 && !el.dataset.group) window.popups.push(el);
    if (el.clientWidth + el.clientHeight == 0) el.style.display = '';
    el.disabled = false;
    el.focus();
    el.classList.add('is-active');
    document.body.classList.add('is-modal-show');
    // scrollTo(el);
}

function scrollTo(el) {
    if (!el) return;
    jQuery(document.documentElement).animate({
        scrollTop: jQuery(el).offset().top
    }, {
        duration: 500,
        complete: function() {
            // window.addEventListener('scroll', scroll);
        }
    });
}

// function scroll(event) {
//   if (document.documentElement.scrollTop < document.documentElement.scrollHeight / 2) {
//     window.removeEventListener('scroll', scroll);
//     document.documentElement.beforeScrollTop = document.documentElement.scrollTop;
//     window.location.hash = '';
//     document.documentElement.scrollTop = document.documentElement.beforeScrollTop;
//   }
// }

function hide(el) {
    if (!el) return window.popups.forEach(hide);
    el.classList.remove('is-active');
    el.style.display = 'none';
    document.body.classList.remove('is-modal-show');
}

function hash(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (!window.popups) window.popups = [];
    if (window.location.hash && window.location.hash != '#' && window.location.hash != '#!') {
        show(document.querySelector(window.location.hash));
    } else {
        hide();
    }
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function detectLang() {
    var lang = null;
    var match = null;
    console.log('detectLang()...');
    console.log('%cdocument.cookie =>','color:green','"'+document.cookie+'"');
    if (match = (navigator.language || navigator.userLanguage).match(/(ru|en|kk|fr|uz)/)) lang = match[1];
    console.log('detectLang navigator => ', match[1] );
    lang = document.querySelector('html').attributes.lang.value || match[1];
    if (match = document.cookie.match(/ lang=(ru|en|kk|fr|uz)/)) lang = match[1];
    if (match = getCookie('lang')) lang = match;
    console.log('%cdetectLang document.cookie => ','background: #222; color: #bada55' ,lang);
    if (match = document.cookie.match(/headerApi\.lang=(ru|en|kk|fr|uz)/)){
        console.log('%cmatch headerApi!!!', 'color: #bada55', match[1]);
        lang = match[1];
    }
    console.log('%cdetectLang headerApi => ','color: #bada55', match, lang );
    console.log('❗️detectLang =>', lang);
    if (lang) return initLang(lang);
}

function initLang(lang) {
    console.log('initLang()...');
    if (lang.lang) lang = lang.lang;
    document.cookie = 'lang=' + lang + '; path=/; domain=' + window.location.hostname;
    document.querySelector('html').attributes.lang.value = lang;
    document.querySelectorAll('input[name="lang"]').forEach(function(el) {
        el.value = lang;
    });
    document.querySelectorAll('[data-locale]').forEach(function(el) {
        el.dataset.locale = lang;
    });
    document.querySelectorAll('[data-placeholder]').forEach(function(el) {
        el.setAttribute('placeholder',el.dataset['placeholder'+lang.capitalize()]);
    });

    window.lang = lang;
    // initReg();
    console.log('❗️initLang =>', lang);
    rules();
}

function setPromo(code){
    if (code.code) code = code.code;
    registrationApi.setPromocode(code);
}

function setLang(lang) {
    if (lang.lang) lang = lang.lang;
    document.cookie = 'lang=' + lang + '; path=/; domain=' + window.location.hostname;
    document.querySelector('html').attributes.lang.value = lang;
    document.querySelectorAll('[data-locale]').forEach(function(el) {
        el.dataset.locale = lang;
    });
    document.querySelectorAll('[data-placeholder]').forEach(function(el) {
        el.setAttribute('placeholder',el.dataset['placeholder'+lang.capitalize()]);
    });
    if (window.line && window.line.data){
        window.line.reload({ eventId: [ line.data['ID'] ], lang: lang });
    }
    initReg();
    if (typeof window.registrationApi !== 'undefined') registrationApi.setLanguage(lang);
    window.fonapi = {};
    // console.log('window.fonapi', window.fonapi);
    rules();
    // console.log('lang = ',window.lang);
}

function ajaxFormCustom(url, data, success, error, cors) {
    if (typeof success == 'function') success = success.bind(this);
    if (typeof error == 'function') error = error.bind(this);
    var xhr = new XMLHttpRequest();
    xhr.open(data ? 'POST' : 'GET', url, true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            try {
                data = JSON.parse(xhr.responseText);
            } catch($e) {
                data = xhr.responseText;
            }
            if (typeof success == 'function') success(data);
        } else {
            if (typeof error == 'function') error(xhr.status);
        }
    };
    xhr.onerror = function(err) {
        if (typeof error == 'function') error(err);
    };
    if (data) xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    if (data) {
        xhr.send(data);
    } else {
        xhr.send();
    }
}

function ajaxForm(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.tagName == 'FORM') var form = event;
    if (this && this.tagName == 'FORM') var form = this;
    form.input = form.querySelector(':focus');

    if (window.grecaptcha) {
        grecaptcha.execute('6LehDGAUAAAAAJoqkx-oc6W-KeapSBCr2veF3Mwd', { action: 'submit' }).then(function(token) {
            form.querySelector('[name=captcha]').value = token;
            ajaxSubmit(form);
        });
    } else {
        ajaxSubmit(form);
    }
}

function ajaxSubmit(form) {
    var opts = {};

    if (form.dataset.submit) opts.beforeSubmit = function() { action(form.dataset.submit); }
    if (form.dataset.success) opts.success = function(res) { action(form.dataset.success, res); }
    if (form.dataset.error) opts.error = function(xhr) { action(form.dataset.error, xhr); }
    if (form.button && form.button.dataset.submit) opts.beforeSubmit = function() { action(form.button.dataset.submit); }
    if (form.button && form.button.dataset.success) opts.success = function(res) { action(form.button.dataset.success, res); }
    if (form.button && form.button.dataset.error) opts.error = function(xhr) { action(form.button.dataset.error, xhr); }
    if (form.button && form.button.attributes.formAction) opts.url = form.button.formAction;
    if (form.input && form.input.dataset.submit) opts.beforeSubmit = function() { action(form.input.dataset.submit); }
    if (form.input && form.input.dataset.success) opts.success = function(res) { action(form.input.dataset.success, res); }
    if (form.input && form.input.dataset.error) opts.error = function(xhr) { action(form.input.dataset.error, xhr); }
    if (form.input && form.input.attributes.formAction) opts.url = form.input.formAction;

    if (jQuery(form).hasClass('custom-validate')){
        var bet = document.querySelector('[name="bet"]').value;
        var phoneVal = document.querySelector('#phone').value;
        var phone = phoneVal.replace(/[^0-9]/ig,'');
        var landing = document.querySelector('input[name="landing"]').value || document.querySelector('meta[name="gtm_name"]').content;
        var _event = document.querySelector('input[name="event"]').value;
        console.debug('landing='+ landing +'&event=' + _event + '&bet=' + bet + '&phone=' + phone);
        ajaxFormCustom('https://fonstats.ru/code/check.php', 'landing='+ landing +'&event=' + _event + '&bet=' + bet+ '&phone=' + phone);
        //success
        // window.location.hash = '#';
        // hash();
        window.voted= true;
        //show title success
        var voteTitle = document.querySelector('.b-modal--vote .b-modal__vote-title');
        if (voteTitle) voteTitle.classList.remove('opacity-0');

        //redirect
        var redirectLink = form.dataset.redirect;
        if (redirectLink){
            setTimeout(function(){
                window.location = redirectLink;
            },3000);
        } else {
            setTimeout(function(){
                // window.location.hash = '#';
            },1000);
        }

    } else {
        jQuery(form).ajaxSubmit(opts);
    }
}

function checkInitData(){
    if ( isMobile.any() ){
        document.querySelectorAll('[data-alias-mob]').forEach(function(el){
            var aliasMob = el.getAttribute('data-alias-mob');
            el.setAttribute('data-alias',aliasMob);
            rules();
        });
        document.querySelectorAll('[data-promo-id-mob]').forEach(function(el){
            var promoMob = el.getAttribute('data-promo-id-mob');
            el.setAttribute('data-promo-id',promoMob);
            // initReg();
        });
    } else {
        rules();
        initReg();
    }
}

var regDataFlag = false;

function checkEmptyData(s,value){
    var _el = document.querySelector('['+s+']')
    if (value && (_el)!=null){_el.setAttribute(s,value);}
}

function updateData(conf){
    console.debug('updateData()');
    regDataFlag = true;
    checkEmptyData('data-alias-mob',conf.rules_alias_mob);
    checkEmptyData('data-alias',conf.rules_alias);
    checkEmptyData('data-promo-id',conf.promocode_text);
    checkEmptyData('data-promo-id-mob',conf.promocode_text_mob);

    checkInitData();
    document.body.classList.add('line-is-loaded');
}

function init() {
    if (!data) return;
    for (var key in data)
        render(key, data[key]);
    for (var key in conf)
        render(key, conf[key]);
        // updateData(conf)
    utm();
}

function render(key, value) {
    document.querySelectorAll('[data-content="' + key + '"]').forEach(function(el) {
        if (value) {
            switch (el.tagName) {
                case 'LABEL':
                case 'DIV':
                    el.style.display = 'block';
                    break;
                case 'SPAN':
                case 'P':
                    el.innerHTML = value;
                    break;
                case 'TEXTAREA':
                case 'INPUT':
                    el.value = value;
                    break;
                case 'A':
                    el.href = value;
                    break;
                case 'IFRAME':
                case 'VIDEO':
                case 'IMG':
                    el.src = value;
                    break;
            }
        } else {
            el.style.display = 'none';
        }
    });
}


function initLine() {
    var match = null;
    var element = null;
    if (element = document.querySelector('meta[name="gtm_name"]')) window.alias = element.content;
    if (match = window.location.pathname.match(/\/(\d+)\/?$/)) window.eventId = match[1];
    else if (match = window.location.pathname.match(/\/([^\/]+)\/?$/)) window.alias = match[1];
    if (match = window.location.search.match(/\bid=(\d+)/)) window.eventId = match[1];
    if (match = window.location.search.match(/_rtx(\d+)/)) window.eventId = match[1];
}

// initLine();

function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    if (!url) url = window.location.href;
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// window.clientId = getCookie('headerApi.cid');
window.clientId = getParameterByName('clientId') || getCookie('headerApi.cid') || getParameterByName('fsid');
console.debug('clientId =>', clientId);
window.fsid = getCookie('headerApi.fsid') || getCookie('headerApi.FSID');
console.debug('fsid =>', fsid);

window.addEventListener("load", (event) => {
    document.body.classList.add('is-loaded');
});

window.addEventListener('DOMContentLoaded', function() {

    // document.body.classList.add('is-animating');

    // detectLang();
    if (document.body.classList.contains('detect-lang')) detectLang();
    // window.addEventListener('hashchange', hash);
    // hash();

    userAgent();
    checkInitData();

    qrcode();

    if (window.clientId){
        document.body.classList.add('is-logged');

    } else {
        // console.log('User is not found, redirected...');
        // setTimeout(function(){
        //     window.location = 'https://www.fon.bet/account/registration/';
        // }, 2000);
    }

});

// Listen for changes in visibility
document.addEventListener('visibilitychange', () => {
    // If the page is visible again
    if (document.visibilityState === 'visible') {
        // Do something
        // window.clientId = getCookie('headerApi.cid');
        // window.clientId = getParameterByName('clientId') || getCookie('headerApi.cid') || getParameterByName('fsid');
        // window.fsid = getCookie('headerApi.fsid') || getCookie('headerApi.FSID');
        // console.debug('Welcome back!', clientId, fsid);

        if (window.clientId ) {
            document.body.classList.add('is-logged');
            // closeAllModals();
            // closeModal(document.getElementById('authStart'));
            // showModal(document.getElementById('regFest'));
            // app.setState('regfest');
        }
    }
});


// lazy load IntersectionObserver video
document.addEventListener('DOMContentLoaded', function() {
    var lazyloadIframes = document.querySelectorAll('.lazyload[data-src]');

    if ('IntersectionObserver' in window) {
        var iframeObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var iframe = entry.target;
                    iframe.src = iframe.dataset.src;
                    iframeObserver.unobserve(iframe);
                }
            });
        });

        lazyloadIframes.forEach(function(iframe) {
            iframeObserver.observe(iframe);
        });
    } else {
        // If browser doesn't support IntersectionObserver, you might want to load all iframes immediately or use a polyfill
    }
});

// window.addEventListener('DOMContentLoaded', function(){
//     document.querySelectorAll('[data-click]').forEach(function(el) {
//         el.addEventListener('click', function(event) {
//             event.preventDefault();
//             action(this.dataset.click, this);
//         });
//     });
// });

jQuery(function() {

    jQuery(document).on('click', '.s-hero__content-body .toolbar__btn:not(._state_disabled),.s-hero__content-form .toolbar__btn:not(._state_disabled)', function(){
        jQuery('.s-hero__content-form-btn').addClass('hide');
    });

    if (isMobile.any() && window.innerWidth < 767){
        var slider = jQuery('.js-mobile-slider');
        if (slider.length){
            slider.owlCarousel({
                items: 1,
                nav: false,
                dots: false,
                loop: true,
                center: true,
                margin: 0,
                // rewind: true,
                startPosition: 1,
                autoWidth: true,
                autoplay: false,
                autoplaySpeed: 500,
                autoplayTimeout: 4000,
                autoplayHoverPause: false
            });
        }

        jQuery(document).on('click', '.s-hero__vote-itm', function (){
            var index = $(this).data('index');
            slider.trigger('to.owl.carousel',index,0)
        });
    }

    if (jQuery('[data-slider]').length) jQuery('[data-slider]').owlCarousel({
        items: 1,
        nav: true,
        dots: false,
        loop: false,
        autoplay: false,
        autoplaySpeed: 500,
        autoplayTimeout: 4000,
        autoplayHoverPause: false
    });

    jQuery.jMaskGlobals.translation['9'] = '';

    document.querySelectorAll('[data-mask]').forEach(function(el) {
        jQuery(el).mask(el.dataset.mask);
    });

    document.querySelectorAll('[data-submit]').forEach(function(el) {
        el.addEventListener('submit', ajaxForm);
    });

    document.querySelectorAll('[data-submit] [type="submit"]').forEach(function(el) {
        el.addEventListener('click', function(event) {
            this.form.button = this;
        });
    });

    document.querySelectorAll('[data-valid="submit"]').forEach(function(el) {
        el.addEventListener('input', function(event) {
            if (this.checkValidity()) ajaxForm(this.form);
        });
    });

    document.querySelectorAll('[data-invalid]').forEach(function(el) {
        el.addEventListener('invalid', function(event) {
            this.setCustomValidity(this.dataset.invalid);
        });
        el.addEventListener('change', function(event) {
            this.setCustomValidity('');
            document.querySelectorAll('[name=' + this.name + ']').forEach(function(el) {
                el.setCustomValidity('');
            });
        });
        el.addEventListener('input', function(event) {
            this.setCustomValidity('');
            document.querySelectorAll('[name=' + this.name + ']').forEach(function(el) {
                el.setCustomValidity('');
            });
        });
    });

    document.querySelectorAll('[data-click]').forEach(function(el) {
        el.addEventListener('click', function(event) {
            event.preventDefault();
            action(this.dataset.click, this.dataset, this);
            // action(this.dataset.click, this);
        });
    });
   
    var indexes = {current: 0};
    var slide = document.getElementsByClassName('text-slide');
    var slides = document.querySelector('.text-slide');
    if (typeof(slides) != 'undefined' && slides != null){
        window.onload = slideText();
    }
    function slideText() {
        if (indexes.last) {
            slide[indexes.last].classList.remove('is-active');
        }
        slides.classList.remove('is-active');
        slide[indexes.current].classList.add('is-active');
        indexes.last = indexes.current;
        indexes.current++;
        if (indexes.current >= slide.length) {
            indexes.current = 0;
        }

        setTimeout(slideText, 2000);
    }

    jQuery(".scrollto").on('click', function (e) {
        e.preventDefault();
        var hash = e.currentTarget.hash,
            scrollTo = 0,
            offset = 0;
        if (!$(hash).length) return;
        scrollTo = Math.round($(hash).offset().top) - offset;
        // animate
        jQuery('html, body').stop().animate({scrollTop: scrollTo}, 600);
    });


    // set all images width in PX to REM
    document.querySelectorAll('.img-adaptive').forEach(function(el) {
        if (!el) return;
        var elWidth = el.getAttribute('width') ? el.getAttribute('width') : el.clientWidth;
        if (el.classList.contains('--em')) el.style.width = elWidth/10+'em'
        else el.style.width = elWidth/10+'rem';
        if (el.getAttribute('height')){
            el.style.height = el.getAttribute('height')/10+'rem';
        }
    });


    //app state
    class App{
        setState(currState){
            var storageState = localStorage.getItem('state');
            if (storageState) currState = storageState;
            if (!document.querySelector('[data-state="'+currState+'"]')) return;
            var body = document.querySelector('body');
            for (var i = body.classList.length - 1; i >= 0; i--) {
                var className = body.classList[i];
                if (className.startsWith('state--')) {
                    body.classList.remove(className);
                }
            }
            body.classList.add('state--'+currState);
            document.querySelectorAll('[data-state]').forEach(function (el){
                if (el.dataset.state.split(' ').indexOf(currState) > -1){
                    (el.dataset.toggle) ? el.classList.remove(el.dataset.toggle) : el.classList.remove('hide');
                } else {
                    (el.dataset.toggle) ? el.classList.add(el.dataset.toggle) : el.classList.add('hide');
                }
            });
            localStorage.removeItem('state');

            //change theme-color
            if (isMobile.any()){
                var bgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color');
                document.querySelector('meta[name="theme-color"]').content = RGBToHex(bgColor);
            }
        }
    }
    window.app = new App();
    console.debug('localStorage state =>', localStorage.getItem('state'));
    window.location.hash = '';
    app.setState('start');

    document.querySelectorAll('[data-show]').forEach(function (elem){
        elem.addEventListener('click',function (e){
            console.log('show', this.dataset);
            // console.log('href', this.getAttribute('href'), this.href);
            if (this.getAttribute('href') != "#" || this.getAttribute('href') != "#!"){
                localStorage.setItem('state',this.dataset.show)
            }
            // e.preventDefault();
            // window.location.hash = '#'+this.dataset.show;
            app.setState(this.dataset.show);
        });
    });

});



function RGBToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb.substr(4).split(")")[0].split(sep);

    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
}

function showModal(el){
    if (!el) return;
    // closeAllModals();
    el.classList.add('is-active');
    // el.style = '';
    document.body.classList.add('is-modal-open');
    document.body.classList.add('is-modal-open--'+el.id);
    document.body.classList.add('no-scroll');
}

function closeModal(el){
    if (!el) return;
    el.classList.remove('is-active');
    // el.style.display = 'none';
    document.body.classList.remove('is-modal-open');
    document.body.classList.remove('is-modal-open--'+el.id);
    if (document.querySelectorAll('.b-modal.is-active').length === 0){
        document.body.classList.remove('no-scroll');
    }
}

function closeAllModals(modals) {
    if (modals){
        modals.forEach((modal) => {closeModal(modal);});
    } else {
        var modalEls = document.querySelectorAll('.b-modal');
        if (modalEls) modalEls.forEach((modal) =>{
            // modal.style.display = 'none'
            modal.classList.remove('is-active');
        });
        document.body.classList.remove('no-scroll');
        document.body.classList.remove('is-modal-open');
        document.body.classList.remove('is-modal-show');
    }
}

window.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.js-modal-open').forEach((el)=>{
        el.addEventListener('click', function(e) {
            e.preventDefault();
            var hash = el.attributes.href.value;
            var modal = document.querySelector(hash);
            showModal(modal);
        });
    });

    document.querySelectorAll('.js-modal-close').forEach((el)=>{
        el.addEventListener('click', function(e) {
            e.preventDefault();
            var modal = this.closest('.b-modal');
            closeModal(modal);
        });
    });

    document.querySelectorAll('.b-modal__bg, .b-modal__close').forEach((el)=>{
        el.addEventListener('click', function(e) {
            e.preventDefault();
            var modal = this.closest('.b-modal');
            closeModal(modal);
        });
    });

});


function RGBToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb.substr(4).split(")")[0].split(sep);

    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
}

var regFlag = false;
var refreshIntervalId = setInterval(function(){
    if (typeof window.registrationApi !== 'undefined') regFlag = true;
    if (regFlag){
        clearInterval(refreshIntervalId);
        console.debug('window.registrationApi', window.registrationApi);

        registrationApi.onRegistrationStateChanged = function(state){
            console.debug("registrationApi state", state);
        };
        registrationApi.onRegistrationCompleted = function(clientId) {
            console.debug('Registration completed, clientId =>', clientId);
            document.body.classList.add('state--regfinish');
            var formTitle = document.querySelectorAll('.js-form-title:not(.hide)');
            formTitle.forEach((el)=>{
                el.classList.add('hide');
            });
            // window.location.hash = '#qrform';
            app.setState('reg-success');

            if (window.innerWidth > 1024 && !isMobile.any()){
                setTimeout(function(){
                    window.location = 'https://www.fonbet.by/account/verification/';
                },5000);
            } else {
                setTimeout(function(){
                    window.location = 'https://www.fonbet.by/account/verification/';
                },5000);
            }
        }
    }
}, 500);

(function() {
    var timer = 0;
    window.addEventListener('resize', function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        else
            document.body.classList.add('stop-transitions');

        timer = setTimeout(function () {
            document.body.classList.remove('stop-transitions');
            timer = null;
        }, 100);
    });
})();

/** @return IntersectionObserver */
function createObserver(p_threshold) {
    return new IntersectionObserver(function (entries) {
        entries.forEach(function (
            /** @type IntersectionObserverEntry */
            entry) {
            if (entry.isIntersecting) {
                var eventIntersecting = new CustomEvent("intersecting");
                entry.target.dispatchEvent(eventIntersecting);
                return;
            }

            var eventNotIntersecting = new CustomEvent("not-intersecting");
            entry.target.dispatchEvent(eventNotIntersecting);
        });
    }, {
        threshold: p_threshold
    });
}

(function(ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
        if (!this) return null;
        if (this.matches(selector)) return this;
        if (!this.parentElement) {return null}
        else return this.parentElement.closest(selector)
    };
}(Element.prototype));
