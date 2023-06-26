import os
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import requests
from .aws_s3 import upload_file_to_s3, get_unique_filename, ALLOWED_EXTENSIONS, remove_file_from_s3

from app.models import db, Review, ReviewImage

review_images_routes = Blueprint('review_images', __name__)

@review_images_routes.route('/<int:image_id>', methods=['DELETE'])
@login_required
def delete_review_image(image_id):
    review_image = ReviewImage.query.get(image_id)
    if not review_image:
        return jsonify({'error': 'Review image not found'}), 404

    review = Review.query.get(review_image.review_id)
    if not review:
        return jsonify({'error': 'Review not found'}), 404

    if review.user_id != current_user.id:
        return jsonify({'error': 'You are not authorized to delete images from this review'}), 403

    # Remove the image file from S3
    if review_image.url:
        remove_file_from_s3(review_image.url)

    # Delete the image from the database
    db.session.delete(review_image)
    db.session.commit()

    return jsonify({'message': 'Review image deleted successfully'}), 200
