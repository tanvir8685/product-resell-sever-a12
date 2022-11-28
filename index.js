const express = require('express');

const app = express();

const port = process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.send('its working')
})
app.listen(port,()=>{
    console.log('its working on',port)
})