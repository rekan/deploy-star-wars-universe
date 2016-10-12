from flask import *

app = Flask('swapi')


@app.route('/')
def homepage():
    return render_template('index.html')

app.run(debug=True)
