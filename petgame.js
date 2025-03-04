class Character {
    constructor(name, hp, attack) {
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.maxHp = hp;
    }

    takeDamage(damage) {
        this.hp -= damage;
    }

    isAlive() {
        return this.hp > 0;
    }

    heal(amount) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
    }

    increaseHp(amount) {
        this.maxHp += amount;
        this.hp += amount;
    }

    increaseAttack(amount) {
        this.attack += amount;
    }
}

const pet = new Character('Pet', 100, 10);
let enemy;
let wave = 1;
let pesos = 0;
let statPoints = 0;
let healAmount = Math.floor(Math.random() * 21) + 20; // Randomize heal amount between 20 and 40
let attackGrowth = Math.floor(Math.random() * 4) + 2; // Randomize attack growth between 2 and 5

function createEnemy() {
    let hp = 50 + wave * 10;
    let attack = 5 + wave * 2;
    if (wave % 5 === 0) { // Boss wave
        hp *= 2;
        attack *= 2;
    }
    enemy = new Character(`Enemy Wave ${wave}`, hp, attack);
}

function updateStatus() {
    document.getElementById('pet-status').innerHTML = `<span>Pet HP:</span> ${pet.hp}/${pet.maxHp} | <span>Attack:</span> ${pet.attack}`;
    document.getElementById('enemy-status').innerHTML = `<span>Enemy HP:</span> ${enemy.hp}/${enemy.maxHp} | <span>Attack:</span> ${enemy.attack}`;
    document.getElementById('wave-status').innerHTML = `<span>Wave:</span> ${wave}`;
    document.getElementById('currency').innerText = `Pesos: ${pesos}`;
    document.getElementById('stat-points').innerText = `Stat Points: ${statPoints}`;
    document.getElementById('pet-hp-bar-inner').style.width = `${(pet.hp / pet.maxHp) * 100}%`;
    document.getElementById('enemy-hp-bar-inner').style.width = `${(enemy.hp / enemy.maxHp) * 100}%`;
    document.getElementById('heal-amount').innerText = `Healing (+${healAmount} HP): 15 Pesos`;
    document.getElementById('attack-growth').innerText = `Attack Growth (+${attackGrowth} Attack): 30 Pesos`;
}

function fight() {
    if (pet.isAlive() && enemy.isAlive()) {
        enemy.takeDamage(pet.attack);
        if (enemy.isAlive()) {
            pet.takeDamage(enemy.attack);
        }
        updateStatus();
        if (!pet.isAlive()) {
            alert('Your pet has been defeated!');
        } else if (!enemy.isAlive()) {
            alert(`The enemy of wave ${wave} has been defeated!`);
            wave++;
            pet.heal(30); // Heal pet by 30 HP
            let reward = 30;
            if (wave % 3 === 0) {
                reward = 40; // Increase reward to 40 pesos every 3 waves
            }
            if (wave > 10) {
                reward = 70; // Increase reward to 70 pesos after wave 10
            }
            if (wave % 5 === 0) { // Boss wave
                const bossRewards = [
                    { type: 'attack', value: Math.floor(Math.random() * 46) + 5 }, // 5 to 50 attack growth
                    { type: 'hp', value: Math.floor(Math.random() * 46) + 5 }, // 5 to 50 hp growth
                    { type: 'stat', value: Math.floor(Math.random() * 14) + 2 }, // 2 to 15 stat points
                    { type: 'money', value: Math.floor(Math.random() * 141) + 60 } // 60 to 200 pesos
                ];
                const bossReward = bossRewards[Math.floor(Math.random() * bossRewards.length)];
                switch (bossReward.type) {
                    case 'attack':
                        pet.increaseAttack(bossReward.value);
                        alert(`You won ${bossReward.value} attack growth from the boss!`);
                        break;
                    case 'hp':
                        pet.increaseHp(bossReward.value);
                        alert(`You won ${bossReward.value} HP growth from the boss!`);
                        break;
                    case 'stat':
                        statPoints += bossReward.value;
                        alert(`You won ${bossReward.value} stat points from the boss!`);
                        break;
                    case 'money':
                        pesos += bossReward.value;
                        alert(`You won ${bossReward.value} pesos from the boss!`);
                        break;
                }
            } else {
                pesos += reward; // Add pesos for each enemy defeated
            }
            statPoints++; // Add 1 stat point for each enemy defeated
            createEnemy();
            updateStatus();
        }
    }
}

function increaseHp() {
    if (statPoints > 0) {
        pet.increaseHp(10);
        statPoints--;
        updateStatus();
    }
}

function increaseAttack() {
    if (statPoints > 0) {
        pet.increaseAttack(2);
        statPoints--;
        updateStatus();
    }
}

function buyHealing() {
    if (pesos >= 15) {
        pet.heal(healAmount);
        pesos -= 15;
        healAmount = Math.floor(Math.random() * 21) + 20; // Randomize heal amount between 20 and 40
        updateStatus();
    } else {
        alert('Not enough pesos!');
    }
}

