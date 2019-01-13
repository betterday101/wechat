const express=require('express');
//引入sha1加密模块
const sha1 = require('sha1');
const app=express();

/*
  - 填写服务器的配置
    URL 服务器的地址
      通过ngrok去将本地端口号对应的服务器映射为外网跨域访问的网址，如：ngrok http 3000
    Token 参与微信签名的字段
  - 验证服务器的有效性
    1. 首先将参数签名加密的三个参数timestamp、nonce、token按照字典序进行排序
    2. 将排序后的参数拼接成一个字符串，进行sha1加密
    3. 将加密后的字符串与signature进行对比
      如果匹配，说明验证成功的，返回echostr给微信服务器
      如果不匹配，说明验证失败的，返回''给微信服务器
 */

// {
//     signature: 'e88915e559864ddee3231926aa5d5c9c29c09921',  微信签名
//     echostr: '1291245433883713343',    微信后台生成的随机字符串
//     timestamp: '1547374093',           时间戳
//     nonce: '1480827394'                微信后台生成的随机数字
// }
const config={
    appID:'wx836629f17b9b6327',
    appsecret:'103875f9d4447adcb1aae0b7573e7ea1',
    token:'mywxgzh20190110'
}

app.use((req,res,next)=>{
    console.log(req.query);
    const {signature,echostr,timestamp,nonce}=req.query;
    const {token} = config;
    // 1. 首先将参数签名加密的三个参数timestamp、nonce、token按照字典序进行排序
    // 2. 将排序后的参数拼接成一个字符串，进行sha1加密
    const sortStr=[timestamp,nonce,token].sort();
    const sha1Str=sha1(sortStr.join(''));
    // 3. 将加密后的字符串与signature进行对比
    if(sha1Str===signature){
        // 如果匹配，说明验证成功的，返回echostr给微信服务器
        res.send(echostr);
    }else{
        // 如果不匹配，说明验证失败的，返回''给微信服务器
        res.send("");
    }

});

app.listen(3000,err=>{
if(!err) console.log("服务器启动了");
else console.log(err)
});