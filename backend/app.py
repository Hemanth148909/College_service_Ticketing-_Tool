from flask import Flask, request, jsonify, session, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, ForeignKey
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt
from flask_cors import CORS  # Import Flask-CORS
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
from flask.cli import with_appcontext
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)  # Enable CORS for frontend requests

# Configurations
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this in production!
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tickets.db'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize Extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = "login"

# Ensure Uploads Directory Exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# User Model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # "student", "department", "admin"

# Ticket Model
class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    department_id = db.Column(db.Integer, db.ForeignKey("department.id"), nullable=False)  # Correct foreign key reference
    status = db.Column(db.String(50), default="Pending")
    title = db.Column(db.String(200), nullable=False) 
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    tickets = db.relationship("Ticket", backref="department", lazy=True)
    


    

# Load User
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
    return "Welcome to the Home Page!"

# Register User API
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists!"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Account created successfully!"}), 201

# Login API
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        print("Received login request with data:", data)  # Debugging
        if not data:
            return jsonify({"error": "Invalid JSON format"}), 400

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Missing username or password"}), 400

        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            return jsonify({"message": "Login successful!", "role": user.role, "user_id": user.id}), 200

        return jsonify({"error": "Invalid username or password!"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/departments", methods=["GET"])
def get_departments():
    departments = Department.query.all()
    return jsonify([{"id": dept.id, "name": dept.name} for dept in departments])    

## Route to create a ticket
@app.route("/create_ticket", methods=["POST"])
def create_ticket():
    try:
        data = request.get_json()
        print("Received ticket data:", data)  # Debugging

        if not data or "title" not in data or "description" not in data or "department_id" not in data:
            return jsonify({"error": "Missing title, description, or department_id"}), 400

        if not current_user.is_authenticated:
            return jsonify({"error": "User not authenticated"}), 401  # Ensure user is logged in

        new_ticket = Ticket(
            title=data["title"],
            description=data["description"],
            student_id=current_user.id,
            status="Pending",
            department_id=data["department_id"],
        )
        db.session.add(new_ticket)
        db.session.commit()

        return jsonify({"message": "Ticket created successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500





@app.route("/my_tickets", methods=["GET"])
@login_required
def my_tickets():
    try:
        # Use student_id for filtering tickets for the current user
        tickets = Ticket.query.filter_by(student_id=current_user.id).all()
        return jsonify([{
            "id": ticket.id,
            "title": ticket.title,
            "description": ticket.description,
            "status": ticket.status,
            "created_at": ticket.created_at
        } for ticket in tickets])
    except Exception as e:
        return jsonify({"error": str(e)}), 500




# Logout API
@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully!"})

# Initialize Database
with app.app_context():
    db.create_all()

# Run Server
if __name__ == "__main__":
    app.run(debug=True)
