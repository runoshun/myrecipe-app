#!/bin/bash

# iOS
sizes="29 40 57 58 60 80 87 114 120 180 1024"
path=`dirname $0`/../ios/tsukurioki/Images.xcassets/AppIcon.appiconset

for size in $sizes; do
    inkscape -e $path/$size.png -w $size -h $size -f icon.svg
done
