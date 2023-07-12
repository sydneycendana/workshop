from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def password(form, field):
    password = field.data
    email = form.data['email']
    user = User.query.filter(User.email == email).first()
    if not user or not user.check_password(password):
        raise ValidationError('Invalid login')


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired()])
    password = StringField('Password', validators=[DataRequired(), password])
