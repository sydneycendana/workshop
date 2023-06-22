import os
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import requests
from ..config import Config
from botocore.exceptions import BotoCoreError, ClientError

from app.models import db, Workshop

workshop_routes = Blueprint('workshops', __name__)


# ------------------------ CREATE WORKSHOP ------------------------
@workshop_routes.route('/', methods=['POST'])
@login_required
def create_workshop():
    workshop_form = WorkshopForm()
    workshop_form['csrf_token'].data = request.cookies['csrf_token']

    place_id = request.form.get('place_id')
    name = request.form.get('name')
    latitude = request.form.get('latitude')
    longitude = request.form.get('longitude')
    formatted_address = request.form.get('formatted_address')
    phone_number = request.form.get('phone_number')
    preview_image = request.files.get('preview_image')

    if workshop_form.validate_on_submit() and place_id and name and latitude and longitude and formatted_address and preview_image:
        try:
            preview_image_filename = generate_unique_filename(preview_image.filename)  # Replace with your unique file naming logic

            Config.s3.upload_fileobj(preview_image, 'scworkshopbucket', preview_image_filename)

            preview_image_url = f'https://scworkshopbucket.amazonaws.com/{preview_image_filename}'

            workshop = Workshop(
                google_id=place_id,
                name=name,
                lat=latitude,
                lng=longitude,
                formatted_address=formatted_address,
                phone_number=phone_number,
                preview_image_url=preview_image_url
            )

            if workshop.validate():
                db.session.add(workshop)
                db.session.commit()

                return {'workshop': workshop.to_dict()}

        except (BotoCoreError, ClientError) as e:
            # Handle any errors that occur during AWS S3 operations
            return {'error': 'Failed to upload preview image to AWS S3.'}, 500

    errors = {}
    errors.update(validation_errors_to_error_messages(workshop_form.errors))
    if not place_id or not name or not latitude or not longitude or not formatted_address or not preview_image:
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
