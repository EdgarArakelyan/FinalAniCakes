let cakeArray = [];

// define a constructor to create player objects
var CakeObject = function (pOrder, pFlavor, pDay, pTime, pPeople) {
  this.Order = pOrder;
  this.Flavor = pFlavor;    
  this.Day = pDay;
  this.Time = pTime;
  this.People = pPeople;  // action  comedy  drama  horrow scifi  musical  western
}


document.addEventListener("DOMContentLoaded", function () {

  document.getElementById("buttonAdd").addEventListener("click", function () {
    let selectedPeople = $('#select-people').val();

    let newCakeObject = new CakeObject(document.getElementById("order").value, document.getElementById("flavor").value,
      selectedPeople, document.getElementById("day").value, document.getElementById("time").value);

    addCakeOrder(newCakeObject);
  });

  $(document).on("pagebeforeshow", "#ListAll", function (event) {   // have to use jQuery 
    FillArrayFromServer();
  });

  $(document).on("pagebeforeshow", "#refreshPage", function (event) {   
    document.location.href = "index.html#ListAll";
  });

  document.getElementById("buttonSortOrder").addEventListener("click", function () {
    cakeArray = cakeArray.sort(compareOrder);
    createList();    
  });

  document.getElementById("buttonSortPeople").addEventListener("click", function () {
    cakeArray = cakeArray.sort(comparePeople);
    createList();    
  });

  document.getElementById("buttonDelete").addEventListener("click", function () {
    let orderNumber = document.getElementById("deleteOrder").value;
    // doing the call to the server right here
    fetch('users/deleteCakeOrder/' + orderNumber, {
        method: 'DELETE'
    })  
    // now wait for 1st promise, saying server was happy with request or not
    .then(responsePromise1 => responsePromise1.text()) // ask for 2nd promise when server is node
    .then(responsePromise2 =>  console.log(responsePromise2), document.location.href = "index.html#refreshPage")  // wait for data from server to be valid
    // force jump off of same page to refresh the data after delete
    .catch(function (err) {
        console.log(err);
        alert(err);
    });

  });


  document.getElementById("buttonClear").addEventListener("click", function () {
    document.getElementById("order").value = "";
    document.getElementById("flavor").value = "";
    document.getElementById("day").value = "";
    document.getElementById("time").value = "";
  });
  
  $(document).on("pagebeforeshow", "#Load", function (event) {   // have to use jQuery 
    document.getElementById("order").value = "";
    document.getElementById("flavor").value = "";
    document.getElementById("day").value = "";
    document.getElementById("time").value = "";
  });

  $(document).on("pagebeforeshow", "#detailPage", function (event) {   // have to use jQuery 
    let localOrder =  document.getElementById("IDparmHere").innerHTML;
    for(let i=0; i < cakeArray.length; i++) {   
      if(cakeArray[i].Order == localOrder){
        document.getElementById("oneOrder").innerHTML = cakeArray[i].Order;
        document.getElementById("oneFlavor").innerHTML = cakeArray[i].Flavor;  
        document.getElementById("oneDay").innerHTML = cakeArray[i].Day;
        document.getElementById("oneTime").innerHTML = cakeArray[i].Time;
        document.getElementById("onePeople").innerHTML = cakeArray[i].People;

        break;
      }
    }
  });

});

function createList()
{
  // clear prior data
  var divCakeList = document.getElementById("divCakeList");
  while (divCakeList.firstChild) {    // remove any old data so don't get duplicates
    divCakeList.removeChild(divCakeList.firstChild);
  };

  var ul = document.createElement('ul');
  cakeArray.forEach(function (element,) {   // use handy array forEach method
    var li = document.createElement('li');
    li.innerHTML = "<a data-transition='pop' class='oneCake' data-parm=" + element.Order + " href='#'>Get Details </a> " + element.Order + "  " + element.People;
    ul.appendChild(li);
  });
  divCakeList.appendChild(ul)

    //set up an event for each new li item, if user clicks any, it writes >>that<< items data-parm into the hidden html 
    var classname = document.getElementsByClassName("oneCake");
    Array.from(classname).forEach(function (element) {
        element.addEventListener('click', function(){
            var parm = this.getAttribute("data-parm");            
            document.getElementById("IDparmHere").innerHTML = parm;
            document.location.href = "index.html#detailPage";
        });
    });
   
};



function compareOrder(a, b) {
  // Use toUpperCase() to ignore character casing
  const cakeA = a.Order.toUpperCase();
  const cakeB = b.Order.toUpperCase();

  let comparison = 0;
  if (cakeA > cakeB) {
    comparison = 1;
  } else if (cakeA < cakeB) {
    comparison = -1;
  }
  return comparison;
}


function comparePeople(a, b) {
  // Use toUpperCase() to ignore character casing
  const cakeA = a.People.toUpperCase();
  const cakeB = b.People.toUpperCase();

  let comparison = 0;
  if (cakeA > cakeB) {
    comparison = 1;
  } else if (cakeA < cakeB) {
    comparison = -1;
  }
  return comparison;
}


// code to exchange data with node server

function FillArrayFromServer() {
  // using fetch call to communicate with node server to get all data
  fetch('/users/cakeList')
  .then(function (theResonsePromise) {  // wait for reply.  Note this one uses a normal function, not an => function
      return theResonsePromise.json();
  })
  .then(function (serverData) { // now wait for the 2nd promise, which is when data has finished being returned to client
  console.log(serverData);
  cakeArray.length = 0;  // clear array
  cakeArray = serverData;   // use our server json data which matches our objects in the array perfectly
  createList();  // placing this here will make it wait for data from server to be complete before re-doing the list
  })
  .catch(function (err) {
   console.log(err);
  });
};


// using fetch to push an object up to server
function addCakeOrder(newCakeObject){
 
  // the required post body data is our movie object passed in, newMovie
  
  // create request object
  const request = new Request('/users/addCakeOrder', {
      method: 'POST',
      body: JSON.stringify(newCakeObject),
      headers: new Headers({
          'Content-Type': 'application/json'
      })
  });
  
  // pass that request object we just created into the fetch()
  fetch(request)
      // wait for frist server promise response of "200" success (can name these returned promise objects anything you like)
      // Note this one uses an => function, not a normal function, just to show you can do either 
      .then(theResonsePromise => theResonsePromise.json())    // the .json sets up 2nd promise
      // wait for the .json promise, which is when the data is back
      .then(theResonsePromiseJson => console.log(theResonsePromiseJson), document.location.href = "#ListAll" )
      // that client console log will write out the message I added to the Repsonse on the server
      .catch(function (err) {
          console.log(err);
      });
  
}; // end of addNewUser
