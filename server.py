from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import flask
from flask import Flask, request, render_template, jsonify
import os
import json 
import requests
import random
import dotenv
dotenv.load()

from intels.classifiers.fsttext import Fsttext
from channels.messenger import Messenger

# setup data locations
training_data_file_name = './data/train/training_data.txt'
stories_file_name = './data/train/stories.json'
model_file_name = './data/models/posttrained/model'
pretrained_vec_file_name = './data/models/pretrained/model.vec'
pretrained_vec_dimension = 300


def messenger_callback(input_data):
    msg = run_prediction(input_data)
    messenger.send({'text': msg}, 'RESPONSE')

def run_prediction(input_data):
    predicted_label = classifier.predict(input_data)
    stories_file = open(stories_file_name, mode='r', encoding='utf-8')
    answer = json.loads(stories_file.read())[predicted_label[0][0]]
    answer = answer[random.randrange(len(answer))]
    return answer

# setup fasttext classifier
classifier = Fsttext(training_data_file_name, model_file_name, pretrained_vec_file_name, pretrained_vec_dimension)
# setup messenger channel
messenger = Messenger(os.environ.get('FB_VERIFY_TOKEN'), os.environ.get('FB_PAGE_TOKEN'), messenger_callback)

app = flask.Flask(__name__)
@app.route('/predict',methods=['POST'])
def predict():
    input_data = request.get_json()['data']
    answer = run_prediction(input_data['query'])
    return jsonify('{"prediction":"'+answer+'"}')

@app.route('/',methods=['POST','GET'])
def index():
    if request.method == 'POST':
        input_data = request.get_json()['data']
        training_data_file = open(training_data_file_name, mode='w', encoding='utf-8')
        training_data = ''
        stories_file = open(stories_file_name, mode='w', encoding='utf-8')
        stories_data = {}
        counter = -1
        for example in input_data:
            counter += 1
            label = '__label__'+str(counter)
            for question in example['questions']:
                training_data += label+' '+question+'\n'
            stories_data[label] = example['answers']
        training_data_file.write(training_data)
        stories_file.write(json.dumps(stories_data))
        training_data_file.close()
        stories_file.close()
        classifier.train()
        return jsonify('{"status":"success"}')

    return render_template('index.html')

@app.route('/messenger/webhook', methods=['GET', 'POST'])
def webhook():
    if request.method == 'GET':
        if (request.args.get('hub.verify_token') == os.environ.get('FB_VERIFY_TOKEN')):
            return request.args.get('hub.challenge')
        raise ValueError('FB_VERIFY_TOKEN does not match.')
    elif request.method == 'POST':
        messenger.handle(request.get_json(force=True))
    return ''