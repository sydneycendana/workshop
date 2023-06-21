import os
from flask import Blueprint, jsonify, request
import requests

workshop_routes = Blueprint('workshops', __name__)

@workshop_routes.route('/', methods=['POST'])
@login_required
def create_workshop():
    workshop_form = WorkshopForm()
    workshop_form['csrf_token'].data = request.cookies['csrf_token']

    review_form = ReviewForm()
    review_form['csrf_token'].data = request.cookies['csrf_token']

    if workshop_form.validate_on_submit() and review_form.validate_on_submit():
        workshop = Workshop(
            place_id=workshop_form.data['google_id'],
            name=workshop_form.data['name'],
            lat=workshop_form.data['lat'],
            lng=workshop_form.data['lng'],
            formatted_address=workshop_form.data['formatted_address'],
            phone_number=workshop_form.data['phone_number'],
            preview_image_url=workshop_form.data['preview_image_url']
        )

        review = Review(
            user_id=review_form.data['user_id'],
            description=review_form.data['description'],
            wifi=review_form.data['wifi'],
            pet_friendliness=review_form.data['pet_friendliness'],
            noise_level=review_form.data['noise_level']
        )

        review_images = []
        uploaded_files = request.files.getlist('review_images')

        for file in uploaded_files:
            image_url = generate_unique_url(file)
            review_image = ReviewImage(url=image_url)
            review_images.append(review_image)

        if workshop.validate() and review.validate() and all(review_image.validate() for review_image in review_images):
            db.session.add(workshop)
            db.session.add(review)
            for review_image in review_images:
                db.session.add(review_image)
            db.session.commit()

            return {
                'workshop': workshop.to_dict(),
                'review': review.to_dict(),
                'review_images': [image.to_dict() for image in review_images]
            }

    errors = {}
    errors.update(validation_errors_to_error_messages(workshop_form.errors))
    errors.update(validation_errors_to_error_messages(review_form.errors))
    return {'errors': errors}, 400
