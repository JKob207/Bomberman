Character.count = 0 //licznik postaci

function Character(inheritance){
    Character.count++
    this.id = 'ch'+Character.count
    if(!inheritance)
    {
        Game.toDraw[this.id] = this
    }
    //
    this.fW = 21 //szerokość klatki
    this.fH = 24 //wysokość klatki
    //
    this.modX = -2
    this.modY = -9
    //
    this.speed = 2
    //
    this.states = {}
    //
    this.currentFrame = 0 //aktualny indeks klatki w this.frames
    //
    this.frameMaxDelay = 2 //opóźnienie klatek
    this.changeFrameDelay = 0

}

Character.prototype.rowAndColumn = function(){
    this.row = Math.round(this.y/Game.board.fH)
    this.column = Math.round(this.x/Game.board.fW)
    if(this.state.slice(-2) == 'go')
    {
        if(this.state=='left_go' || this.state=='right_go')
        {
            this.nextRow = this.row
            this.nextColumn = this.state=='left_go' ? Math.floor(this.x/Game.board.fW) : Math.ceil(this.x/Game.board.fW)
        }else{
            this.nextColumn = this.column
            this.nextRow = this.state=='up_go' ? Math.floor(this.y/Game.board.fH) : Math.ceil(this.y/Game.board.fH)
        }

        if(!(this.row==this.nextRow && this.column==this.nextColumn) && Game.board.b[this.nextRow][this.nextColumn].type != 'empty')
        {
            this.state = this.state.slice(0,-3)
            this.currentFrame = 0
            if(this.row!=this.nextRow)
            {
                this.y = this.row*Game.board.fH
            }else{
                this.x = this.column*Game.board.fW
            }
        }else{
            if(this.row!=this.nextRow)
            {
                this.x = this.column*Game.board.fW
            }else if(this.column!=this.nextColumn){
                this.y = this.row*Game.board.fH
            }
        }
    }else{
        this.nextRow = this.row
        this.nextColumn = this.column
    }
}

Character.prototype.draw = function(){
    if(this.state.slice(-2) == 'go'){
        if(this.state=="down_go")
        {
            this.y+=this.speed
        }else if(this.state == "right_go")
        {
            this.x+=this.speed
        }else if(this.state == "up_go")
        {
            this.y-=this.speed
        }else if(this.state == "left_go")
        {
            this.x-=this.speed
        }
        this.rowAndColumn()
    }
    //Game.ctx.fillRect(this.column*Game.board.fW*VAR.scale, this.row*Game.board.fH*VAR.scale, Game.board.fW*VAR.scale, Game.board.fH*VAR.scale)
    //Game.ctx.fillRect(this.nextColumn*Game.board.fW*VAR.scale, this.nextRow*Game.board.fH*VAR.scale, Game.board.fW*VAR.scale, Game.board.fH*VAR.scale)
    if(Game.board.b[this.row][this.column].subType == 'bomb' && Game.board.b[this.row][this.column].bumType)
    {
        this.setKO()
    }

    if(this.states[this.state].flip)
    {
        Game.ctx.save()
        Game.ctx.scale(-1,1)
    }
    Game.ctx.drawImage(Game.spr, this.states[this.state].sx+this.states[this.state].f[this.currentFrame] * this.fW,  this.states[this.state].sy, this.fW, this.fH, this.states[this.state].flip ? (-this.fW-this.modX-this.x)*VAR.scale : (this.x+this.modX)*VAR.scale, (this.y+this.modY)*VAR.scale, this.fW*VAR.scale, this.fH*VAR.scale)
    
    if(this.states[this.state].flip)
    {
        Game.ctx.restore()
    }

    if(this.changeFrameDelay < this.frameMaxDelay)
    {
        this.changeFrameDelay++
    }else 
    {
        this.changeFrameDelay = 0
        if(this.state=='ko' && this.currentFrame==this.states[this.state].f.length-1)
        {
            this.afterKO()
        }else{
            this.currentFrame = this.currentFrame+1 >=this.states[this.state].f.length ? 0 : ++this.currentFrame   
        }
    }
}

Character.prototype.setKO = function(){
    this.state = 'ko'
}
Character.prototype.afterKO = function(){
    delete Game.toDraw[this.id]
}

function Hero()
{
    Character.call(this)
    this.state = 'down' //aktualny stan
    this.states = {
        'down':{sx:0, sy:0, f:[0]},
        'down_go':{sx:0, sy:0, f:[1,0,2,0]},
        'left':{sx:63, sy:0, f:[0]},
        'left_go':{sx:63, sy:0, f:[1,0,2,0]},
        'up':{sx:0, sy:24, f:[0]},
        'up_go':{sx:0, sy:24, f:[1,0,2,0]},
        'right':{sx:63, sy:0, f:[0], flip: true},
        'right_go':{sx:63, sy:0, f:[1,0,2,0], flip: true},
        'ko': {sx:0, sy:48, f:[0,1,0,1,0,1,2,3,4]}
    }
    this.x = Game.board.fW
    this.y = Game.board.fH
    //
    this.rowAndColumn()
}

