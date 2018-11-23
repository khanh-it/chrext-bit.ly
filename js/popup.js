(function ($) {
    // Define vars
    var SCHEMA = 'https';
    var DOMAIN = 'bitly.com';
    var URL = SCHEMA + '://' + DOMAIN + '/';
    var URI = '';
    // +++ elements
    var $win = $(window);
    var $form1st = $('#form1st');
    var $btnStart = $('#btn-start');
    var $btnStop = $('#btn-stop');
    var $rptWinBtn = $('#report-window-btn');
    var $adsWinBtn = $('#ads-window-btn');
    var $adsCntBadge = $('#ads-cnt-badge');
    
    /**
     * Show/hide report window
     * @param void
     */
    function reportWindow(callback, hide)
    {
        // Case: hide window
        if (true === hide) {
            var win = reportWindow.win;
            if (win && ('closed' in win) && !win.closed) {
                win.closed();
                win = reportWindow.win = null;
            }    
            return;
        }
        //.end

        var link = (URL + URI) + '+';
        var win = reportWindow.win;
        if (win && ('closed' in win) && !win.closed) {
            return win.focus();
        }
        //
        win = reportWindow.win = window.open(link + '#rl=0', 'BitLy-Report', 'width=800,height=600');
        //
        function reloadWin() {
            win.location = (link + '#rl=' + (++reloadWin.cnt));
        }
        reloadWin.cnt = 0;
        //
        var timer = setInterval(function () {
            if (win && ('closed' in win) && win.closed) {
                return clearInterval(timer);
            }
            reloadWin();
        }, 30 * 1000);
    }
    // @var {null}|{object}
    reportWindow.win = null;
    //
    $rptWinBtn.on('click', function(evt){
        evt.preventDefault();
        reportWindow();
    });

    /**
     * Show/hide ads window
     * @return void
     */
    function adsWindow(callback, hide)
    {
        // Case: hide/close window
        if (true === hide) {
            // Hide/close window
            var win = adsWindow.win;
            if (win && !win.closed) {
                win.close();
                win = adsWindow.win = null;
            }
            // Reset stats
            $adsCntBadge.text(adsWindow.cnt = 0);
            return;
        }
        //.end

        // Format input(s)
        callback = callback || $.noob;
        // +++
        var link = (URL + URI) + '?_=' + (new Date().getTime());
        var win = adsWindow.win;
        if (!win || (win && win.closed)) {
            win = adsWindow.win = window.open('_blank', 'BitLy-Ads', 'width=1024,height=768');
            win.blur();
            window.focus();
        }
        win.location = link;
        // 
        $adsCntBadge.text(++adsWindow.cnt);
    }
    // @var {null}|{object}
    adsWindow.win = null;
    // @var {number}
    adsWindow.cnt = 0;
    //
    $adsWinBtn.on('click', function(evt){
        evt.preventDefault();
        adsWindow();
    });

    /**
     * Clear cookies
     */
    function clearCookies(callback)
    {
        callback = callback || $.noob; // Format callback
        chrome.cookies.getAll({}, function (cookies) {
            console.log('clearCookies: ', cookies);
            if (cookies.length) {
                var rmCookieKeys = ['_bit', '_cc'];
                var rmCookies = [];
                cookies.forEach(function (cookie) {
                    if ($.inArray(cookie.name, rmCookieKeys) >= 0) {
                        rmCookies.push(cookie);
                    }
                });
                if (rmCookies.length) {
                    var cbCnt = 0;
                    rmCookies.forEach(function (cookie) {
                        chrome.cookies.remove({ "url": URL, "name": cookie.name }, function () {
                            console.log('cookie removed: ', cookie);
                            // Fire callback?
                            if (++cbCnt == rmCookies.length) {
                                callback();
                            }
                        });
                    });
                } else {
                    // Fire callback!
                    callback();
                }
            } else {
                // Fire callback!
                callback();
            }
        });
    }

    /**
     * 
     */
    function start()
    {
        // Open/show report window
        reportWindow();
        // Clear cookies --> Open/show ads window
        function func() {
            clearCookies(adsWindow);
        };
        func();
        // Repeat...
        var sec = Math.round(Math.random() * 10);
        start.timer = setInterval(func, (sec + 15) * 1000);
    }
    start.timer = null;
    //.end

    /**
     * 
     */
    function stop()
    {
        // Hide report window
        reportWindow(null, true);
        // Hide ads window
        adsWindow(null, true);
        //
        clearInterval(start.timer);
    }

    /**
     * 
     */
    $btnStart.on('click', function (evt) {
        //
        evt.preventDefault();
        //
        URI = $.trim($form1st.find('[name="uri"]').attr('readonly', 'readonly').val());
        if (!URI) {
            return;
        }
        //
        $form1st.addClass('active');
        //
        start();
    });
    //.end

    /**
     * 
     */
    $btnStop.on('click', function (evt) {
        //
        evt.preventDefault();
        //
        $form1st.find('[name="uri"]').removeAttr('readonly').val('');
        //
        $form1st.removeClass('active');
        //
        stop();
    });

    /**
     * 
     */
    $win.on('beforeunload', function() {
        stop();
    })
})(jQuery);