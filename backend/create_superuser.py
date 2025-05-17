import requests
import json
import sys
import re

def validate_inputs(national_id, sim_card, password):
    if not re.fullmatch(r"\d{16}", national_id):
        print("National ID must be exactly 16 digits")
        sys.exit(1)
    if not re.fullmatch(r"07\d{8}", sim_card):
        print("Phone number must start with 07 and be 10 digits")
        sys.exit(1)
    if (len(password) < 8 or
        not re.search(r"[A-Z]", password) or
        not re.search(r"[a-z]", password) or
        not re.search(r"\d", password) or
        not re.search(r"[@$!%*?&#]", password)):
        print("Password must be at least 8 characters and include uppercase, lowercase, number, and special character")
        sys.exit(1)

def create_superuser(email, password, name, sim_card, national_id):
    url = 'http://localhost:5000/users/'
    
    data = {
        'email': email,
        'password': password,
        'full_name': name,
        'phone_number': sim_card,
        'national_id': national_id
    }
    
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        print(f"Superuser created successfully: {email}")
    except requests.exceptions.RequestException as e:
        print(f"Error creating superuser: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) != 6:
        print("Usage: python create_superuser.py <email> <password> <name> <sim_card> <national_id>")
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2]
    name = sys.argv[3]
    sim_card = sys.argv[4]
    national_id = sys.argv[5]
    
    validate_inputs(national_id, sim_card, password)
    create_superuser(email, password, name, sim_card, national_id) 