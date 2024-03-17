import csv

import os
from dotenv import load_dotenv

import psycopg2
from psycopg2 import sql
import time
from datetime import datetime
from psycopg2.extensions import register_adapter, AsIs
import json


# Define a custom adapter function to handle dictionary types
def adapt_dict(dict_var):
    return AsIs("'" + json.dumps(dict_var) + "'")

# Register the adapter function for the dictionary type
register_adapter(dict, adapt_dict)

class Database:
  def __init__(self):
    # Establish a database connection
    load_dotenv()
    

    
    self._conn = self._connect_to_db()
    self.initDB()
    
    

  def _connect_to_db(self):
    max_retries = 3
    retry_delay = 5  # seconds
    retry_count = 0

    while retry_count < max_retries:
      try:
        # Connect to your PostgreSQL database
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PAS"),
            host="db",
            port="5432"
        )
        print("Connected to the database successfully")
        return conn
      except Exception as e:
        print(f"Attempt {retry_count+1}/{max_retries}: Connection failed. Retrying in {retry_delay} seconds.")
        time.sleep(retry_delay)
        retry_count += 1

        print("Failed to connect to the database after multiple attempts.")

  def execute_query(self, query, params=None):
    try:
      # Create a cursor object using the cursor() method
      cursor = self._conn.cursor()

      # Execute the SQL query
      if params:
          cursor.execute(query, params)
      else:
          cursor.execute(query)

      # Fetch the result
      result = cursor.fetchall()

      # Close the cursor
      cursor.close()

      return result
    except (Exception, psycopg2.DatabaseError) as error:
      print(error)
      return None
  
  

  def close_connection(self):
    # Close the database connection
    self._conn.close()
    print("Connection closed successfully")

  def initDB(self):
    # Define the SQL command to create the table
    create_table_query = """
    CREATE TABLE IF NOT EXISTS my_table (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        url VARCHAR(255),
        uploadDate TIMESTAMP,
        region JSONB
    );
    """

    # Execute the SQL command
    self.execute_query(create_table_query)
    
    self.reMakeArchive()
    

  def videosOnFile(self):
    # Define the SQL query to get the most recent uploadDate
    query = """
            (SELECT uploadDate, url 
            FROM my_table 
            WHERE uploadDate = (SELECT MAX(uploadDate) FROM my_table) ORDER BY id DESC LIMIT 1)
            UNION
            (SELECT uploadDate, url 
            FROM my_table 
            WHERE uploadDate = (SELECT MIN(uploadDate) FROM my_table) ORDER BY id DESC LIMIT 1);
          """
    return self.execute_query(query)

  def getUrlById(self, id):
    query = "SELECT url FROM my_table WHERE id = %s;"
    print("ubfa: " + str(id))
    cursor = self._conn.cursor()
    cursor.execute(query, (id,))
    result = cursor.fetchone()
    url = url = result[0]
    cursor.close
    return url

  def insertListOfVideoLinks(self, listOfLinks):
    try:
      cursor = self._conn.cursor()
      # Define the SQL query to insert the new row
      insert_query = """
          INSERT INTO my_table (title, url)
          VALUES (%s, %s)
      """
      #print("pre date:: " + str(listOfLinks))
      # Execute the SQL query with the data
      for row_data in listOfLinks:

        
        title = row_data['title']
        url = row_data['url']
        #upload_date = row_data['uploadDate']
        #region = row_data['region'] # ideally we would have regional 'accents' 

        # Execute the SQL query with the data
        cursor.execute(insert_query, (title, url))


        #cursor.execute(insert_query, (row_data,))
        #print("added link: " + row_data['title'])
      self._conn.commit()
      cursor.close
    except Exception as e:
      print("error adding link: "+ str(e))
    
  

  def adapt_dict(dict_var):
    return AsIs("'" + json.dumps(dict_var) + "'")

  register_adapter(dict, adapt_dict)
  
  def getASLDictoinary(self, amount="all", offset=0, word=''):
    base_query = "SELECT id, title FROM my_table"
    cursor = self._conn.cursor()
    if (amount != "all"):
      # Construct the SQL query with offset and amount
      base_query += f" OFFSET {offset} LIMIT {amount}"

    if (word !=""):
      
      base_query += f" WHERE similarity(title, %s) > 0.3"  # idk how similar the word should be (cuz we have so many, 0.3 shuold be fine)

      cursor.execute(base_query, (word,))
      return cursor.fetchall()
    return self.execute_query(base_query)
    
  
  def reMakeArchive(self):
    try:
      # Check if the database has data
      result = self.execute_query("SELECT url FROM my_table")
      
      urls_in_db = result

      # Check if the file exists
      
      script_directory = os.path.dirname(os.path.abspath(__file__))
      file_path = os.path.join(script_directory, 'data', 'archive.txt')
      
      file_exists = os.path.exists(file_path)

      # If the database has data and the file does not exist, perform action X
      if urls_in_db > 0 and not file_exists:
        # Perform action X
        print("remaking archive data")
        
        # Write the data to the file
        with open(file_path, 'w') as file:
          for url in urls_in_db:
            file.write('youtube ' + url + '\n')
    except Exception as e:
      print("error reMaking Archive: "+ str(e))
