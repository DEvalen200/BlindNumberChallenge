const draggables = document.querySelectorAll(".draggable");
const containters = document.querySelectorAll(".container");

var currentTurn = 0;
var maxTurn = 10;
var currentDraggable;

var currentRandomNumber;
const numbersList = Array(maxTurn)//[-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,-1000,];

for (index = 0; index < numbersList.length; index++) {
    numbersList[index] = -1000;
}

currentDraggable = document.getElementById("draggable_0");
currentRandomNumber = getRandomInt(1000);
currentDraggable.innerHTML = currentRandomNumber.toString();

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


    //Check possible positions
    checkPossiblePositions(temp);
    if (checkIfLose())
    {
        console.log("You Lost");
    }
    else
    {
        currentDraggable.draggable = true;
    }
    
    return temp;
  }

function checkIfLose()
{
    //If possible positions = 0;

    var possibleOptions = new Array();

    for (let index = 0; index < containters.length; index++) {
        if (containters[index].classList.contains("posibleOption"))
        {
            possibleOptions.push(containters[index]);
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

        for (let index = 0; index < containters.length; index++) {
            if (index > lastNumberInListIndex)
            {
                containters[index].classList.add("posibleOption");
            }
        }
    }
    else //Hay algún número mayor que currentNumber
    {
        var tempIndex = numbersList.indexOf(tempNumber);
    
        for (let index = 9; index < numbersList.length; index--) {
            if (index < tempIndex)
            {
                if (numbersList[index] == -1000)
                {
                    containters[index].classList.add("posibleOption");
                }
                else
                {
                    break;
                }
            }
        }

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
      
        containters.forEach(containter => {
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
                        console.log("You Win");
                    }
                    else
                    {
                        var nextDraggable = document.getElementById("draggable_" + currentTurn.toString());
                        nextDraggable.classList.remove("hidden");
                        currentDraggable = nextDraggable;

                        currentDraggable.draggable = false;
                        numbersList[parseInt(containter.id)] = currentRandomNumber;

                        //Remove PosibleOption
                        for (let index = 0; index < containters.length; index++) {
                            if (containters[index].classList.contains("posibleOption"))
                            {
                                containters[index].classList.remove("posibleOption");
                            }
                        }

                        //Generate Next Number
                        /*currentRandomNumber = getRandomInt(1000);
                        currentDraggable.innerHTML = currentRandomNumber.toString();*/
                        console.log(numbersList);
                    }
                }
            })      
    })
})

containters.forEach(containter => {
    containter.addEventListener("dragover", e =>{
        e.preventDefault();
        if (!containter.classList.contains("dragObjective") && !containter.classList.contains("busy") )
        {
            containter.classList.add("dragObjective");
        }
    })

    containter.addEventListener("dragleave", e =>{
        if (containter.classList.contains("dragObjective"))
        {
            containter.classList.remove("dragObjective");
        }
    })
})