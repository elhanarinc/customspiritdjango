# -*- coding: utf-8 -*-

import logging
import os

from django.core.wsgi import get_wsgi_application


logging.captureWarnings(True)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "customspiritdjango.settings.dev")

application = get_wsgi_application()
