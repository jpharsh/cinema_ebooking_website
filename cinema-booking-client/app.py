from flask import Flask, jsonify, request, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import re
import mysql.connector
from mysql.connector.errors import IntegrityError
from cryptography.fernet import Fernet
from flask_session import Session
import jwt
from datetime import datetime, timedelta
import random  # For generating a reset token
import string  # For generating a random string
import traceback
import os  # To set environment variables
import base64
from email.mime.text import MIMEText
import google_auth_oauthlib.flow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from werkzeug.security import check_password_hash
from google.auth.exceptions import RefreshError
from google_auth_oauthlib.flow import InstalledAppFlow
import traceback


app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = '' # DELETED FOR PUBLIC REPO
app.config['SESSION_TYPE'] = 'filesystem'  # Store session data on the server-side
Session(app)

JWT_SECRET = ''  # DELETED FOR PUBLIC REPO
JWT_ALGORITHM = '' # DELETED FOR PUBLIC REPO
JWT_EXPIRATION_MINUTES = 30

# Database connection parameters
db_host = '' # DELETED FOR PUBLIC REPO
db_user = '' # DELETED FOR PUBLIC REPO
db_password = '' # DELETED FOR PUBLIC REPO
db_name = '' # DELETED FOR PUBLIC REPO

encryption_key = b''  # DO NOT PUBLISH THIS KEY !!!!! DELETED FOR PUBLIC REPO
cipher_suite = Fernet(encryption_key)

# Google OAuth Configuration
CLIENT_ID = '' # DELETED FOR PUBLIC REPO
CLIENT_SECRET = '' # DELETED FOR PUBLIC REPO
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

# Load credentials from token.json
def load_credentials():
    creds = None

    # Load existing token if available
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        print("Token loaded successfully.")

    # Check if credentials are expired or invalid
    if creds and creds.expired and creds.refresh_token:
        try:
            print("Refreshing token...")
            creds.refresh(Request())  # Attempt to refresh token
            print("Token refreshed successfully.")
        except RefreshError:
            print("Token is expired or revoked. Re-authenticating...")
            creds = reauthenticate()
    elif not creds or not creds.valid:
        print("No valid token found. Authenticating...")
        creds = reauthenticate()

    return creds

def reauthenticate():
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
    
    # Save the new token for future use
    with open('token.json', 'w') as token_file:
        token_file.write(creds.to_json())
    
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

def fetch_movies(is_now_showing):
    db = connect_db()
    cursor = db.cursor(dictionary=True)
    sql = f"SELECT * FROM Movies WHERE isNowShowing = %s"
    cursor.execute(sql, (is_now_showing, ))
    movies = cursor.fetchall()
    cursor.close()
    return jsonify(movies)

@app.route('/api/fetch-all-movies', methods=['GET'])
def fetch_all_movies():
    connection = connect_db()
    try:
        with connection.cursor(dictionary=True) as cursor:  # Use dictionary cursor for consistency
            sql = "SELECT * FROM Movies"
            cursor.execute(sql)
            movies = cursor.fetchall()
            return jsonify(movies)
    finally:
        connection.close()



def send_email_via_gmail_api(to, subject, body):
    try:
       creds = load_credentials()
       service = build('gmail', 'v1', credentials=creds)
       print("Service initialized successfully.")
       
       message = MIMEText(body)
       message['to'] = to
       message['subject'] = subject
       print("Email message created:", message)
       
       raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
       message = {'raw': raw_message}
       print('Encoded message:', message)

       service.users().messages().send(userId='me', body=message).execute()
       print("Email sent successfully.")
    except Exception as e:
       print(f"Error sending email: {e.__class__.__name__}: {e}")

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
   return fetch_movies(is_now_showing=True)

@app.route('/api/coming-soon', methods=['GET'])
def get_coming_soon():
   return fetch_movies(is_now_showing=False)

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
        print(f"Error fetching user data: {str(e)}")
        return None
    finally:
        connection.close()

@app.route('/api/user-get', methods=['GET'])
def get_userinfo():
    id = request.args.get('id', type=int)  # Get 'id' parameter from the query string
    if id is None:
        return jsonify({"error": "Missing 'id' parameter"}), 400

    user_data = fetch_userdata('Users', id)
    
    if user_data:
        return jsonify(user_data), 200
    return jsonify({"error": "User not found"}), 404
    
