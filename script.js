"use strict";
window.addEventListener("DOMContentLoaded", start);


function start() {
  console.log("Javascript is running :)");

  createTiles();
  createItems();
  displayTiles();
  checkKeyDown();
  requestAnimationFrame(tick);
}
const player = {
  x: 0,
  y: 0,
  regX: 14,
  regY: 16,
  speed: 120,
  moving: false,
  direction: undefined,
  hitbox: {
    x: 4,
    y: 6,
    width: 25,
    height: 30,
  },
};

const controls = {
  left: false,
  right: false,
  up: false,
  down: false,
};

let debug = true;

const TILE_SIZE = 32;

const tiles = [
  [1, 0, 4, 0, 4, 0, 0, 9, 9, 9, 9, 9, 1, 0, 0, 0],
  [1, 4, 0, 3, 0, 3, 9, 9, 9, 9, 0, 0, 1, 0, 4, 4],
  [1, 0, 4, 0, 4, 0, 9, 9, 9, 0, 6, 0, 1, 0, 3, 0],
  [1, 0, 3, 0, 4, 0, 0, 0, 9, 0, 0, 0, 1, 4, 0, 3],
  [1, 0, 0, 0, 0, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 0, 9, 0, 0, 4, 4, 0, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 0, 9, 4, 4, 4, 4, 4, 3, 4],
  [1, 0, 0, 0, 0, 1, 0, 0, 9, 9, 9, 9, 9, 9, 9, 0],
  [1, 1, 1, 1, 1, 1, 0, 3, 9, 0, 0, 0, 0, 9, 9, 0],
  [9, 9, 9, 9, 9, 2, 9, 9, 9, 0, 0, 0, 0, 9, 9, 0],
  [0, 3, 4, 0, 4, 1, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9],
  [5, 5, 5, 5, 5, 1, 3, 0, 0, 0, 0, 0, 0, 9, 9, 9],
  [5, 7, 7, 7, 5, 1, 0, 3, 0, 0, 0, 0, 0, 9, 9, 9],
  [5, 7, 7, 7, 5, 1, 0, 3, 0, 0, 0, 3, 0, 9, 9, 9],
  [5, 7, 7, 7, 8, 1, 4, 0, 0, 0, 0, 0, 0, 9, 9, 9],
  [5, 5, 5, 5, 5, 1, 0, 0, 4, 4, 4, 3, 4, 9, 9, 9],
];


const itemsGrid = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const GRID_HEIGHT = tiles.length;
const GRID_WIDTH = tiles[0].length;

let lastTimestamp = 0;

function coordFromPos({ x, y }) {
  const row = Math.round(y / TILE_SIZE);
  const col = Math.round(x / TILE_SIZE);
  const coord = { row, col };
  return coord;
}

function posFromCoord({ row, col }) {}

function displayTiles() {
  const visualTiles = document.querySelectorAll("#background .tile");

  for (let row = 0; row <= tiles.length - 1; row++) {
    for (let col = 0; col <= tiles[row].length - 1; col++) {
      const modelTile = getTileAtCoord({ row, col });
      const visualTile = visualTiles[row * GRID_WIDTH + col];

      visualTile.classList.add(getClassForTiletype(modelTile));
    }
  }
}

function getClassForTiletype(tileType) {
  switch (tileType) {
    case 0:
      return "grass";
      break;
    case 1:
      return "path";
      break;
    case 2:
      return "plank";
      break;
    case 3:
      return "tree";
      break;
    case 4:
      return "flowers";
      break;
    case 5:
      return "wall";
    case 6:
      return "well";
    case 7:
      return "carpet";
      break;
    case 8:
      return "door";
      break;
    case 9:
      return "water";
      break;
  }
}

function createTiles() {
  const gamefield = document.querySelector("#gamefield");

  const background = document.querySelector("#background");

  // Scan rows & cols
  // Create div and add to background
  for (let row = 0; row <= tiles.length - 1; row++) {
    for (let col = 0; col <= tiles[row].length - 1; col++) {
      let newDiv = document.createElement("div");
      newDiv.classList.add("tile");
      background.appendChild(newDiv);
    }
  }
  gamefield.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
  gamefield.style.setProperty("--GRID_HEIGHT", GRID_HEIGHT);
  gamefield.style.setProperty("--TILE_SIZE", TILE_SIZE + "px");

}

