//俄羅斯方塊。
var Tetrimino = (function invocation() {
    function Tetrimino() {
        var typeArray = Object.keys(TETRIMINO);
        var index = Math.floor(Math.random() * typeArray.length);
        this.type = typeArray[index];
        this.direction = 0;
        this.positionX = 3;
        this.positionY = 0;
    }

    //移動俄羅斯方塊。
    Tetrimino.prototype.move = function (direction) {
        switch (direction) {
            case DIRECTION.RIGHT:
                this.positionX++;
                break;
            case DIRECTION.LEFT:
                this.positionX--;
                break;
            case DIRECTION.DOWN:
                this.positionY++;
                break;
            case DIRECTION.TOP:
                this.positionY--;
                break;
        }
    };

    //旋轉俄羅斯方塊。
    Tetrimino.prototype.rotate = function (direction) {
        var directionArray = TETRIMINO[this.type];
        switch (direction) {
            case DIRECTION.ANTICLOCKWISE:
                this.direction = (this.direction + (directionArray.length - 1)) % directionArray.length;
                break;
            case DIRECTION.CLOCKWISE:
                this.direction = (this.direction + 1) % directionArray.length;
                break;
        }
    };

    return Tetrimino;
}());
