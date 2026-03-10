import os
import requests
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in environment variables")

# Read the SQL file
with open('setup_db.sql', 'r') as f:
    sql_query = f.read()

# Supabase REST API endpoint for executing SQL via RPC
# Note: This requires an RPC function setup to execute arbitrary SQL 
# However, usually we can use postgres connection string. Let's provide instructions.
print("=========================================================")
print("Please run the contents of 'setup_db.sql' in the Supabase")
print("SQL Editor located in the Supabase Dashboard.")
print("The REST API does not allow direct schema execution without")
print("a direct Postgres connection string or an RPC function.")
print("=========================================================")
