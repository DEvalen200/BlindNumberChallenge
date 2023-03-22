const draggables = document.querySelectorAll(".draggable");
const containersTemp = document.querySelectorAll(".container");
const gameBoard = document.getElementById("game-board-normal");
const resultText = document.getElementById("result");
const instructionsHelper = document.getElementById("instructionsHelper");

const veryEasyButton = document.getElementById("veryEasyButton");
const easyButton = document.getElementById("easyButton");

const madeBy = document.getElementById("madeBy");

var currentTurn = 0;
var maxTurn = parseInt(localStorage.getItem("maxTurn")) || 10;
var currentDraggable;

var test = 0;
    
var canGenerateNextNumber = false;
    
var currentRandomNumber;
const numbersList = Array(maxTurn)//[-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,];
var containers = Array();

start();

function start()
{

    if (maxTurn < 5)
    {
        veryEasyButton.classList.add("veryEasyAdapted");
        easyButton.classList.add("easyAdapted");
    }

    for (let index = 0; index < containersTemp.length; index++) {
        if(index >= maxTurn)
        {
            if (!containersTemp[index].classList.contains("hidden"))
            {
                containersTemp[index].classList.add("hidden");
            }

        }
        else
        {
            if (containersTemp[index].classList.contains("hidden"))
            {
                containersTemp[index].classList.remove("hidden");
            }
        }
    }
    

    for (let index = 0; index < containersTemp.length; index++) {
        if (!containersTemp[index].classList.contains("hidden"))
        {
            containers.push(containersTemp[index]);
        }
    }
    
    gameBoard.style.setProperty('--grid-size-y', +maxTurn);
    resultText.style.setProperty("--y", +maxTurn);

    for (let index = 0; index < draggables.length; index++) {
        draggables[index].style.setProperty("--y", +maxTurn+1);
    }
    
    for (index = 0; index < numbersList.length; index++) {
        numbersList[index] = -1000;
    }
    
    currentDraggable = document.getElementById("draggable_0");
    currentRandomNumber = getRandomInt(1000);
    currentDraggable.innerHTML = currentRandomNumber.toString(); 
}

function reload()
{
    window.location.reload();
}

function getRandomInt(max) {
    var temp = Math.floor(Math.random() * max);
    while(numbersList.includes(temp))
    {
        temp = Math.floor(Math.random() * max);
    }


    /*temp = test;
    test++;*/

    //Check possible positions
    checkPossiblePositions(temp);
    if (checkIfLose() && currentTurn != 0)
    {
        lose();
    }
    else
    {
        currentDraggable.draggable = true;
    }
    
    canGenerateNextNumber = false;

    return temp;
  }

function checkIfLose()
{
    //If possible positions = 0;

    var possibleOptions = new Array();

    for (let index = 0; index < containers.length; index++) {
        if (containers[index].classList.contains("posibleOption"))
        {
            possibleOptions.push(containers[index]);
        }
        
    }

    if (possibleOptions.length > 0)
    {
        return false;
    }
    else
    {
        return true;
    }

}

function checkPossiblePositions(_temp)
{
    if (currentTurn == 0)
    {
        return;
    }

    var tempNumber = -1000;
    for (let index = 0; index < numbersList.length; index++) {
        if (numbersList[index] > _temp)
        {
            tempNumber = numbersList[index];
            break;
        }
    }

    var lastNumberInListIndex = -1000;
    if (tempNumber == -1000)
    {
        for (let index = 0; index < numbersList.length; index++) {
            if (numbersList[index] != -1000)
            {
                lastNumberInListIndex = index;
            }
        }

        for (let index = 0; index < containers.length; index++) {
            if (index > lastNumberInListIndex)
            {
                containers[index].classList.add("clickable");
                containers[index].classList.add("posibleOption");
            }
        }
    }
    else //Hay algún número mayor que currentNumber
    {
        var tempIndex = numbersList.indexOf(tempNumber);
    
        for (let index = numbersList.length-1; index < numbersList.length; index--) {
            if (index < tempIndex)
            {
                if (numbersList[index] == -1000)
                {
                    containers[index].classList.add("clickable");
                    containers[index].classList.add("posibleOption");
                }
                else
                {
                    break;
                }
            }
        }

    }
}

function lose()
{
    console.log("You Lost");
    currentDraggable.classList.add("lost");
    resultText.classList.remove("hidden");
    resultText.innerHTML = "YOU LOST"
}

function win()
{
    resultText.classList.remove("hidden");
    resultText.innerHTML = "YOU WON!"
    console.log("You Win");
}

function changeLevel(maxLevelTurn)
{
    localStorage.setItem("maxTurn", maxLevelTurn);
    reload();
    //start();
}

