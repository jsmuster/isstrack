$APP = "planclock-ui"
heroku container:login

docker tag $APP registry.heroku.com/$APP/web
docker push registry.heroku.com/$APP/web

heroku container:release web -a $APP
