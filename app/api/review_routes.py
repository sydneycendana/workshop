import os
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import requests
from .aws_s3 import upload_file_to_s3, get_unique_filename, ALLOWED_EXTENSIONS, remove_file_from_s3

from app.models import db, Review, ReviewImage, Vote

review_routes = Blueprint('reviews', __name__)


# ------------------------ GET REVIEW BY ID ------------------------
@review_routes.route('/<int:review_id>', methods=['GET'])
@login_required
def get_review(review_id):
    review = Review.query.get(review_id)
    if not review:
        return jsonify({'error': 'Review not found'}), 404

    return jsonify(review.to_dict()), 200


# ------------------------ EDIT REVIEW ------------------------
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


# ------------------------ DELETE REVIEW ------------------------
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


# ------------------------ ADD REVIEW IMAGES ------------------------
@review_routes.route('/<int:review_id>/images', methods=['POST'])
@login_required
def add_review_images(review_id):
    review = Review.query.get(review_id)
    if not review:
        return jsonify({'error': 'Review not found'}), 404

    if review.user_id != current_user.id:
        return jsonify({'error': 'You are not authorized to add images to this review'}), 403

    images = request.files.getlist('images')
    print("------------------------------------", images)
    if not images:
        return jsonify({'error': 'No images provided'}), 400

    if len(images) > 3:
        return jsonify({'error': 'You can only upload a maximum of 3 images'}), 400

    uploaded_image_urls = []
    for image in images:
        if image and '.' in image.filename:
            extension = image.filename.rsplit('.', 1)[1].lower()
            if extension not in ALLOWED_EXTENSIONS:
                return jsonify({'error': 'Invalid file extension. Only images with extensions: {} are allowed.'.format(', '.join(ALLOWED_EXTENSIONS))}), 400

            image.filename = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)
            print(upload)

            if 'url' in upload:
                uploaded_image_urls.append(upload['url'])
            else:
                return jsonify({'error': 'Failed to upload image'}), 500
        else:
            return jsonify({'error': 'Invalid file'}), 400

    review_images = []
    for image_url in uploaded_image_urls:
        review_image = ReviewImage(url=image_url, review_id=review.id)
        db.session.add(review_image)
        review_images.append(review_image)

    db.session.commit()
    return jsonify({'message': 'Review images added successfully', 'images': {image.id : image.to_dict() for image in review_images}}), 200


# ------------------------ ADD VOTE TO REVIEW ------------------------
@review_routes.route('/<int:review_id>/votes', methods=['POST'])
@login_required
def add_review_vote(review_id):
    review = Review.query.get(review_id)
    if not review:
        return jsonify({'error': 'Review not found'}), 404

    if review.user_id == current_user.id:
        return jsonify({'error': 'You cannot vote for your own review'}), 403


    vote_type = request.json.get('vote_type')
    if vote_type not in [-1, 1]:
        return jsonify({'error': 'Invalid vote type. Vote type should be either 1 or -1'}), 400

    # Check if the user has already voted for this review
    existing_vote = Vote.query.filter_by(user_id=current_user.id, review_id=review.id).first()
    if existing_vote:
        return jsonify({'error': 'You have already voted for this review'}), 400

    # Create a new vote
    vote = Vote(user_id=current_user.id, review_id=review.id, vote_type=vote_type)
    db.session.add(vote)
    db.session.commit()

    return vote.to_dict(), 201
