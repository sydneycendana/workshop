from app.models import db, ReviewImage, Review, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


def seed_review_images():

    review1 = Review.query.filter_by(id=1).first()
    review2 = Review.query.filter_by(id=2).first()
    review3 = Review.query.filter_by(id=3).first()
    review4 = Review.query.filter_by(id=4).first()

    reviewImage1 = ReviewImage(
        review_id= review1.id,
        url='https://images.pexels.com/photos/887723/pexels-photo-887723.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    reviewImage2 = ReviewImage(
        review_id= review1.id,
        url='https://images.pexels.com/photos/1438445/pexels-photo-1438445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    reviewImage3 = ReviewImage(
        review_id= review1.id,
        url='https://images.pexels.com/photos/1394841/pexels-photo-1394841.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    reviewImage4 = ReviewImage(
        review_id= review2.id,
        url='https://images.pexels.com/photos/996219/pexels-photo-996219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    reviewImage5 = ReviewImage(
        review_id= review2.id,
        url='https://images.pexels.com/photos/1833306/pexels-photo-1833306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    reviewImage6 = ReviewImage(
        review_id= review3.id,
        url='https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    reviewImage7 = ReviewImage(
        review_id= review3.id,
        url='https://images.pexels.com/photos/3316924/pexels-photo-3316924.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    reviewImage8 = ReviewImage(
        review_id= review4.id,
        url='https://images.pexels.com/photos/1137745/pexels-photo-1137745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )
    reviewImage9 = ReviewImage(
        review_id= review4.id,
        url='https://images.pexels.com/photos/5461666/pexels-photo-5461666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow()
    )

    db.session.add(reviewImage1)
    db.session.add(reviewImage2)
    db.session.add(reviewImage3)
    db.session.add(reviewImage4)
    db.session.add(reviewImage5)
    db.session.add(reviewImage6)
    db.session.add(reviewImage7)
    db.session.add(reviewImage8)
    db.session.add(reviewImage9)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_review_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM review_images"))

    db.session.commit()
