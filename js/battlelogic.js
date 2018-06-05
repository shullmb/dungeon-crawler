while (crawler.hp > 0 && mage.hp > 0) {
    if (turn % 2 === 0) {
        setTimeout(function () {
            mage.hp -= crawler.rollAttack(crawler.level, 2);
        }, 1500);
    } else {
        chooseAction(crawler);
    }
    turn++
}