#!/bin/sh

# Switch to the script's current directory
cd `dirname $0`;

# Create the "min" directory if it doesn't already exist
[ ! -d min ] && { mkdir min; }


# Strip unused rulesets from fonts.css; they only exist as reference
tmp=fonts-tmp.css;
perl -e '$/=undef;while(<>){($r=$_)=~s/\[class\^="icon-"\].*$//gsi;}print STDOUT $r;' < css/fonts.css > $tmp


# Stylesheets
cat $tmp css/global.css css/main.css | cleancss --skip-advanced -o min/min.css
rm $tmp

names=('about' 'asx' 'careers' 'clients' 'clients.lteIE9' 'contact' 'home' 'resources')
for i in ${names[@]}; do
	cleancss --skip-advanced -o 'min/page.'$i'.css' 'css/page.'$i'.css'
done;


# JavaScript
uglifyjs js/main.js --mangle -o min/min.js
