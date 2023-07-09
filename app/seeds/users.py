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

    emily = User(
        first_name='Emily',
        last_name='Williams',
        email='emilywilliams@example.com',
        password='password'
    )

    david = User(
        first_name='David',
        last_name='Brown',
        email='davidbrown@example.com',
        password='password'
    )

    sarah = User(
        first_name='Sarah',
        last_name='Davis',
        email='sarahdavis@example.com',
        password='password'
    )

    andrew = User(
        first_name='Andrew',
        last_name='Taylor',
        email='andrewtaylor@example.com',
        password='password'
    )

    olivia = User(
        first_name='Olivia',
        last_name='Lee',
        email='olivialee@example.com',
        password='password'
    )

    admin = User(
        first_name='Admin',
        last_name='User',
        email='admin@example.com',
        password='password'
    )

    db.session.add(john)
    db.session.add(jane)
    db.session.add(michael)
    db.session.add(emily)
    db.session.add(david)
    db.session.add(sarah)
    db.session.add(andrew)
    db.session.add(olivia)
    db.session.add(admin)

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
