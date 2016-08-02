'use strict';

exports.shuffle = function(array){
  var m = array.length, t, i;
  while (m > 0) 
  {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};

exports.randomNumberBetween = function(l,r)
{
  if (l>r) 
    return r;

  r = Math.floor(r);
  l = Math.floor(l);
  var random = Math.floor((Math.random() * (r-l)) + l);
  //console.log("A random number between " + l + " and " + r +" is " + random+".");
  return random;
};

exports.cloneObject=function(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
 
  var temp = obj.constructor(); // give temp the original obj's constructor
  for (var key in obj) {
    temp[key] = exports.cloneObject(obj[key]);
  }
 
  return temp;
};

exports.generateName = function(length) {
  var name = "";
  for (var i = 0; i < length; i++)
  {
    if (i % 2 == 0)//We want a consonant
    {
      var index = 0;

      //If you found a vowel keep looking
      while (index == 0 || index == 4 || index == 8 || index == 14 || index == 20)
      {
        index = Math.floor(Math.random() * 26);  
      }

      //We found our consonant
      var next_letter = String.fromCharCode(97 + index);

      //Add the character
      name += next_letter;

      //If its a q add the u
      if (next_letter == 'q')
      {
        name += "u";
      }
    }
    else//We are looking for a vowel
    {
      var index = 1;

      //If you found a vowel keep looking
      while (index != 0 && index != 4 && index != 8 && index != 14 && index != 20)
      {
        index = Math.floor(Math.random() * 26);
      }

      var next_letter = String.fromCharCode(97 + index);

      //Add the character
      name += next_letter;
    }
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
};