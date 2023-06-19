from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship

class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    workshop_id = db.Column(db.Integer, db.ForeignKey('workshops.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    description = db.Column(db.Text)
    wifi = db.Column(db.Numeric(precision=3, scale=1), nullable=False)
    pet_friendliness = db.Column(db.Numeric(precision=3, scale=1), nullable=False)
    noise_level = db.Column(db.Numeric(precision=3, scale=1), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    workshop = relationship('Workshop', backref='workshop')
    user = relationship('User', backref='user')
    images = relationship('ReviewImage', backref='review_image', cascade='all, delete')
    votes = relationship('Vote', backref='vote', cascade='all, delete')

    def to_dict(self):
        total_votes = sum(vote.vote_type for vote in self.votes)
        return {
            'id': self.id,
            'workshop_id': self.workshop_id,
            'user_id': self.user_id,
            'description': self.description,
            'wifi': float(self.wifi),
            'pet_friendliness': float(self.pet_friendliness),
            'noise_level': float(self.noise_level),
            'updated_at': self.updated_at,
            'created_at': self.created_at,
            'total_votes': total_votes
        }
