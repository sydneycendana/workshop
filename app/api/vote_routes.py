import os
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import requests
from .aws_s3 import upload_file_to_s3, get_unique_filename, ALLOWED_EXTENSIONS, remove_file_from_s3

from app.models import db, Review, ReviewImage, Vote

vote_routes = Blueprint('votes', __name__)

# ------------------------ EDIT VOTE ------------------------
@vote_routes.route('/<int:vote_id>', methods=['PUT'])
@login_required
def edit_vote(vote_id):
    vote = Vote.query.get(vote_id)
    if not vote:
        return jsonify({'error': 'Vote not found'}), 404

    if vote.user_id != current_user.id:
        return jsonify({'error': 'You are not authorized to edit this vote'}), 403

    vote_type = request.json.get('vote_type')
    if vote_type not in [-1, 1]:
        return jsonify({'error': 'Invalid vote type. Vote type should be either 1 or -1'}), 400

    vote.vote_type = vote_type
    db.session.commit()

    return jsonify(vote.to_dict()), 200


# ------------------------ DELETE VOTE ------------------------
@vote_routes.route('/<int:vote_id>', methods=['DELETE'])
@login_required
def delete_vote(vote_id):
    vote = Vote.query.get(vote_id)
    if not vote:
        return jsonify({'error': 'Vote not found'}), 404

    if vote.user_id != current_user.id:
        return jsonify({'error': 'You are not authorized to delete this vote'}), 403

    db.session.delete(vote)
    db.session.commit()

    return jsonify({'message': 'Vote deleted successfully'}), 200
