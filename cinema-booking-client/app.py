from flask import Flask, jsonify, request, session
import pymysql
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import re
import mysql.connector
from mysql.connector.errors import IntegrityError
from cryptography.fernet import Fernet
from flask_session import Session
import jwt
from datetime import datetime, timedelta
import random  # For generating a reset token
import string  # For generating a random string
import os  # To set environment variables
import base64
import smtplib
from email.mime.text import MIMEText
import google_auth_oauthlib.flow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build


app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'supersecretkey'  # Replace with your actual secret key for production
app.config['SESSION_TYPE'] = 'filesystem'  # Store session data on the server-side
Session(app)


JWT_SECRET = 'another_super_secret_key'  # Replace with a production key
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_MINUTES = 30


# Database connection parameters
db_host = 'cinema-ebooking-database.cdm6csm20sfl.us-east-2.rds.amazonaws.com'
db_user = 'admin'
db_password = 'kyqtov-narha3-nEcpif'
db_name = 'mywebsite'


encryption_key = b'EcxldqJv4puPs5cRA3vv5So_-wcZNquUvohJyplob_M='  # DO NOT PUBLISH THIS KEY !!!!!
cipher_suite = Fernet(encryption_key)


# Google OAuth Configuration
CLIENT_ID = '543307738148-faodjbvprsud5i9foiun55i9misrm01i.apps.googleusercontent.com'
CLIENT_SECRET = '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'
SCOPES = ['https://www.googleapis.com/auth/gmail.send']


# Load credentials from token.json
def load_credentials():
   creds = None
   token_file = 'token.json'
  
   if os.path.exists(token_file):
       creds = Credentials.from_authorized_user_file(token_file, SCOPES)
  
   if not creds or not creds.valid:
       if creds and creds.expired and creds.refresh_token:
           creds.refresh(Request())
       else:
           flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_config(
               {
                   "installed": {
                       "client_id": CLIENT_ID,
                       "client_secret": CLIENT_SECRET,
                       "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                       "token_uri": "https://oauth2.googleapis.com/token",
                       "redirect_uris": ["http://localhost:8080"]
                   }
               }, SCOPES
           )
           creds = flow.run_local_server(port=8080)
      
       with open(token_file, 'w') as token:
           token.write(creds.to_json())
  
   return creds

