from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from datetime import datetime

class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    workshop_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('workshops.id')), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    description = db.Column(db.Text)
    wifi = db.Column(db.Float, nullable=False)
    pet_friendliness = db.Column(db.Float, nullable=False)
    noise_level = db.Column(db.Float, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    workshop = relationship('Workshop', back_populates='reviews')
    user = relationship('User', back_populates='reviews')
    images = relationship('ReviewImage', back_populates='review', cascade='all, delete-orphan')
    votes = relationship('Vote', back_populates='review', cascade='all, delete')

    def to_dict(self):
        total_votes = sum(vote.vote_type for vote in self.votes)
        return {
            'id': self.id,
            'workshop_id': self.workshop_id,
            'user_id': self.user_id,
            'user_first_name': self.user.first_name,
            'description': self.description,
            'wifi': float(self.wifi),
            'pet_friendliness': float(self.pet_friendliness),
            'noise_level': float(self.noise_level),
            'updated_at': self.updated_at,
            'created_at': self.created_at,
            'total_votes': total_votes
        }
