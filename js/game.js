window.onload = function(){
    Game.spr = new Image() //sprite
    Game.spr.onload = Game.init
    Game.spr.src = 'gfx/bombe.png'
}

VAR = {
	fps:15, //klatki na sekundę
	W:0,// szerokość okna
	H:0,// wysokość okna
	scale:4,// skala elementów
	//
	lastTime:0,
	rand:function(min,max){
		return Math.floor(Math.random()*(max-min+1))+min
	},
	shuffle:function(arr){
		var counter = arr.length
		var tmp
		var index
		while(counter>0)
		{
			counter--
			index = Math.floor(Math.random() * counter)
			tmp = arr[counter]
			arr[counter] = arr[index]
			arr[index] = tmp
		}
		return arr
	}
}

Game = {
	toDraw:{},
	init:function(){
		Game.canvas = document.createElement('canvas')
		Game.ctx = Game.canvas.getContext('2d')
		Game.board = new Board()
		Game.hero = new Hero()
		//
		window.addEventListener('keydown', Game.onKey, false)
		window.addEventListener('keyup', Game.onKey, false)
		//
		var tmpEmpty
		for(let i=0;i<5;i++)
		{
			tmpEmpty = Game.board.getEmptySpace()
			new Enemy(tmpEmpty.x*Game.board.fW, tmpEmpty.y*Game.board.fH)
		}
		//
		Game.layout()
		window.addEventListener('resize', Game.layout, false)
        document.body.appendChild(Game.canvas)
		Game.animationLoop()
	},
	stop:function(){
		window.removeEventListener('keydown', Game.onKey)
		window.removeEventListener('keyup', Game.onKey)
	},
	onKey:function(e)
	{
		if((e.keyCode>=37 && e.keyCode<=40) || e.keyCode==32)
		{
			//e.preventDefault()
			if(e.type=='keydown' && !Game['key_'+e.keyCode])
			{
				Game['key_'+e.keyCode] = true
				if(e.keyCode>=37 && e.keyCode<=40)
				{
					for(let i=37;i<=40;i++)
					{
						if(i!=e.keyCode)
						{
							Game['key_'+i] = false
						}
					}
					Game.hero.updateState()
				}else{
					new Bomb(Game.hero.column, Game.hero.row)
				}
			}else if(e.type=='keyup')
			{
				Game['key_'+e.keyCode] = false
				if(e.keyCode!=32){
					Game.hero.updateState()
				}
			}
		}
	},
	// Ta metoda będzie odpalana przy każdej zmianie wielkości okna
	layout:function(e){
		VAR.W = window.innerWidth
		VAR.H = window.innerHeight
		
		VAR.scale = Math.max(1,Math.min(
			Math.floor(VAR.W/(Game.board.fW*Game.board.b[0].length)),
			Math.floor(VAR.H/(Game.board.fH*Game.board.b.length))
		))

		Game.canvas.width = Math.round(VAR.scale*Game.board.fW*Game.board.b[0].length)
		Game.canvas.height = Math.round(VAR.scale*Game.board.fH*Game.board.b.length)
		
		Game.canvas.style[Modernizr.prefixed('transform')] = 'translate('+Math.round((VAR.W-Game.canvas.width)/2)+'px,'+Math.round((VAR.H-Game.canvas.height)/2)+'px'+')'

        Game.ctx.imageSmoothingEnabled = false //rozmycie pikseli
        Game.ctx.mozSmoothingEnabled = false
        Game.ctx.oSmoothingEnabled = false
        Game.ctx.webkitSmoothingEnabled = false
	},
	// Funkcja, która odpala się 60 razy na sekundę
	animationLoop:function(time){
		requestAnimationFrame( Game.animationLoop )
		// ograniczenie do ilości klatek zdefiniowanych w właściwości obiektu VAR (nie więcej niż VAR.fps)
		if(time-VAR.lastTime>=1000/VAR.fps){
			VAR.lastTime = time;
			Game.ctx.clearRect(0,0,VAR.W, VAR.H)
			//
			Game.board.draw()
			//
            for(let o in Game.toDraw) //rysowanie wszystkich obiektów
            {
                Game.toDraw[o].draw()
            }
		}
    }
    
}