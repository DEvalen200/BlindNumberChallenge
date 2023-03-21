const draggables = document.querySelectorAll(".draggable");
const containters = document.querySelectorAll(".container");

var currentTurn = 0;
var maxTurn = 10;
var currentDraggable;

var currentRandomNumber;

currentDraggable = document.getElementById("draggable_0");
currentRandomNumber = getRandomInt(1000);
currentDraggable.innerHTML = currentRandomNumber.toString();

function reload()
{
    window.location.reload();
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

draggables.forEach(draggable =>{
    draggable.addEventListener("dragstart", () =>{
        draggable.classList.add("dragging");
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
                    }
                    else
                    {
                        var nextDraggable = document.getElementById("draggable_" + currentTurn.toString());
                        nextDraggable.classList.remove("hidden");
                        currentDraggable = nextDraggable;
                        currentRandomNumber = getRandomInt(1000);
                        currentDraggable.innerHTML = currentRandomNumber.toString();
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