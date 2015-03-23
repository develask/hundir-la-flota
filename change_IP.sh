#! /bin/bash
var1="$1"
var2="$2"
sed -e "s/$var1/$var2/g" ./app.js > op.txt
mv op.txt app.js
sed -e "s/$var1/$var2/g" ./public/js/index.js > op.txt
mv op.txt public/js/index.js
sed -e "s/$var1/$var2/g" ./mail.js > op.txt
mv op.txt mail.js