function showInstructions()
{
    if (instructionsHelper.classList.contains("hidden"))
    {
        instructionsHelper.classList.remove("hidden");
    }
    else
    {
        instructionsHelper.classList.add("hidden");
    }
}

document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
      if (canGenerateNextNumber)
      {
        currentDraggable.classList.remove("noNumber");
        currentRandomNumber = getRandomInt(1000);
        currentDraggable.innerHTML = currentRandomNumber.toString();
      }
    }
    else if (e.key == "r" ||
    e.code == "KeyR" ||      
    e.keyCode == 82 )
    {
        reload();
    }
  }

draggables.forEach(draggable =>{
    draggable.addEventListener("dragstart", () =>{
        draggable.classList.add("dragging");
    })

    draggable.addEventListener("click", () =>{
        if (draggable.classList.contains("noNumber"))
        {
            draggable.classList.remove("noNumber");
            currentRandomNumber = getRandomInt(1000);
            currentDraggable.innerHTML = currentRandomNumber.toString();
        }

    })

    draggable.addEventListener("dragend", () =>{
        draggable.classList.remove("dragging");
      
        containers.forEach(containter => {
                if (containter.classList.contains("dragObjective"))
                {
                    //Snap
                    draggable.style.setProperty("--y", parseInt(containter.id));
                    draggable.classList.remove("draggable");
                    draggable.setAttribute("draggable", false);
                    containter.classList.remove("dragObjective");
                    containter.classList.add("busy");
                    //Show next draggable
                    currentTurn++;
                    if (currentTurn >= maxTurn)
                    {
                        //Win
                        win();
                    }
                    else
                    {
                        var nextDraggable = document.getElementById("draggable_" + currentTurn.toString());
                        nextDraggable.classList.remove("hidden");
                        currentDraggable = nextDraggable;

                        currentDraggable.draggable = false;
                        numbersList[parseInt(containter.id)] = currentRandomNumber;

                    

                        //Remove PosibleOption and Clickable
                        for (let index = 0; index < containers.length; index++) {
                            containers[index].classList.remove("clickable");
                            if (containers[index].classList.contains("posibleOption"))
                            {
                                containers[index].classList.remove("posibleOption");
                            }
                        }

                        canGenerateNextNumber = true;
                        //Generate Next Number
                        /*currentRandomNumber = getRandomInt(1000);
                        currentDraggable.innerHTML = currentRandomNumber.toString();*/
                    }
                }
            })      
    })
})

madeBy.addEventListener("click", () =>{
    window.open("https://twitter.com/dev_valen", '_blank').focus();
})

containers.forEach(containter => {
    containter.addEventListener("dragover", e =>{

        if (!containter.classList.contains("dragObjective") && !containter.classList.contains("busy"))
        {
            if (currentTurn != 0)
            {
                if (containter.classList.contains("posibleOption"))
                {
                    containter.classList.add("dragObjective");
                }
            }
            else
            {
                containter.classList.add("dragObjective");
            }
        }
        else if (containter.classList.contains("dragObjective"))
        {
            e.preventDefault();
        }
    })

    containter.addEventListener("dragleave", e =>{
        if (containter.classList.contains("dragObjective"))
        {
            containter.classList.remove("dragObjective");
        }
    })

    containter.addEventListener("click", () =>{
        if (containter.classList.contains("clickable"))
        {
            //Select
                    //Snap
                    currentDraggable.style.setProperty("--y", parseInt(containter.id));
                    currentDraggable.classList.remove("draggable");
                    currentDraggable.setAttribute("draggable", false);
                    containter.classList.remove("dragObjective");
                    containter.classList.add("busy");
                    //Show next draggable
                    currentTurn++;
                    if (currentTurn >= maxTurn)
                    {
                        //Win
                        win();
                    }
                    else
                    {
                        var nextDraggable = document.getElementById("draggable_" + currentTurn.toString());
                        nextDraggable.classList.remove("hidden");
                        currentDraggable = nextDraggable;

                        currentDraggable.draggable = false;
                        numbersList[parseInt(containter.id)] = currentRandomNumber;

                    

                        //Remove PosibleOption and Clickable
                        for (let index = 0; index < containers.length; index++) {
                            containers[index].classList.remove("clickable");
                            if (containers[index].classList.contains("posibleOption"))
                            {
                                containers[index].classList.remove("posibleOption");
                            }
                        }

                        canGenerateNextNumber = true;
                        //Generate Next Number
                        /*currentRandomNumber = getRandomInt(1000);
                        currentDraggable.innerHTML = currentRandomNumber.toString();*/
                    }
            
        }
    })
})