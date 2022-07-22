from flask import (
    render_template, 
    g,
    request,
    session,
    redirect,
    url_for
)
import flask_login
from app import app

@app.route('/', methods = ['GET'])
@app.route("/index")
def index():
    return render_template('index.html', title="Rocket System Management")


@app.route('/home', methods = ['GET'])
@flask_login.login_required
def home():
    return render_template('home.html', title="Rocket System Management")