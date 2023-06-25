import os
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import requests
from .aws_s3 import (
    upload_file_to_s3, get_unique_filename)

from app.models import db, Workshop, Vote, Review
from ..forms.workshop import WorkshopForm

workshop_routes = Blueprint('workshops', __name__)


# ------------------------ CREATE WORKSHOP ------------------------
@workshop_routes.route('/', methods=['POST'])
@login_required
def create_workshop():

    place_id = request.form['place_id']
    name = request.form['name']
    lat = request.form['lat']
    lng = request.form['lng']
    formatted_address = request.form['formatted_address']
    phone_number = request.form['phone_number']
    image = request.files['image']


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
        return {'message': 'Workshop created successfully'}

    errors = {}
    if not place_id or not name or not lat or not lng or not formatted_address:
        errors['place_details'] = 'Missing or invalid place details.'
    return {'errors': errors}, 400

# ------------------------ GET WORKSHOP BY ID ------------------------
@workshop_routes.route('/<int:workshop_id>', methods=['GET'])
def get_workshop(workshop_id):
    workshop = Workshop.query.get(workshop_id)
    if workshop:
        reviews = workshop.reviews
        workshop_dict = workshop.to_dict()
        reviews_list = []

        for review in reviews:
            vote = None
            user_has_voted = False
            user_vote_type = None

            if current_user.is_authenticated:
                vote = Vote.query.filter_by(user_id=current_user.id, review_id=review.id).first()
                if vote:
                    user_has_voted = True
                    user_vote_type = vote.vote_type

            review_dict = review.to_dict()
            review_dict['votes'] = {
                'userHasVoted': user_has_voted,
                'userVoteType': user_vote_type
            }
            review_dict['images'] = [image.to_dict() for image in review.images]
            reviews_list.append(review_dict)

        workshop_dict['reviews'] = reviews_list

        return jsonify(workshop_dict), 200

    return jsonify({'message': 'Workshop not found'}), 404
