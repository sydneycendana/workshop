import os
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import requests

from app.models import db, Review

review_routes = Blueprint('reviews', __name__)

@review_routes.route('/<int:review_id>', methods=['PUT'])
@login_required
def edit_review(review_id):
    review = Review.query.get(review_id)
    if review:
        if review.user_id != current_user.id:
            return jsonify({'error': 'You are not authorized to edit this review'}), 403

        description = request.form.get('description', review.description)
        wifi = request.form.get('wifi', review.wifi)
        if wifi == '':
            wifi = review.wifi

        pet_friendliness = request.form.get('pet_friendliness', review.pet_friendliness)
        if pet_friendliness == '':
            pet_friendliness = review.pet_friendliness

        noise_level = request.form.get('noise_level', review.noise_level)
        if noise_level == '':
            noise_level = review.noise_level

        review.description = description
        review.wifi = wifi
        review.pet_friendliness = pet_friendliness
        review.noise_level = noise_level

        db.session.commit()
        return jsonify({'message': 'Review updated successfully'}), 200

    return jsonify({'error': 'Review not found'}), 404


@review_routes.route('/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(review_id):
    review = Review.query.get(review_id)
    if review:
        if review.user_id != current_user.id:
            return jsonify({'error': 'You are not authorized to delete this review'}), 403

        db.session.delete(review)
        db.session.commit()
        return jsonify({'message': 'Review deleted successfully'}), 200

    return jsonify({'error': 'Review not found'}), 404
