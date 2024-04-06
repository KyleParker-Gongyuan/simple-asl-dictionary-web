
# we can sell this api for a bit idk how much but we should make a little bit of money I would hoem

from flask import Flask, request, jsonify, send_file


#! WE NEED FFMPEG
import io
import os
from dotenv import load_dotenv
from yt_dlp import YoutubeDL
from contextlib import redirect_stdout
import datetime

from db import Database
#from internetarchive import search_items, get_item

from da import download_info, count_lines_in_file

from wordGenerator import random_sign_word, alphabet

#! lets see if we can get (intersignuniversity.com) to join our mission
#? we want to use 1 of the 2 not sure which

#! we could download a video from a key which would be the name in the dictionary

class SignLanguageAPI:
  def __init__(self):
    self.app = Flask(__name__)
    self.db = Database()
    self.last_data_check = datetime.datetime.now()
    load_dotenv()

    
    script_directory = os.path.dirname(os.path.abspath(__file__))
    self.videoArchiveFile = os.path.join(script_directory, 'data', 'archive.txt')


    

    # env vars
    self.updateSignLangDbAfterXDays = int(os.getenv("AFTER_X_DAYS_UPDATE"))#ideally we'll have multiple sign languages in the future
    self.batch_size = int(os.getenv("BATCH_SIZE"))
    self.initBatch_size = int(os.getenv("INIT_BATCH_SIZE"))
    #if self.app.debug:
    #  self.asl_channel = os.getenv("TESTING_CHANNEL")# Example channel URL
    #self.asl_channel = os.getenv("TESTING_CHANNEL")# Example channel URL
      
    
    self.asl_channel = os.getenv("ASL_YT_CHANNEL")
    
    
    videos_dict = self.update_channel_video_list(self.asl_channel, self.initBatch_size)
    videos_dict = download_info(self.asl_channel, self.videoArchiveFile, count_lines_in_file(self.videoArchiveFile)+self.initBatch_size)

    self.db.insertListOfVideoLinks(videos_dict)
    print("init data: " + str(self.db.getASLDictoinary()))


    #!query our database for list of words, if last check was over (X) days ago then we query YT for a list of videos names for the database
    # and make sure we have the newest list of vids

    @self.app.route("/api/signDictionary,methods=['POST']")
    def list_of_words():
      print("Sending Word List")
      self.check_last_time_updated()

      data= request.get_json()
      #I feel like I've done somthing wrong FWI
      amount = int(request.args.get('amount', 50))
      page= int(request.args.get('amount', 1))
      word = str(request.args.get('word', ''))

      asl_list = self.db.getASLDictoinary(amount=amount, page=page, word=word)
      

      aslWords = [{'id': row[0], 'title': row[1]} for row in asl_list]
      
      return jsonify(aslWords)

    @self.app.route("/api/signWord", methods=["POST"])
    def sign_word():
      """
        Get A word in ASL

        Returns:
          video: example.mp4
      """
      data = request.get_json()
      uuid = data.get('id')
      print("AAAAAHHHHHHH")
      url = self.db.getUrlById(uuid)
      print("Av:" + str(url))
      

      video_file = self.download_video(url)
      try:
        vid_data = io.BytesIO(video_file)
        
        response = send_file(
          vid_data,
          mimetype='video/mp4',
          #as_attachment=True,
          #attachment_filename='video.mp4'
        )
        return response
      except Exception as e:
        print("PROBLEM!!!!: " +str(e))
        raise
    
    @self.app.route("/api/randomword", methods=["POST"])
    def randomword():
      data = request.get_json()
      wordleng = data.get('wordLength')
      wordlist = data.get('wordList')
      wantSvg = data.get('wantSvg')


      try:

        vid_data = random_sign_word(wordleng, wordlist, wantSvg)
        print(jsonify(vid_data[0], vid_data[1]))
        return jsonify(vid_data[0], vid_data[1])
        """
        response = send_file(
          vid_data,
          mimetype='video/mp4',
          #as_attachment=True,
          #attachment_filename='video.mp4'
        )
        """
        #return response
      except Exception as e:
        print("PROBLEM!!!!")

    @self.app.route("/api/alphabet")
    def abc():
      return jsonify(alphabet())



    if __name__ == "__main__":
      #self.app.run(host='0.0.0.0', port=5000)
      self.app.run(host='0.0.0.0')

  def check_last_time_updated(self):
    """
      Check if (X) days have passed since the initial time. and then update our list of videos
    """
    # Check if (X) days have passed
    current_time = datetime.datetime.now()
    timeSenseLastUpdate = current_time - self.last_data_check
    if ((timeSenseLastUpdate.days >= self.updateSignLangDbAfterXDays)): # might be that time is a list but int well aint
      
      #videos_dict = self.update_channel_video_list(self.asl_channel, self.batch_size)#! the smart thing would be to get all videos after X date, but we aint smart
      videos_dict = download_info(self.asl_channel, self.videoArchiveFile, count_lines_in_file(self.videoArchiveFile)+self.batch_size)

      #we want to put it into a csv
      
      self.db.insertListOfVideoLinks(videos_dict)



  #! we want to do stuff like openASL but ya know... actually (posiablly) make money


  #we get the data from the diciotnary/database (should it be in memory or on database?) (which is cheaper? a cached in ram or storage?)
  #we get {title: "hello", key: 123} and the video with that key and we send it over

  #send that video to our user
  #?return "video of the word being signed" #this returns a video
  def update_channel_video_list(self, channel_url, batch_size):
    """
      Get all video titles from a YouTube channel.

      Parameters:
        channel_url (str): The URL of the YouTube channel.

      Returns:
        dict: A dictionary containing video titles and their corresponding video URLs.
    """
    print("started updating list of channel vids")
    
    dbVideosOnFiles = self.db.videosOnFile()
    # -1 day to make sure that if they posted a new vid a 3pm and we downloaded at 1pm we get all the vids
    

    oururlz=[]
    if dbVideosOnFiles:
      print("shit we got: " + str(dbVideosOnFiles))
      
      # Format the datetime object as a string

      #? if a video was uploaded on the day we did our video crawel then we want to make sure we have that video
      

      
      oururlz = [dbVideosOnFiles[0][1],dbVideosOnFiles[1][1]]

    num_videos_per_chunk = 10  # Number of videos to download per chunk
    num_chunks = 3  
    ydl_opts = {
    'quiet': True,
    'skip_download': True, #! it downloads the file then reads the date on the file
    'extract_flat': True,
    'playlist_end': num_videos_per_chunk * (num_chunks + 1),
    'playlist_items': f'1-{num_videos_per_chunk * (num_chunks + 1)}',
      #'dateafter': dateAfter_format, #! (if outside date delete)
      
    }
    #'parse-metadata'
    
    videos = []

    #!def ytshit(ydl_opts,channel_url):
    try:
      with YoutubeDL(ydl_opts) as ydl:
        channel_info = ydl.extract_info(channel_url, download=False)
        
        unparsedVideos = []
        #regioninfo = {"country": "USA", "region": "East Coast", "State": "Georgia"} if (channel_info.get('uploader') == os.getenv("ASL_YT_CHANNEL_NAME")) else {}
        #! we need a better way of doing the region info
        def adad(knownUrls, channel_vids, isInit=True):
          # If knownUrls is empty and it's the first call, get all new URLs
          print("do we have uurlz: " + str(knownUrls))
          if not knownUrls and isInit:
            for vido in channel_vids['entries']:
              varzi = 0
              #! the bigest problem is I dont have a good way of doing this.. 
              #? ie how do I know which video to download
              print(varzi)
              #if varzi == 10:
              #  print("uzaBITCH")
              #  break
              
              print("adadKK: "+ str(vido))

              if z['id'] != z['channel_id']:
                unparsedVideos.append(z['id'])
              varzi + 1
            

          # If knownUrls contains URLs
          for vido in channel_vids:
            if vido['id'] == knownUrls[0]:
              lastVid = knownUrls.copy()
              lastVid.pop()
              channel_vids.reverse()
              adad(lastVid, channel_vids, isFirstCall=False)
              break

            if vido['id'] != vido['channel_id']:
              unparsedVideos.append(vido['id'])

        
        
        """
        
        def adad(knownUrls, usersVids):
          for vido in usersVids:
            if knownUrls:
              
              if(vido['id'] == knownUrls[0]):
                
                print("we outK: " + str(knownUrls))
                lastVid = knownUrls.copy()
                lastVid.pop()
                print("we outW: " + str(knownUrls))
                print("we out: " + vido['id'])
                print("we outV: " + str(oururlz))
                usersVids.reverse()
                
                
                adad(lastVid, usersVids)
                break
              
            
            #if i >= batch_size:
            #  return unparsedVideos
            

            if (vido['id'] != vido['channel_id']):
              unparsedVideos.append(
                
                vido['id'],
  
              )
            
        """
        
        # adad(oururlz,channel_info['entries'])
        with YoutubeDL(ydl_opts) as ydl:
          result = ydl.extract_info(channel_url, download=False)
          for entry in result['entries']:
            video_id = entry['id']
            
            print(f"Downloading video: {entry['title']} ({video_id})")
            ydl_opts['skip_download'] = False
            print(entry['id'])
            
        
    except Exception as e:
      print("Error adding list of videos from channel: ", e)
    try:
      
      vidz = []
      if unparsedVideos:
        print("holly shit we have: " + str(len(unparsedVideos)) + " links")
        vidz = ['https://www.youtube.com/watch?v=' + video for video in unparsedVideos]

      with YoutubeDL(ydl_opts) as ydl:
        
        def ytDatedLinkDownloader(knownVidz, vidss):
          for url in vidss:
            
            if knownVidz:
              if(videoData['id'] == knownVidz[0]):
                
                
                dizNum = knownVidz.copy()
                dizNum.pop()
                vidss.reverse()
                ytDatedLinkDownloader(dizNum, vidss)
                break
              
            videoData = ydl.extract_info(url, download=False)
            
            
            
            videos.append({
              'title': videoData['title'],
              'url': videoData['id'],
              'uploadDate': videoData['upload_date'],
              #'region': regioninfo,
            })
          
        print("WE GOT DIZ MANY VIDZ  "+ str(vidz))
        ytDatedLinkDownloader(oururlz,vidz)
      

      print("cur data: "+str(videos))
    except Exception as e:
      print("Error getting video metaData: ", e)
      
    return videos


  
  
  """
  def get_videos_from_archive(collection, date_after, batch_size):
    try:
        videos = []
        for result in search_items('collection:' + collection, rows=batch_size):
          item = get_item(result['identifier'])
          if 'date' in item.metadata:
            upload_date = datetime.strptime(item.metadata['date'], '%Y-%m-%dT%H:%M:%SZ')
            if upload_date > date_after:
              videos.append({
                'id': item.identifier,
                'title': item.metadata['title'],
                'url': 'https://archive.org/details/' + item.identifier,
                'datetime': upload_date,
              })
        print("Found", len(videos), "videos")
        return videos
    except Exception as e:
      print("Error updating list of videos:", e)

  """

  def download_video(self, url):
    """
      Download a video from YouTube.
      
      Parameters:
        url (str): The URL of the YouTube video.
    """
    try:
      print(url)
      ydl_opts = {
        #'ffmpeg_location': ffmpeg_path,
        #'outtmpl': 'video.mp4',  # Output file name #! this could be a uuid?
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',  # Choose best quality MP4 format
      }
      opts = {
        "outtmpl": "-",
        'logtostderr': True
      }
      buffer = io.BytesIO()# this will probably be slower but we shouldnt have to delete a .mp4 after soooo
      with redirect_stdout(buffer), YoutubeDL(opts) as foo:
        foo.download(f'https://www.youtube.com/watch?v={url}')
      memoryVideo = buffer.getvalue()

      # write out the buffer the turn into a real file later
      #!Path(f"{youtube_id}.mp4").write_bytes(buffer.getvalue())
      
      memoryVideo = buffer.getvalue()
      if memoryVideo is None:
        return "Error: Failed to download video."
      print("Video downloaded successfully!")
      return memoryVideo
    except Exception as e:
      # we want to do a check if we are being blocked from downloading a video OR if the video doesnt exist
      print("Error downloading video: ", e)
  
  def stream_video(self, url): #when would we need to stream Sign language?
    """
      Stream a video using.
      
      Parameters:
        url (str): The URL of the video to be streamed.
    """
    
    try:
      return "Why tf would we need this"
    except Exception as e:
      print("Error streaming video:", e)


#! THIS FEEELZ WRONG!!! HELLP I DONT THINK THIS IS RIGHT
api = SignLanguageAPI()
api.start()