Hero.prototype = new Character(true)
Hero.prototype.contructor = Hero
Hero.prototype.parent = Character.prototype

Hero.prototype.updateState = function(){
    this.tempState = this.state
    if(Game.key_37){
        this.tempState = 'left_go'
    }else if(Game.key_38){
        this.tempState = 'up_go'
    }else if(Game.key_39){
        this.tempState = 'right_go'
    }else if(Game.key_40){
        this.tempState = 'down_go'
    }else if(this.state.slice(-2) == 'go'){
        this.tempState = this.state.slice(0,this.state.indexOf('_go'))
    }
    if(this.tempState!=this.state)
    {
        this.currentFrame = 0
        this.state = this.tempState
    }
}

Hero.prototype.setKO = function(){
    this.parent.setKO.call(this)
    Game.stop()
}

Hero.prototype.afterKO = function(){
    if(!Game.isOver)
    {
        Game.isOver = true
        console.log('Game over!')
    }  
}

Hero.prototype.enemyHitTest = function(){
    for(var e in Enemy.all)
    {
        e = Enemy.all[e]
        if((this.row == e.row && e.x+Game.board.fW>this.x && e.x<this.x+Game.board.fW) || (this.column==e.column && e.y+Game.board.fH>this.y && e.y<this.y+Game.board.fH))
        {
            return true
        }
    }
    return false
}

Hero.prototype.draw = function(){
    this.parent.draw.call(this)
    if(this.state!='ko' && this.enemyHitTest())
    {
        this.setKO()
    }
}

Enemy.all = {}
function Enemy(x,y){
    Character.call(this)
    Enemy.all[this.id] = this
    this.state = 'down'
    this.states = {
        'down':{sx:0, sy:72, f:[0]},
        'down_go':{sx:0, sy:72, f:[1,0,2,0]},
        'left':{sx:63, sy:24, f:[0]},
        'left_go':{sx:63, sy:24, f:[1,0,2,0]},
        'up':{sx:63, sy:72, f:[0]},
        'up_go':{sx:63, sy:72, f:[1,0,2,0]},
        'right':{sx:63, sy:24, f:[0], flip: true},
        'right_go':{sx:63, sy:24, f:[1,0,2,0], flip: true},
        'ko': {sx:0, sy:96, f:[0,1,2,3,4,5]}
    }
    this.x = x
    this.y = y
    this.rowAndColumn()
    this.setDirection()
}

Enemy.prototype = new Character(true)
Enemy.prototype.contructor = Enemy
Enemy.prototype.parent = Character.prototype

Enemy.prototype.setDirection = function(){
    this.canGo = this.canGo || []
    this.canGo.length = 0
    for(let i = this.column-1;i<=this.column+1;i++)
    {
        for(let j=this.row-1; j<=this.row+1;j++)
        {
            if(!(i==this.column && j==this.row))
            {
                if(i==this.column || j==this.row)
                {
                    if(Game.board.b[j][i].type == 'empty')
                    {
                        this.canGo.push({x:i, y:j})
                    }
                }
            }
        }
    }
    if(this.canGo.length>0)
    {
        this.tmpPos = this.canGo[ VAR.rand(0,this.canGo.length-1)]
        if(this.column<this.tmpPos.x)
        {
            this.state = 'right_go'
        }else if(this.column>this.tmpPos.x)
        {
            this.state = 'left_go'
        }else if(this.row<this.tmpPos.y)
        {
            this.state = 'down_go'
        }else if(this.row>this.tmpPos.y){
            this.state = 'up_go'
        }
    }else if(this.state.slice(-2) == 'go')
    {
        this.state = this.state.slice(0,-3)
    }
}

Enemy.prototype.rowAndColumn = function(){
    this.prevState = this.state
    this.parent.rowAndColumn.call(this)

    if(this.state!=this.prevState && this.state.slice(-2)!='go' && this.prevState.slice(-2) == 'go')
    {
        this.setDirection()
    }
}

Enemy.prototype.afterKO = function(){
    this.parent.afterKO.call(this)
    delete Enemy.all[this.id]
    var someEnemy = false
    for(var e in Enemy.all)
    {
        someEnemy = true
        break
    }
    if(!someEnemy)
    {
        console.log("SUCCESS")
    }
}

