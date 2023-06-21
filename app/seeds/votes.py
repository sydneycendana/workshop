from app.models import db, Vote, Review, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


def seed_votes():

    review1 = Review.query.filter_by(id=1).first()
    review2 = Review.query.filter_by(id=2).first()
    review3 = Review.query.filter_by(id=3).first()
    review4 = Review.query.filter_by(id=4).first()

    john = User.query.filter_by(email='johndoe@example.com').first()
    jane = User.query.filter_by(email='janesmith@example.com').first()
    michael = User.query.filter_by(email='michaeljohnson@example.com').first()
    emily = User.query.filter_by(email='emilywilliams@example.com').first()
    david = User.query.filter_by(email='davidbrown@example.com').first()
    sarah = User.query.filter_by(email='sarahdavis@example.com').first()

    vote1 = Vote(
        review_id= review1.id,
        user_id= jane.id,
        vote_type= 1,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
    )
    vote2 = Vote(
        review_id= review1.id,
        user_id= michael.id,
        vote_type= 1,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
    )
    vote3 = Vote(
        review_id= review1.id,
        user_id= emily.id,
        vote_type= 1,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
    )
    vote4 = Vote(
        review_id= review1.id,
        user_id= david.id,
        vote_type= -1,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
    )
    vote5 = Vote(
        review_id= review1.id,
        user_id= sarah.id,
        vote_type= 1,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
    )
    vote6 = Vote(
        review_id= review2.id,
        user_id= david.id,
        vote_type= -1,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
    )
    vote7 = Vote(
        review_id= review2.id,
        user_id= michael.id,
        vote_type= -1,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
    )
    vote8 = Vote(
        review_id= review3.id,
        user_id= john.id,
        vote_type= -1,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
    )
    vote9 = Vote(
        review_id= review3.id,
        user_id= emily.id,
        vote_type= 1,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
    )
    vote10 = Vote(
        review_id= review3.id,
        user_id= jane.id,
        vote_type= 1,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
    )
    vote11 = Vote(
        review_id= review4.id,
        user_id= jane.id,
        vote_type= 1,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
    )
    vote12 = Vote(
        review_id= review4.id,
        user_id= michael.id,
        vote_type= 1,
        updated_at=datetime.utcnow(),
        created_at=datetime.utcnow(),
    )


    db.session.add(vote1)
    db.session.add(vote2)
    db.session.add(vote3)
    db.session.add(vote4)
    db.session.add(vote5)
    db.session.add(vote6)
    db.session.add(vote7)
    db.session.add(vote8)
    db.session.add(vote9)
    db.session.add(vote10)
    db.session.add(vote11)
    db.session.add(vote12)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_votes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM votes"))

    db.session.commit()