# Get card information
@app.route('/api/cards-get', methods=['GET'])
def get_cardinfo():
    user_id = request.args.get('user_id', type=int)  # Get 'user_id' parameter from the query string
    if user_id is None:
        return jsonify({"error": "Missing 'user_id' parameter"}), 400

    card_data = fetch_carddata('PaymentCards', user_id)
    if card_data:
        for row in card_data:
            try:
                # Decrypt each field if it exists and is of string type
                decrypted_card_num = cipher_suite.decrypt(row['card_num'].encode()).decode() if isinstance(row['card_num'], str) else cipher_suite.decrypt(row['card_num']).decode()
                decrypted_cv_num = cipher_suite.decrypt(row['cv_num'].encode()).decode() if isinstance(row['cv_num'], str) else cipher_suite.decrypt(row['cv_num']).decode()
                decrypted_exp_month = cipher_suite.decrypt(row['exp_month'].encode()).decode() if isinstance(row['exp_month'], str) else cipher_suite.decrypt(row['exp_month']).decode()
                decrypted_exp_year = cipher_suite.decrypt(row['exp_year'].encode()).decode() if isinstance(row['exp_year'], str) else cipher_suite.decrypt(row['exp_year']).decode()
                
                # Update row with decrypted values
                row['card_num'] = decrypted_card_num
                row['cv_num'] = decrypted_cv_num
                row['exp_month'] = decrypted_exp_month
                row['exp_year'] = decrypted_exp_year

            except Exception as decrypt_error:
                print(f"Error decrypting card data: {str(decrypt_error)}")
        
        return jsonify({"card_data": card_data, "found": True}), 200

    else:
        return jsonify({"found": False}), 200
    
@app.route('/api/verify-password', methods=['POST'])
def verify_password():
    data = request.json
    entered_password = data.get('password')
    user_id = data.get('id')

    if user_id is None:
        return jsonify({"error": "Missing 'user_id' parameter"}), 400

    print(f"Received password: {entered_password}, User ID: {user_id}")  # Debugging line

    user = fetch_userdata('Users', user_id)

    if user:
        print(f"User fetched: {user}")  # Debugging line
        if check_password_hash(user['u_password'], entered_password):
            return jsonify({'passwordVerified': True}), 200
        else:
            print("Password mismatch!")  # Debugging line
            return jsonify({'passwordVerified': False}), 401
    else:
        print("User not found!")  # Debugging line
        return jsonify({'passwordVerified': False}), 404

