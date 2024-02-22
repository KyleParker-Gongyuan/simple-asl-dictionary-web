import axios from 'axios';


export async function getSignsList(offset, ammount){
  var params={
    offset: offset,
    ammount: ammount
  }
  try{
    const response = await axios.get('/api/signDictionary',params)

      
      return response.data;
    
  }catch(error){
    console.error('had a problem getting signs:', error);
    throw error
  }
}


export async function getSignVid(id){
  
  const postData = {
    title: 'example_title',
    id: id
  };

  try{
    const response = await axios.post('/api/signWord', postData)
    
    console.log(response.data); // Handle the API response data
    return response.data;
  } catch(error){
    console.error('problem getting single sign:', error);
    throw error
  }

}



export async function randomword(wordlength){
  try {
    const jsonData = {
      wordLength: wordlength,
      wordList: "eng",
      wantSvg: false
    };

    const response = await axios.post('/api/randomword', jsonData);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting form:', error);
  }
}


export async function alphabet(){
  try {
    

    const response = await axios.get('/api/alphabet');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting form:', error);
  }
}