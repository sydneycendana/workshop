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
        'radius': 160934  # 100 miles in meters
    }

    response = requests.get(url, params=params)
    data = response.json()

    predictions = data['predictions']
    place_ids = [prediction['place_id'] for prediction in predictions]

    return jsonify(place_ids)


@google_routes.route('/details', methods=['GET'])
def place_details():
    place_id_input = request.args.get('place_id')

    print("----------------------------", place_id_input)

    url = f'https://maps.googleapis.com/maps/api/place/details/json'
    params = {
        'place_id': place_id_input,
        'key': API_KEY,
    }

    response = requests.get(url, params=params)
    data = response.json()

    if data['status'] == 'OK':
        place_details = {
            'name': data['result']['name'],
            'formatted_address': data['result']['formatted_address'],
            'phone_number': data['result'].get('formatted_phone_number', ''),
            'latitude': data['result']['geometry']['location']['lat'],
            'longitude': data['result']['geometry']['location']['lng']
        }
        return jsonify(place_details)
    else:
        return jsonify({'error': 'Failed to fetch place details'})
