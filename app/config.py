import logging

TIMEZONE = 'Asia/Jakarta'

# DEBUG can only be set to True in a development environment for security reasons
DEBUG = True

# secret key for generating tokens
SECRET_KEY = "rocket.saas"

# Admin credentials
ADMIN_CREDENTIALS = ('admin', 'Pa$$word')

# Configuration of a Email account for sending and receiving mails
MAIL_ACCOUNT = [
    {
        "default": {
            "ACCOUNT": "rocket.saas@gmail.com",
            "SERVER": "smtp.googlemail.com",
            "IMAP_PORT": 993,
            "SMTP_PORT": 465,
            "USE_TLS": False,
            "USE_SSL": True,
            "USERNAME": "",
            "PASSWORD": ""
        }
    }
]

# Configuration of a Database account
DATABASE_ACCOUNT = {
        "mpmds": {
            "DRIVER": "{ODBC Driver 18 for SQL Server}",
            "SERVER": "51.79.206.3",
            "PORT": 1443,
            "user": "sa",
            "password": "P@ssw0rd1",
            "database": "rocket",
        },
    }

# Number of times a password is hashed
BCRYPT_LOG_ROUNDS = 12

LOG_LEVEL = logging.DEBUG
LOG_FILENAME = 'activity.log'
LOG_MAXBYTES = 1024
LOG_BACKUPS = 2

# ORANGE API ENDPOINT
ORANGE_API_USERVALIDATION_ENDPOINT = "https://hr.mpm-motor.com:8080/MPM/services/UserValidationSrvcs?wsdl"