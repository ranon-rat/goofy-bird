import { Game } from "./game.js"
const canvas=document.getElementById("goofy-bird") as HTMLCanvasElement

const ctx=canvas.getContext("2d")!
const game=new Game(ctx)
canvas.width=game.width
canvas.height=game.height
canvas.addEventListener("click",(_)=>game.bird.jump(),false)
setInterval(()=>requestAnimationFrame  (game.show.bind(game)),1000/game.fps)
