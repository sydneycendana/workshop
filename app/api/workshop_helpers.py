from math import radians, sin, cos, sqrt, atan2
from app.models import Workshop

def find_workshops_within_radius(lat, lng, radius):
    workshops_within_radius = []

    workshops = Workshop.query.all()

    for workshop in workshops:
        workshop_lat = workshop.lat
        workshop_lng = workshop.lng
        distance = calculate_distance(lat, lng, workshop_lat, workshop_lng)

        if distance <= float(radius):
            workshops_within_radius.append(workshop)

    return workshops_within_radius

def calculate_distance(lat1, lng1, lat2, lng2):
    earth_radius = 3958.8  # Radius of the Earth in miles

    lat1_rad = radians(float(lat1))
    lng1_rad = radians(float(lng1))
    lat2_rad = radians(float(lat2))
    lng2_rad = radians(float(lng2))

    dlat = lat2_rad - lat1_rad
    dlng = lng2_rad - lng1_rad

    a = sin(dlat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlng / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = earth_radius * c

    rounded_distance = round(distance, 1)  # Round distance to 1 decimal point

    return rounded_distance