function createItems() {
  const items = document.querySelector("#items");
  
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const modelItem = itemsGrid[row][col];
      if (modelItem === 1) {
        const item = document.createElement("div");
        item.classList.add("item");
        item.classList.add("gold");
        item.style.setProperty("--row", row);
        item.style.setProperty("--col", col);
        items.append(item);

      }
    }
  }
}

function checkKeyDown() {
  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight" || event.key === "d") {
      controls.right = true;
    }

    if (event.key === "ArrowUp" || event.key === "w") {
      controls.up = true;
    }

    if (event.key === "ArrowDown" || event.key === "s") {
      controls.down = true;
    }

    if (event.key === "ArrowLeft" || event.key === "a") {
      controls.left = true;
    }
  });

  document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowRight" || event.key === "d") {
      controls.right = false;
    }

    if (event.key === "ArrowUp" || event.key === "w") {
      controls.up = false;
    }

    if (event.key === "ArrowDown" || event.key === "s") {
      controls.down = false;
    }

    if (event.key === "ArrowLeft" || event.key === "a") {
      controls.left = false;
    }
  });
}



function displayPlayerAtPosition() {
  const visualPlayer = document.querySelector("#player");
  visualPlayer.style.translate = `${player.x}px ${player.y}px`;
}

function canMoveTo(pos) {
  const { row, col } = coordFromPos(pos);

  if (row < 0 || row >= GRID_HEIGHT || col < 0 || row >= GRID_WIDTH) {
    return false;
  } else {
    const tileType = getTileAtCoord({ row, col });
    switch (tileType) {
      case 0:
      case 1:
      case 2:
      case 4:
      case 7:
      case 8:
        return true;
      case 3:
      case 5:
      case 6:
      case 9:
        return false;
    }
  }
}
/*
    if (pos.x < 0 || pos.y < 0 || pos.x > 484 || pos.y > 465) {
      return false;
    } else {
      return true;
    }
    */

function movePlayer(deltaTime) {
  player.moving = false;

  const newPos = {
    x: player.x,
    y: player.y,
  };

  if (controls.right) {
    player.moving = true;
    player.direction = "right";
    newPos.x += player.speed * deltaTime;
  } else if (controls.left) {
    player.moving = true;
    player.direction = "left";
    newPos.x -= player.speed * deltaTime;
  }

  if (controls.down) {
    player.moving = true;
    player.direction = "down";
    newPos.y += player.speed * deltaTime;
  } else if (controls.up) {
    player.moving = true;
    player.direction = "up";
    newPos.y -= player.speed * deltaTime;
  }

  if (canMoveTo(newPos)) {
    player.x = newPos.x;
    player.y = newPos.y;
  }
}

function displayPlayerAnimation() {
  const visualPlayer = document.querySelector("#player");

  if (player.moving) {
    visualPlayer.classList.add("animate");
    visualPlayer.classList.remove("up", "down", "left", "right");
    visualPlayer.classList.add(player.direction);
  } else {
    visualPlayer.classList.remove("animate");
  }
}

function tick(timestamp) {
  requestAnimationFrame(tick);

  const deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  movePlayer(deltaTime);


  displayPlayerAtPosition();
  displayPlayerAnimation();

  if (debug) {
    showDebug();
  }
}


function getTileAtCoord({ row, col }) {
  return tiles[row][col];
}
// Debugging
function highlightTile({ row, col }) {
  const visualTiles = document.querySelectorAll("#background .tile");
  const visualTile = visualTiles[row * GRID_WIDTH + col];

  visualTile.classList.add("highlight");
}

function unHighlightTile({ row, col }) {
  const visualTiles = document.querySelectorAll("#background .tile");
  const visualTile = visualTiles[row * GRID_WIDTH + col];

  visualTile.classList.remove("highlight");
}

