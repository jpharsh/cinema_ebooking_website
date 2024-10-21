from flask import Flask, jsonify, request
import pymysql
from flask_cors import CORS
from werkzeug.security import generate_password_hash
import sqlite3
import re
import mysql.connector
from mysql.connector.errors import IntegrityError
from cryptography.fernet import Fernet

app = Flask(__name__)
CORS(app)

# Database connection parameters
db_host = 'cinema-ebooking-database.cdm6csm20sfl.us-east-2.rds.amazonaws.com'
db_user = 'admin'
db_password = 'kyqtov-narha3-nEcpif'
db_name = 'mywebsite'

encryption_key = b'EcxldqJv4puPs5cRA3vv5So_-wcZNquUvohJyplob_M='  # DO NOT PUBLISH THIS KEY !!!!!
cipher_suite = Fernet(encryption_key)

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

# @app.route('/api/register2', methods=['POST'])
# def register_user2():
#     return jsonify({'message': 'HELLO'}), 200

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
        home_street_address = home_address.get('streetAddress')
        home_city = home_address.get('city')
        home_state = home_address.get('state')
        home_zip_code = home_address.get('zipCode')

        # card information
        card_info = data.get('cardInfo')
        name_on_card = card_info.get('nameOnCard')
        card_number = card_info.get('cardNumber')
        expiration_date = card_info.get('expirationDate')
        cvc = card_info.get('cvc')
        billing_street_address = card_info.get('streetAddress')
        billing_city = card_info.get('city')
        billing_state = card_info.get('state')
        billing_zip_code = card_info.get('zipCode')


        # Basic input validation
        if not first_name or not last_name or not phone_number or not email or not password:
            return jsonify({'error': 'Please provide all required fields.'}), 400

        # Validate email format
        if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            return jsonify({'error': 'Invalid email address.'}), 400

        # Hash the password for security
        hashed_password = generate_password_hash(password)

        # Encrypt the card info
        encrypted_card_number = cipher_suite.encrypt(card_number.encode()).decode()
        encrypted_cvc = cipher_suite.encrypt(cvc.encode())
        encrypted_card_number_str = encrypted_card_number.decode('utf-8') if isinstance(encrypted_card_number, bytes) else encrypted_card_number
        encrypted_cvc_str = encrypted_cvc.decode('utf-8') if isinstance(encrypted_cvc, bytes) else encrypted_cvc
        if expiration_date:
            expiration_month = expiration_date.split('/')[0]
            expiration_year = expiration_date.split('/')[1]
            encrypted_expiration_month = cipher_suite.encrypt(expiration_month.encode())
            encrypted_expiration_year = cipher_suite.encrypt(expiration_year.encode())
            encrypted_expiration_month_str = encrypted_expiration_month.decode('utf-8') if isinstance(encrypted_expiration_month, bytes) else encrypted_expiration_month
            encrypted_expiration_year_str = encrypted_expiration_year.decode('utf-8') if isinstance(encrypted_expiration_year, bytes) else encrypted_expiration_year            

        print('before connect_db')

        # Insert user data into the database
        with connect_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO Users (user_type, f_name, l_name, email, u_password, phone_num, promo_sub, street_address, city, state, zip_code, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', ('1', first_name, last_name, email, hashed_password, phone_number, promo_subscription, home_street_address, home_city, home_state, home_zip_code, '1'))
           
            user_id = cursor.lastrowid  

            # Insert encrypted card information into PaymentCard table
            if encrypted_card_number and encrypted_cvc and expiration_date:
                cursor.execute('''
                    INSERT INTO PaymentCards (user_id, card_num, cv_num, exp_month, exp_year, name_on_card, street_address, city, state, zip_code)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ''', (user_id, encrypted_card_number_str, encrypted_cvc_str, encrypted_expiration_month_str, encrypted_expiration_year_str, name_on_card, billing_street_address, billing_city, billing_state, billing_zip_code))
            

            # print('after inserting card info')
            #  # Retrieve and decrypt the card info when needed
            # cursor.execute("SELECT exp_month FROM PaymentCards WHERE user_id=%s", (user_id,))
            # result = cursor.fetchone()
            # if result:
            #     print('result: ', result)
            #     print("Type of result[0]:", type(result[0]))  # Should be <class 'str'> for encrypted values
            #     encrypted_exp_month = result[0]  # Get the encrypted card number directly
            #     decrypted_exp_month = cipher_suite.decrypt(encrypted_exp_month.encode()).decode()  # Use .encode() only if needed
            #     print("Decrypted Card Number:", decrypted_exp_month)

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
