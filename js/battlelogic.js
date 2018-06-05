const battle = (crawler) => {
    let turn = 1
    do {
        if (turn % 2 === 0) {
            chooseAction(crawler);
        } else {
            mage.hp -= crawler.rollAttack(1,4);
            console.log(mage.hp);
        }
        turn++
        (crawler.hp <= 0 || mage.hp <= 0) ? battleLoopRunning = false: battleLoopRunning = true;
    } while ( battleLoopRunning) 
}