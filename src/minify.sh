#!/bin/sh

# Create the "min" directory if it doesn't already exist
[ ! -d min ] && { mkdir min; }


# Stylesheets
cat css/fonts.css css/global.css css/main.css | cleancss --skip-advanced -o min/min.css

names=('about' 'asx' 'careers' 'clients' 'clients.lteIE9' 'contact' 'home' 'resources')
for i in ${names[@]}; do
	cleancss --skip-advanced -o 'min/page.'$i'.css' 'css/page.'$i'.css'
done;


# JavaScript
uglifyjs js/main.js --mangle -o min/min.js
