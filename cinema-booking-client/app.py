from flask import Flask, jsonify, request
import pymysql
from flask_cors import CORS
from werkzeug.security import generate_password_hash
import sqlite3
import re
import mysql.connector
from mysql.connector.errors import IntegrityError

app = Flask(__name__)
CORS(app)

# Database connection parameters
# db_host = 'cinema-ebooking-database.cdm6csm20sfl.us-east-2.rds.amazonaws.com'
# db_user = 'admin'
# db_password = 'kyqtov-narha3-nEcpif'
# db_name = 'mywebsite'

db_host='localhost'        # MySQL server (usually localhost for local dev)
db_user='root'   # MySQL username (e.g., root)
db_password='mysqlGanesha' # MySQL password
db_name='sys'  # Name of your MySQL database

def connect_db():
    # return sqlite3.connect('users.db')
    return mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_name
    )

def fetch_movies(table_name):
    connection = pymysql.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_name
    )
    try:
        with connection.cursor() as cursor:
            sql = f"SELECT title, poster_url, mpaa_rating, trailer_url FROM {table_name}"
            cursor.execute(sql)
            result = cursor.fetchall()
            # Transform the result into a list of dictionaries
            movies = [{'title': row[0], 'poster_url': row[1], 'mpaa_rating': row[2], 'trailer_url': row[3]} for row in result]
            return jsonify(movies)
    finally:
        connection.close()

@app.route('/api/now-playing', methods=['GET'])
def get_now_playing():
    return fetch_movies('now_playing_movies')

@app.route('/api/coming-soon', methods=['GET'])
def get_coming_soon():
    return fetch_movies('coming_soon_movies')

@app.route('/api/register2', methods=['POST'])
def register_user2():
    return jsonify({'message': 'HELLO'}), 200

@app.route('/api/register', methods=['POST'])
def register_user():
    print('register_user invoked')
    try:
        data = request.get_json()

        # required information
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        phone_number = data.get('phoneNumber')
        email = data.get('email')
        password = data.get('password')
        promo_subscription = data.get('subscribeToPromo', False)

        # home address information
        home_address = data.get('addressInfo')
        street_address = home_address.get('streetAddress')
        city = home_address.get('city')
        state = home_address.get('state')
        zip_code = home_address.get('zipCode')

        # Basic input validation
        if not first_name or not last_name or not phone_number or not email or not password:
            return jsonify({'error': 'Please provide all required fields.'}), 400

        # Validate email format
        if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            return jsonify({'error': 'Invalid email address.'}), 400

        # Hash the password for security
        hashed_password = generate_password_hash(password)

        print('before connect_db')

        # Insert user data into the database
        with connect_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO Users (user_type, f_name, l_name, email, u_password, phone_num, promo_sub, street_address, city, state, zip_code)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', ('1', first_name, last_name, email, hashed_password, phone_number, promo_subscription, street_address, city, state, zip_code))
            conn.commit()

        print('after connect_db')
        # Send success response (you can send a confirmation email here)
        return jsonify({'message': 'User registered successfully. Please check your email for confirmation.'}), 200

    except Exception as e:
        # If the error is caused by a duplicate email entry, catch it here
        print(e)
        if "Duplicate entry" in str(e):
            return jsonify({'error': 'Email already exists.'}), 409
        else:
            # return jsonify({'error': 'Database error occurred.'}), 500
            return jsonify({'error': 'An error occurred during registration.'}), 500

    # except Exception as e:
    #     print(e)
    #     return jsonify({'error': 'An error occurred during registration.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
