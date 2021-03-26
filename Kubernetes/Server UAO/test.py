#!flask/bin/python
from flask import Flask, jsonify
from flask import abort
from flask import request
import pickle
import base64
import json
import cv2
import http.client as httplib

LORA_SERVICE = '10.244.1.58:5000'
app = Flask(__name__)

@app.route('/img', methods=['POST'])
def send_img():
    if not request.json or not 'img' in request.json:
        abort(400)
    response = None
    try:
        headers = {"Content-type": "application/json"}
        conn = httplib.HTTPConnection('detection-service:5000', timeout=5)
        conn.request("POST", "/img", json.dumps(request.get_json()), headers)
        response = conn.getresponse()
    except Exception as e:
        print("timeout",e)
    return "Respuesta", response.status

##Rutas microservicio de lora
@app.route('/lora-gateway', methods=['GET'])
def get_lora_gateway():
    url = "/lora-gateway"
    response = None
    body = None
    try:
        conn = httplib.HTTPConnection(LORA_SERVICE, timeout=10)
        conn.request("GET", url)
        response = conn.getresponse()
    except Exception as e:
        print("timeout",e)
    body = response.read()
    return body, 200


@app.route('/lora-post', methods=['GET'])
def get_lora_post():
    params = request.args
    url = "/lora-gateway-post1/"+str(params.get('latitud'))+'/'+str(params.get('longitud'))+'/'+str(params.get('rssi'))+'/'+str(params.get('snr'))+'/'+str(params.get('gate'))+'/'+str(params.get('frec'))
    response = None
    body = None
    try:
        conn = httplib.HTTPConnection(LORA_SERVICE, timeout=5)
        conn.request("GET", url)
        response = conn.getresponse()
    except Exception as e:
        print("timeout",e)
    body = response.read()
    return body, 200

@app.route('/lora-post2', methods=['POST'])
def post_lora_post():
    response = None
    try:
        headers = {"Content-type": "application/json"}
        conn = httplib.HTTPConnection(LORA_SERVICE, timeout=5)
        conn.request("POST", "/lora-gateway-post2", json.dumps(request.get_json()), headers)
        response = conn.getresponse()
    except Exception as e:
        print("timeout",e)
    body = response.read()
    return body, 200

@app.route('/lora-gateway-param', methods=['GET','DELETE'])
def get_delete_lora_gateway_params():
    params = request.args
    url = "/lora-gateway-param/"+str(params.get('frec'))+'/'+str(params.get('gate'))
    response = None
    body = None
    try:
        conn = httplib.HTTPConnection(LORA_SERVICE, timeout=5)
        if request.method == 'GET':
            conn.request("GET", url)
        else:
            conn.request("DELETE", url)
        response = conn.getresponse()
    except Exception as e:
        print("timeout",e)
    body = response.read()
    return body, 200

@app.route('/lora-spinner', methods=['GET','DELETE'])
def get_lora_spinner():
    response = None
    body = None
    if request.method == 'GET':
        try:
            conn = httplib.HTTPConnection(LORA_SERVICE, timeout=5)
            conn.request("GET", "/spinner")
            response = conn.getresponse()
        except Exception as e:
            print("timeout",e)
        body = response.read()
    else:
        params = request.args
        url = "/spinner/"+str(params.get('gateway'))
        try:
            conn = httplib.HTTPConnection(LORA_SERVICE, timeout=5)
            conn.request("DELETE", url)
            response = conn.getresponse()
        except Exception as e:
            print("timeout",e)
        body = response.read()
    return jsonify(body), 200

# @app.route('/lora-spinner', methods=['DELETE'])
# def get_lora_spinner():
#     params = request.args
#     url = "/spinner/"+str(params.get('gateway'))
#     response = None
#     body = None
#     try:
#         conn = httplib.HTTPConnection(LORA_SERVICE, timeout=5)
#         conn.request("DELETE", url)
#         response = conn.getresponse()
#     except Exception as e:
#         print("timeout",e)
#     body = response.read()
#     return body, 200

@app.route('/lora-spinner-add', methods=['GET'])
def get_lora_spinner_add():
    params = request.args
    url = "/add/"+str(params.get('gateway'))+'/'+str(params.get('latitud'))+'/'+str(params.get('longitud'))
    response = None
    body = None
    try:
        conn = httplib.HTTPConnection(LORA_SERVICE, timeout=5)
        conn.request("GET", url)
        
        response = conn.getresponse()
    except Exception as e:
        print("timeout",e)
    body = response.read()
    return body, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)




