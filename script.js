//creates an enemy class
class enemyValues {
    constructor(hp = (Math.floor(Math.random() * 4) + 2),fp = (Math.floor(Math.random() * 2) + 1), ac =  (Math.floor(Math.random()) * .4) + .2) {
        this.hp = hp;
        this.fp = fp;
        this.ac = ac;
    }
}


//initiate list of enemies
let enemyList = [];

let enemyStats = document.querySelector(".enemyStats")
let enemyAttributes = enemyStats.innerText.split("\n")
let enemyAttributes2 = enemyAttributes[0].split(" ")
let enemyHull = enemyAttributes2[2];
enemyAttributes2 = enemyAttributes[1].split(" ")
let enemyFP = enemyAttributes2[2];
enemyAttributes2 = enemyAttributes[2].split(" ")
let enemyAC = enemyAttributes2[2];

//set original enemy to object and pushes it to total enemies
let newEnemy = new enemyValues(enemyHull,enemyFP,enemyAC);
enemyList.push(newEnemy)


//makes multiple enemies
function createEnemies(x) {
    let numEnemies = Math.floor(Math.random()*3) + x;

    for(let i = 1;i<=numEnemies;i++){
        newEnemy = new enemyValues()
        enemyList.push(newEnemy)
    }
}
//calls the function
createEnemies(3)

//create player
let playerStats = document.querySelector(".playerStats")
let playerAttributes = playerStats.innerText.split("\n")
let playerAttributes2 = playerAttributes[0].split(" ")
let playerHull = playerAttributes2[2];
playerAttributes2 = playerAttributes[1].split(" ")
let playerFP = playerAttributes2[2];
playerAttributes2 = playerAttributes[2].split(" ")
let playerAC = playerAttributes2[2];
//missles
let missles = 3;
let playerValues = [playerHull,playerFP,playerAC,missles]

playerStats.innerText = `Hull : ${playerHull}\nFirepower : ${playerFP}\nAccuracy : ${playerAC}\nMissles :${missles}`; 

let mode = prompt('What game mode do you want to play?\nArcade("A") or Endless("E")')

alert("Click on the ship to fight off the invader!")
//get id of img to set add event listener
let ship = document.querySelector(".playerImage");
let shipStatus = true;

let attackTarget;

//No megaship in the beginning
let megaShip = false;
let targetNum;

let points = 0;
let round = 3;

ship.addEventListener("click", function(){
    //ship status determines if the game is on
    if(shipStatus==true){
        //random shield function
        if(Math.random()>.7){
            alert("SHIELDS ACTIVATE\nHull's looking stronger");
            playerHull++;
            playerHull+=2;
        }
        //set prompt for targetting attack command
        targetNum = (prompt(`There are ${enemyList.length}, which do you want to target?`))-1;
        while(megaShip==true && enemyList.length>1 && targetNum==0){
            alert("The Ship's weapons are in the way, try again")
            targetNum = (prompt(`There are ${enemyList.length}, which do you want to target?`))-1;
        }
        attackTarget = enemyList[targetNum]
        attackCommand(attackTarget)
        
        resultScreen()
    //ask if the player wants to play again
    } else {
        let playAgain = confirm("Ready for another go trooper?");
        if(playAgain == true){
            playerHull = 15;
            createEnemies(3);
            shipStatus = true;
            alert("Click on the ship to fight off the invader!")
            attackTarget = enemyList[0]
            megaShip = false;
            mode = prompt('What game mode do you want to play?\nArcade("A") or Endless("E")')
        } else {
            alert('GAME OVER')
        }
    }
    //resets the dom
    playerStats.innerText = `Hull : ${playerHull}\nFirepower : ${playerFP}\nAccuracy : ${playerAC}\nMissles :${missles}`; 
    enemyStats.innerText = `Hull : ${attackTarget.hp}\nFirepower : ${attackTarget.fp}\nAccuracy : ${attackTarget.ac}`;
})

