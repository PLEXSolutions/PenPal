#!/bin/bash

FIND_FILES="find . -name '*.js' -path '*/client/*' -not \( -path '*/node_modules/*' -or -path '*/.meteor/*' \)"
TRANSFORM_FILES="FILES=\$($FIND_FILES); for file in \$FILES; do echo \"require('.\$file');\"; done"

JS=$(bash -c "$TRANSFORM_FILES")
echo $JS > ./.storybook/require_all_files.js

while true;
do
    FILE_CHANGE=$(fswatch -1 -r -Ie '.*node_modules.*' --event=Created --event Removed .)
    echo Created or deleted $FILE_CHANGE
    
    JS=$(bash -c "$TRANSFORM_FILES")
    echo $JS > ./.storybook/require_all_files.js
done
