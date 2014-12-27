#批量查询中国手机号归属地

批量在线查询中国手机号归属地，并导出成csv文件。

使用的[腾讯拍拍的API](http://virtual.paipai.com/extinfo/GetMobileProductInfo?mobile=18880888808&amount=10000&callname=getPhoneNumInfoExtCallback')

##安装：

```
~# [sudo] npm install query_china_phone_address -g
```

##用法：

```
querychinaphoneaddress 13333333333 18888888888
```

或

```
querychinaphoneaddress ./query.csv
```
csv格式类似于：

```
"realName","nickName","mobilePhone"
"任猛","hehehe",15222222222
"赵哥","hahaha",18888888888
"史庆","lalala",13000000000
```
查询结果会保存于当前目录的`answer.csv`中。