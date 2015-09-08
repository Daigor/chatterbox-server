module.exports = function(msg1, msg2){
  var num1 = msg1.split('');
  num1.splice( msg1.length - 3, 3 );
  num1.splice( 0, 7 )
  num1 = num1.join('');
  var num2 = msg2.split('');
  num2.splice( msg2.length - 3, 3 );
  num2.splice( 0, 7 )
  num2 = num2.join('');
  console.log( num1, num2 );
  return +num1 - +num2;
};
