var url = "https://api.propublica.org/congress/v1/113/house/members.json";

const veriapi = {
        method : 'GET',
        datatype: 'json',
        headers: {'X-API-Key': 'y1Bqhhulf34HcIz3ljl8wDbbDyRfseLXfJPZL8NG'}};

if (document.title.includes("Senate")) {
    url = "https://api.propublica.org/congress/v1/113/senate/members.json";
} 

fetch(url, veriapi)
    .then(response => response.json())
    .then(json => {
            data = json;
            app.senators = data.results[0].members;
            if (document.getElementById("app") != undefined) {
                tableNumberMembers(app.senators);
                states(app.senators)
                hideSpinner();
            }
            if (document.getElementById("tablesHouseAt") != undefined || document.getElementById("tablesSenateAt") != undefined) {
                engageds(app.senators);
                loyals(app.senators);
                hideSpinner();
            }
            if (document.getElementById('chfilt')) {
                hideSpinner();
            }
            
    })
    // .catch(error => alert("Ups no se encontro nada!! Proba a cargar la pagina devuelta!"))

var app = new Vue({  
        el: '#app',  
        data: {    
            senators: [],
            states: [],
            checkbox: [],
            stateSelected: "",
            statistics: {
                totalNumberOfMembers: 0,
                numberOfDemocrats: [], 
                numberOfRepublicans: [], 
                numberOfIndependents: [], 
                voteAverageDemocrats: 0,
                voteAverageRepublicans: 0,
                voteAverageIndependents: 0,
                leastLoyal: [],
                mostLoyal: [],
                leastEngaged: [],
                mostEngaged: [],
            },
        },
        methods: {
            filter(member){
                return this.checkbox.includes(member)
            },
        }
}); 

function tableNumberMembers (totalMembers){
let democratsAux = []; 
let republicansAux = []; 
let independentsAux = [];  
var suma = 0;
var suma2 = 0;
var suma3 = 0;
  
totalMembers.forEach(member =>{ 
            if (member.party==="D"){
                    democratsAux.push(member.votes_with_party_pct);
                    suma = 0;
                    for (let i = 0; i < democratsAux.length; i++) {
                       au = democratsAux[i];
                       suma += au;    
                }       
            } else if (member.party==="R"){
                    republicansAux.push(member.votes_with_party_pct);
                    suma2 = 0;
                    for (let i = 0; i < republicansAux.length; i++) {
                       au2 = republicansAux[i];
                       suma2 += au2;
                    }
            } else if (member.party==="ID") {
              independentsAux.push(member.votes_with_party_pct);
              suma3 = 0;
              for (let i = 0; i < independentsAux.length; i++) {
                 au3 = independentsAux[i];
                 suma3 += au3;
            } 
          } else {}
});
app.statistics.totalNumberOfMembers = democratsAux.length + republicansAux.length + independentsAux.length;
app.statistics.numberOfDemocrats = democratsAux;
app.statistics.numberOfRepublicans = republicansAux;
app.statistics.numberOfIndependents = independentsAux;
app.statistics.voteAverageDemocrats = (suma / democratsAux.length).toFixed(2);
app.statistics.voteAverageRepublicans = (suma2 / republicansAux.length).toFixed(2);
app.statistics.voteAverageIndependents = (suma3 / independentsAux.length != 0 ? independentsAux.length : 1).toFixed(2);
}

function states(totalMembers){
    totalMembers.forEach(member => {
        if (app.states.includes(member.state) != true){
            app.states.push(member.state)
        }
    })
}

function engageds(totalMembers) {
          var listMembMost = []; 
  
              totalMembers.forEach(member =>{ 
                          listMembMost.push(member);
              }); 
      
              listMembMost.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct);
  
              var membDem10 = Math.round((listMembMost.length) * 0.1);

              app.statistics.mostEngaged = listMembMost.splice(membDem10, Math.round((listMembMost.length) * 0.9))
  
          var listMembLeast = []; 
  
              totalMembers.forEach(member =>{ 
                          listMembLeast.push(member);
              });
      
              listMembLeast.sort((a, b) => b.missed_votes_pct - a.missed_votes_pct);
  
              var membDem10Mas = Math.round((listMembLeast.length) * 0.1);
              
              app.statistics.leastEngaged = listMembLeast.splice(membDem10Mas, Math.round((listMembLeast.length) * 0.9))

app.statistics.mostEngaged = listMembMost;
app.statistics.leastEngaged = listMembLeast;
} 

function loyals (totalMembers) {
          var listMembLessOften = []; 
  
              totalMembers.forEach(member =>{ 
                  if(member.votes_with_party_pct > 0)
                          listMembLessOften.push(member);
              }); 
      
              listMembLessOften.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct);
  
  
              var membDem10 = Math.round((listMembLessOften.length) * 0.1);

              app.statistics.leastLoyal = listMembLessOften.splice(membDem10, Math.round((listMembLessOften.length) * 0.9))
  
          var listMembMoreOften = []; 
  
              totalMembers.forEach(member =>{ 
                          listMembMoreOften.push(member);
              });
      
              listMembMoreOften.sort((a, b) => b.votes_with_party_pct - a.votes_with_party_pct);
  
              var membDem10Mas = Math.round((listMembMoreOften.length) * 0.1);
              
              app.statistics.mostLoyal = listMembMoreOften.splice(membDem10Mas, Math.round((listMembMoreOften.length) * 0.9));

app.statistics.mostLoyal = listMembMoreOften;
app.statistics.leastLoyal = listMembLessOften;
}

function botonReadmore() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("myBtn");
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more...";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less";
      moreText.style.display = "inline";
      btnText.style.textDecoration = "none";
    }
}

function hideSpinner() {
        document.getElementById('spinner')
                .style.display = 'none';
} 