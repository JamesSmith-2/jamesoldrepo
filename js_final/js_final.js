const ball = document.querySelector('.ball');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');

let playerHits = 0;
const volumeLevel = Math.floor(Math.random() * 101);

const scoreboard = document.getElementById('scoreboard');

document.addEventListener('DOMContentLoaded', (event) => {
    //
    let gameRunning = true; 
    player1.addEventListener('mousedown', handlePaddleMouseDown);
    player2.addEventListener('mousedown', handlePaddleMouseDown);

    // volume
    const handle = document.querySelector('.volume-handle');
    let isAlertShown = false; // track if alert has been shown
    let isAlert2Shown = false;

    handle.addEventListener('mousedown', () => {
        let isDragging = true;
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX;
                handle.style.left = `${x}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            if (!isAlertShown) 
            {
                // Show the alert only if it hasn't been shown before
                isAlertShown = true;

                alert(`In order to change your volume level to ${volumeLevel}%, you must beat me in a game of pong!
                
                Use the Mouse on the white paddle to begin`);
                startPongGame(); // Begin the pong game after closing the alert
            }
        isDragging = false;
        });
    });
    // Pong 

    // let player1 = document.querySelector('#player1');
    function handlePaddleMouseDown(e)
    {
        isPaddleDragging = true;
        startY = e.clientY;
    }

    let ballX = 390;
    let ballY = 190;
    let ballSpeedX = 5;
    let ballSpeedY = 3;
    let isDragging = false;

    //track the mouse
    let isPaddleDragging = false;
    let startY = 0;

    //event listener for mouse down (click on paddle
    function handlePaddleMouseDown(e) {
        isPaddleDragging = true;
        startY = e.clientY;
    }

    player1.addEventListener('mousedown', (e) => 
    {
        isPaddleDragging = true;
        startY = e.clientY;
        e.preventDefault();
    });

    //track mouse move
    document.addEventListener('mousemove', (e) => {
        if (isPaddleDragging) {
            // Calculate the new position
            const deltaY = e.clientY - startY;
            let player1Top = window.getComputedStyle(player1).getPropertyValue('top');
            let newPosition = parseInt(player1Top) + deltaY;
    
            // Keep the paddle within the bounds of the game board
            const minTop = 0;
            const maxTop = 400 - player1.offsetHeight; // Subtract the height of the paddle to keep it within the game board
            newPosition = Math.max(minTop, Math.min(maxTop, newPosition));
    
            // Update the position of the paddle
            player1.style.top = newPosition + 'px';
    
            // Update startY for the next mouse move
            startY = e.clientY;
        }
    });
    

    // Event listener for mouse up
        document.addEventListener('mouseup', (e) => {
            isDragging = false;
            isPaddleDragging = false;
        });

        // Event listener for each frame
            function updateAI() {
                // Calculate the difference between the ball's y-position and the player2 paddle's current y-position
                const deltaY = ball.getBoundingClientRect().top - player2.getBoundingClientRect().top;
            
                const minTop = 0;
                const maxTop = 400 - player2.offsetHeight; 
                // Adjust the paddle's position toward the ball's y-position
                const speed = 1; 
                let newTop = player2.offsetTop + deltaY * speed;
            
                // Keep the paddle within the bounds of the game board
                newTop = Math.max(minTop, Math.min(maxTop, newTop));
                player2.style.top = newTop + 'px';
            }

    // Check for collision between ball and player1 paddle
    function checkCollisionP1() {
        const ballRect = ball.getBoundingClientRect();
        const player1Rect = player1.getBoundingClientRect();

        if (ballRect.left < player1Rect.right &&
            ballRect.right > player1Rect.left &&
            ballRect.top < player1Rect.bottom &&
            ballRect.bottom > player1Rect.top) {
            // Handle collision
            ballSpeedX *= -1; // Reverse ball's horizontal direction

            playerHits++;
            console.log("Player Hits:", playerHits);

            //update scoreboard
            scoreboard.textContent = `Player Hits: ${playerHits} / ${volumeLevel}`

                if (playerHits >= volumeLevel) {
                    gameRunning = false;

                    alert(`Congratulations! You have hit the ball ${playerHits} times. The volume was successfully changed to ${volumeLevel}%`)
                }
        }
    }

    function checkCollisionP2() {
        const ballRect = ball.getBoundingClientRect();
        const player2Rect = player2.getBoundingClientRect();

        if (ballRect.left < player2Rect.right &&
            ballRect.right > player2Rect.left &&
            ballRect.top < player2Rect.bottom &&
            ballRect.bottom > player2Rect.top) {
            // Handle collision
            ballSpeedX *= -1; // Reverse ball's horizontal direction
        }
    }


    function updateBallPosition() {
        if (gameRunning) {
            ballX += ballSpeedX;
            ballY += ballSpeedY;
            ball.style.left = ballX + 'px';
            ball.style.top = ballY + 'px';
    
            // Handle collisions with walls
            if (ballX <= 0) {
                ballSpeedX *= -1;
                ball.style.backgroundColor = 'red'; // Change the color of the ball
                gameRunning = false; // Stop the game

                alert(`You have lost.
                Volume will not be changed to ${volumeLevel}%
                Try. Again.`);
                
            } else if (ballX >= 780) {
                ballSpeedX *= -1;
            }
            if (ballY <= 0 || ballY >= 380) {
                ballSpeedY *= -1;
            }
        }
    }

    function gameLoop() {
        updateBallPosition();
        updateAI();
        checkCollision();
        requestAnimationFrame(gameLoop);
        }

    function checkCollision() {
        checkCollisionP1();
        checkCollisionP2();
    }

    function startPongGame() {
        const gameBoard = document.querySelector('.game-board');
        gameBoard.style.display = 'flex';
        gameLoop();
    }
});