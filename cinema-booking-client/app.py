from flask import Flask, jsonify
import pymysql
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database connection parameters
db_host = 'cinema-ebooking-database.cdm6csm20sfl.us-east-2.rds.amazonaws.com'
db_user = 'admin'
db_password = 'kyqtov-narha3-nEcpif'
db_name = 'mywebsite'

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

if __name__ == '__main__':
    app.run(debug=True)
