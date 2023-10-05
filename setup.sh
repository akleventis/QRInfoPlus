#!/bin/bash

# Create secrets.ts file and set permissions
touch .env
sudo chmod +x .env

# Write content to secrets.ts file
echo 'EXPO_PUBLIC_ENV = "prod"
EXPO_PUBLIC_CLIENT_ID = ""
EXPO_PUBLIC_CLIENT_SECRET = ""
EXPO_PUBLIC_REDIRECT_URI = "exp://127.0.0.1:19000/"' > .env

echo "secrets.ts file created successfully!"