//Math damage
function attackCommand(target){
    //missles
    let useMissle;
    if(missles>0){
        useMissle = confirm(`Use Missle?`)
        if(useMissle){
         missles--;
        }
    }
    //player attacks
    if((Math.random())<playerAC){
        if(useMissle){
            target.hp-= ((playerFP*1)+3)
        }else{
            target.hp-= playerFP;
        }
        alert("What a Hit!")
    } else {
        alert("You'll get them next time")
    }
    //enemy attacks
    for(let i in enemyList){
        if(enemyList[i].hp>0){
            if((Math.random())<enemyList[i].ac){
                playerHull-= enemyList[i].fp;
                alert("Looks like the enemy got you")
            } else {
                alert(`That was close! Enemy ${(i*1)+1} almost got you.`)
            }
        }
    }
}

function resultScreen(){
    //if the player loses
    if(playerHull<=0) {
        alert("COMMANDER, CAN YOU HEAR ME?! COMAAAAANDEEER!!")
        shipStatus=false;
        if(mode== "e"){
            alert(`You earned ${points} points.`)
        }
    //checks if there are still enemies
    } else if(attackTarget.hp<=0){
        enemyList.splice(targetNum,1)
        points++;
        //if player defeats an enemy, let the player know
        if(enemyList.length>0){
            alert("Now's not the time to celebrate, more incoming")
        } else {
            if(mode.toUpperCase() == "A"){
                arcadeEnding()
            } else if(mode.toUpperCase() == "E"){
                endlessEnding()
            }
            
            
        }
    
    }
}

function arcadeEnding(){
    alert("Congratulations soldier, you're going home!")
            //if the player has enough health and enough missles, it starts the boss fight
            if(megaShip==false && playerHull>10 && missles>2){
                alert("Wait, What is that!");
                alert("Oh no, it's the Mega-Ship!")
                alert("You have to get through the weapons before you can attack the main hull (Enemy 1)")
                //creates the boss
                newEnemy = new enemyValues(10,8,0.1);
                enemyList.push(newEnemy)
                //creates the weapons
                for(let i =0; i<4;i++){
                    newEnemy = new enemyValues (10, 2, 0.5)
                    enemyList.push(newEnemy)
                }
                enemyList.push()
                attackTarget = enemyList[0];
                megaShip = true;
            } else {
                shipStatus=false;
            }
}

function endlessEnding(){
    alert("Time to get ready for the next battle")
    alert(`You have ${points} points, you can use them to upgrade your stats.`)
    let upgrade = true;
    while(upgrade == true && points>=1){
        upgrade = confirm(`Points: ${points} Hull: ${playerValues[0]}\nWould you like to upgrade Hull for 1 point?`)
        if(upgrade){
            points--
            playerValues[0]++
        }
    }
    upgrade = true;
    while(upgrade == true && points>=2){
        upgrade = confirm(`Points: ${points} FP: ${playerValues[1]}\nWould you like to upgrade FP for 2 points?`)
        if(upgrade){
            points-=2;
            playerValues[1]++
        }
    }
    upgrade = true;
    while(upgrade == true && points>=3){
        upgrade = confirm(`Points: ${points} AC: ${playerValues[2]}\nWould you like to upgrade AC for 3 points?`)
        if(upgrade){
            points-=3;
            playerValues[2]= ((playerValues[2]*10)+1)/10;
        }
    }
    upgrade = true;
    while(upgrade == true && points>=3){
        upgrade = confirm(`Points: ${points} Missles: ${playerValues[3]}\nWould you like to upgrade missles for 3 points?`)
        if(upgrade){
            points-=3;
            playerValues[3]++
        }
    }
    playerHull = playerValues[0];
    playerFP = playerValues[1];
    playerAC = playerValues[2];
    missles = playerValues[3];
    round+=2;
    createEnemies(round)
    alert("Time to the next round")
}