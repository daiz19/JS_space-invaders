/*
プロジェクトで使う主な機能
* for loops
* addEventListener
* classList
* document.querySelector
* Timeout
* switch case
*/

// 定数
const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')

// 15 x 15 のグリッド（225マス）をループ処理で作成
for (let i = 0; i < 225; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}
const squares = Array.from(document.querySelectorAll('.grid div'))

// インベーダーの配列を作成し、インベーダーの位置をセット
const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

// 変数
let currentShooterIndex = 202
let width = 15
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let results = 0


// シューターを描画
squares[currentShooterIndex].classList.add('shooter')

// シューターを左右キーで操作するファンクション（関数）
function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0)
                currentShooterIndex -= 1
            break
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1)
                currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add('shooter')
}
document.addEventListener('keydown',moveShooter)


// ビームを発射するファンクション（関数）
function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex

    // ビームを動かすファンクション（関数）
    function moveLaser() {
        if (currentLaserIndex < 0) return
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')

        // ビームがインベーダーに当たった時の処理
        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')

            squares[currentLaserIndex].classList.add('boom')
            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'),300)
            clearInterval(laserId)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultsDisplay.innerHTML = results
            console.log(aliensRemoved)
        }

    }
    switch (e.key) {
        case ' ': // スペースキーが押されたら  
            laserId = setInterval(moveLaser,100)
    }
}
document.addEventListener('keydown',shoot)


// インベーダーを描画するファンクション（関数）
function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}
draw()

// インベーダーを消すファンクション（関数）
function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

// インベーダーを動かすファンクション（関数）
function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1

    remove()

    // 右端に着いた時の処理
    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            goingRight = false
        }
    }

    // 左端に着いた時の処理
    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            goingRight = true
        }
    }

    // インベーダーを進行方向に動かす処理
    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    // ゲームオーバーとゲームクリア
    if (squares[currentShooterIndex].classList.contains('invader','shoter')) {
        resultsDisplay.innerHTML = 'GAME OVER'
        clearInterval(invadersId)
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] > (squares.length)) {
            resultsDisplay.innerHTML = 'GAME OVER'
            clearInterval(invadersId)
        }
    }

    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'YOU WIN!'
        clearInterval(invadersId)
    }
}
invadersId = setInterval(moveInvaders,600)