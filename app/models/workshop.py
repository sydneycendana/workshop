from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import current_user
from sqlalchemy.orm import relationship
from datetime import datetime

from .vote import Vote

class Workshop(db.Model):
    __tablename__ = 'workshops'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    google_id = db.Column(db.String(255), nullable=False, unique=True)
    name = db.Column(db.String(255), nullable=False)
    lat = db.Column(db.Numeric(precision=10, scale=7), nullable=False)
    lng = db.Column(db.Numeric(precision=10, scale=7), nullable=False)
    formatted_address = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(255), nullable=True)
    preview_image_url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reviews = relationship('Review', back_populates='workshop', cascade='all, delete-orphan')

    def to_dict(self):
        average_wifi = self.calculate_average_rating('wifi')
        average_pet_friendliness = self.calculate_average_rating('pet_friendliness')
        average_noise_level = self.calculate_average_rating('noise_level')

        reviews_list = []

        for review in self.reviews:
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

        return {
            'id': self.id,
            'google_id': self.google_id,
            'name': self.name,
            'lat': self.lat,
            'lng': self.lng,
            'formatted_address': self.formatted_address,
            'phone_number': self.phone_number,
            'preview_image_url': self.preview_image_url,
            'average_wifi': average_wifi,
            'average_pet_friendliness': average_pet_friendliness,
            'average_noise_level': average_noise_level,
            'created_at': self.created_at,
            'reviews': reviews_list
        }


    def calculate_average_rating(self, rating_type):
        total_ratings = len(self.reviews)
        if total_ratings == 0:
            return None

        rating_sum = sum(getattr(review, rating_type) for review in self.reviews)
        average_rating = rating_sum / total_ratings
        return round(average_rating, 1)
