import os
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import requests
from .aws_s3 import (
    upload_file_to_s3, get_unique_filename)

from app.models import db, Workshop, Vote, Review

workshop_routes = Blueprint('workshops', __name__)


# ------------------------ CREATE WORKSHOP ------------------------
@workshop_routes.route('/', methods=['POST'])
@login_required
def create_workshop():
    workshop_form = WorkshopForm()
    workshop_form['csrf_token'].data = request.cookies['csrf_token']

    place_id = request.json.get(place_id)
    name = request.json.get(name)
    lat = request.json.get(lat)
    lng = request.json.get(lng)
    formatted_address = request.json.get(formatted_address)
    phone_number = request.json.get(phone_number)

    if workshop_form.validate_on_submit() and place_id and name and latitude and longitude and formatted_address:

        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        print(upload)

        if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when we tried to upload
        # so we send back that error message (and we printed it above)
            return render_template("workshop_form.html", form=form, errors=[upload])

        url = upload["url"]
        workshop = Workshop(
            google_id=place_id,
            name=name,
            lat=latitude,
            lng=longitude,
            formatted_address=formatted_address,
            phone_number=phone_number,
            preview_image_url=url
        )
        db.session.add(workshop)
        db.session.commit()
        return redirect("/")

    if form.errors:
        print(form.errors)
        return render_template("workshop_form.html", form=form, errors=form.errors)

    if not place_id or not name or not latitude or not longitude or not formatted_address:
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
