from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import random

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///results.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Model
class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    wpm = db.Column(db.Float)
    accuracy = db.Column(db.Float)
    time = db.Column(db.Integer)
    date = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/test')
def test():
    paragraphs = [
        "Typing quickly and accurately is a valuable skill in the digital world.",
        "Practice makes perfect when it comes to improving your typing speed.",
        "Consistency is key to becoming a better typist every single day.",
        "A calm mind and good posture improve accuracy during typing tests."
    ]
    paragraph = random.choice(paragraphs)
    return render_template('test.html', paragraph=paragraph)

@app.route('/submit_result', methods=['POST'])
def submit_result():
    data = request.get_json()
    new_result = Result(
        name=data.get("name"),
        wpm=data.get("wpm"),
        accuracy=data.get("accuracy"),
        time=data.get("time")
    )
    db.session.add(new_result)
    db.session.commit()
    return jsonify({"id": new_result.id})

@app.route('/result/<int:id>')
def result(id):
    r = Result.query.get_or_404(id)
    return render_template('result.html', r=r)

@app.route('/results')
def results():
    all_results = Result.query.order_by(Result.date.desc()).all()
    return render_template('results.html', results=all_results)

if __name__ == "__main__":
    app.run(debug=True)
