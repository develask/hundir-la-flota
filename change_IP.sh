#! /bin/bash
var1="$1"
sed -e "s/localhost/$var1/g" ./app.js > op.txt
mv op.txt app.js
sed -e "s/localhost/$var1/g" ./public/js/index.js > op.txt
mv op.txt public/js/index.js
sed -e "s/localhost/$var1/g" ./mail.js > op.txt
mv op.txt index.js