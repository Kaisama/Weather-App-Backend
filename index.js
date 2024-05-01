const http=require('http');
const fs=require('fs');
const requests=require('requests');

const indexFile=fs.readFileSync('index.html','utf-8');

const replaceVal=(tempVAl,orgVal)=>{
  let temperature=tempVAl.replace("{%tempval%}",orgVal.main.temp);
  temperature=temperature.replace("{%tempmin%}",orgVal.main.temp_min);

   temperature=temperature.replace("{%tempmax%}",orgVal.main.temp_max);
   temperature=temperature.replace("{%location%}",orgVal.name);

  temperature=temperature.replace("{%country%}",orgVal.sys.country);
  return temperature;
}

const server=http.createServer((req,res)=>{
        if(req.url=='/'){
            requests("http://api.openweathermap.org/data/2.5/weather?q=Dehradun&units=metric&appid=372cefe1aeae3397687c127397dc0429")
            .on('data', function (chunk) {
                const objData=JSON.parse(chunk); 
                const arrData=[objData]
             // console.log(arrData)
             const realTimeData=arrData
             .map((val)=> replaceVal(indexFile,val)).join(" ")
            // console.log(realTimeData)
            res.write(realTimeData);
            })
            .on('end', function (err) {
              if (err) return console.log('connection closed due to errors', err);
             res.end();
              console.log('end');
            });
        }
})

server.listen(3000,"127.0.0.1",()=>{
  console.log("Port is working Fine")
});