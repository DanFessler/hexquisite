// Tile Data
var regex = /&nbsp;/gi;
var canvas = JSON.parse(
  document.getElementById("HexquisiteData").innerHTML.replace(regex, " ")
);

// Element References
var canvasDiv = document.getElementById("HexquisiteCanvas");
var canvasImage = document.getElementById("HexquisiteImage");
var tilePrototype = document.getElementById("TilePrototype");

// Countdown Div
var countdownDiv = document.createElement("div");
countdownDiv.style.position = "absolute";
countdownDiv.style.top = "0px";
countdownDiv.id = "HexCountdown";
canvasDiv.appendChild(countdownDiv);

// Canvas image
canvasImage.src = `https://${canvas.canvasImage}`;

// Starting values
var tileWidth = 88;
var tileHeight = 48;
var startx = 440;
var starty = 0;
var tilex = startx;
var tiley = starty;
var rowWidth = 6;
var rowTileCount = 0;
var completedTiles = 0;

if (canvas.revealDate) {
  var revealDate = new Date(canvas.revealDate);
} else {
  var revealDate = new Date();
  revealDate = revealDate.getUTCDate();
}

// Place tiles
for (var i = 1; i != 92; i++) {
  // Clone the prototype tile
  var thisTile = tilePrototype.cloneNode(true);
  thisTile.id = "tile_" + i;

  // Get data for the tile
  if (canvas.tiles[thisTile.id]) {
    // Prepare tile with data
    switch (canvas.tiles[thisTile.id].status) {
      case "unavailable":
        thisTile.classList.add("unavailable");
        thisTile.children[0].innerHTML = "<br />T" + i;
        break;
      case "available":
        thisTile.classList.add("available");
        thisTile.children[0].innerHTML =
          "T" +
          i +
          "<br /><b>Unclaimed</b><br /><span class='timer'>" +
          canvas.timeLimit * 24 +
          "h 0m</span>";
        break;
      case "claimed":
        thisTile.classList.add("claimed");
        var dueDate = new Date(canvas.tiles[thisTile.id].timestamp);
        dueDate.setDate(dueDate.getDate() + canvas.timeLimit);
        var timeLeft = dueDate.getTime() - new Date().getTime();
        if (timeLeft > 0) {
          thisTile.children[0].innerHTML =
            "T" +
            i +
            "<br /><b>" +
            canvas.tiles[thisTile.id].owner +
            "</b><br /><span class='timer'>" +
            readableDate(timeLeft) +
            "</span>";
        } else {
          thisTile.children[0].innerHTML =
            "T" +
            i +
            "<br /><b>" +
            canvas.tiles[thisTile.id].owner +
            "</b><br /><span class='timer'>EXPIRED</span>";
        }
        break;
      case "complete":
        thisTile.classList.add("complete");
        thisTile.children[0].innerHTML =
          "T" +
          i +
          "<br /><b>" +
          canvas.tiles[thisTile.id].owner +
          "</b><br /><span class='timer'>DONE</span>";
        completedTiles++;
        break;
    }
  } else {
    // default to unavailable tile if data doesnt exist
    thisTile.classList.add("unavailable");
    thisTile.children[0].innerHTML = "<br />T" + i;
  }

  // Place tile into position
  thisTile.style.display = "block";
  thisTile.style.left = tilex + "px";
  thisTile.style.top = tiley + "px";
  canvasDiv.appendChild(thisTile);

  // Update placement positions for next tile
  tilex += tileWidth;
  tiley += tileHeight;
  rowTileCount += 1;
  if (rowWidth - 1 < rowTileCount) {
    rowTileCount = 0;
    if (i < 51) {
      startx -= tileWidth;
      starty += tileHeight;
      rowWidth += 1;
    } else {
      rowWidth -= 1;
      starty += tileHeight * 2;
    }
    tilex = startx;
    tiley = starty;
  }
}

// Display countdown if all tiles are completed
if (completedTiles == 91) clocktick = window.setInterval(liveCountdown, 500);

function liveCountdown() {
  var timeLeft = revealDate.getTime() - new Date().getTime();
  if (timeLeft >= 0)
    countdownDiv.innerHTML =
      "Reveal Countdown:<br/><h1 style='padding-top:4px'>" +
      readableCountdown(timeLeft) +
      "</h1>";
  else reveal();
}

function reveal() {
  clearInterval(clocktick);
  canvasDiv.style.backgroundImage = "url('http://" + canvas.canvasReveal + "')";
  canvasDiv.onclick = function() {
    window.open("http://" + canvas.canvasReveal);
  };
  canvasDiv.classList.add("hexcomplete");
  countdownDiv.innerHTML = "";
}

// Return human readable date from milliseconds
function readableDate(ms) {
  var x;
  x = ms / 1000;
  var seconds = x % 60;
  x /= 60;
  var minutes = x % 60;
  x /= 60;
  var hours = x; // % 24;
  x /= 24;
  var days = x;

  days = Math.floor(days);
  hours = Math.floor(hours);
  minutes = Math.floor(minutes);

  return hours + "h " + minutes + "m";
}

// Return human readable countdown from milliseconds
function readableCountdown(ms) {
  var x;
  x = ms / 1000;
  var seconds = x % 60;
  x /= 60;
  var minutes = x % 60;
  x /= 60;
  var hours = x % 24;
  x /= 24;
  var days = x;

  days = Math.floor(days);
  hours = Math.floor(hours);
  minutes = Math.floor(minutes);
  seconds = Math.floor(seconds);

  minutes = ("0" + minutes).slice(-2);
  seconds = ("0" + seconds).slice(-2);

  return days + ":" + hours + ":" + minutes + ":" + seconds;
}
