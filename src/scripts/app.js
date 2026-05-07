"use strict";
/*
const promise = fetch("assets/data/file.txt");
// passer par une fonction nommée
promise.then(fetchResolve);

function fetchResolve(){
// code 
}

//méthode 2 : passer par une fonction anonyme
promise.then(function() {
    // code 
});
*/

// sans variable 

/* EXO 1 JAVA SCRIPT

var btn = document.querySelector(".btn--fetch");
var p = document.querySelector(".text--fetch");

btn.addEventListener("click", function(event){
    event.preventDefault();
    var target = event.currentTarget;
    var url = target.getAttribute("href");
    console.log(target);

    fetch("assets/data/description.txt")
    .then(function (response) {
        return response.text();
    })
    .then(function (data) {
        console.log(data);
        p.innerText = data;
    })
    
    .catch(function (error) {
        console.log("errrrrrrror");
    })
});

*/

// EXO 2 JAVA SCRIPT

/*
var btn = document.querySelector(".button");
var select = document.querySelector(".files-select");
var div = document.querySelector(".content");

btn.addEventListener("click", function(event){
    var selectedValue = select.value;
    var url = "assets/data/" + selectedValue;

    fetch(url)   
    .then(function (response) {
        return response.text();
    })
    .then(function (data) {
        console.log(data);
        div.innerHTML = data;
    })
    
    .catch(function (error) {
        console.log("errrrrrrror");
    })

});
*/

/*
fetch("assets/data/description.txt")
    .then(function(response) {
        return response.text();
    })
    .then(function (data) {
        console.log(data);
    })
    
    .catch(function(error) {
        console.log("errrrrrrror");
    });
*/

// EXO JSON JAVA SCRIPT

/*
var button = document.querySelector(".btn");
var PetitBtn = document.querySelector(".btn2");
var elTitle = document.querySelector(".title");
var elAddress = document.querySelector(".address");
var elSection = document.querySelector(".section");

button.addEventListener("click", onButtonClick);
PetitBtn.addEventListener("click", onButtonClick);

function onButtonClick(event) {
    console.log("button cliqué");

    var target = event.currentTarget;

    fetch("assets/data/heaj.json")
    .then(function(response) {
       return response.json(); // extrait le json de la réponse 
    })
    .then(function(data) {
        console.log(data); // data = traitement du then() précédent
        console.log(data.name);
        console.log(data.sections[3]);

        elTitle.innerText = data.name;
        elAddress.innerText = data.address.street;
        elSection.innerText = data.sections[3];
    })
}
*/

/*
var list =[
    { firstname: "John", lastname: "Doe"},
    { firstname: "Jane", lastname: "Doe"},
    { firstname: "Toto", lastname: "Titi"},
    ];

list.forEach(function(item) {
    console.log(item);
});

var buttons = document.querySelectorAll(".btn");
buttons.forEach(function(item) {
    console.log(item)
});

var btn = document.querySelector(".btn");
var btn2 = document.querySelector(".btn2");
btn.addEventListener("click", onButtonClick);
btn2.addEventListener("click", onButtonClick);

function onButtonClick(event) {
    var target = event.currentTarget;
    var url = target.getAttribute("data-url"); // data-url à mettre sur un button dans le html. exemple : data-url="assets/data/heaj.json"
    fetch(url);
}
*/

/*
var Links = document.querySelectorAll(".link");

Links.innerText = "yo";
var url = Links.getAttribute("href");
Links.setAttribute("href", "http://google.com");

var btn = document.querySelector(".btn");
btn.addEventListener("click", function(event) {
    fetch(assests/data/heaj.json)
});
*/

/*
var section = document.querySelector(".content");

var parag = document.createElement("p");
parag.innerText = "Hello world";

var parag2 = document.createElement("p");
parag2.innerText = "Hello world 2";

section.appendChild(parag);
section.appendChild(parag2);
*/

// EXO FETCH API

fetch("https://web.mayfly.ovh/api.php?type=city&query=b")
    .then(function(response) {
       return response.json();
    })

    .then(function(data) {
        console.log(data)
        data.forEach(function(obj) {
            console.log(obj.title);
            var li = document.createElement("li");
            li.innerText = obj.title;
            ul.appendChild(li);
        }
    )})

            
  