function toggleDebugMode() {
  if (debug) {
    const visualTiles = document.querySelectorAll("#background .tile");
    for (let row = 0; row <= tiles.length - 1; row++) {
      for (let col = 0; col <= tiles[row].length - 1; col++) {
        const visualTile = visualTiles[row * GRID_WIDTH + col];
        visualTile.classList.remove("highlight");
      }
    }

    const visualPlayer = document.querySelector("#player");
    visualPlayer.classList.remove("show-rect");
    visualPlayer.classList.remove("show-reg-point");
  }
  debug = !debug;
}

function showDebug() {
  showDebugTileOnPlayer();
  showDebugPlayerRect();
  showDebugPlayerRegistrationPoint();
  getTilesUnderPlayer(player);
  showHitbox();
}

function showHitbox() {
  const visualPlayer = document.querySelector("#player");
  visualPlayer.classList.add("show-hitbox");
}

function hideDebug() {
  hideDebugTileOnPlayer();
}

let lastPlayerCoord = coordFromPos(player);

function showDebugTileOnPlayer() {
  const coord = coordFromPos(player);

  if (coord.row !== lastPlayerCoord.row || coord.col !== lastPlayerCoord.col) {
    unHighlightTile(lastPlayerCoord);
    highlightTile(coord);
  }

  lastPlayerCoord = coord;
}

function hideDebugTileOnPlayer() {
  unHighlightTile(coordFromPos(player));
}

function showDebugPlayerRect() {
  const visualPlayer = document.querySelector("#player");
  if (!visualPlayer.classList.contains("show-rect")) {
    visualPlayer.classList.add("show-rect");
  }
}

function showDebugPlayerRegistrationPoint() {
  const visualPlayer = document.querySelector("#player");
  if (!visualPlayer.classList.contains("show-reg-point")) {
    visualPlayer.classList.add("show-reg-point");
  }

  visualPlayer.style.setProperty("--regX", player.regX + "px");
  visualPlayer.style.setProperty("--regY", player.regY + "px");
}

function getTilesUnderPlayer(player) {
  const visualPlayer = document.querySelector("#player");

  const tiles = [];
  const topLeft = {
    x: player.x - player.regX - player.hitbox.x,
    y: player.hitbox.y,
  };
  const topRight = {
    x: player.x - player.regX + player.hitbox.x,
    y: player.hitbox.y,
  };
  const bottomLeft = {
    x: player.x - player.regX + player.hitbox.x,
    y: player.hitbox.y - player.regY + player.hitbox.y,
  };
  const bottomRight = {
    x: player.x + player.regX + player.hitbox.x,
    y: player.hitbox.y - player.regY + player.hitbox.y,
  };

  visualPlayer.style.setProperty("--HITBOX_WIDTH", player.hitbox.width + "px");
  visualPlayer.style.setProperty(
    "--HITBOX_HEIGHT",
    player.hitbox.height + "px"
  );
  visualPlayer.style.setProperty("--HITBOX_X", player.hitbox.x + "px");
  visualPlayer.style.setProperty("--HITBOX_Y", player.hitbox.y + "px");

  
  // visualPlayer.style.setProperty("--HITBOX_TOPLEFT_X", topLeft.x + "px");
  // visualPlayer.style.setProperty("--HITBOX_TOPLEFT_Y", topLeft.y + "px");
  // visualPlayer.style.setProperty("--HITBOX_TOPRIGHT_X", topRight.x + "px");
  // visualPlayer.style.setProperty("--HITBOX_TOPRIGHT_Y", topRight.y + "px");
  // visualPlayer.style.setProperty("--HITBOX_BOTTOMLEFT_X", bottomLeft.x + "px");
  // visualPlayer.style.setProperty("--HITBOX_BOTTOMLEFT_Y", bottomLeft.y + "px");
  // visualPlayer.style.setProperty(
  //   "--HITBOX_BOTTOMRIGHT_X",
  //   bottomRight.x + "px"
  // );
  // visualPlayer.style.setProperty(
  //   "--HITBOX_BOTTOMRIGHT_Y",
  //   bottomRight.y + "px"
  // );
  
}
