const axios = require('axios');
let unirest = require('unirest');

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
    let req = unirest('GET', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
    .headers({ 'Authorization': 'Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==' })
    .send()
  .end(res => {
    if (res.error) throw new Error(res.error);
    console.log(res.raw_body);
  });
}















async function processMpesa(phone){
    //phone=phone.slice(1)
    let req = unirest('GET', 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
.headers({ 'Authorization': 'Basic cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==' })
.send()
.end(res => {
	if (res.error) throw new Error(res.error);
	console.log(res.raw_body);
});
    const accessTkn = 'T27wM2vUwSI1CMksPMRPHfD0mhO3'
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
        "CallBackURL": "https://n3vj0vz2-5500.uks1.devtunnels.ms/paycallback",    
        "AccountReference":254769819306,    
        "TransactionDesc":"Test"
     }
    let response = await axios.post(url,body,{headers})
    //console.log(response)
}

module.exports = processMpesa