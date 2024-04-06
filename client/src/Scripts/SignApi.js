import axios from 'axios';

export async function fuzzyAWord(){

}



export async function getSignsList(pageoffset, amount, search4word) {
  try {
    const response = await axios.post('/api/signDictionary', {
      headers: {'Content-Type': 'application/json', 'charset': 'utf-8'}

      ,params: {
        page: pageoffset,
        amount: amount,
        word: search4word
      }
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Had a problem getting signs:', error);
    throw error;
  }
}


export async function getSignVid(id){
  
  const postData = {
    title: 'example_title',
    id: id
  };

  try{
    console.log("we sent: " + id); // Handle the API response data
    const response = await axios.post('/api/signWord', postData,{ responseType: 'blob' })
    
    //console.log(response.data); // Handle the API response data
    const videoz = response.data;
    const video =URL.createObjectURL(videoz);
    return video; //! this feels fucking stupid
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