import random
import os

# Get the directory of the current Python script
script_directory = os.path.dirname(os.path.abspath(__file__))

def random_sign_word(length, word_list, isSvg=False):
  """
  get a random word from list, then send it back as ASL video/images, you'll have to guess the word (for practicing finger spelling)

  Args:
    length (int): how long you want the word to be
    word_list (list): pick which list of words you want to choose from (makes it ez to have multiple languags)
    isSvg (bool): pick if we are using the svg image or jpg image

  Returns:
    List, Image-type: list of images(the word), the word
  """

  file = os.path.join(script_directory, 'data', 'thisdata', word_list +'.txt')
  with open(file, 'r') as file:
    # Read all lines from the file
    lines = file.readlines()

  # Strip newline characters from each line and store them in a list
  
  words = [line.strip() for line in lines]

  filtered_word = random.choice([word.strip() for word in words if len(word.strip()) == length])
  
  return (fingerspelling(filtered_word, isSvg), filtered_word)



def fingerspelling(word=str, isSvg=False):
  """_summary_

  Args:
    word (_type_, optional): _description_. Defaults to str.
    isSvg (bool, optional): _description_. Defaults to False.

  Returns:
    _type_: _description_
  """


  letters = word(list).upper() if isSvg else word(list).lower()
  
  
  # Construct the path to the target folder relative to the script directory
  target_folder = os.path.join(script_directory, 'data', 'thisdata', 'WPclipArt') if isSvg else os.path.join(script_directory, 'data', 'thisdata','LSQ-alphabet')

  signList = []
  
  filetype = ["Sign_language_",".svg",'image/svg+xml'] if isSvg else ["LSQ_", ".jpg",'image/jpeg']
  for letter in letters:
    file = filetype[0] + letter + filetype[1]
    # we get the word then we goto the file and get the corrisponding sign #! (how do we do double letters? black screen?)
    signList.insert(os.path.join(target_folder, file))

  #return (signList, filetype[2])
  return signList
#! OR we can use our database, idk tho

def alphabet():
  target_folder = os.path.join(script_directory, 'data', 'thisdata', 'WPclipArt')
  image_paths = []
  # Iterate through files in the folder
  for file_name in target_folder:
    # Check if the file is an image (you may need to adjust this condition)
    
    image_paths.append(os.path.join(target_folder, file_name))
  return image_paths