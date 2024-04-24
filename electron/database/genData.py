import sqlite3
import random
import os.path
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "stride.db")

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Define a function to generate random data
generated_cids = set()

def generate_random_data():

    uid = random.randint(1, 40)
    school = random.choice(["ABC School", "MNO School", "PQR School", "XYZ School"])
    leadership_pos = random.choice(["PL", "SL", "PSG"]) # This remains constant as per instructions
    options = ["AV", "RS", "LD", "PS", "DP", "SJ", "BT", "PSG", "CP", "MA"]
    sustain1 = random.choice(options)
    sustain2 = random.choice(options)
    sustain3 = random.choice(options)
    improve1 = random.choice(options)
    improve2 = random.choice(options)
    improve3 = random.choice(options)
    overall_assessment = random.choice(["C", "U", "E", "P", "C"])
    eventName = random.choice(["FTX 2024", "FTX 2023"])
    mission_type = random.choice(["ambush", "raid", "mtc", "defend", "attack"])
    company = random.choice(["Alpha", "Bravo", "Charlie"])
    platoon = random.randint(1,5)
    squad = random.randint(1,10)
    bluecard_date = datetime.today().strftime('%Y-%m-%d')

    return (uid, school, leadership_pos, sustain1, sustain2, sustain3, improve1, improve2, improve3, overall_assessment, eventName, mission_type, company, platoon, squad, bluecard_date)

# Insert random data into the database
def insert_random_data(n):
    for _ in range(n):
        data = generate_random_data()
        cursor.execute('INSERT INTO BlueCards (uid, school, leadership_pos, sustain1, sustain2, sustain3, improve1, improve2, improve3, overall_assessment, eventName, mission_type, company, platoon, squad, bluecard_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
    conn.commit()

# Example: Insert 10 random records
insert_random_data(100)

# Close the connection
conn.close()
