Bomb.count = 0
Bomb.maxCount = 2
Bomb.elements = {
    'bomb': {sx: 126, sy: 16, f:[0,0,1,1,2,2]},
    'center': {sx: 126, sy: 64, f:[0,0,1,1,2,2,3,3,2,2,1,1,0,0]},
    'up_bum': {sx: 126, sy: 96, f:[0,0,1,1,2,2,3,3,2,2,1,1,0,0]},
    'down_bum': {sx: 126, sy: 96, f:[0,0,1,1,2,2,3,3,2,2,1,1,0,0]},
    'right_bum': {sx: 126, sy: 48, f:[0,0,1,1,2,2,3,3,2,2,1,1,0,0]},
    'left_bum': {sx: 126, sy: 48, f:[0,0,1,1,2,2,3,3,2,2,1,1,0,0]},
    'up_bum_end': {sx: 126, sy: 80, f:[0,0,1,1,2,2,3,3,2,2,1,1,0,0]},
    'down_bum_end': {sx: 126, sy: 80, f:[0,0,1,1,2,2,3,3,2,2,1,1,0,0], flip: true},
    'right_bum_end': {sx: 126, sy: 32, f:[0,0,1,1,2,2,3,3,2,2,1,1,0,0], flip: true},
    'left_bum_end': {sx: 126, sy: 32, f:[0,0,1,1,2,2,3,3,2,2,1,1,0,0]},
}

function Bomb(column,row, bumType){
    if((Bomb.maxCount>Bomb.count && Game.board.b[row][column].subType != 'bomb' && !bumType) || (bumType && Game.board.b[row][column].subType=='board' && (!Game.board.b[row][column].bumType || Game.board.b[row][column].bumType.slice(-3)=='end'))  )
    {
        if(!bumType)
        {
           Bomb.count++ 
        }
        //
        this.sx = Board.elements.floor.sx
        this.sy = Board.elements.floor.sy
        //
        // this.bombSx = 126
        // this.bombSy = 16
        // //
        // this.f = [0,0,1,1,2,2]
        this.currentF = 0
        //
        this.bumType = bumType
        this.type = this.bumType ? 'empty' : 'solid'
        this.subType = 'bomb'
        this.data = !bumType ? Bomb.elements.bomb : Bomb.elements[bumType]
        //
        this.column = column
        this.row = row
        //
        this.timer = bumType ? this.data.f.length : 30
        this.range = 2
        //
        Game.board.b[this.row][this.column] = this
    }
}
Bomb.prototype.draw = function() {
    if(this.timer>0)
    {
        this.targetX = this.column*Game.board.fW*VAR.scale
        this.targetY = this.row*Game.board.fH*VAR.scale
        if(this.data.flip)
        {
            Game.ctx.save()
            if(this.bumType == 'down_bum_end')
            {
                Game.ctx.scale(1,-1)
                this.targetY = this.targetY*-1-(Game.board.fH*VAR.scale)
            }else
            {
                Game.ctx.scale(-1,1)
                this.targetX = this.targetX*-1-(Game.board.fW*VAR.scale)
            }
           
        }
        Game.ctx.drawImage(
            Game.spr,
            this.data.sx+this.data.f[this.currentF]*Game.board.fW,
            this.data.sy,
            Game.board.fW,
            Game.board.fH,
            this.targetX,
            this.targetY,
            Game.board.fW*VAR.scale,
            Game.board.fH*VAR.scale
        )
        if(this.data.flip)
        {
            Game.ctx.restore()
        }
        this.currentF = this.currentF+1>=this.data.f.length ? 0 : this.currentF+1;
        this.timer--
    }else if(this.type=='solid')
    {
        Bomb.count--
        this.type = 'empty'
        this.currentF = 0
        this.data = Bomb.elements.center
        this.bumType = 'center'
        this.timer = this.data.f.length
        //
        this.bums = []
        for(let i=0;i<4;i++)
        {
            this.axis = i%2 ? 'tmpColumn' : 'tmpRow'
            this.grow = i%3 ? true : false
            
            this.tmpColumn = this.column
            this.tmpRow = this.row

            if(this.axis == 'tmpColumn' && this.grow)
            {
                this.tmpBumType = 'right_bum'
            }else if(this.axis == 'tmpColumn' && !this.grow)
            {
                this.tmpBumType = 'left_bum'
            }else if(this.axis == 'tmpRow' && this.grow)
            {
                this.tmpBumType = 'down_bum'
            }else if(this.axis == 'tmpRow' && !this.grow)
            {
                this.tmpBumType = 'up_bum'
            }


            for(let j=0;j<this.range;j++)
            {
                this[this.axis] = this[this.axis]+(this.grow ? 1 : -1)
                if(Game.board.b[this.tmpRow][this.tmpColumn].type != 'solid')
                {
                    if(Game.board.b[this.tmpRow][this.tmpColumn].koObj)
                    {
                        new window[Game.board.b[this.tmpRow][this.tmpColumn].koObj](this.tmpColumn, this.tmpRow)
                        break;
                    }else{
                        new Bomb(this.tmpColumn, this.tmpRow, this.tmpBumType+(j==this.range-1 ? '_end' : ''))                        
                    }
                }else if(Game.board.b[this.tmpRow][this.tmpColumn].subType == 'bomb' && !Game.board.b[this.tmpRow][this.tmpColumn].bumType)
                {
                    Game.board.b[this.tmpRow][this.tmpColumn].timer = 0
                }else{
                    break;
                }
            }
        }
    }else{
        Game.board.b[this.row][this.column] = Board.elements.floor
    }
}