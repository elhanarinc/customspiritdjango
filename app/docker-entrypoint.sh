#!/bin/bash
python3 manage.py migrate                            # Apply database migrations
python3 manage.py collectstatic --clear --noinput    # clearstatic files
python3 manage.py collectstatic --noinput            # collect static files

# Prepare log files and start outputting logs to stdout
touch /usr/src/logs/gunicorn.log
touch /usr/src/logs/access.log

tail -n 0 -f /usr/src/logs/*.log &

# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn customspiritdjango.wsgi:application \
    --name customspiritdjango \
    --workers 4 \
    --log-level=/usr/src/logs/info \
    --log-file=/usr/src/logs/gunicorn.log \
    --access-logfile=/usr/src/logs/access.log \
    --bind 0.0.0.0:8000 &

# Start Nginx
echo Starting Nginx. 
exec service nginx start