const url = 'https://api.football-data.org';
const API_TOKEN = '6164ddf5a832426380c9624cdb95eb1f';
let def_id_competition = '2002';
let def_seasion_competition = '2018';

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

function set_id_competition(params) {
    def_id_competition = params;
}

function set_seasion_competition(params) {
    def_seasion_competition = params;
}

// tim
function teams (season=def_seasion_competition, id_competition=def_id_competition) {
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
        // let page = window.location.hash.substr(1);
        const urlSearch = new URLSearchParams(window.location.search);
        let page = urlSearch.get("page");
        if (page == "" || page == undefined) page = "beranda";
        
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
                <div class="card ${setColor}">
                    <div class="card-image ${setColor} darken-2" style="text-align: -webkit-center">
                        <img src="${imgUrl}" alt="Logo ${teams.name}" class="img-team">
                    </div>
                    <div class="card-stacked">
                        <div class="card-content ${setColorText} center">
                            <span class="card-title"><strong>${teams.name}</strong></span>
                            <div class="divider"></div>
                            ${teams.founded} - ${teams.venue}
                        </div>
                        <div class="card-action center" style="padding: 5px;">
                            <a href="index.html?page=lihat_tim&id=${teams.id}" class="btn-small black">Lihat Tim</a>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    return setHTML;
}

// lihat tim
function getTeamsData(id_team) {
    const urlAPI = `${url}/v2/teams/${id_team}`;
    
    if ('caches' in window) {
        caches.match(urlAPI)
            .then( (response) => {
                if (response) {
                    response.json().then( (result) => {
                        renderTimDetail(result);
                    })
                }
            })
    }

    fetchAPI(urlAPI)
        .then( result => {
            renderTimDetail(result);
        })
        .catch(error => {
            console.log(`Error in rendering : ${error}`);
        });
}

function renderTimDetail(result) {
    let team = result;
    let squad = team.squad;
    delete team.squad;

    $(".name-lihat-tim").html(team.name);
    $(".detail-lihat-tim").html(`${team.founded} - ${team.venue}`);
    $(".img-lihat-tim").attr("src", changeImageProtocol(team.crestUrl));

    let coach = squad.find( data => {
        return data.role.toLowerCase() === 'coach';
    });
    $(".coach-name-lihat-tim").html(coach.name);
    let player = squad.filter( data => {
        return data.role.toLowerCase().includes("player");
    });
    let setHTML;
    $(".players-list table tbody").html("");

    for (let i = 0; i < player.length; i++) {
        let iconColor = 'grey-text';

            setHTML = `<tr>
                        <td>${i+1}</td>
                        <td>${player[i].name}</td>
                        <td>${player[i].shirtNumber===null ? '-' : player[i].shirtNumber}</td>
                        <td>${player[i].position}</td>
                        <td>
                            <a href="javascript:;" class="favorite-button" data-id=${player[i].id}><i class="material-icons ${iconColor}">favorite</i></a>
                        </td>
                    </tr>`;
            $(".players-list table tbody").append(setHTML);

            getPlayerById(player[i].id)
                .then( () => {
                    let icons = $(".players-list table tbody a[data-id="+player[i].id+"] .material-icons");
                    if(icons.hasClass("grey-text")){
                        icons.removeClass("grey-text");
                        icons.addClass("red-text");
                    }
                });
    }

    $(".favorite-button").on("click", (event) => {
        const favIcon = event.target;
        const idPlayer = event.currentTarget.dataset.id;
        const dataPlayer = player.find( data => {
            return parseInt(data.id) === parseInt(idPlayer);
        });
        
        if(favIcon.classList.contains("grey-text")){
            if(confirm("Anda akan menambahkan sebagai Pemain Favorit?")){
                favIcon.classList.remove('grey-text');
                favIcon.classList.add('red-text');
                saveFavoritePlayer({id:dataPlayer.id, team:team, player:dataPlayer});
            }

        }else{
            if(confirm("Anda akan membatalkan sebagai Pemain Favorit?")){
                favIcon.classList.remove('red-text');
                favIcon.classList.add('grey-text');
                deleteFavoritePlayer(dataPlayer.id);
            }
            
        }
    });
}

// klasemen
function tableStandings (season=def_seasion_competition, id_competition=def_id_competition) {
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

// kompetisi
function data_competition(id_competition=def_id_competition) {
    const urlAPI = `${url}/v2/competitions/${id_competition}`;
    
    if ('caches' in window) {
        caches.match(urlAPI)
            .then( (response) => {
                if (response) {
                    response.json().then( (result) => {
                        renderTableChampionSection(result);
                    })
                }
            })
    }

    fetchAPI(urlAPI)
            .then( result => {
            renderTableChampionSection(result);
        })
        .catch(error => {
            console.log(`Error in rendering : ${error}`);
        });
}

function renderTableChampionSection(result) {
    let tableSeason = result.seasons;
    let imgUrl = '';
    let setHTML = `<div class="row">
        <table class="responsive-table striped">
            <thead>
            <tr>
                <th>Musim</th>
                <th>Juara</th>
            </tr>
            </thead>
        <tbody>
    `;
    if(tableSeason.length > 0) {
        for (let i = 0; i < tableSeason.length; i++) {  
            const winnerData    = tableSeason[i].winner;
            const startYear     = tableSeason[i].startDate.split('-');
            const endYear       = tableSeason[i].endDate.split('-');

            if(winnerData !== null){
                imgUrl = changeImageProtocol(winnerData.crestUrl);
                setHTML += `
                    <tr>
                        <td>${startYear[0]} - ${endYear[0]}</td>
                        <td class="valign-wrapper">
                            <img src="${imgUrl}" alt="Logo ${winnerData.name}" class="img-team-standings">
                            ${winnerData.name}
                        </td>
                    </tr>`;
            } else {
                setHTML += `
                    <tr>
                        <td>${startYear[0]} - ${endYear[0]}</td>
                        <td class="valign-wrapper">-</td>
                    </tr>`;
            }
        }
    }else{
        console.log("Tidak ada");
    }
    setHTML += `<tbody></table></div>`;

    $(".champions-list").html(setHTML);
}

// pemain favorit
function favoritePlayer() {
    getFavoritePlayer()
        .then( result => {
            renderFavoritePlayer(result);
        });
}

function renderFavoritePlayer(result) {
    let setHTML = `<table class="table-responsive striped bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Posisi</th>
                        <th>Asal Tim</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>`;
    for (let i = 0; i < result.length; i++) {
        let player = result[i].player;
        let team = result[i].team;

        setHTML += `<tr>
                    <td>${i+1}</td>
                    <td>${player.name}</td>
                    <td>${player.position}</td>
                    <td>${team.name}</td>
                    <td>
                        <a href="javascript:;" class="favorite-button" data-id=${result[i].id}><i class="material-icons red-text">favorite</i></a>
                    </td>
                </tr>`;    
    }
    setHTML += `</tbody></table>`;

    $(".table-favorite-player").html(setHTML);

    $(".favorite-button").on("click", (event) => {
        const favIcon = event.target;
        const idPlayer = event.currentTarget.dataset.id;
        
        if(favIcon.classList.contains("red-text")){
            if(confirm("Anda akan membatalkan sebagai Pemain Favorit?")){
                deleteFavoritePlayer(idPlayer)
                    .then(()=>{
                        window.location = './index.html?page=pemain_favorit';
                    });
            }

        }else{
            
        }
    });
}