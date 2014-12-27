var os = require('os');
var fs = require('fs');
var http = require('http');
var bl = require('bl');
var iconv = require('iconv-lite');

var phoneNumberList = [];
var addressList = [];
var lengthOfPhoneNumberList = 0;
var lengthOfPerOtherInfoCsvLine = 0;



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
        if (info.otherInfo.length > lengthOfPerOtherInfoCsvLine) {
          lengthOfPerOtherInfoCsvLine = info.otherInfo.length;
        }
        while (info.otherInfo.length < lengthOfPerOtherInfoCsvLine) {
          info.otherInfo.push("");
        }
        addressList.push(info.otherInfo.concat([
          info.phoneNumber,
          data.province,
          data.cityname,
          data.isp
        ]).join(', '));
        if (lengthOfPhoneNumberList === addressList.length) {
          //print addressList.
          console.log("Done");
          fs.writeFile('./answer.csv', addressList.join(os.EOL));
        }
      } catch(e) {
        console.error(e);
      }
    }));
  });

};
module.exports = function(list) {
  phoneNumberList = list;
  lengthOfPhoneNumberList = phoneNumberList.length;
  for (var i in phoneNumberList) {
    getAddress(phoneNumberList[i]);
  }
};
