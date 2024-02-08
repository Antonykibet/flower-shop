const moment = require("moment");
const axios =require('axios')
require('dotenv').config()

async function generateToken(){
  let headers = new Headers();
  headers.append("Authorization", "Basic Sk04bkJXYXFuUEU4OE5wak5JOFhKUjIzdFE5NUptTGk6Zjd1TUdZYThuVUNudEx1bw==");
  let response= await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", { headers })
  let {access_token} = await response.json()
  return access_token
}


async function processMpesa(res,amount,phoneNumber){
  const url ="https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
const auth = `Bearer ${await generateToken()}`;
const timestamp = moment().format("YYYYMMDDHHmmss");
const password = new Buffer.from(
  process.env.SHORTCODE +
  "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
  timestamp
).toString("base64");

axios.post(url,{
      BusinessShortCode: process.env.SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: "https://n3vj0vz2-5500.uks1.devtunnels.ms/paybillCallback",
      AccountReference: 'calYX34',
      TransactionDesc: "Mpesa Daraja API stk push test",
    },
    {
      headers: {
        Authorization: auth,
      },
    }
  )
  .then((response) => {
    // res.send("😀 Request is successful done ✔✔. Please enter mpesa pin to complete the transaction");
    //SEND BACK A JSON RESPONSE TO THE CLIENT
    console.log(response.data);
    res.status(200).json({
      msg: "Request is successful done ✔✔. Please enter mpesa pin to complete the transaction",
      status: true,
    });

  })
  .catch((error) => {
    console.log(error);
    //res.status(500).send("❌ Request failed");
    console.log(error);
    res.status(500).json({
      msg: "Request failed",
      status: false,
    });
  });
}

module.exports = processMpesa