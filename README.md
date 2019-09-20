# github-hider
This is a TamperMonkey script that hides all files of the Pull Requests whose relative path start with a given prefix.

## Install

1. Install TamperMonkey for Firefox or Chrome: https://www.tampermonkey.net/
1. Click the icon of the add-on on the toolbar
1. Click "Create a New Script"
1. Copy-Paste the content of `userscript.js` in place of the original boilerplate code
1. Understand the code in order to ensure it doesn't do anything nasty
1. Modify the constants `prefixToHide` and `frequencyOfDeleteMillisec` according to your needs
1. Save the script by File -> Save
1. Close this tab
1. Open a new tab where the files of a Pull Request can be browsed.

## Why?

In some cases, it's better to add generated files and dependencies to the git repository. For example, it makes the installation _significantly_ faster, which is very important in CI/CD environments.

In such cases, you may have a huge `vendor/` directory with hundreds of files. If these files are changing for some reason then your PR will look as if you edited a lot of files which is just partly true. Indeed, those files have been changed but those changes are not something that you want to investigate. Probably, you don't want to see those many file changes and don't want to confuse your peers either. 

In such cases, it is nice to hide all the files under the `vendor/` directory. 

## How does it work?

Because github fetches the files of a Pull Request in smaller chunks, a TamperMonkey script cannot be run "after" them. It is better to hide the files as early as possible. If newer files are displayed, the TamperMonkey script hides those ones as well. In order to do this, it runs in every second. 

The code runs for less than 5 milliseconds on a decent developer laptop so it shouldn't be an issue if it runs in every second. 

## TODO

1. Add toggle button to hide/unhide files
1. Add capability to hide files under more different directory prefixes, for example, `vendor/` and `3rdparty/`. 
1. Investigate whether it is possible to stop the repeated hiding operation after a certain point.
