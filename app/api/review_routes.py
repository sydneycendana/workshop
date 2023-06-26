import os
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import requests

from app.models import db, Review

review_routes = Blueprint('reviews', __name__)

# ------------------------ CREATE REVIEW ------------------------
@review_routes.route('/', methods=['POST'])
@login_required
def create_review():
    workshop_id = request.form['workshop_id']
    description = request.form['description']
    wifi = request.form['wifi']
    pet_friendliness = request.form['pet_friendliness']
    noise_level = request.form['noise_level']

    if workshop_id and description and wifi and pet_friendliness and noise_level:
        workshop = Workshop.query.get(workshop_id)
        if workshop:
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
            return jsonify({'message': 'Review created successfully'}), 200

        return jsonify({'error': 'Workshop not found'}), 404

    errors = {}
    if not workshop_id or not description or not wifi or not pet_friendliness or not noise_level:
        errors['review_details'] = 'Missing or invalid review details.'
    return jsonify({'errors': errors}), 400
