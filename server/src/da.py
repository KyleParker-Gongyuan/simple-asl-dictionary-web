import subprocess
import os




def check_url_existence(cur, url):
  cur.execute("SELECT COUNT(*) FROM videos WHERE url = %s", (url,))
  return cur.fetchone()[0] > 0



def download_info(url, archive_file,  end_index, start_index=1,):
  """_summary_

  Args:
      url (_type_): for some reason using "yt.com/channel/vidoes" works better (wont get yt shorts) then "yt.com/channel"
      archive_file (_type_): _description_
      end_index (_type_): _description_
      start_index (_type_): _description_
  """
  
  command = [
      'yt-dlp',
      '--force-write-archive',
      '-s',
      '--download-archive', archive_file,
      '--get-title',
      '--get-id',
      '--playlist-items', f'{start_index}-{end_index}',
      '--force-write-archive',
      '--skip-download',
      url
  ]
  
  

  try:
    # Execute the command
    result = subprocess.run(command, capture_output=True, text=True, check=True)
    
    # Check if the archive file has been updated
    if os.path.exists(archive_file):
      print(f"Archive file '{archive_file}' updated successfully.")
    else:
      print(f"Archive file '{archive_file}' not found. It might not have been updated.")
    
    lines = result.stdout.splitlines()
    
    data = []

    for title, url in zip(lines[::2], lines[1::2]):
      
      data.append({'title': title, 'url': url})
      print(f'Title: {title}, URL: {url}')  # Print title and URL
      
    return data
    
  except subprocess.CalledProcessError as e:
    print("Error executing command:", e)
  except Exception as e:
    print("An unexpected error occurred:", e)



# Call the function with the number of videos you want
def count_lines_in_file(file_path):
  try:
    with open(file_path, 'r') as file:
      line_count = sum(1 for line in file)
    return line_count
  except FileNotFoundError:
    print(f"File '{file_path}' not found.")
    return 0
