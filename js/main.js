window.onload = function () {
    var canvas = document.getElementById("tetris");
    if (canvas.getContext) {
        var playField = new PlayField(canvas);
        var tetrimino = new Tetrimino();
        playField.redraw(tetrimino);
        playField.gameStart();

        document.addEventListener('keydown', function (event) {
            var key = event.key;
            switch (key) {
                case KEY.CONTROL:
                case KEY.Z:
                    tetrimino.rotate(DIRECTION.ANTICLOCKWISE);
                    //如果此操作會發生碰撞，就返回剛剛對俄羅斯方塊的操作。
                    if (playField.isCollision(tetrimino)) {
                        tetrimino.rotate(DIRECTION.CLOCKWISE);
                    } else {
                        playField.redraw(tetrimino);
                    }
                    break;
                case KEY.X:
                case KEY.ARROW_UP:
                    tetrimino.rotate(DIRECTION.CLOCKWISE);
                    //如果此操作會發生碰撞，就返回剛剛對俄羅斯方塊的操作。
                    if (playField.isCollision(tetrimino)) {
                        tetrimino.rotate(DIRECTION.ANTICLOCKWISE);
                    } else {
                        playField.redraw(tetrimino);
                    }
                    break;
                case KEY.ARROW_RIGHT:
                    tetrimino.move(DIRECTION.RIGHT);
                    //如果此操作會發生碰撞，就返回剛剛對俄羅斯方塊的操作。
                    if (playField.isCollision(tetrimino)) {
                        tetrimino.move(DIRECTION.LEFT);
                    } else {
                        playField.redraw(tetrimino);
                    }
                    break;
                case KEY.ARROW_LEFT:
                    tetrimino.move(DIRECTION.LEFT);
                    //如果此操作會發生碰撞，就返回剛剛對俄羅斯方塊的操作。
                    if (playField.isCollision(tetrimino)) {
                        tetrimino.move(DIRECTION.RIGHT);
                    } else {
                        playField.redraw(tetrimino);
                    }
                    break;
                case KEY.SPACE:
                case KEY.ARROW_DOWN:
                    tetrimino.move(DIRECTION.DOWN);
                    if (key == KEY.SPACE) {
                        while (!playField.isCollision(tetrimino)) {
                            tetrimino.move(DIRECTION.DOWN);
                        }
                    }
                    //如果此操作會發生碰撞，就返回剛剛對俄羅斯方塊的操作。
                    if (playField.isCollision(tetrimino)) {
                        tetrimino.move(DIRECTION.TOP);
                        playField.save(tetrimino);
                        playField.redraw();
                        playField.checkAndDestroyLine();
                        //換下一個俄羅斯方塊的時候，如果發生碰撞就代表遊戲結束。
                        tetrimino = new Tetrimino();
                        if (playField.isCollision(tetrimino)) {
                            playField.gameOver();
                        } else {
                            playField.redraw(tetrimino);
                        }
                    } else {
                        playField.redraw(tetrimino);
                    }
                    break;
            }
        });
    }
}
