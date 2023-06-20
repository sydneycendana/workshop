import os
from flask import Blueprint, jsonify, request
import requests

google_routes = Blueprint('google', __name__)

API_KEY = os.getenv('API_KEY')

@google_routes.route('/autocomplete', methods=['GET'])
def autocomplete():
    input_text = request.args.get('input')
    console.log(input_text)

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
    place_id = request.args.get('place_id')

    url = 'https://maps.googleapis.com/maps/api/place/details/json'
    params = {
        'place_id': place_id,
        'key': API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    if data['status'] == 'OK':
        place_details = data['result']
        return jsonify(place_details)
    else:
        return jsonify({'error': 'Failed to fetch place details'})