function buyAttackGrowth() {
    if (pesos >= 30) {
        pet.increaseAttack(attackGrowth);
        pesos -= 30;
        attackGrowth = Math.floor(Math.random() * 4) + 2; // Randomize attack growth between 2 and 5
        updateStatus();
    } else {
        alert('Not enough pesos!');
    }
}

function spinWheel() {
    if (pesos >= 50) {
        pesos -= 50;
        const outcomes = [
            { type: 'stat', value: 2 },
            { type: 'stat', value: 4 },
            { type: 'hp', value: 50 },
            { type: 'hp', value: 30 },
            { type: 'attack', value: 5 },
            { type: 'attack', value: 10 }
        ];
        const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        switch (outcome.type) {
            case 'stat':
                statPoints += outcome.value;
                alert(`You won ${outcome.value} stat points!`);
                break;
            case 'heal':
                pet.heal(outcome.value);
                alert(`You healed ${outcome.value} HP!`);
                break;
            case 'hp':
                pet.increaseHp(outcome.value);
                alert(`You increased max HP by ${outcome.value}!`);
                break;
            case 'attack':
                pet.increaseAttack(outcome.value);
                alert(`You increased attack by ${outcome.value}!`);
                break;
        }
        updateStatus();
    } else {
        alert('Not enough pesos to spin the wheel!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createEnemy();
    const gameDiv = document.createElement('div');
    gameDiv.id = 'game';
    gameDiv.innerHTML = `
        <div id="status-container">
            <div class="character-container">
                <div class="hp-bar">
                    <div id="pet-hp-bar-inner" class="hp-bar-inner"></div>
                </div>
                <img id="pet-image" class="pet-image" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6c3d567d-af2b-469e-b10c-d5b135964ab2/dg06vdq-866d2629-f891-4450-a69e-4234d84bfc25.png/v1/fill/w_1192,h_670/solo_leveling___sung_jinwoo_3_png_by_loombot_dg06vdq-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvNmMzZDU2N2QtYWYyYi00NjllLWIxMGMtZDViMTM1OTY0YWIyXC9kZzA2dmRxLTg2NmQyNjI5LWY4OTEtNDQ1MC1hNjllLTQyMzRkODRiZmMyNS5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.kPh21Et6KsOeFS7kA_Zu-yO1gdXBXhe7TKX2vDXFlas" alt="Pet Image">
            </div>
            <div class="character-container">
                <div class="hp-bar">
                    <div id="enemy-hp-bar-inner" class="hp-bar-inner"></div>
                </div>
                <img id="enemy-image" class="enemy-image" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6c3d567d-af2b-469e-b10c-d5b135964ab2/dg06tox-c9ec53c4-a785-4515-b73f-24ca575fc3fa.png/v1/fit/w_828,h_1792/solo_leveling___beru_png_by_loombot_dg06tox-414w-2x.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjY4OCIsInBhdGgiOiJcL2ZcLzZjM2Q1NjdkLWFmMmItNDY5ZS1iMTBjLWQ1YjEzNTk2NGFiMlwvZGcwNnRveC1jOWVjNTNjNC1hNzg1LTQ1MTUtYjczZi0yNGNhNTc1ZmMzZmEucG5nIiwid2lkdGgiOiI8PTEyNDIifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.ux4nc7xDtM8rXmcplhgA9nR7O2hzuK7sSygAQRoJJo4" alt="Enemy Image">
            </div>
        </div>
        <div id="pet-status" class="status-item"><span>Pet HP:</span> ${pet.hp}/${pet.maxHp} | <span>Attack:</span> ${pet.attack}</div>
        <div id="wave-status" class="status-item"><span>Wave:</span> ${wave}</div>
        <div id="enemy-status" class="status-item"><span>Enemy HP:</span> ${enemy.hp}/${enemy.maxHp} | <span>Attack:</span> ${enemy.attack}</div>
        <div id="currency">Pesos: ${pesos}</div>
        <div id="stat-points">Stat Points: ${statPoints}</div>
        <button id="fight-button">Fight!</button>
        <button id="increase-hp-button">Increase HP</button>
        <button id="increase-attack-button">Increase Attack</button>
        <div id="shop">
            <div>
                <span id="heal-amount">Healing (+${healAmount} HP): 15 Pesos</span>
                <button id="buy-healing-button">Buy</button>
            </div>
            <div>
                <span id="attack-growth">Attack Growth (+${attackGrowth} Attack): 30 Pesos</span>
                <button id="buy-attack-button">Buy</button>
            </div>
        </div>
        <div id="wheel-container">
            <div id="wheel">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <button id="spin-button">Spin the Wheel (50 Pesos)</button>
        </div>
    `;
    document.getElementById('root').appendChild(gameDiv);

    document.getElementById('fight-button').addEventListener('click', fight);
    document.getElementById('increase-hp-button').addEventListener('click', increaseHp);
    document.getElementById('increase-attack-button').addEventListener('click', increaseAttack);
    document.getElementById('buy-healing-button').addEventListener('click', buyHealing);
    document.getElementById('buy-attack-button').addEventListener('click', buyAttackGrowth);
    document.getElementById('spin-button').addEventListener('click', spinWheel);
    updateStatus();
});
