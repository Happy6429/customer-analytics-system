from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__,
            static_folder='static',
            template_folder='templates')
CORS(app)

DATABASE = os.path.join(os.path.dirname(__file__), '..', 'database.db')

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            city TEXT NOT NULL,
            purchase REAL NOT NULL
        )''')
        conn.commit()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/init', methods=['GET', 'POST'])
def initialize_db():
    try:
        init_db()
        return jsonify({'message': 'Database initialized successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/customers', methods=['GET'])
def get_customers():
    try:
        with get_db() as conn:
            customers = conn.execute('SELECT * FROM customers ORDER BY id DESC').fetchall()
            return jsonify([dict(customer) for customer in customers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/customers', methods=['POST'])
def add_customer():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        name = data.get('name', '').strip()
        age = data.get('age')
        city = data.get('city', '').strip()
        purchase = data.get('purchase')

        if not name or not city or age is None or purchase is None:
            return jsonify({'error': 'All fields are required'}), 400

        if not isinstance(age, int) or age < 18 or age > 100:
            return jsonify({'error': 'Age must be between 18 and 100'}), 400

        if not isinstance(purchase, (int, float)) or purchase < 0:
            return jsonify({'error': 'Purchase must be a positive number'}), 400

        with get_db() as conn:
            conn.execute('INSERT INTO customers (name, age, city, purchase) VALUES (?, ?, ?, ?)',
                        (name, age, city, purchase))
            conn.commit()

        return jsonify({'message': 'Customer added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/insights', methods=['GET'])
def get_insights():
    try:
        with get_db() as conn:
            # Total customers
            total_customers = conn.execute('SELECT COUNT(*) as count FROM customers').fetchone()['count']

            # Average purchase
            avg_purchase = conn.execute('SELECT AVG(purchase) as avg FROM customers').fetchone()['avg'] or 0

            # Top customer
            top_customer = conn.execute('SELECT name, purchase FROM customers ORDER BY purchase DESC LIMIT 1').fetchone()
            top_customer = dict(top_customer) if top_customer else None

            # City purchases
            city_purchases = conn.execute('''
                SELECT city, COUNT(*) as count, AVG(purchase) as avg
                FROM customers
                GROUP BY city
                ORDER BY avg DESC
            ''').fetchall()
            city_purchases = [dict(row) for row in city_purchases]

            # Segments
            segments = conn.execute('''
                SELECT
                    SUM(CASE WHEN purchase > 500 THEN 1 ELSE 0 END) as high_spenders,
                    SUM(CASE WHEN purchase BETWEEN 200 AND 500 THEN 1 ELSE 0 END) as medium_spenders,
                    SUM(CASE WHEN purchase < 200 THEN 1 ELSE 0 END) as low_spenders
                FROM customers
            ''').fetchone()
            segments = dict(segments)

            # Age groups
            age_groups = conn.execute('''
                SELECT
                    CASE
                        WHEN age < 25 THEN '18-24'
                        WHEN age < 35 THEN '25-34'
                        WHEN age < 45 THEN '35-44'
                        WHEN age < 55 THEN '45-54'
                        ELSE '55+'
                    END as age_group,
                    COUNT(*) as count
                FROM customers
                GROUP BY age_group
                ORDER BY age_group
            ''').fetchall()
            age_groups = {row['age_group']: row['count'] for row in age_groups}

        return jsonify({
            'total_customers': total_customers,
            'average_purchase': avg_purchase,
            'top_customer': top_customer,
            'city_purchases': city_purchases,
            'segments': segments,
            'age_groups': age_groups
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)