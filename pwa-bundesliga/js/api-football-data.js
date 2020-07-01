const url = 'https://api.football-data.org';
const API_TOKEN = '6164ddf5a832426380c9624cdb95eb1f';

function changeImageProtocol(url) {
    return url.replace(/^http:\/\//i, 'https://');
}
function status(response) {
    if (response.errorCode == undefined) {
        return Promise.resolve(response);
    } else {
        console.log(`Error : ${response.status}`);
        return Promise.reject(new Error(response.statusText));
    }
}
  
function setJSON(response) {
    return response.json();
}

function error(error) {
    console.log(`Error in fetching : ${error}`);
}

function fetchAPI(urlAPI) {
    return fetch(urlAPI, 
    { 
        headers : 
        {
            'X-Auth-Token' : API_TOKEN
        }
    })
    .then(status)
    .then(setJSON)
    .catch(error);
}

function teams (season='2018', id_competition='2002') {
    const urlAPI = `${url}/v2/competitions/${id_competition}/teams?season=${season}`;

    if ('caches' in window) {
        caches.match(urlAPI)
            .then( (response) => {
                if (response) {
                    response.json().then( (result) => {
                        $('#year-season').html(season);
                        renderTeamSection(result);
                    })
                }
            })
    }

    fetchAPI(urlAPI)
        .then( result => {
            $('#year-season').html(season);
            renderTeamSection(result);
        })
        .catch(error => {
            console.log(`Error in rendering : ${error}`);
        });
}

function renderTeamSection(result) {
    let setHTML = '<div class="row">';
    if(result.teams.length > 0) {
        let page = window.location.hash.substr(1);
        if (page == "") page = "beranda";
        
        switch (page) {
            case "beranda":
                setHTML += berandaTeamRender(result);
                break;
            
            case "klub":
                setHTML += klubTeamRender(result);
                break;
            
            default:
                setHTML += berandaTeamRender(result);
                break;
        }
    }else{
        console.log("Tidak ada tim");
    }
    setHTML +='</div>';

    $(".team-list").html(setHTML);
}

function berandaTeamRender(result){
    let setHTML = '';
    let imgUrl = '';
    for(let i=0; i<result.teams.length; i++){
        const teams = result.teams[i];
        imgUrl = changeImageProtocol(teams.crestUrl);
        setHTML += `<img src="${imgUrl}" alt="Logo ${teams.name}" class="img-team">`;
    }

    return setHTML;
}

function klubTeamRender(result){
    let setHTML = '';
    let imgUrl = '';
    for(let i=0; i<result.teams.length; i++){
        const teams = result.teams[i];
        const arrColor = teams.clubColors.split("/");
        let setColor = arrColor[0].trim().toLowerCase();
        let setColorText = "white-text";
        imgUrl = changeImageProtocol(teams.crestUrl);

        if (setColor === "black") {
            setColor = "grey";
        } else if (setColor === "white") {
            setColorText = "";
        }

        setHTML += `<div class="col l6 s12">
                <div class="card horizontal ${setColor} hide-on-small-only">
                    <div class="card-image ${setColor} darken-2">
                        <img src="${imgUrl}" alt="Logo ${teams.name}" class="img-team">
                    </div>
                    <div class="card-stacked">
                        <div class="card-content ${setColorText}">
                            <span class="card-title"><strong>${teams.name}</strong></span>
                            <div class="divider"></div>
                            ${teams.founded} - ${teams.venue}
                        </div>
                    </div>
                </div>
                <div class="card ${setColor} hide-on-med-and-up">
                    <div class="card-image ${setColor} darken-2" style="text-align: -webkit-center">
                        <img src="${imgUrl}" alt="Logo ${teams.name}" class="img-team">
                    </div>
                    <div class="card-stacked">
                        <div class="card-content ${setColorText} center">
                            <span class="card-title"><strong>${teams.name}</strong></span>
                            <div class="divider"></div>
                            ${teams.founded} - ${teams.venue}
                        </div>
                    </div>
                </div>
            </div>`;
    }

    return setHTML;
}

function tableStandings (season='2018', id_competition='2002') {
    const urlAPI = `${url}/v2/competitions/${id_competition}/standings?season=${season}&standingType=TOTAL`;
    
    if ('caches' in window) {
        caches.match(urlAPI)
            .then( (response) => {
                if (response) {
                    response.json().then( (result) => {
                        $('#year-season').html(season);
                        renderTableStandingSection(result);
                    })
                }
            })
    }

    fetchAPI(urlAPI)
            .then( result => {
            $('#year-season').html(season);
            renderTableStandingSection(result);
        })
        .catch(error => {
            console.log(`Error in rendering : ${error}`);
        });
}

function renderTableStandingSection(result) {
    let tableStandings = result.standings[0].table;
    let imgUrl = '';
    let setHTML = `<div class="row">
        <table class="responsive-table striped centered">
            <thead>
            <tr>
                <th>Peringkat</th>
                <th>Tim</th>
                <th>Main</th>
                <th>Poin</th>
                <th>Menang</th>
                <th>Kalah</th>
                <th>Imbang</th>
                <th>Goal</th>
                <th>Selisih</th>
            </tr>
            </thead>
        <tbody>
    `;
    if(tableStandings.length > 0) {
        for (let i = 0; i < tableStandings.length; i++) {
            let bgColor = "";
            if ( i < 4 ) {
                if( i%2 == 1){
                    bgColor = 'green lighten-4';
                }else{
                    bgColor = 'green lighten-5';
                }
            }
            
            imgUrl = changeImageProtocol(tableStandings[i].team.crestUrl);
            setHTML += `
                <tr class="${bgColor}">
                    <td>${tableStandings[i].position}</td>
                    <td class="valign-wrapper">
                        <img src="${imgUrl}" alt="Logo ${tableStandings[i].team.name}" class="img-team-standings">
                        ${tableStandings[i].team.name}
                    </td>
                    <td>${tableStandings[i].playedGames}</td>
                    <td><strong>${tableStandings[i].points}</strong></td>
                    <td>${tableStandings[i].won}</td>
                    <td>${tableStandings[i].lost}</td>
                    <td>${tableStandings[i].draw}</td>
                    <td><strong>${tableStandings[i].goalsFor}</strong> : ${tableStandings[i].goalsAgainst}</td>
                    <td>${tableStandings[i].goalDifference}</td>
                </tr>`;
        }
    }else{
        console.log("Tidak ada tim");
    }
    setHTML += `<tbody></table></div>`;

    $(".table-standings").html(setHTML);
    
}