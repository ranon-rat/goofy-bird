import { Game } from "./game.js";
import { fps } from "./mathfuncs.js";
const canvas = document.getElementById("goofy-bird");
const ctx = canvas.getContext("2d");
const game = new Game(ctx);
canvas.width = game.width;
canvas.height = game.height;
//requestAnimationFrame  (game.show.bind(game))
setTimeout(() => setInterval(() => requestAnimationFrame(game.show.bind(game)), 1000 / fps), 1000);
