//遊玩區域。
var PlayField = (function invocation() {
    function PlayField(canvas, width, height, style, color) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.width = width || TETRIS.WIDTH;
        this.height = height || TETRIS.HEIGHT;

        this.style = {
            eraseLineCount: (style && style.eraseLineCount) || STYLE.ERASE_LINE_COUNT,
            linePixel: (style && style.linePixel) || STYLE.LINE_PIXEL,
            gridPixel: (style && style.gridPixel) || STYLE.GRID_PIXEL
        };
        this.color = {
            stoke: (color && color.stoke) || COLOR.BACKGROUND_STROKE,
            fill: (color && color.fill) || COLOR.BACKGROUND_FILL
        }

        this.tetrisArray = initialTetrisArray(this.width, this.height);
        this.isGameOver = false;

        this.canvas.width = this.width * this.style.gridPixel;
        this.canvas.height = this.height * this.style.gridPixel;

        this.interval;
    }

    //檢查在 PlayField 放上此 tetrimino 是否會碰撞。
    PlayField.prototype.isCollision = function (tetrimino) {
        var gridPosition = TETRIMINO[tetrimino.type][tetrimino.direction];
        for (var i = 0; i < gridPosition.length; i++) {
            var position = gridPosition[i].split(",");
            var x = Number(position[0]) + tetrimino.positionX;
            var y = Number(position[1]) + tetrimino.positionY;
            if (x < 0 || (this.width - 1) < x) {
                return true;
            }
            if (y < 0 || (this.height - 1) < y) {
                return true;
            }
            if (this.tetrisArray[x][y].status == STATUS.OCCUPIED) {
                return true;
            }
        }
        return false;
    };

    //遊戲開始要做的事情。
    PlayField.prototype.gameStart = function (func) {
        this.isGameOver = false;
        //每秒往下一格。
        this.interval = setInterval(function () {
            var event = new Event('keydown');
            event.key = KEY.ARROW_DOWN;
            document.dispatchEvent(event);
        }, 1000);
    };

    //遊戲結束要做的事情。
    PlayField.prototype.gameOver = function () {
        this.isGameOver = true;
        clearInterval(this.interval);
        alert("Game Over");
    };

    //重畫。
    PlayField.prototype.redraw = function (tetrimino) {
        //如果遊戲已經結束，就不需要再畫了。
        if (!this.isGameOver) {
            //清空全部。
            this.ctx.clearRect(0, 0, this.width * this.style.gridPixel, this.height * this.style.gridPixel);
            //畫出來 PlayField 的部分。
            this.ctx.lineWidth = this.style.linePixel;
            this.ctx.strokeStyle = this.color.stoke;
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    drawGrid(this.ctx, x, y, getColor(this.tetrisArray, x, y), this.style.gridPixel, this.style.linePixel);
                }
            }
            //畫出來 tetrimino 的部分。
            if (tetrimino) {
                var gridPosition = TETRIMINO[tetrimino.type][tetrimino.direction];
                for (var i = 0; i < gridPosition.length; i++) {
                    var position = gridPosition[i].split(",");
                    var x = Number(position[0]) + tetrimino.positionX;
                    var y = Number(position[1]) + tetrimino.positionY;
                    drawGrid(this.ctx, x, y, COLOR.TETRIMINO[tetrimino.type], this.style.gridPixel, this.style.linePixel);
                }
            }
            //最上面幾行擦掉。
            this.ctx.clearRect(0, 0, this.width * this.style.gridPixel, this.style.eraseLineCount * this.style.gridPixel);
        }
    };

    //將 tetrimino 存入 PlayField。
    PlayField.prototype.save = function (tetrimino) {
        var gridPosition = TETRIMINO[tetrimino.type][tetrimino.direction];
        for (var i = 0; i < gridPosition.length; i++) {
            var position = gridPosition[i].split(",");
            var x = Number(position[0]) + tetrimino.positionX;
            var y = Number(position[1]) + tetrimino.positionY;
            this.tetrisArray[x][y].status = STATUS.OCCUPIED;
            this.tetrisArray[x][y].color = COLOR.TETRIMINO[tetrimino.type];
        }
    };

    //檢查有無滿行，有的話，就進行消行。
    PlayField.prototype.checkAndDestroyLine = function () {
        var newTetrisArray = JSON.parse(JSON.stringify(this.tetrisArray));
        //紀錄目前有幾行滿行。
        var fullLineCount = 0;
        for (var y = this.height - 1; 0 <= y; y--) {
            var isFull = true;
            for (var x = 0; x < this.width; x++) {
                if (fullLineCount <= y) {
                    //如果下面的有滿行就往下補。
                    if (fullLineCount > 0) {
                        newTetrisArray[x][y + fullLineCount] = this.tetrisArray[x][y];
                    }
                    if (this.tetrisArray[x][y].status != STATUS.OCCUPIED) {
                        isFull = false;
                    }
                } else {
                    //依據 fullLineCount 最上面幾行直接給予空行。
                    newTetrisArray[x][y] = {
                        status: STATUS.EMPTY
                    };
                }
            }
            if (isFull) {
                fullLineCount++;
            }
        }
        this.tetrisArray = newTetrisArray;
    };

    //產出 width 乘 height 的 tetrisArray，並給予初始化。
    function initialTetrisArray(width, height) {
        //創建二維陣列。
        var tetrisArray = new Array(width);
        for (var x = 0; x < tetrisArray.length; x++) {
            tetrisArray[x] = new Array(height);
        }
        //初始化。
        for (var x = 0; x < tetrisArray.length; x++) {
            for (var y = 0; y < tetrisArray[x].length; y++) {
                tetrisArray[x][y] = {
                    status: STATUS.EMPTY
                };
            }
        }
        return tetrisArray;
    }

    //取得該格顏色。
    function getColor(tetrisArray, x, y) {
        var grid = tetrisArray[x][y];
        if (grid.status == STATUS.EMPTY) {
            return COLOR.BACKGROUND_FILL[(x + y) % 2];
        } else if ("color" in grid) {
            return grid.color;
        } else {
            throw new Error("don't know what color it should be. grid[" + x + "][" + y + "]:" + JSON.stringify(grid));
        }
    }

    //畫一格。
    function drawGrid(ctx, x, y, fillStyle, gridPixel, linePixel) {
        var startPositionX = gridPixel * x + linePixel / 2;
        var startPositionY = gridPixel * y + linePixel / 2;
        //雙色相間的背景格子色。
        ctx.fillStyle = fillStyle;

        ctx.beginPath();
        ctx.moveTo(startPositionX, startPositionY);
        ctx.lineTo(startPositionX + gridPixel - linePixel, startPositionY);
        ctx.lineTo(startPositionX + gridPixel - linePixel, startPositionY + gridPixel - linePixel);
        ctx.lineTo(startPositionX, startPositionY + gridPixel - linePixel);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }

    return PlayField;
}());
