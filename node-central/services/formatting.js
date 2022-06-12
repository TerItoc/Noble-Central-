function term(str, char) {
  var xStr = str.substring(0, str.length - 1);
  return xStr + char;
}

module.exports = {
  term:term,
}
