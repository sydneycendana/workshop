from app.models import db, Review, Workshop, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


def seed_reviews():

    bluestone_lane = Workshop.query.filter_by(google_id='ChIJ72sCjByzwoARbRa-WGgEHp8').first()
    philz = Workshop.query.filter_by(google_id='ChIJua0_SgS0woARsgW9JuaSljg').first()
    wework = Workshop.query.filter_by(google_id='ChIJWwl0Day7woARVa2km0j80TA').first()
    java_man = Workshop.query.filter_by(google_id='ChIJwWxW1nizwoAR6s3eTYCjUxU').first()

    john = User.query.filter_by(email='johndoe@example.com').first()
    jane = User.query.filter_by(email='janesmith@example.com').first()
    michael = User.query.filter_by(email='michaeljohnson@example.com').first()
    emily = User.query.filter_by(email='emilywilliams@example.com').first()
    david = User.query.filter_by(email='davidbrown@example.com').first()
    sarah = User.query.filter_by(email='sarahdavis@example.com').first()

    review1 = Review(
        workshop_id= bluestone_lane.id,
        user_id= john.id,
        description= "This was a very comfortable spot to spend a few hours working at. The wifi is great and there are a lot of different places to sit. Just be warned at the level of distraction, since people seem like to like to meet up with friends and talk loudly. Dogs are also allowed on the patio.",
        wifi= 5.0,
        pet_friendliness= 4.5,
        noise_level= 2.5,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )

    review2 = Review(
        workshop_id=philz.id,
        user_id=jane.id,
        description="Love the coffee here! It has a unique taste and aroma. The atmosphere is cozy and perfect for getting work done. They also have friendly staff who make great recommendations.",
        wifi=4.0,
        pet_friendliness=3.5,
        noise_level=3.0,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )

    review3 = Review(
        workshop_id=wework.id,
        user_id=michael.id,
        description="Wework is a fantastic place to work. The office spaces are clean, modern, and well-equipped. The amenities provided are top-notch, including reliable wifi, free coffee, and comfortable seating areas.",
        wifi=5.0,
        pet_friendliness=3.0,
        noise_level=2.0,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )

    review4 = Review(
        workshop_id=java_man.id,
        user_id=emily.id,
        description="Great place to grab a cup of coffee and work. The location is convenient and the atmosphere is cozy. The staff is friendly and the coffee is delicious.",
        wifi=4.5,
        pet_friendliness=4.0,
        noise_level=3.5,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    review5 = Review(
        workshop_id=bluestone_lane.id,
        user_id=david.id,
        description="I absolutely love this place! The coffee is amazing and the ambiance is perfect for work or meetings. The staff is always friendly and the service is excellent.",
        wifi=5.0,
        pet_friendliness=4.5,
        noise_level=2.0,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    review6 = Review(
        workshop_id=philz.id,
        user_id=sarah.id,
        description="Philz has become my go-to coffee shop for work. The coffee is delicious, and they have a wide variety of options. The seating area is comfortable, and the atmosphere is vibrant.",
        wifi=4.5,
        pet_friendliness=3.0,
        noise_level=3.5,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )

    review7 = Review(
        workshop_id=bluestone_lane.id,
        user_id=emily.id,
        description="Bluestone Lane has a great ambiance and the coffee is excellent. The interior is beautifully designed with cozy seating areas. It can get a bit crowded during peak hours, so it's best to come early for a quiet working environment.",
        wifi=4.0,
        pet_friendliness=3.5,
        noise_level=3.0,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )

    review8 = Review(
        workshop_id=java_man.id,
        user_id=sarah.id,
        description="Java Man is a hidden gem for coffee lovers. The coffee is rich and flavorful, and they have a wide selection of blends. The seating area is comfortable and spacious, making it a great place to work or study.",
        wifi=4.5,
        pet_friendliness=3.5,
        noise_level=3.0,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )

    review9 = Review(
        workshop_id=java_man.id,
        user_id=john.id,
        description="Java Man has a cozy and welcoming atmosphere. The staff is friendly and attentive. The coffee is top-notch and they offer a great variety of snacks and pastries. It's a perfect spot for a productive work session.",
        wifi=4.0,
        pet_friendliness=3.0,
        noise_level=2.5,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )

    db.session.add(review1)
    db.session.add(review2)
    db.session.add(review3)
    db.session.add(review4)
    db.session.add(review5)
    db.session.add(review6)
    db.session.add(review7)
    db.session.add(review8)
    db.session.add(review9)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()
