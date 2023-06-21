from app.models import db, Workshop, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


def seed_workshops():
    bluestone_lane = Workshop(
        google_id= 'ChIJ72sCjByzwoARbRa-WGgEHp8',
        name= 'Bluestone Lane Manhattan Beach Café',
        lat= 33.8854891,
        lng= -118.4091505,
        formatted_address= '321 Manhattan Beach Blvd, Manhattan Beach, CA 90266, USA',
        phone_number= '(718) 374-6858',
        preview_image_url= 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        created_at= datetime.utcnow(),
    )
    philz = Workshop(
        google_id= 'ChIJua0_SgS0woARsgW9JuaSljg',
        name= 'Philz Coffee',
        lat= 33.9021519,
        lng= -118.3855891,
        formatted_address= '2191 Rosecrans Ave, El Segundo, CA 90245, USA',
        phone_number= '(310) 981-4697',
        preview_image_url= 'https://images.unsplash.com/photo-1516743619420-154b70a65fea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
        created_at= datetime.utcnow(),
    )
    java_man = Workshop(
        google_id= 'ChIJwWxW1nizwoAR6s3eTYCjUxU',
        name= 'Java Man',
        lat= 33.8629894,
        lng= -118.3993731,
        formatted_address= '157 Pier Ave, Hermosa Beach, CA 90254, USA',
        phone_number= '(310) 379-7209',
        preview_image_url= 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
        created_at= datetime.utcnow(),
    )
    redondo_library = Workshop(
        google_id= 'ChIJL-SFi6W0woAR222AuZdawGs',
        name= 'Redondo Beach Public Library',
        lat= 33.8458188,
        lng= -118.3879986,
        formatted_address= '303 N Pacific Coast Hwy, Redondo Beach, CA 90277, USA',
        phone_number= '(310) 318-0675',
        preview_image_url= 'https://images.unsplash.com/photo-1555116505-38ab61800975?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
        created_at= datetime.utcnow(),
    )
    hopsaint = Workshop(
        google_id= 'ChIJ5Zp1nuy0woAR_64xET9Grgs',
        name= 'HopSaint Brewing Company',
        lat= 33.857671,
        lng= -118.3677402,
        formatted_address= '5160 W 190th St, Torrance, CA 90503, USA',
        phone_number= '(310) 214-4677',
        preview_image_url= 'https://images.unsplash.com/photo-1584225065152-4a1454aa3d4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
        created_at= datetime.utcnow(),
    )
    juneshine = Workshop(
        google_id= 'ChIJTYrhGUu7woARUJbUoehJl_o',
        name= 'JuneShine - Santa Monica',
        lat= 33.9991045,
        lng= -118.4809481,
        formatted_address= '2914 Main St, Santa Monica, CA 90405, USA',
        phone_number= '(424) 744-8702',
        preview_image_url= 'https://images.unsplash.com/photo-1539639885136-56332d18071d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
        created_at= datetime.utcnow(),
    )
    wework = Workshop(
        google_id= 'ChIJWwl0Day7woARVa2km0j80TA',
        name= 'WeWork Office Space & Coworking',
        lat= 34.0206594,
        lng= -118.3979872,
        formatted_address= '10000 Washington Blvd, Culver City, CA 90232, USA',
        phone_number= '(424) 260-6112',
        preview_image_url= 'https://images.unsplash.com/photo-1582641547274-2770615179ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        created_at= datetime.utcnow(),
    )


    db.session.add(bluestone_lane)
    db.session.add(philz)
    db.session.add(java_man)
    db.session.add(redondo_library)
    db.session.add(hopsaint)
    db.session.add(juneshine)
    db.session.add(wework)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_workshops():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.workshops RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM workshops"))

    db.session.commit()
