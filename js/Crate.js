function Crate(column, row){
    this.sx = Board.elements.floor.sx
    this.sy = Board.elements.floor.sy
    //
    this.animSx = 126
    this.animSy = 0
    //
    this.currentF = 0
    this.f = [0,0,1,1,2,2,3,3,4,4,5,5]
    //
    this.type = 'empty'
    this.subType = 'crate'
    //
    this.row = row
    this.column = column

    Game.board.b[row][column] = this  
}

Crate.prototype.draw = function()
{
    Game.ctx.drawImage(
        Game.spr,
        this.animSx+this.f[this.currentF]*Game.board.fW,
        this.animSy,
        Game.board.fW,
        Game.board.fH,
        this.column*Game.board.fW*VAR.scale,
        this.row*Game.board.fH*VAR.scale,
        Game.board.fW*VAR.scale,
        Game.board.fH*VAR.scale
    )
    this.currentF++
    if(this.currentF>=this.f.length)
    {
        Game.board.b[this.row][this.column] = Board.elements.floor
    }
}