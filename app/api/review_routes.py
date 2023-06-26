import os
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import requests

from app.models import db, Review

review_routes = Blueprint('reviews', __name__)
