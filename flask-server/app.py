
from flask import Flask, render_template, request, redirect, Response
import boto3
import service
import json
from datetime import datetime

app = Flask(__name__)
dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('todo')

@app.route("/")
def HelloWorld():
    return "hello world"


@app.route('/new-to-dos', methods=['POST'])
def save_todo():
    if request.method == 'POST':
        # title = request.form['title']
        # game_day = request.form['gameDay']
        # user_name = request.form['userName']

        params = request.get_json()
        title = params['title']
        game_day = params['gameDay']
        user_name = params['userName']

        service.upload_post(title, game_day, user_name)

        return redirect('/')


@app.route('/todays/<year>/<season>/<day>')
def get_today_todo(year, season, day):
    game_day = year + " " + season + " " + day
    result = service.get_today_todo(game_day, '민주')

    response = json.dumps(result['Items']).encode('utf-8')

    return Response(response, content_type='application/json; charset=utf-8')
