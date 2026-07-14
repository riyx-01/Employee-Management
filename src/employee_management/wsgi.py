import os
import sys

# Add the src directory to the python path so modules are found by Vercel
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "employee_management.settings")

application = get_wsgi_application()
app = application
