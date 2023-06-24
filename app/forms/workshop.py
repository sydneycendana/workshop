from flask_wtf import FlaskForm
from wtforms import StringField, FileField
from wtforms.validators import DataRequired, Length
from flask_wtf.file import FileAllowed
from app.api.aws_s3 import ALLOWED_EXTENSIONS

class WorkshopForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired(), Length(max=100)])
    address = StringField("Address", validators=[DataRequired(), Length(max=200)])
    phone_number = StringField("Phone Number", validators=[DataRequired(), Length(max=20)])
    image = FileField("Image File", validators=[DataRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