@app.route('/api/delete-card/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):
    try:
        with connect_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM PaymentCards WHERE id = %s", (card_id,))
            conn.commit()
            if cursor.rowcount == 0:
                return jsonify({"error": "Card not found"}), 404
        return jsonify({"message": "Card deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting card: {e}")
        return jsonify({"error": "An error occurred while deleting the card."}), 500
 
@app.route('/api/edit', methods=['POST'])
def edit_acc():
    print('edit_acc invoked')
    try:
        data = request.get_json()
        
        userId = data.get('id')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        phone_number = data.get('phoneNumber')
        password = data.get('password')
        promo_subscription = data.get('isOptedInForPromotions', False)
        hashed_password = generate_password_hash(password) if password else None

        home_address = data.get('addressInfo', {})
        home_street_address = home_address.get('streetAddress')
        home_city = home_address.get('city')
        home_state = home_address.get('state')
        home_zip_code = home_address.get('zipCode')

        request_cards = data.get('cards', [])
        request_card_ids = {card['id'] for card in request_cards if 'id' in card}

        with connect_db() as conn:
            cursor = conn.cursor(dictionary=True)

            if hashed_password:
                cursor.execute('''
                    UPDATE Users
                    SET f_name = %s,
                        l_name = %s,
                        u_password = %s,
                        phone_num = %s,
                        promo_sub = %s,
                        street_address = %s,
                        city = %s,
                        state = %s,
                        zip_code = %s,
                        status = %s
                    WHERE id = %s
                ''', (first_name, last_name, hashed_password, phone_number, promo_subscription, home_street_address, home_city, home_state, home_zip_code, "1", userId))
            else:
                cursor.execute('''
                    UPDATE Users
                    SET f_name = %s,
                        l_name = %s,
                        phone_num = %s,
                        promo_sub = %s,
                        street_address = %s,
                        city = %s,
                        state = %s,
                        zip_code = %s,
                        status = %s
                    WHERE id = %s
                ''', (first_name, last_name, phone_number, promo_subscription, home_street_address, home_city, home_state, home_zip_code, "1", userId))

            print("User profile updated")

            cursor.execute('SELECT id FROM PaymentCards WHERE user_id = %s', (userId,))
            existing_card_ids = {row['id'] for row in cursor.fetchall()}

            cards_to_delete = existing_card_ids - request_card_ids
            if cards_to_delete:
                placeholders = ', '.join(['%s'] * len(cards_to_delete))
                query = f'DELETE FROM PaymentCards WHERE user_id = %s AND id IN ({placeholders})'
                cursor.execute(query, (userId, *cards_to_delete))

            for card in request_cards:
                name_on_card = card['nameOnCard']
                card_number = card['cardNumber']
                expiration_month = card['expirationMonth']
                expiration_year = card['expirationYear']
                cvc = card['cvc']
                billing_street_address = card['streetAddress']
                billing_city = card['city']
                billing_state = card['state']
                billing_zip_code = card['zipCode']
                card_id = card.get('id')

                encrypted_card_number = cipher_suite.encrypt(card_number.encode()).decode()
                encrypted_cvc = cipher_suite.encrypt(cvc.encode()).decode()
                encrypted_expiration_month = cipher_suite.encrypt(expiration_month.encode()).decode()
                encrypted_expiration_year = cipher_suite.encrypt(expiration_year.encode()).decode()

                if card_id in existing_card_ids:
                    cursor.execute('''
                        UPDATE PaymentCards
                        SET card_num = %s, 
                            cv_num = %s,
                            exp_month = %s,
                            exp_year = %s,
                            name_on_card = %s,
                            street_address = %s,
                            city = %s,
                            state = %s,
                            zip_code = %s
                        WHERE id = %s AND user_id = %s
                    ''', (encrypted_card_number, encrypted_cvc, encrypted_expiration_month, encrypted_expiration_year,
                          name_on_card, billing_street_address, billing_city, billing_state, billing_zip_code,
                          card_id, userId))
                    print(f"Updated card with ID {card_id}")
                else:
                    cursor.execute('''
                        INSERT INTO PaymentCards (user_id, card_num, cv_num, exp_month, exp_year, name_on_card, street_address, city, state, zip_code)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ''', (userId, encrypted_card_number, encrypted_cvc, encrypted_expiration_month, encrypted_expiration_year,
                          name_on_card, billing_street_address, billing_city, billing_state, billing_zip_code))
                    print(f"Inserted new card for user_id {userId}")

            conn.commit()

        print('Database changes committed')
        return jsonify({'message': 'Changes have been saved'}), 200

    except Exception as e:
        print(f"Error in edit_acc: {e}")
        traceback.print_exc()  # Print the full stack trace for debugging
        return jsonify({'error': 'An error occurred while updating the database.'}), 500

       
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
                add_card_to_db(cursor, user_id, card)
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
            is_admin = decoded_token.get('user_type') == 2
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
    
@app.route('/api/movies', methods=['GET'])
def get_movies():
    db = connect_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Movies")
    movies = cursor.fetchall()
    cursor.close()
    return jsonify(movies)

# POST route to add a new movie
@app.route('/api/movies', methods=['POST'])
def add_movie():
    try: 
        data = request.json

        # Extract fields from the data
        title = data.get('title')
        mpaa_rating = data.get('mpaa_rating')
        category = data.get('category')
        director = data.get('director')
        producer = data.get('producer')
        movie_cast = data.get('movie_cast')
        synopsis = data.get('synopsis')
        reviews = data.get('reviews', "")
        poster_url = data.get('poster_url')
        trailer_url = data.get('trailer_url')

        with connect_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO Movies (title, movie_cast, synopsis, poster_url, mpaa_rating, trailer_url, isNowShowing, category, director, producer)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ''', (title, movie_cast, synopsis, poster_url, mpaa_rating, trailer_url, '0', category, director, producer))

            conn.commit()
            return jsonify({'message': 'Movie added successfully'}), 201

    except Exception as e:
           return jsonify({'error': 'An error occurred when trying to add movie.'}), 500

@app.route('/api/add-promo', methods=['POST'])
def add_promo():
    try:
        data = request.json
        
        # Extract fields from the data
        promo_code = data.get('code')
        promo_discount = data.get('discount')
        promo_expiry = data.get('expirationDate')

        # Validate the input
        if not promo_code or not promo_discount or not promo_expiry:
            return jsonify({'error': 'All fields are required'}), 400

        # Connect to the database and insert the promo
        connection = connect_db()
        cursor = connection.cursor()
        cursor.execute('''
            INSERT INTO Promotions (promo_code, promo_amount, exp_date)
            VALUES (%s, %s, %s)
        ''', (promo_code, promo_discount, promo_expiry))

        connection.commit()

         # Step 2: Fetch all users who are subscribed to promotions
        cursor.execute('SELECT email FROM Users WHERE promo_sub = 1 AND status = 2')
        subscribed_users = cursor.fetchall()

        # cursor.close()
        # connection.close()

        print('before sending email')
        # Step 3: Send emails to all subscribed users
        subject = "New Movie Promotion Available!"
        body = f"Hello, there's a new promotion available: {promo_code}. It expires on {promo_expiry}."

        print('before users loop')
        print(f"Subscribed users: {subscribed_users}")
        # Loop through the list of subscribed users and send an email
        for user in subscribed_users:
            email = user[0]
            print(f"Sending email to {email}")
            send_email_via_gmail_api(email, subject, body)
        
        print('after sending email')
        cursor.close()
        connection.close()
        return jsonify({'message': 'Promo added and emails sent successfully!'}), 201

    except Exception as e:
        print(f"Error adding promo: {e}")
        return jsonify({'error': 'An error occurred while adding the promo'}), 500

# Endpoint to get all promos
@app.route('/api/promos', methods=['GET'])
def get_promos():
    try:
        connection = connect_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute('SELECT * FROM Promotions')
        promos = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(promos), 200
    except Exception as e:
        print(f"Error fetching promos: {e}")
        return jsonify({'error': 'An error occurred while fetching promos.'}), 500

@app.route('/api/schedule-movie', methods=['POST'])
def schedule_movie():
    data = request.get_json()
    movie_id = data.get('movie_id')
    room = data.get('room')
    dtime = data.get('time')

    connection = connect_db()
    try:
        cursor = connection.cursor()
        print(f"Received movie_id: {movie_id} (type: {type(movie_id)})")

        # Check if the movie exists in the Movies table
        cursor.execute("SELECT COUNT(*) FROM Movies WHERE id = %s", (movie_id,))
        movie_exists = cursor.fetchone()[0]

        if not movie_exists:
            return jsonify({"success": False, "error": "Invalid movie ID"}), 400

        # Check if the selected room already has a movie scheduled at the same date and time
        cursor.execute("""
            SELECT COUNT(*) FROM Shows
            WHERE room_id = %s AND showtime = %s
        """, (room, dtime))
        conflict = cursor.fetchone()[0]

        if conflict > 0:
            return jsonify({"success": False, "error": "Time conflict in the selected room"}), 400

        # Insert new schedule
        cursor.execute("""
            INSERT INTO Shows (movie_id, room_id, showtime)
            VALUES (%s, %s, %s)
        """, (movie_id, room, dtime))

       # Get the ID of the newly inserted show
        show_id = cursor.lastrowid

        # Retrieve seat IDs for the specified room
        cursor.execute("""
            SELECT id FROM Seats
            WHERE room_id = %s
            LIMIT 69
        """, (room,))
        seat_ids = cursor.fetchall()

        if len(seat_ids) < 69:
            return jsonify({"success": False, "error": "Not enough seats available in the specified room"}), 400

        # Prepare seat data for insertion into ShowSeats
        seat_data = [(show_id, seat_id[0], 0) for seat_id in seat_ids]  # Status is set to 0 (available)
        cursor.executemany("""
            INSERT INTO ShowSeats (show_id, seat_id, seat_status)
            VALUES (%s, %s, %s)
        """, seat_data)

        connection.commit()

        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"Error scheduling movie: {e}")
        return jsonify({"success": False, "error": "An error occurred while scheduling the movie"}), 500
    finally:
        connection.close()

@app.route('/api/get-seats', methods=['GET'])
def get_seats():
    show_id = request.args.get('show_id')  # Assume you pass the show_id as a query parameter
    connection = connect_db()
    try:
        cursor = connection.cursor(dictionary=True)
        # Query to fetch seat statuses for the given show_id
        cursor.execute("""
            SELECT seat_status 
            FROM ShowSeats
            WHERE show_id = %s
            ORDER BY seat_id ASC
        """, (show_id,))
        
        # Fetch all rows from the query result
        seats = cursor.fetchall()  # Returns a list of dictionaries
        
        # Return the JSON response
        return jsonify(seats), 200
    except Exception as e:
        print(f"Error fetching seat statuses: {e}")
        return jsonify({"success": False, "error": "An error occurred while fetching seat statuses"}), 500
    finally:
        connection.close()

@app.route('/api/update-is-now-showing', methods=['POST'])
def update_is_now_showing():
    data = request.get_json()
    movie_id = data.get('movie_id')
    is_now_showing = data.get('isNowShowing')  # Adjusted to match the frontend payload

    print(f"Received movie_id: {movie_id}, is_now_showing: {is_now_showing}")

    connection = connect_db()
    try:
        cursor = connection.cursor()
        print(f"Updating isNowShowing for movie_id: {movie_id} to {is_now_showing}")

        cursor.execute("""
            UPDATE Movies
            SET isNowShowing = %s
            WHERE id = %s
        """, (is_now_showing, movie_id))
        connection.commit()

        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"Error updating isNowShowing: {e}")
        return jsonify({"success": False, "error": "An error occurred while updating the movie"}), 500
    finally:
        connection.close()
        
@app.route('/api/showtimes/<int:movie_id>', methods=['GET'])
def get_showtimes(movie_id):
    connection = connect_db()
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM Shows WHERE movie_id = %s"
    cursor.execute(query, (movie_id,))
    showtimes = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(showtimes)

@app.route('/api/update-seat-status', methods=['POST'])
def update_seat_status():
    data = request.get_json()
    show_id = data.get('show_id')
    selected_seats = data.get('selectedSeats')
    print(f"selected_seats: {selected_seats}")

    if not show_id or not selected_seats or len(selected_seats) == 0:
        return jsonify({'error': 'Invalid data provided'}), 400

    try:
        connection = connect_db()
        cursor = connection.cursor()

        for seat in selected_seats:
            seat_id = seat.get('seat_id')
            print(f"Updating seat status for seat_id: {seat_id}")
            cursor.execute("""
                UPDATE ShowSeats
                SET seat_status = 2
                WHERE show_id = %s AND seat_id = %s
            """, (show_id, seat_id))

        connection.commit()
        return jsonify({'message': 'Seat statuses updated successfully'}), 200
    except Exception as e:
        print(f"Error updating seat statuses: {e}")
        return jsonify({'error': 'Failed to update seat statuses'}), 500
    finally:
        connection.close()

@app.route('/api/add-card', methods=['POST']) 
def add_card():
    try:
        with connect_db() as conn:
            cursor = conn.cursor()
            data = request.get_json()
            user_id = data.get('user_id')
            
            add_card_to_db(cursor, user_id, data)
            conn.commit()
        return jsonify({'message': 'Card added successfully'}), 201
    except Exception as e:
        print(f"Error adding card: {e}")
        return jsonify({'error': 'An error occurred while adding the card'}), 500
    finally:
        conn.close()

def add_card_to_db(cursor, user_id, card):
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

@app.route('/api/validate-promo', methods=['POST'])
def validate_promo():
    try:
        # Get the promo code from the request
        data = request.json
        promo_code = data.get("promo_code")

        if not promo_code:
            return jsonify({"error": "Promo code is required"}), 400

        # Fetch promo details from the database
        connection = connect_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT promo_amount, exp_date FROM Promotions WHERE promo_code = %s", (promo_code,))
        promo = cursor.fetchone()
        cursor.close()
        connection.close()

        if not promo:
            return jsonify({"error": "Invalid promo code"}), 404

        # Debugging: Check what expiration date is fetched
        expiration_date = promo.get("exp_date")
        print(f"Raw expiration_date from DB: {expiration_date}")

        # Ensure the expiration_date is processed correctly
        if isinstance(expiration_date, str):
            try:
                expiration_date = datetime.strptime(expiration_date, "%Y-%m-%d").date()
            except ValueError as e:
                print(f"Error parsing expiration_date: {e}")
                return jsonify({"error": "Invalid expiration date format"}), 500

        # Check if the promo code is expired
        current_date = datetime.now().date()
        print(f"Current date: {current_date}, Expiration date: {expiration_date}")
        if expiration_date < current_date:
            return jsonify({"error": "Promo code has expired"}), 400

        # Return the discount if valid
        discount = promo.get("promo_amount", 0)
        return jsonify({"discount": discount}), 200

    except Exception as e:
        print(f"Error validating promo code: {e}")
        return jsonify({"error": "An error occurred while validating the promo code"}), 500

    
@app.route('/api/show-dates', methods=['GET'])
def get_show_dates():
    connection = connect_db()
    try:
        with connection.cursor(dictionary=True) as cursor:
            sql = "SELECT DISTINCT DATE(showtime) as show_date FROM Shows ORDER BY show_date ASC"
            cursor.execute(sql)
            result = cursor.fetchall()
            dates = [row['show_date'].strftime('%Y-%m-%d') for row in result]
            return jsonify(dates)
    finally:
        connection.close()

@app.route('/api/movies-by-date', methods=['GET'])
def get_movies_by_date():
    show_date = request.args.get('date')  # Expecting date in 'YYYY-MM-DD' format
    connection = connect_db()
    try:
        with connection.cursor() as cursor:
            sql = """
            SELECT DISTINCT m.id, m.title, m.poster_url, m.mpaa_rating
            FROM Movies m
            JOIN Shows s ON m.id = s.movie_id
            WHERE DATE(s.showtime) = %s
            """
            cursor.execute(sql, (show_date,))
            result = cursor.fetchall()
            movies = [{'id': row[0], 'title': row[1], 'poster_url': row[2], 'mpaa_rating': row[3]} for row in result]
            return jsonify(movies)
    finally:
        connection.close()

import traceback

@app.route('/api/get-promo-id', methods=['GET'])
def get_promo_id():
    promo_code = request.args.get('promo_code')  # Extract promo_code from query parameters

    if not promo_code:
        return jsonify({'error': 'Promo code is required'}), 400

    try:
        # Connect to the database
        connection = connect_db()
    except Exception as e:
        return jsonify({'error': f'Database connection error: {str(e)}'}), 500

    try:
        with connection.cursor() as cursor:
            # Query to fetch promo_id based on promo_code
            sql = """
            SELECT id
            FROM Promotions
            WHERE promo_code = %s
            """
            cursor.execute(sql, (promo_code,))
            result = cursor.fetchone()

            if result:
                return jsonify({'id': result[0]}), 200  # Return the promo_id if found
            else:
                return jsonify({'error': 'Promo code not found'}), 404

    except Exception as e:
        return jsonify({'error': f'Error executing query: {str(e)}'}), 500

    finally:
        connection.close()

        
@app.route('/api/save-order', methods=['POST'])
def save_order():
    try:
        # Parse incoming JSON data
        data = request.get_json()
        print(f"Received data: {data}")  # Debug log

        customer_id = data.get('customer_id')
        show_id = data.get('show_id')
        total = data.get('total')
        card_id = data.get('card_id')
        promo_id = data.get('promo_id')  # Optional
        adults = data.get('adults', 0)
        seniors = data.get('seniors', 0)
        children = data.get('children', 0)
        seats = data.get('seats', [])

        # Validate required fields
        if not (customer_id and show_id and total and card_id):
            return jsonify({'error': 'Missing required fields'}), 400

        if len(seats) != adults + seniors + children:
            return jsonify({'error': 'Mismatch between ticket counts and seats provided'}), 400

        # Normalize seat IDs
        seats = [seat['seat_id'] for seat in seats]

        # Ensure all values are integers
        customer_id = int(customer_id)
        show_id = int(show_id)
        total = float(total)
        card_id = int(card_id)
        promo_id = int(promo_id) if promo_id is not None else None

        # Insert into Bookings table
        connection = connect_db()
        print("Database connection established")  # Debug log

        with connection.cursor() as cursor:
            # Insert booking into Bookings table
            booking_query = """
                INSERT INTO Bookings (customer_id, show_id, total, card_id, promo_id) 
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(booking_query, (customer_id, show_id, total, card_id, promo_id))
            connection.commit()

            # Get the last inserted booking_id
            booking_id = cursor.lastrowid
            print(f"Booking ID: {booking_id}")  # Debug log

            # Insert tickets into Tickets table
            ticket_types = {
                'adult': (1, adults),
                'senior': (2, seniors),
                'child': (3, children)
            }

            ticket_query = """
                INSERT INTO Tickets (booking_id, ticket_type, seat_id) 
                VALUES (%s, %s, %s)
            """

            seat_index = 0
            for ticket_type, (type_id, count) in ticket_types.items():
                for _ in range(count):
                    seat_id = seats[seat_index]
                    cursor.execute(ticket_query, (booking_id, type_id, seat_id))
                    seat_index += 1

            connection.commit()
            print("Tickets saved successfully!")  # Debug log

        return jsonify({'message': 'Order and tickets saved successfully!'}), 201

    except ValueError:
        return jsonify({'error': 'All values must be integers'}), 400
    except Exception as e:
        # Log the full error including traceback for debugging
        print(f"Error saving order: {e}")
        traceback.print_exc()  # This will print the detailed error stack trace
        return jsonify({'error': f'An error occurred while saving the order: {str(e)}'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            connection.close()


@app.route('/send-confirmation-email', methods=['POST'])
def send_confirmation_email():
   data = request.json
   print(f"Received data: {data}")
   to = data.get('to')
   movie = data.get('movie')
   date = data.get('date')
   time = data.get('time')
   tickets = data.get('tickets')
   seats = data.get('seats')
   total_price = data.get('total_price')

   if not to or not movie or not date or not time or not tickets or not seats or not total_price:
       return jsonify({'error': 'Missing required fields'}), 400

   subject = f"Your Movie Confirmation for {movie}"
   body = f"""
   Thank you for your purchase!

   Movie: {movie}
   Date: {date}
   Time: {time}
   Tickets: {tickets}
   Seats: {seats}
   Total Price: ${total_price}

   Enjoy the movie!
   """

   try:
       send_email_via_gmail_api(to, subject, body)
       return jsonify({'message': 'Email sent successfully'}), 200
   except Exception as e:
       return jsonify({'error': str(e)}), 500
   
@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    user_id = request.args.get('user_id')  # Pass the logged-in user's ID
    conn = connect_db()
    cursor = conn.cursor(dictionary=True)

    query = '''
    SELECT 
        b.id, 
        b.total,
        s.showtime,
        m.title,
		SUM(CASE WHEN t.ticket_type = '1' THEN 1 ELSE 0 END) AS adults,
		SUM(CASE WHEN t.ticket_type = '2' THEN 1 ELSE 0 END) AS seniors,
		SUM(CASE WHEN t.ticket_type = '3' THEN 1 ELSE 0 END) AS children
    FROM Bookings b
    JOIN Shows s ON b.show_id = s.id
    JOIN Movies m ON s.movie_id = m.id
    JOIN Tickets t ON b.id = t.booking_id
    WHERE b.customer_id = %s
    GROUP BY b.id, s.showtime, m.title
    '''
    cursor.execute(query, (user_id,))
    bookings = cursor.fetchall()
    for booking in bookings:
        showtime = booking['showtime']
        booking['formatted_date'] = showtime.strftime('%a, %d %b %Y')
        booking['formatted_time'] = showtime.strftime('%I:%M %p')

    cursor.close()
    conn.close()

    return jsonify(bookings)

if __name__ == '__main__':
   app.run(debug=True)
