Write-Host "App: $APP"
heroku ps -a $APP
heroku addons -a $APP
