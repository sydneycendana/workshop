from flask_wtf import FlaskForm
from wtforms import StringField, FileField
from wtforms.validators import DataRequired

class WorkshopForm(FlaskForm):
    place_id = StringField('Place ID', validators=[DataRequired()])
    name = StringField('Name', validators=[DataRequired()])
    latitude = StringField('Latitude', validators=[DataRequired()])
    longitude = StringField('Longitude', validators=[DataRequired()])
    formatted_address = StringField('Formatted Address', validators=[DataRequired()])
    phone_number = StringField('Phone Number')
    preview_image = FileField('Preview Image', validators=[DataRequired()])
