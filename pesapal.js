const axios =require('axios')
require('dotenv').config()

function generateRandomNumb() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function generatePesaPalToken(){
    let uri  = 'https://pay.pesapal.com/v3/api/Auth/RequestToken'
    try {
        let response = await axios.post(uri,
            {
                "consumer_key": process.env.PESAPAL_CONSUMER_KEY ,
                "consumer_secret": process.env.PESAPAL_CONSUMER_SECRET
            },
            {
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                }
            })
        let {token} = response.data
        return token
    } catch (error) {
        console.log(error)
    }
}

async function makePesaPalPayment(){
    let token = await generatePesaPalToken()
    let uri = 'https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest'
    let response = await axios.post(uri,
        {
            "id": `Calyx-${generateRandomNumb()}`,
            "currency": "KES",
            "amount": 100.00,
            "description": "Payment description goes here",
            "callback_url": "https://www.calyxflowerske.com/pesapalCall",
            "notification_id": process.env.IPN_ID,
            "billing_address": {
                "email_address": "john.doe@example.com",
                "phone_number": "0769819306",
            }
        },
        {
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': token,
            }
        })

        let {redirect_url} = response.data
        return redirect_url
}
module.exports = makePesaPalPayment
