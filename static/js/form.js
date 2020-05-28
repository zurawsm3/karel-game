// console.log(document.querySelector('#myform'))
document.querySelector('#myform').submit(function(event){
    // console.log("JJJJ");
  // prevent default browser behaviour
  event.preventDefault();
  console.log("FFFF")
});