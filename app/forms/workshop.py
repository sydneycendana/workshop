from flask_wtf import FlaskForm
from wtforms import StringField, FileField
from wtforms.validators import DataRequired, Length
from flask_wtf.file import FileAllowed
from app.api.aws_s3 import ALLOWED_EXTENSIONS

class WorkshopForm(FlaskForm):
    image = FileField("Image File", validators=[DataRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
