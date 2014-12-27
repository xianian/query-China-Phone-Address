var os = require('os');
var fs = require('fs');
var http = require('http');
var bl = require('bl');
var iconv = require('iconv-lite');

var phoneNumberList = [];
var addressList = [];
var lengthOfPhoneNumberList;

var createPhoneNumberList = function(path) {
  var buffer = fs.readFileSync(path);
  var numbers = buffer.toString().split('\n');
  for (var i in numbers) {
    numbers[i] = {
      phoneNumber: numbers[i].split(',')[1],
      name: numbers[i].split(',')[0],
    };
  }
  lengthOfPhoneNumberList = numbers.length;
  return numbers;
};

var getAddress = function(info) {
  if (!info.phoneNumber) {
    lengthOfPhoneNumberList -= 1;
    return;
  }
  if (info.phoneNumber.length !== 11) {
    lengthOfPhoneNumberList -= 1;
    return;
  }

  //var requireUrl = 'http://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=' + info.phoneNumber;
  var requireUrl = 'http://virtual.paipai.com/extinfo/GetMobileProductInfo?mobile='+info.phoneNumber+'&amount=10000&callname=getPhoneNumInfoExtCallback';
  http.get(requireUrl, function (response){
    response.pipe(bl(function (err, data) {
      data = iconv.decode(data,'GBK');
      if (err){
        return getAddress(info);
      }
      try {
        data = "{"+data.toString().split('{')[1].split('}')[0]+"}";
        //data = JSON.parse(data);
        data = eval("("+data+")");
        console.log(info.phoneNumber+", "+(addressList.length*100/lengthOfPhoneNumberList)+"%");
        addressList.push(info.name+", "+info.phoneNumber+", "+data.province+", "+data.cityname+", "+data.isp);
        if (lengthOfPhoneNumberList === addressList.length) {
          //print addressList.
          fs.writeFile('./answer.csv', addressList.join(os.EOL));
        }
      } catch(e) {
        console.error(e);
      }
    }));
  });

};

phoneNumberList = createPhoneNumberList('./query.csv');
for (var i in phoneNumberList) {
  getAddress(phoneNumberList[i]);
}

