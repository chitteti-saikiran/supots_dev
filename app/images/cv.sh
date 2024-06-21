#!/bin/bash

extensions="svg"

ext = ".png"

for i in *.svg;
do
    if [[ -f $i ]]; then
        #copy stuff ....
        name="${i/.svg/.png}"
        #echo $name 
        echo $i
        /Applications/Inkscape.app/Contents/Resources/bin/inkscape $i --export-png=`echo /Users/wisolve/Documents/react-native/supotsu/src/images/$i | sed -e /Users/wisolve/Documents/react-native/supotsu/src/images/$name`;
    fi
done