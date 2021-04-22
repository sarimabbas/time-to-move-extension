# How to run this code

## First time setup

First, navigate to this folder using `cd`. Then, run the following:

```bash
python3 -m venv virtual_environment
source virtual_environment/bin/activate
pip install -r requirements.txt
```

## Running the code

```bash
source virtual_environment/bin/activate
FLASK_DEBUG=true flask run
```

# How to deploy this code

Just push to GitHub, it will auto-deploy to Heroku: <https://time-to-move-scheduler.herokuapp.com/>

Keep in mind the Heroku server goes to sleep every 30 minutes, so it will take a while to load up for the first time if it hasn't been used for a while.
