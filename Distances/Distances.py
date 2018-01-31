import json
import sys
import requests


class grapher():

    global obj

    def __init__(self):
        global obj
        url = 'https://pinpointit-393d2.firebaseio.com/places.json?auth=2Oy3Pk0jgKIGaJYf80SUEzETWZJIshfPY2VDMijq'
        obj = requests.get(url).json()

    def get_dict(self):
        global obj
        obj_dict = obj
        return obj_dict
