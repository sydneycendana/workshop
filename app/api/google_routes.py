import os
from flask import Blueprint, jsonify, request
import requests

google_routes = Blueprint('google', __name__)

API_KEY = os.getenv('API_KEY')

@google_routes.route('/autocomplete', methods=['GET'])
def autocomplete():
    input_text = request.args.get('input')

    url = f'https://maps.googleapis.com/maps/api/place/autocomplete/json'
    params = {
        'input': input_text,
        'key': API_KEY,
        'location': '34.0522,-118.2437',  # Los Angeles coordinates
        'radius': 160934,  # 100 miles in meters
        'strictbounds': 'true',
        'types': 'establishment'
    }

    response = requests.get(url, params=params)
    data = response.json()
    predictions = data['predictions']
    results = []
    print(data)

    for prediction in predictions:
        name = prediction['structured_formatting'].get('main_text', '')
        address = prediction['structured_formatting'].get('secondary_text', '')
        place_id = prediction['place_id']


        result = {'name': name, 'address': address, 'place_id': place_id}
        results.append(result)
    return jsonify(results)


@google_routes.route('/nearby', methods=['GET'])
def nearby():
    input_text = request.args.get('input')

    url = f'https://maps.googleapis.com/maps/api/place/autocomplete/json'
    params = {
        'input': input_text,
        'key': API_KEY,
        'location': '34.0522,-118.2437',  # Los Angeles coordinates
        'radius': 160934,  # 100 miles in meters
        'strictbounds': 'true',
        'types': '(regions)'
    }

    response = requests.get(url, params=params)
    data = response.json()
    predictions = data['predictions']
    results = []

    for prediction in predictions:
        name = prediction['structured_formatting'].get('main_text', '')
        address = prediction['structured_formatting'].get('secondary_text', '')
        place_id = prediction['place_id']

        result = {'name': name, 'address': address, 'place_id': place_id}
        results.append(result)

    return jsonify(results)



@google_routes.route('/details', methods=['GET'])
def place_details():
    place_id_input = request.args.get('place_id')

    url = f'https://maps.googleapis.com/maps/api/place/details/json'
    params = {
        'place_id': place_id_input,
        'key': API_KEY,
    }

    response = requests.get(url, params=params)
    data = response.json()


    if data['status'] == 'OK':
        place_details = {
            'place_id': place_id_input,
            'name': data['result']['name'],
            'formatted_address': data['result']['formatted_address'],
            'phone_number': data['result'].get('formatted_phone_number', ''),
            'latitude': data['result']['geometry']['location']['lat'],
            'longitude': data['result']['geometry']['location']['lng']
        }

        return place_details

    else:
        return jsonify({'error': 'Failed to fetch place details'})