def create_jwt_token(user_id, email, user_type):
    expiration = datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_MINUTES)
    token = jwt.encode({'id': user_id, 'email': email, 'user_type': user_type, 'exp': expiration}, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def create_jwt_token2(user_id, email):
    expiration = datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_MINUTES)
    # Removed user_type from JWT payload
    token = jwt.encode({'id': user_id, 'email': email, 'exp': expiration}, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def verify_jwt_token(token):
   try:
       decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
       return decoded
   except jwt.ExpiredSignatureError:
       return None  # Token has expired
   except jwt.InvalidTokenError:
       return None  # Invalid token


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


def send_email_via_gmail_api(to, subject, body):
   creds = load_credentials()
   service = build('gmail', 'v1', credentials=creds)


   message = MIMEText(body)
   message['to'] = to
   message['subject'] = subject


   raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
   message = {'raw': raw_message}


   try:
       service.users().messages().send(userId='me', body=message).execute()
       print("Email sent successfully.")
   except Exception as e:
       print(f"Error sending email: {e}")




@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
   try:
       data = request.get_json()
       email = data.get('email')


       if not email:
           return jsonify({'error': 'Email is required.'}), 400


       with connect_db() as conn:
           cursor = conn.cursor()
           cursor.execute('SELECT id FROM Users WHERE email = %s', (email,))
           user = cursor.fetchone()


           if not user:
               return jsonify({'error': 'Email not found.'}), 404


           user_id = user[0]

        # Generate reset token without user_type
       reset_token = create_jwt_token2(user_id, email)
       subject = 'Password Reset Request'
       body = f'Click the link to reset your password: http://localhost:3000/reset-password?token={reset_token}'

       send_email_via_gmail_api(email, subject, body)


       return jsonify({'message': 'Password reset email sent successfully.'}), 200


   except Exception as e:
       print(f"Error during password reset: {e}")
       return jsonify({'error': 'An error occurred during password reset.'}), 500




@app.route('/api/now-playing', methods=['GET'])
def get_now_playing():
   return fetch_movies('now_playing_movies')


@app.route('/api/coming-soon', methods=['GET'])
def get_coming_soon():
   return fetch_movies('coming_soon_movies')


# @app.route('/api/register2', methods=['POST'])
# def register_user2():
#     return jsonify({'message': 'HELLO'}), 200
def fetch_userdata(table_name, id):
    connection = connect_db()
    try:
        cursor = connection.cursor(dictionary=True)
        sql = f"SELECT * FROM {table_name} WHERE id = %s"
        cursor.execute(sql, (id,))
        result = cursor.fetchone()
        return result
    except Exception as e:
        print(f"Error fetching user data: {str(e)}")  # Debug error
        return None
    finally:
        connection.close()

def fetch_carddata(table_name, user_id):
    connection = connect_db()
    try:
        cursor = connection.cursor(dictionary=True)
        sql = f"SELECT * FROM {table_name} WHERE user_id = %s"
        cursor.execute(sql, (user_id,))
        result = cursor.fetchall()
        # Transform the result into a list of dictionaries
        cardFields = [{'id': row['id'], 'name_on_card': row['name_on_card'], 'card_num': row['card_num'], 'exp_month': row['exp_month'], 'exp_year': row['exp_year'], 'cv_num': row['cv_num'], 'street_address': row['street_address'], 'city': row['city'], 'state': row['state'], 'zip_code': row['zip_code']} for row in result]
        return cardFields
    except Exception as e:
        print(f"Error fetching user data: {str(e)}")  # Debug error
        return None
    finally:
        connection.close()

@app.route('/api/user-get', methods=['GET'])
def get_userinfo():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Missing token"}), 401

    decoded_token = verify_jwt_token(token)
    if not decoded_token:
        return jsonify({"error": "Invalid or expired token"}), 401

    user_data = fetch_userdata('Users', decoded_token['id'])
    if user_data:
        return jsonify(user_data), 200
    return jsonify({"error": "User not found"}), 404
    
# Get card information
@app.route('/api/card-get', methods=['GET'])
def get_cardinfo():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Missing token"}), 401

    decoded_token = verify_jwt_token(token)
    if not decoded_token:
        return jsonify({"error": "Invalid or expired token"}), 401

    card_data = fetch_carddata('PaymentCards', decoded_token['id'])
    if card_data:
        return jsonify(card_data), 200
    return jsonify({"error": "No card data found."}), 404

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
       cards = data.get('cards')
       print('cards:', cards)
       # card_info = data.get('cardInfo')
       # name_on_card = card_info.get('nameOnCard')
       # card_number = card_info.get('cardNumber')
       # expiration_date = card_info.get('expirationDate')
       # cvc = card_info.get('cvc')
       # billing_street_address = card_info.get('streetAddress')
       # billing_city = card_info.get('city')
       # billing_state = card_info.get('state')
       # billing_zip_code = card_info.get('zipCode')




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
               INSERT INTO Users (user_type, f_name, l_name, email, u_password, phone_num, promo_sub, street_address, city, state, zip_code, status)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
           ''', ('1', first_name, last_name, email, hashed_password, phone_number, promo_subscription, home_street_address, home_city, home_state, home_zip_code, '1'))
         
           user_id = cursor.lastrowid 


           for card in cards:
               name_on_card = card['nameOnCard']
               card_number = card['cardNumber']
               expiration_date = card['expirationDate']
               cvc = card['cvc']
               billing_street_address = card['streetAddress']
               billing_city = card['city']
               billing_state = card['state']
               billing_zip_code = card['zipCode']


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

       # Generate the verification code
       verification_code = ''.join(random.choices(string.digits, k=5))  # 5-digit code


       # Hash the password for security
       hashed_password = generate_password_hash(password)


       # Insert user data into the database (make sure your Users table has a 'verification_code' column)
       with connect_db() as conn:
           cursor = conn.cursor()
           cursor.execute('''
                UPDATE Users
                SET verification_code = %s
                WHERE id = %s
           ''', (verification_code, user_id))
           conn.commit()


       # Send the verification code via email
       subject = "Verify Your Account"
       body = f"Your 5-digit verification code is {verification_code}."
       send_email_via_gmail_api(email, subject, body)  # Use the Gmail API to send the email


       return jsonify({'message': 'Registration successful. Please check your email for the verification code.'}), 200

   except Exception as e:
       print(e)
       if "Duplicate entry" in str(e):
           return jsonify({'error': 'Email already exists.'}), 409
       else:
           return jsonify({'error': 'An error occurred during registration.'}), 500


#    except Exception as e:
#        # If the error is caused by a duplicate email entry, catch it here
#        print(e)
#        if "Duplicate entry" in str(e):
#            return jsonify({'error': 'Email already exists.'}), 409
#        else:
#            # return jsonify({'error': 'Database error occurred.'}), 500
#            return jsonify({'error': 'An error occurred during registration.'}), 500


   # except Exception as e:
   #     print(e)
   #     return jsonify({'error': 'An error occurred during registration.'}), 500

@app.route('/api/verify-account', methods=['POST'])
def verify_account():
    data = request.get_json()
    email = data.get('email')
    verification_code = data.get('verificationCode')

    print(f"Email: {email}, Verification Code: {verification_code}")

    if not email or not verification_code:
        return jsonify({"message": "Email and verification code are required"}), 400

    # Connect to the database
    conn = connect_db()
    cur = conn.cursor()

    # Fetch the user based on email and compare the verification code
    cur.execute('SELECT verification_code FROM Users WHERE email = %s', (email,))
    result = cur.fetchone()

    if result is None:
        cur.close()
        conn.close()
        return jsonify({"message": "User not found"}), 404

    stored_verification_code = result[0]

    # Compare the provided code with the one stored in the database
    if stored_verification_code == verification_code:
        # Update the user's account to mark it as verified
        cur.execute('''
            UPDATE Users
            SET status = 2
            WHERE email = %s
        ''', (email,))

        conn.commit()  # Commit the changes
        cur.close()
        conn.close()

        return jsonify({"message": "Account verified successfully"}), 200
    else:
        cur.close()
        conn.close()
        return jsonify({"message": "Invalid verification code"}), 400
    

@app.route('/api/login', methods=['POST'])
def login_user():
   try:
       data = request.get_json()
       email = data.get('email')
       password = data.get('password')


       print(f"Login attempt - email: {email}, password: {password}")  # Debugging info


       if not email or not password:
           print("Missing email or password")  # Debugging info
           return jsonify({'error': 'Please provide both email and password.'}), 400


       with connect_db() as conn:
           cursor = conn.cursor(dictionary=True)
           cursor.execute('SELECT * FROM Users WHERE email = %s', (email,))
           user = cursor.fetchone()
           
           if user:
                print(f"User found - email: {user['email']}")  # Debugging info
                if check_password_hash(user['u_password'], password):
                    print("Password correct")  # Debugging info
                    token = create_jwt_token(user['id'], user['email'], user['user_type'])  # Generate JWT
                    return jsonify({'message': 'Login successful.', 'token': token, 'user_type': user['user_type']}), 200
                else:
                    print("Password incorrect")  # Debugging info
                    return jsonify({'error': 'Invalid email or password.'}), 401
           else:
                print("User not found")  # Debugging info
                return jsonify({'error': 'Invalid email or password.'}), 401


   except Exception as e:
       print(f"Error during login: {e}")  # Debugging info
       return jsonify({'error': 'An error occurred during login.'}), 500




# Logout route
@app.route('/api/logout', methods=['POST'])
def logout_user():
   session.clear()
   return jsonify({'message': 'Logged out successfully.'}), 200


# Route to check if a user is logged in
@app.route('/api/check-session', methods=['GET'])
def check_session():
    auth_header = request.headers.get('Authorization')
    if auth_header:
        token = auth_header.split(" ")[1]  # Bearer <token>
        decoded_token = verify_jwt_token(token)
        if decoded_token:
            is_admin = decoded_token.get('user_type') == '2'
            return jsonify({'logged_in': True, 'user_id': decoded_token['id'], 'email': decoded_token['email'], 'is_admin': is_admin}), 200
    return jsonify({'logged_in': False}), 200

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        reset_token = data.get('token')
        new_password = data.get('newPassword')

        # Check if token and new password are provided
        if not reset_token or not new_password:
            return jsonify({'error': 'Token and new password are required.'}), 400

        # Decode the token
        decoded_token = verify_jwt_token(reset_token)
        if not decoded_token:
            return jsonify({'error': 'Invalid or expired token.'}), 400

        user_id = decoded_token.get('id')  # Safely extract user ID from the token

        # Ensure user_id exists in token
        if not user_id:
            return jsonify({'error': 'Invalid token.'}), 400

        # Optional: Add password validation for complexity
        if len(new_password) < 8:  # Example validation
            return jsonify({'error': 'Password must be at least 8 characters long.'}), 400

        # Hash the new password
        hashed_password = generate_password_hash(new_password)

        # Update the password in the database
        with connect_db() as conn:
            cursor = conn.cursor()
            cursor.execute('UPDATE Users SET u_password = %s WHERE id = %s', (hashed_password, user_id))
            conn.commit()

        return jsonify({'message': 'Password has been reset successfully.'}), 200

    except Exception as e:
        # Use a logging library instead of print for better production logging
        print(f"Error during password reset: {e}")
        return jsonify({'error': 'An error occurred during password reset.'}), 500


if __name__ == '__main__':
   app.run(debug=True)
