from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from datetime import datetime

class Workshop(db.Model):
    __tablename__ = 'workshops'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(255))
    name = db.Column(db.String(255))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    formatted_address = db.Column(db.String(255))
    phone_number = db.Column(db.String(255))
    preview_image = db.Column(db.Integer, db.ForeignKey('review_images.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reviews = relationship('Review', backref='review', cascade='all, delete', lazy=True)

    def to_dict(self):
        average_wifi = self.calculate_average_rating('wifi')
        average_pet_friendliness = self.calculate_average_rating('pet_friendliness')
        average_noise_level = self.calculate_average_rating('noise_level')

        return {
            'id': self.id,
            'google_id': self.google_id,
            'name': self.name,
            'lat': self.lat,
            'lng': self.lng,
            'formatted_address': self.formatted_address,
            'phone_number': self.phone_number,
            'preview_image': self.preview_image,
            'average_wifi': average_wifi,
            'average_pet_friendliness': average_pet_friendliness,
            'average_noise_level': average_noise_level,
            'updated_at': self.updated_at,
            'created_at': self.created_at
        }

    def calculate_average_rating(self, rating_type):
        total_ratings = len(self.reviews)
        if total_ratings == 0:
            return None

        rating_sum = sum(getattr(review, rating_type) for review in self.reviews)
        average_rating = rating_sum / total_ratings
        return round(average_rating, 1)
