from Distances import grapher
import sys
import os
import requests
import pprint
import json

pp = pprint.PrettyPrinter(indent=4)

graph = grapher()
places = graph.get_dict()
locs = []
for place in places:
    locs.append(place)

for i in range(0, len(locs)):
    data = {}
    for j in range(0, len(locs)):
        if i != j:
            place = locs[i]
            place2 = locs[j]
            url = 'https://maps.googleapis.com/maps/api/directions/json?origin=place_id:' + \
                str(place) + '&destination=place_id:' + str(place2) + \
                '&key=AIzaSyD2blk49vwxtYbL4h2TYrT_QlG_5UnwIKM&mode=walking'

            responce = requests.get(url).json()
            dist = responce['routes'][0]['legs'][0]['distance']['text']
            if 'ft' in dist:
                actual_distance = float(dist[:-3]) / 5280
            else:
                actual_distance = float(dist[:-3])
            print(place, actual_distance, place2)
            data[place2] = round(actual_distance, 2)
    json_data = json.dumps(data)
    url_put = 'https://pinpointit-393d2.firebaseio.com/places/' + locs[i] + \
        '/distances.json?auth=2Oy3Pk0jgKIGaJYf80SUEzETWZJIshfPY2VDMijq'
    print(requests.patch(url_put, data=json_data).json())
