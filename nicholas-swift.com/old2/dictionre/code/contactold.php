<?php

$myInput = $_POST['field'];

if(myInput == "I am crazy!")
{
  echo "Wow that's lame;
}
if(myInput == "This is a sentence.")
{
  echo "Hmm, it apears to be.";
}
else
{
  $tmp = exec("python testscript.py .$myInput");
  echo $tmp;
}
  
?>