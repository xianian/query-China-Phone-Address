#批量查询中国手机号归属地

用法：

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