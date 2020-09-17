alias ng="C:/Users/ARobertson/AppData/Roaming/npm/node_modules/@angular/cli/bin/ng"
git pull
ng b -c uat --output-path=dist/source/uat/
cp -i web.config ./dist/source/uat/
$SHELL
