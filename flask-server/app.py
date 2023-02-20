
from flask import Flask, render_template, request, redirect, Response, session
import boto3
import service
import json
import xml.etree.ElementTree as elemTree
from datetime import datetime

app = Flask(__name__)
tree = elemTree.parse('keys.xml')
app.secret_key = tree.find('string[@name="secret_key"]').text
dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('todo')


@app.route("/")
def main_page():
    response = json.dumps(service.all_user()).encode("utf-8")
    return Response(response, content_type='application/json; charset=utf-8')


@app.route('/new-to-dos', methods=['POST'])
def save_todo():
    if request.method == 'POST':
        # title = request.form['title']
        # game_day = request.form['gameDay']
        # user_name = request.form['userName']

        params = request.get_json()
        title = params['title']
        game_day = params['gameDay']
        print(session)
        user_name = session['username']

        service.upload_post(title, game_day, user_name)

        return redirect('/')


@app.route('/todays/<year>/<season>/<day>')
def get_today_todo(year, season, day):
    game_day = year + " " + season + " " + day
    result = service.get_today_todo(game_day, session['username'])

    response = json.dumps(result['Items']).encode('utf-8')

    return Response(response, content_type='application/json; charset=utf-8')


@app.route('/register', methods=['POST'])
def register():
    params = request.get_json()
    username = params['username']
    password = params['password']

    service.register(username, password)
    return redirect('/')


@app.route('/login_confirm', methods=['POST'])
def login_confirm():
    params = request.get_json()
    username = params['username']
    password = params['password']

    if service.login(username, password):
        print("yes")
        session['username'] = username
        return redirect('/')
    else:
        print('no')
        return redirect('/')


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/')


if __name__ == '__main__':
    app.debug = True
    app.run()