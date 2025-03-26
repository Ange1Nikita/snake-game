(function(){"use strict";var t={6795:function(t,e,i){var s=i(5130),o=i(6768);const n={id:"app"};function a(t,e,i,s,a,h){const r=(0,o.g2)("SnakeGame");return(0,o.uX)(),(0,o.CE)("div",n,[(0,o.bF)(r)])}var h=i(4232);const r={class:"game-container"},c={class:"theme-buttons"},d={class:"score-board"},l=["width","height"],u={key:0};function f(t,e,i,s,n,a){return(0,o.uX)(),(0,o.CE)("div",r,[e[6]||(e[6]=(0,o.Lk)("h1",null,"Змейка",-1)),(0,o.Lk)("div",c,[(0,o.Lk)("button",{onClick:e[0]||(e[0]=t=>a.changeTheme("classic"))},"Классическая тема"),(0,o.Lk)("button",{onClick:e[1]||(e[1]=t=>a.changeTheme("night"))},"Ночная тема"),(0,o.Lk)("button",{onClick:e[2]||(e[2]=t=>a.changeTheme("space"))},"Космическая тема")]),(0,o.Lk)("div",d,[(0,o.Lk)("p",null,"Счёт: "+(0,h.v_)(n.score),1),(0,o.Lk)("p",null,"Рекорд: "+(0,h.v_)(n.highScore),1)]),(0,o.Lk)("canvas",{ref:"gameCanvas",width:n.canvasSize,height:n.canvasSize,onTouchstart:e[3]||(e[3]=(...t)=>a.handleTouchStart&&a.handleTouchStart(...t)),onTouchmove:e[4]||(e[4]=(...t)=>a.handleTouchMove&&a.handleTouchMove(...t)),onTouchend:e[5]||(e[5]=(...t)=>a.handleTouchEnd&&a.handleTouchEnd(...t))},null,40,l),n.gameOver?((0,o.uX)(),(0,o.CE)("p",u,"Игра окончена! Нажмите на экран для перезапуска.")):(0,o.Q3)("",!0)])}i(4114),i(8111),i(7588),i(3579);var m={data(){return{canvasSize:400,gridSize:20,snake:[{x:10,y:10}],food:{x:15,y:15},direction:{x:0,y:0},gameOver:!1,touchStartX:null,touchStartY:null,score:0,highScore:0,foodColorPhase:0,comets:[],cometInterval:null,maxComets:5,speed:.2,initialSpeed:.2,headPosition:{x:10,y:10},gameLoopTimer:null,updateInterval:100,frameRate:60,lastUpdateTime:0,currentTheme:"classic",themes:{classic:{background:["#87CEEB","#98FB98"],snake:{fill:"green",stroke:"darkgreen"},food:{stroke:"darkred"}},night:{background:["#000033","#1a1a4d"],snake:{fill:"#00ff00",stroke:"#00cc00"},food:{stroke:"#ff4500"}},space:{background:["#000000","#000033"],snake:{fill:"#ffffff",stroke:"#cccccc"},food:{stroke:"#ffff00"}}}}},mounted(){const t=localStorage.getItem("currentTheme");t&&this.themes[t]?this.currentTheme=t:this.currentTheme="classic",this.startGame(),window.addEventListener("keydown",this.handleKeyDown),this.startCometSpawning()},beforeUnmount(){window.removeEventListener("keydown",this.handleKeyDown),this.stopCometSpawning()},methods:{spawnComet(){if(this.comets.length>=this.maxComets)return;const t=this.canvasSize/this.gridSize-1,e={x:Math.random()*t,y:-1,speed:.3*Math.random()+.1,size:2*Math.random()+1};this.comets.push(e)},startCometSpawning(){this.cometInterval=setInterval((()=>{"space"===this.currentTheme&&this.spawnComet()}),2e3)},stopCometSpawning(){clearInterval(this.cometInterval)},changeTheme(t){this.currentTheme!==t&&(this.currentTheme=t,localStorage.setItem("currentTheme",t),console.log(`Тема изменена на: ${t}`),this.drawGame())},startGame(){this.snake=[{x:10,y:10}],this.food={x:15,y:15},this.direction={x:0,y:0},this.gameOver=!1,this.score=0,this.speed=this.initialSpeed,this.headPosition={x:10,y:10},this.lastUpdateTime=Date.now(),this.gameLoop(),this.updateGameState()},updateGameState(){const t=Date.now(),e=t-this.lastUpdateTime;if(e>=this.updateInterval){this.lastUpdateTime=t;let e={x:this.snake[0].x+this.direction.x,y:this.snake[0].y+this.direction.y};if(e.x<0&&(e.x=this.canvasSize/this.gridSize-1),e.x>=this.canvasSize/this.gridSize&&(e.x=0),e.y<0&&(e.y=this.canvasSize/this.gridSize-1),e.y>=this.canvasSize/this.gridSize&&(e.y=0),this.snake.unshift({x:e.x,y:e.y}),e.x===this.food.x&&e.y===this.food.y?(this.spawnFood(),this.score++,this.score>this.highScore&&(this.highScore=this.score),this.playSound("sounds/eat.mp3"),this.speed<1&&(this.speed+=.01)):this.snake.pop(),this.snake.slice(1).some((t=>t.x===e.x&&t.y===e.y)))return this.gameOver=!0,void this.playSound("sounds/game-over.mp3")}requestAnimationFrame((()=>this.updateGameState()))},gameLoop(){if(this.gameOver||!this.$refs.gameCanvas)return;this.headPosition.x+=(this.snake[0].x-this.headPosition.x)*this.speed,this.headPosition.y+=(this.snake[0].y-this.headPosition.y)*this.speed,this.headPosition.x<0&&(this.headPosition.x+=this.canvasSize/this.gridSize),this.headPosition.x>=this.canvasSize/this.gridSize&&(this.headPosition.x-=this.canvasSize/this.gridSize),this.headPosition.y<0&&(this.headPosition.y+=this.canvasSize/this.gridSize),this.headPosition.y>=this.canvasSize/this.gridSize&&(this.headPosition.y-=this.canvasSize/this.gridSize),this.foodColorPhase+=.05,"space"===this.currentTheme&&this.comets.forEach((t=>{t.y+=t.speed,t.y>this.canvasSize/this.gridSize&&(t.y=-1)})),this.$refs.gameCanvas&&this.drawGame();const t=1e3/this.frameRate;this.gameLoopTimer=setTimeout((()=>this.gameLoop()),t)},drawGame(){const t=this.$refs.gameCanvas,e=t.getContext("2d"),i=this.themes[this.currentTheme],s=e.createLinearGradient(0,0,this.canvasSize,this.canvasSize);if(s.addColorStop(0,i.background[0]),s.addColorStop(1,i.background[1]),e.fillStyle=s,e.fillRect(0,0,this.canvasSize,this.canvasSize),e.fillStyle=i.snake.fill,e.strokeStyle=i.snake.stroke,e.lineWidth=2,this.snake.forEach(((t,i)=>{const s=this.gridSize/2;let o,n;0===i?(o=this.headPosition.x*this.gridSize+s,n=this.headPosition.y*this.gridSize+s):(o=t.x*this.gridSize+s,n=t.y*this.gridSize+s),e.beginPath(),e.arc(o,n,s-2,0,2*Math.PI),e.fill(),e.stroke()})),this.food){const t=30*Math.sin(this.foodColorPhase)+30;e.fillStyle=`hsl(${t}, 100%, 50%)`,e.strokeStyle=i.food.stroke,e.lineWidth=2;const s=this.gridSize/2,o=this.food.x*this.gridSize+s,n=this.food.y*this.gridSize+s;e.beginPath(),e.arc(o,n,s-2,0,2*Math.PI),e.fill(),e.stroke()}"space"===this.currentTheme&&this.comets.forEach((t=>{const i=t.x*this.gridSize+this.gridSize/2,s=t.y*this.gridSize+this.gridSize/2;for(let o=0;o<3;o++){const n=t.size*(1-.3*o),a=1-.3*o;e.fillStyle=`rgba(255, 255, 255, ${a})`,e.beginPath(),e.arc(i,s-o*this.gridSize*.2,n,0,2*Math.PI),e.fill()}}))},spawnFood(){const t=Math.floor(this.canvasSize/this.gridSize)-1,e=Math.floor(this.canvasSize/this.gridSize)-1;let i,s=0;do{i={x:Math.floor(Math.random()*(t+1)),y:Math.floor(Math.random()*(e+1))},s++}while(this.snake.some((t=>t.x===i.x&&t.y===i.y))&&s<100);s>=100?console.error("Не удалось сгенерировать еду после 100 попыток!"):this.food=i},handleKeyDown(t){switch(this.gameOver&&"Space"===t.code&&this.startGame(),t.code){case"ArrowUp":0===this.direction.y&&(this.direction={x:0,y:-1});break;case"ArrowDown":0===this.direction.y&&(this.direction={x:0,y:1});break;case"ArrowLeft":0===this.direction.x&&(this.direction={x:-1,y:0});break;case"ArrowRight":0===this.direction.x&&(this.direction={x:1,y:0});break}},handleTouchStart(t){const e=t.touches[0];this.touchStartX=e.clientX,this.touchStartY=e.clientY},handleTouchMove(t){t.preventDefault()},handleTouchEnd(t){const e=t.changedTouches[0],i=e.clientX-this.touchStartX,s=e.clientY-this.touchStartY;Math.abs(i)>Math.abs(s)?(i>0&&0===this.direction.x&&(this.direction={x:1,y:0}),i<0&&0===this.direction.x&&(this.direction={x:-1,y:0})):(s>0&&0===this.direction.y&&(this.direction={x:0,y:1}),s<0&&0===this.direction.y&&(this.direction={x:0,y:-1}))},handleScreenClick(){this.gameOver&&this.startGame()},playSound(t){const e=new Audio(t);e.play()}}},g=i(1241);const S=(0,g.A)(m,[["render",f],["__scopeId","data-v-117201b6"]]);var v=S,p={components:{SnakeGame:v}};const y=(0,g.A)(p,[["render",a]]);var k=y;(0,s.Ef)(k).mount("#app")}},e={};function i(s){var o=e[s];if(void 0!==o)return o.exports;var n=e[s]={exports:{}};return t[s].call(n.exports,n,n.exports,i),n.exports}i.m=t,function(){var t=[];i.O=function(e,s,o,n){if(!s){var a=1/0;for(d=0;d<t.length;d++){s=t[d][0],o=t[d][1],n=t[d][2];for(var h=!0,r=0;r<s.length;r++)(!1&n||a>=n)&&Object.keys(i.O).every((function(t){return i.O[t](s[r])}))?s.splice(r--,1):(h=!1,n<a&&(a=n));if(h){t.splice(d--,1);var c=o();void 0!==c&&(e=c)}}return e}n=n||0;for(var d=t.length;d>0&&t[d-1][2]>n;d--)t[d]=t[d-1];t[d]=[s,o,n]}}(),function(){i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,{a:e}),e}}(),function(){i.d=function(t,e){for(var s in e)i.o(e,s)&&!i.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})}}(),function(){i.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){var t={524:0};i.O.j=function(e){return 0===t[e]};var e=function(e,s){var o,n,a=s[0],h=s[1],r=s[2],c=0;if(a.some((function(e){return 0!==t[e]}))){for(o in h)i.o(h,o)&&(i.m[o]=h[o]);if(r)var d=r(i)}for(e&&e(s);c<a.length;c++)n=a[c],i.o(t,n)&&t[n]&&t[n][0](),t[n]=0;return i.O(d)},s=self["webpackChunksnake_game"]=self["webpackChunksnake_game"]||[];s.forEach(e.bind(null,0)),s.push=e.bind(null,s.push.bind(s))}();var s=i.O(void 0,[504],(function(){return i(6795)}));s=i.O(s)})();
//# sourceMappingURL=app.5daa07a3.js.map