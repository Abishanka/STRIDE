import sqlite3
import random
import os.path

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "stride.db")

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Define a function to generate random data
generated_cids = set()

def generate_random_data():
    global generated_cids
    cid = random.randint(100000, 10000000)
    while cid in generated_cids:
        cid = random.randint(100000, 10000000)
    generated_cids.add(cid)
    
    uid = cid  # Ensuring uid is the same as cid
    school = random.choice(["ABC School", "MNO School", "PQR School", "XYZ School"])
    leadership_pos = "DEF"  # This remains constant as per instructions
    options = ["AV", "RS", "LD", "PS", "DP", "SJ", "BT", "PSG", "CP", "MA"]
    sustain1 = random.choice(options)
    sustain2 = random.choice(options)
    sustain3 = random.choice(options)
    improve1 = random.choice(options)
    improve2 = random.choice(options)
    improve3 = random.choice(options)
    overall_assessment = random.choice(["C", "U", "E", "P", "C"])
    return (cid, uid, school, leadership_pos, sustain1, sustain2, sustain3, improve1, improve2, improve3, overall_assessment)

# Insert random data into the database
def insert_random_data(n):
    for _ in range(n):
        data = generate_random_data()
        cursor.execute('INSERT INTO BlueCards (cid, uid, school, leadership_pos, sustain1, sustain2, sustain3, improve1, improve2, improve3, overall_assessment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
    conn.commit()

# Example: Insert 10 random records
insert_random_data(100)

# Close the connection
conn.close()
