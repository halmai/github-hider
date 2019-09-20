// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*/pull/4/files
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var prefixToHide = 'vendor/';  // configurable value. If the path of a file starts with this prefix, it will be hidden.
    var frequencyOfDeleteMillisec = 1000; // configurable value. It tries to hide files after each such a long interval.

    function hideByPathPrefix(pref) {
        var divs = document.getElementById('files').querySelectorAll('div[id^="diff-"]');
        var re = new RegExp('^diff\-[0-9]+$')

        for (var i = 0; i < divs.length; i++) {
            var id = divs[i].attributes.id;
            if (id && re.test(id.value)) {
                var tagA = document.getElementById(id.value).getElementsByTagName('a')[0];
                var title = tagA.attributes.title
                if (title && title.value && (title.value.substr(0, pref.length) == pref)) {
                    // console.log('Hide:', title);
                    document.getElementById(id.value).style.display = 'none';
                }
            }
        }

    }

    function schedule() {
        setTimeout(function() {
            // console.log('hiding', (new Date).toISOString(), '...');
            hideByPathPrefix(prefixToHide);
            // console.log('hidden', (new Date).toISOString(), '.');
            schedule();
        }, frequencyOfDeleteMillisec);
    }

    hideByPathPrefix(prefixToHide);
    schedule();
})();
