Board.templates = [
    [
        'WWWWWWWWWWWWWWW',
        'W             W',
        'W X X X X X X W',
        'W             W',
        'W X X X X X X W',
        'W             W',
        'W X X X X X X W',
        'W             W',
        'W X X X X X X W',
        'W             W',
        'WWWWWWWWWWWWWWW'
    ],
    [
        'WWWWWWWWWWWWWWW',
        'W             W',
        'W X XXX XXX X W',
        'W             W',
        'W X X X X X X W',
        'W X         X W',
        'W X X X X X X W',
        'W             W',
        'W X XXX XXX X W',
        'W             W',
        'WWWWWWWWWWWWWWW'
    ],
    [
        'WWWWWWWWWWWWWWW',
        'W      X      W',
        'W  X   X   X  W',
        'W XXXX X XXXX W',
        'W      X      W',
        'W XX X X X XX W',
        'W      X      W',
        'W XX   X    X W',
        'W  XXX   XXXX W',
        'W             W',
        'WWWWWWWWWWWWWWW'
    ],
    [
        'WWWWWWWWWWWWWWW',
        'W             W',
        'W  XXX   XXX  W',
        'W  X   X   X  W',
        'W  X   X   X  W',
        'W             W',
        'W  X   X   X  W',
        'W  X   X   X  W',
        'W  XXX   XXX  W',
        'W             W',
        'WWWWWWWWWWWWWWW'
    ]
]

Board.elements = {
    'floor':{sx: 174, sy:16, type: 'empty', subType:'board'},
    'W':{sx: 190, sy:16, type: 'solid', subType:'board'},
    'X':{sx: 206, sy:16, type: 'solid', subType:'board'},
    'box':{sx: 126, sy:0, type: 'soft', subType:'board', koObj: 'Crate'}
}
function Board(){
    this.fW = 16
    this.fH = 16
    this.parse(Board.templates[ VAR.rand(0,Board.templates.length-1) ])
	for(let i=0;i<25;i++)
	{
		this.addCrate()
	}
}

Board.prototype.getEmptySpace = function(){
	return this.emptySpaces.length>0 ? this.emptySpaces.shift() : null
}

Board.prototype.addCrate = function(){
	var pos = this.getEmptySpace()
	if(pos)
	{
		this.b[pos.y][pos.x] = Board.elements.box
	}
}

Board.prototype.draw = function(){
    for(let i=0;i<this.b.length;i++)
    {
        for(let j=0;j<this.b[i].length;j++)
        {
            Game.ctx.drawImage(
                Game.spr,
                this.b[i][j].sx,
                this.b[i][j].sy,
                this.fW,
                this.fH,
                j*this.fW*VAR.scale,
                i*this.fH*VAR.scale,
                this.fW*VAR.scale,
                this.fH*VAR.scale
            )
            if(this.b[i][j].subType != 'board')
            {
                this.b[i][j].draw() 
            }
        }
    }
}

Board.prototype.parse = function(arr){
	this.emptySpaces = []
	this.b = []
    for(let i=0;i<arr.length;i++)
    {
        this.b.push([])
        for(let j=0; j<arr[i].length;j++)
        {
            this.b[i].push(Board.elements[ arr[i].charAt(j)==' ' ? 'floor' : arr[i].charAt(j)] )
			if(this.b[i][j].type =="empty" && !(i==1 && j==1) && !(i==2 && j==1) && !(i==1 && j==2))
			{
				this.emptySpaces.push( {x: j, y: i} )
			}
		}
	}
	this.emptySpaces = VAR.shuffle(this.emptySpaces)
}