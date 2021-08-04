// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Csongor Halmai
// @match        https://github.com/*/pull/*
// @match        https://github.com/*/commit/*
// @match        https://github.<yourcompany>.com/*/pull/*
// @match        https://github.<yourcompany>.com/*/commit/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var patternsToHide = [ // configurable value. If the path of a file matches one of these regular expressions, it will be hidden.
        'go.mod$',
        'go.sum$',
        '^vendor/',
        '.pb.go$',
    ];
    var frequencyOfDeleteMillisec = 1000; // configurable value. It tries to hide newly fetched files after each period of this duration.

    var btnId = 'btn-github-hider-toggler'; // the ID of the toggle button
    var className = 'github-hider-file'; // class name for collecting all the DIVs that we want to hide/unhide
    var isVisible = false; // are all the relevant files Visible or Hidden?
    var numHiddenFiles = 0;

    function addHiderButton(firstDiv) {
        if (document.getElementById(btnId)) {
            return;
        }

        var parentOfDivs = firstDiv.parentNode;
        var button = document.createElement("button");
        button.id = btnId;
        button.addEventListener("click", toggleFiles);
        parentOfDivs.insertBefore(button,firstDiv);
        updateButtonLabel();
        button.style.margin = '2em 0';
    }

    function toggleFiles() {
        setFileVisibility(!isVisible);
    }

    function setFileVisibility(b) {
        isVisible = b;

        var els = document.getElementsByClassName(className);
        for (var i = 0; i < els.length; i++) {
            els[i].style.display = isVisible ? 'block' : 'none';
        }
    }

    function updateButtonLabel() {
        if (document.getElementById(btnId)) {
            document.getElementById(btnId).innerHTML = 'Toggle Files Hidden by Github Hider (' + numHiddenFiles + ' files)';
        }
    }

    // tells whether the DIV element contains an A element that has a title we want hide
    function hasHideableTitle(divEl, patterns) {
        var aTags = divEl.getElementsByTagName('a');

        for (var i = 0; i < aTags.length; i++) {
            var title = aTags[i].attributes.title
            if (title && title.value) {
                for (var j = 0; j < patterns.length; j++) {
                    var re = new RegExp(patterns[j])
                    if (title.value.match(re)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    function markHidablesByPathPrefix(patterns) {
        var files = document.getElementById('files');
        if (!files) {
            return; // it can happen that the files are not populated yet.
        }

        var divs = files.querySelectorAll('div[id^="diff-"]');
        var re = new RegExp('^diff\-[0-9a-z]+$')
        var isFirst = true;

        for (var i = 0; i < divs.length; i++) {
            var id = divs[i].attributes.id;
            if (id && re.test(id.value)) {
                if (hasHideableTitle(document.getElementById(id.value), patterns)) {
                    if (isFirst) {
                        addHiderButton(divs[i]);
                    }
                    var el = document.getElementById(id.value);
                    if (!el.classList.contains(className)) {
                        el.classList.add(className);
                        numHiddenFiles++;
                    }
                }
            }
        }
        setFileVisibility(isVisible);
        updateButtonLabel();
    }

    function schedule() {
        setTimeout(function() {
            // console.log('hiding', (new Date).toISOString(), '...');
            markHidablesByPathPrefix(patternsToHide);
            // console.log('hidden', (new Date).toISOString(), '.');
            schedule();
        }, frequencyOfDeleteMillisec);
    }

    markHidablesByPathPrefix(patternsToHide);
    setFileVisibility(false);
    updateButtonLabel();
    schedule();
})();
