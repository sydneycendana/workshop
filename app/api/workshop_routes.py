import os
import random
from sqlalchemy import and_
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import requests
from .aws_s3 import (
    upload_file_to_s3, get_unique_filename, ALLOWED_EXTENSIONS, remove_file_from_s3)
from .workshop_helpers import find_workshops_within_radius, calculate_distance


from app.models import db, Workshop, Vote, Review
from ..forms.workshop import WorkshopForm

workshop_routes = Blueprint('workshops', __name__)


# ------------------------ CREATE WORKSHOP ------------------------
@workshop_routes.route('/', methods=['POST'])
def create_workshop():

    place_id = request.form['place_id']
    name = request.form['name']
    lat = request.form['lat']
    lng = request.form['lng']
    formatted_address = request.form['formatted_address']
    phone_number = request.form['phone_number']
    image = request.files['image']

    filename = image.filename
    if filename and '.' in filename:
        extension = filename.rsplit('.', 1)[1].lower()
        if extension not in ALLOWED_EXTENSIONS:
            return {'errors': ['Invalid file extension. Only images with extensions: {} are allowed.'.format(', '.join(ALLOWED_EXTENSIONS))]}, 400


    if place_id and name and lat and lng and formatted_address:
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        print(upload)

        if "url" not in upload:
            # If the dictionary doesn't have a url key,
            # it means there was an error when trying to upload,
            # so we send back that error message (and we printed it above)
            return {'errors': [upload]}, 400

        url = upload["url"]
        workshop = Workshop(
            google_id=place_id,
            name=name,
            lat=lat,
            lng=lng,
            formatted_address=formatted_address,
            phone_number=phone_number,
            preview_image_url=url
        )
        db.session.add(workshop)
        db.session.commit()
        print(workshop.to_dict())
        return jsonify(workshop.to_dict()), 200

    errors = {}
    if not place_id or not name or not lat or not lng or not formatted_address or not preview_image_url:
        errors['place_details'] = 'Missing or invalid place details.'
    return {'errors': errors}, 400

# ------------------------ GET WORKSHOP BY ID ------------------------
@workshop_routes.route('/<int:workshop_id>', methods=['GET'])
def get_workshop(workshop_id):
    workshop = Workshop.query.get(workshop_id)
    if workshop:
        return jsonify(workshop.to_dict()), 200

    return jsonify({'message': 'Workshop not found'}), 404

# ------------------------ GET FEATURED WORKSHOPS ------------------------
@workshop_routes.route('/featured', methods=['GET'])
def get_featured_workshops():
    workshops = Workshop.query.all()
    featured_workshops = random.sample(workshops, k=4) if len(workshops) > 4 else workshops

    featured_workshops_list = []

    for workshop in featured_workshops:
        workshop_dict = workshop.to_dict()
        featured_workshops_list.append(workshop_dict)

    return jsonify(featured_workshops_list), 200

# ------------------------ GET NEARBY WORKSHOPS ------------------------
@workshop_routes.route('/nearby', methods=['GET'])
def get_nearby_workshops():
    lat = request.args.get("lat")
    lng = request.args.get("lng")

    if not lat or not lng:
        return jsonify({"error": "Latitude and longitude are required."}), 400

    workshops_within_radius = find_workshops_within_radius(lat, lng, 20)

    workshops_list = []

    for workshop in workshops_within_radius:
        workshop_dict = workshop.to_dict()
        distance = calculate_distance(lat, lng, workshop.lat, workshop.lng)
        workshop_dict['distance'] = distance  # Add the distance to the workshop dictionary
        workshops_list.append(workshop_dict)

    return jsonify(workshops_list), 200


# ------------------------ DELETE WORKSHOP ------------------------
@workshop_routes.route('/<int:workshop_id>', methods=['DELETE'])
@login_required
def delete_workshop(workshop_id):
    workshop = Workshop.query.get(workshop_id)
    if workshop:
        if current_user.id != 1:
            return jsonify({'error': 'Unauthorized'}), 401

        remove_file_from_s3(workshop.preview_image_url)

        db.session.delete(workshop)
        db.session.commit()

        return jsonify({'message': 'Workshop deleted successfully'}), 200

    return jsonify({'message': 'Workshop not found'}), 404


# ------------------------ CREATE REVIEW ------------------------
@workshop_routes.route('/<int:workshop_id>/reviews', methods=['POST'])
@login_required
def create_review(workshop_id):
    description = request.form.get('description', '')
    wifi = request.form['wifi']
    pet_friendliness = request.form['pet_friendliness']
    noise_level = request.form['noise_level']

    if wifi and pet_friendliness and noise_level:
        workshop = Workshop.query.get(workshop_id)
        if workshop:
            existing_review = Review.query.filter(
                and_(
                    Review.workshop_id == workshop_id,
                    Review.user_id == current_user.id
                )
            ).first()
            if existing_review:
                return jsonify({'error': 'Review by this user already exists for the workshop'}), 400

            review = Review(
                workshop_id=workshop_id,
                user_id=current_user.id,
                description=description,
                wifi=wifi,
                pet_friendliness=pet_friendliness,
                noise_level=noise_level
            )
            db.session.add(review)
            db.session.commit()
            return review.to_dict(), 201

        return jsonify({'error': 'Workshop not found'}), 404

    errors = {}
    if not workshop_id or not current_user.id or not wifi or not pet_friendliness or not noise_level:
        errors['review_details'] = 'Missing or invalid review details.'
    return jsonify({'errors': errors}), 400
