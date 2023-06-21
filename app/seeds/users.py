from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_users():
    john = User(
        first_name='John',
        last_name='Doe',
        email='johndoe@example.com',
        password='password'
    )

    jane = User(
        first_name='Jane',
        last_name='Smith',
        email='janesmith@example.com',
        password='password'
    )

    michael = User(
        first_name='Michael',
        last_name='Johnson',
        email='michaeljohnson@example.com',
        password='password'
    )

    db.session.add(john)
    db.session.add(jane)
    db.session.add(michael)

    db.session.commit()



# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
