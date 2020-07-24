
//去掉字符串头尾空格   
function trim(str){
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

module.exports = { trim };
