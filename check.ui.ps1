$APP = "planclock-ui"
heroku apps:info --app $APP
heroku releases --app $APP --num 5
