# --- Stage 1: Build dependencies ---
FROM python:3.12-slim AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Build wheels of dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# --- Stage 2: Final minimal production image ---
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy built python packages from builder stage
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy project files
COPY . .

EXPOSE 8000

# Script/Command to run migrations and start gunicorn
# Note: we use shell form to execute multiple commands (migrate and then start server)
CMD python manage.py migrate && gunicorn --bind 0.0.0.0:$PORT --chdir src employee_management.wsgi:application
