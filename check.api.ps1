$APP = "planclock-api"
heroku apps:info --app $APP
heroku releases --app $APP --num 5
