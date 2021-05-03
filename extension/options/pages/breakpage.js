var countDownDate = new Date("May 6, 2021 11:30:00").getTime();
var x = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById("timer").innerHTML =
    hours + " : " + minutes + " : " + seconds;

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "Break Over!";
  }
}, 1000);
