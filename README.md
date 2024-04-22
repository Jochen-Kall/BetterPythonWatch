# BetterPythonWatch README

Vscode is a fantastic IDE for python in general.
When programming interactively or debugging tensor code, be it numpy/scipy or torch code, the shape and data types of variables is essential information, that unfortunately is hidden among a lot of python bloat as subentry of the variable in question.

This addon aims to mitigate this deficit by providing a customized add to watch action as a stop gap measure until the authors of vscode get around improving the debugger UI.

## Features

Customized add to watchlist action, that consumes a variable, generates a meta data tuple and adds it to the watchlist, such that shape and data type are displayed along with the actual variable.

To use, simply select the variable of interest in the editor while in debug mode and execute the action "Debug: add to Watch [tensor]"

\!\[Adding a tensor to the watchlist\]\(images/Before.png\)
\!\[Adding a tensor to the watchlist\]\(images/Action_in_action.png\)


## Requirements

None

## Extension Settings

None

## Known Issues

None

## Release Notes


### 1.0.0
Initial Release
