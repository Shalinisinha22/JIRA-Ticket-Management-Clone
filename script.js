let addbtn=document.querySelector(".add-btn");
let removebtn=document.querySelector(".remove-btn")
let modalcont=document.querySelector(".modal-cont")
let mainCont=document.querySelector(".main-cont")
let textArea=document.querySelector(".textarea-cont")
let colors=["lightpink","lightblue","lightgreen","black"]
let modalPriorityColors=colors[colors.length-1]
let prioritycolor=document.querySelectorAll(".priority-color")
let toolboxcolor=document.querySelectorAll(".color")





let addFlag=false;
let removeFlag=false;

let lockClass="fa-lock"
let unlockClass="fa-lock-open"

let ticketsArr=[];

if(localStorage.getItem("jira_tickets")){
  //retrieve and display tickets
  ticketsArr=JSON.parse(localStorage.getItem("jira_tickets"));
  ticketsArr.forEach((ticketObj)=> {
        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId);
  })

}



addbtn.addEventListener("click",(e)=>{
    //display modal
       //addflag==true=>display modal
      //addflag==false=>remove modal
    addFlag=!addFlag
    if(addFlag){
      modalcont.style.display="flex"
     
     }
 else{
      modalcont.style.display="none"
 }
    
})


removebtn.addEventListener("click",(e)=>{
  removeFlag=!removeFlag


})

  



   //listener for modal priority coloring
   prioritycolor.forEach((colorElem,idx)=>{
    colorElem.addEventListener("click",(e)=>{
         prioritycolor.forEach((prioritycolorelem,idx)=>{
           prioritycolorelem.classList.remove("defaultBorder")
     })

    colorElem.classList.add("class","defaultBorder")
    let color=colorElem.classList[1];
    modalPriorityColors=color
    
      
  })
  })




   //generate tickets  
   modalcont.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
   
      createTicket(modalPriorityColors,textArea.value) 
    
     addFlag=false
     setModalToDefault()
    }
 
   })




function createTicket(ticketColor,ticketTask,ticketId){

  let id= ticketId || shortid();
  let ticketCont=document.createElement("div")
  ticketCont.setAttribute("class","ticket-cont")
  ticketCont.innerHTML=`                
                         <div class="ticket-color ${ticketColor}"></div>
                          <div class="ticket-id">
                              ${id}
                          </div>
                        <div class="task-area ">
                           ${ticketTask}
                        </div>
                        <div class="lock">
                            <i class="fa-solid fa-lock"></i>
                        </div>

       `
       mainCont.appendChild(ticketCont)

       //create objects of ticket and add to array
     
       if(!ticketId){
        ticketsArr.push({ticketColor,ticketTask,ticketId:id});
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
       }
    

       handleremoval(ticketCont,id)
       handleLock(ticketCont,id)
       handleColor(ticketCont,id)
}




function handleremoval(ticket,id){
   ticket.addEventListener("click",(e)=>{
        if(removeFlag){
          //db remove
         let idx= getTicketIdx(id);
         ticketsArr.splice(idx,1);
         let stringTicketArr=JSON.stringify(ticketsArr);
         localStorage.setItem("jira_tickets",stringTicketArr)

         ticket.remove();//ui remove

         }
  })


}



function handleLock(ticket,id){
  let ticketlockElem=ticket.querySelector(".lock")
  let tickettaskarea=ticket.querySelector(".task-area")
  let ticketlock=ticketlockElem.children[0];
  ticketlock.addEventListener("click",(e)=>{
    let ticketIdx=getTicketIdx(id)

     if(ticketlock.classList.contains(lockClass)){
       ticketlock.classList.remove(lockClass)
       ticketlock.classList.add(unlockClass)
       tickettaskarea.setAttribute("contenteditable","true")
       tickettaskarea.setAttribute("spellcheck","false")


     } 
     else {
      ticketlock.classList.remove(unlockClass)
      ticketlock.classList.add(lockClass)
      tickettaskarea.setAttribute("contenteditable","false")
     }

    //modify data in local storage(ticket task area) 
     ticketsArr[ticketIdx].ticketTask=tickettaskarea.innerText;
     localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr))

  })
}


function handleColor(ticket,id){
  let ticketcolor=ticket.querySelector(".ticket-color")
  ticketcolor.addEventListener("click",(e)=>{
    //get ticketidx from ticketsarr
    let ticketIdx=getTicketIdx(id)
    let currentTicketcolor=ticketcolor.classList[1]

    let CTCidx=colors.findIndex((color)=>{
            return currentTicketcolor===color//return index
    })
   CTCidx++;
   let newticketcoloridx=CTCidx % colors.length;
   let newticketcolor=colors[newticketcoloridx]
   ticketcolor.classList.remove(currentTicketcolor);
   ticketcolor.classList.add(newticketcolor)

    //modify data in local storage(priority color changed)
 ticketsArr[ticketIdx].ticketColor=newticketcolor
 localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr))
  })


}

function getTicketIdx(id){
  let ticketIdx=ticketsArr.findIndex((ticketObj)=>{
    return ticketObj.ticketId===id;
  })
  return ticketIdx
}



for(let i=0;i<toolboxcolor.length;i++){

  toolboxcolor[i].addEventListener("click",(e)=>{
    let CTCtoolboxcolor=toolboxcolor[i].classList[0]
   let filteredTicketArr= ticketsArr.filter((ticketObj,idx)=>{
                     return CTCtoolboxcolor===ticketObj.ticketColor;
    })

    //remove previous ticket
    let allticketscont=document.querySelectorAll(".ticket-cont")
    for(let i=0;i<allticketscont.length;i++){
      allticketscont[i].remove();
    }
//display filtered ticket
    filteredTicketArr.forEach((ticketObj,idx)=>{
      createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId)
    })
   })
 

  toolboxcolor[i].addEventListener("dblclick",(e)=>{
         //remove previous ticket
    let allticketscont=document.querySelectorAll(".ticket-cont")
    for(let i=0;i<allticketscont.length;i++){
      allticketscont[i].remove();
    }

   ticketsArr.forEach((ticketObj)=>{
      createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId)  
   })
  })
}

function setModalToDefault(){
  modalcont.style.display="none"
    textArea.value="";
   modalPriorityColors=colors[colors.length-1]
  prioritycolor.forEach((prioritycolorelem,idx)=>{
     prioritycolorelem.classList.remove("defaultBorder")
         })
      
    prioritycolor[prioritycolor.length-1].classList.add("class","defaultBorder")
  
  

    }