from flask_wtf import FlaskForm
from wtforms import FileField
from wtforms.validators import DataRequired
from app.api.aws_s3 import ALLOWED_EXTENSIONS

class WorkshopForm(FlaskForm):
    image = FileField("Image File", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
