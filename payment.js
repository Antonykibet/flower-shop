const axios = require('axios');

function generateTimestamp(){
    const date = new Date();
    const timestamp = date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);
    return timestamp;
  }

 async function accessToken(){ 
    const secret = process.env.MPESA_CONSUMER_SECRET
    const key = process.env.MPESA_CONSUMER_KEY

    const auth = new Buffer.from(`${key}:${secret}`).toString('base64')
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    const headers = {
        'Authorization': "Basic" + " " + auth,
        'Content-Type': 'application/json'
      };

    const response = await axios.get(url, { headers });
    return response.data.access_token
}
async function processMpesa(phone){
    phone=phone.slice(1)
    const accessTkn = await accessToken()
    const shortCode = process.env.SHORTCODE
    const timestamp = generateTimestamp()
    const passKey = process.env.PASS_KEY
    const pass = new Buffer.from(shortCode + passKey + timestamp).toString('base64')
    let url = `https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`
    const headers = {
        'Authorization': `Bearer ${accessTkn}`,
        'Content-Type': 'application/json'
      };
      const body = {    
        "BusinessShortCode": `${shortCode}`,    
        "Password": `${pass}` ,    
        "Timestamp":timestamp,    
        "TransactionType": "CustomerPayBillOnline",    
        "Amount": 1,    
        "PartyA":phone,    
        "PartyB":`${shortCode}`,    
        "PhoneNumber":phone,    
        "CallBackURL": "https://eighty-lizards-learn.tunnelapp.dev/paycallback",    
        "AccountReference":254769819306,    
        "TransactionDesc":"Test"
     }
    let response = await axios.post(url,body,{headers})
    //console.log(response)
}

module.exports = processMpesa