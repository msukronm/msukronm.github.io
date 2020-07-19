import {getFavorite, getDataById, saveFavorite, deleteFavorite} from './db.js';

const url = 'https://api.football-data.org';
const API_TOKEN = '6164ddf5a832426380c9624cdb95eb1f';
let def_id_competition = '2002';
let def_seasion_competition = '2018';

class ApiFootballData {

changeImageProtocol(url) {
    return url.replace(/^http:\/\//i, 'https://');
}

status(response) {
    if (response.errorCode === undefined) {
        return Promise.resolve(response);
    } else {
        console.log(`Error : ${response.status}`);
        return Promise.reject(new Error(response.statusText));
    }
}
  
setJSON(response) {
    return response.json();
}

error(error) {
    console.log(`Error in fetching : ${error}`);
}

fetchAPI(urlAPI) {
    return fetch(urlAPI, 
    { 
        headers : 
        {
            'X-Auth-Token' : API_TOKEN
        }
    })
    .then(this.status)
    .then(this.setJSON)
    .catch(this.error);
}

set_id_competition(params) {
    def_id_competition = params;
}

set_seasion_competition(params) {
    def_seasion_competition = params;
}

// tim
teams (season=def_seasion_competition, id_competition=def_id_competition) {
    const urlAPI = `${url}/v2/competitions/${id_competition}/teams?season=${season}`;

    if ('caches' in window) {
        caches.match(urlAPI)
            .then( (response) => {
                if (response) {
                    response.json().then( (result) => {
                        $('#year-season').html(season);
                        this.renderTeamSection(result);
                    })
                }
            })
    }

    this.fetchAPI(urlAPI)
        .then( result => {
            $('#year-season').html(season);
            this.renderTeamSection(result, "online");
        })
        .catch(error => {
            console.log(`Error in rendering : ${error}`);
        });
}

renderTeamSection(result, params='caches') {
    let setHTML = '<div class="row">';
    // let page = window.location.hash.substr(1);
    const urlSearch = new URLSearchParams(window.location.search);
    let page = urlSearch.get("page");

    if(result.teams.length > 0) {
        if (page === "" || page === undefined) page = "beranda";
        
        switch (page) {
            case "beranda":
                setHTML += this.berandaTeamRender(result);
                break;
            
            case "klub":
                setHTML += this.klubTeamRender(result, params);
                break;
            
            default:
                setHTML += this.berandaTeamRender(result);
                break;
        }
    }else{
        console.log("Tidak ada tim");
    }
    setHTML +='</div>';

    $(".team-list").html(setHTML);
    if(result.teams.length > 0 && page === "klub"){

        getFavorite()
            .then(result => {
                for (let i = 0; i < result.length; i++) {
                    let icons = $(".btn-favorite[data-id="+result[i].id+"] i.material-icons");
                    if(icons.hasClass("grey-text")){
                        icons.removeClass("grey-text");
                        icons.addClass("red-text");
                    }
                }
            })
        
        const teams = result.teams;
        $(".btn-favorite").on("click", (event) => {
            console.log(event);
            const favIcon = event.currentTarget.children[0];
            const id = event.currentTarget.dataset.id;
            const data = teams.find( data => {
                return parseInt(data.id) === parseInt(id);
            });
            const buttonTim = $("a[data-id='"+id+"']");
            
            if(favIcon.classList.contains("grey-text")){
                favIcon.classList.remove('grey-text');
                favIcon.classList.add('red-text');
                saveFavorite(data);
    
            }else{
                favIcon.classList.remove('red-text');
                favIcon.classList.add('grey-text');
                deleteFavorite(id);
                
            }
        });
    }
}

berandaTeamRender(result){
    let setHTML = '';
    let imgUrl = '';
    for(let i=0; i<result.teams.length; i++){
        const teams = result.teams[i];
        imgUrl = this.changeImageProtocol(teams.crestUrl);
        setHTML += `<img src="${imgUrl}" alt="Logo ${teams.name}" class="img-team">`;
    }

    return setHTML;
}

klubTeamRender(result, params){
    let setHTML = '';
    let imgUrl = '';
    for(let i=0; i<result.teams.length; i++){
        const teams = result.teams[i];
        const arrColor = teams.clubColors.split("/");
        let setColor = arrColor[0].trim().toLowerCase();
        let setColor2 = setColor+" darken-2";
        let setColorText = "white-text";
        imgUrl = this.changeImageProtocol(teams.crestUrl);
        
        if (setColor === "black") {
            setColor = "grey";
            setColor2 = setColor+" darken-2";
        } else if (setColor === "white") {
            setColor2 = "grey lighten-4";
            setColorText = "";
        }


        setHTML += `<div class="col l6 s12">
                <div class="card ${setColor}">
                    <div class="card-image ${setColor2}" style="text-align: -webkit-center">
                        <img src="${imgUrl}" alt="Logo ${teams.name}" class="img-team">
                    </div>
                    <div class="card-stacked">
                        <div class="card-content ${setColorText} center">
                            <span class="card-title"><strong>${teams.name}</strong></span>
                            <div class="divider"></div>
                            ${teams.founded} - ${teams.venue}
                        </div>
                        <div class="card-action center white" style="padding: 5px;">
                            <button type="button" class="btn white btn-favorite" data-id="${teams.id}"><i class="material-icons grey-text">favorite</i></button> `;
        setHTML +=  `</div>
                    </div>
                </div>
            </div>`;
    }

    return setHTML;
}

// lihat tim
getTeamsData(id_team) {
    const urlAPI = `${url}/v2/teams/${id_team}`;
    
    if ('caches' in window) {
        caches.match(urlAPI)
            .then( (response) => {
                if (response) {
                    response.json().then( (result) => {
                        this.renderTimDetail(result);
                    })
                }
            })
    }

    this.fetchAPI(urlAPI)
        .then( result => {
            this.renderTimDetail(result);
        })
        .catch(error => {
            console.log(`Error in rendering : ${error}`);
        });
}

renderTimDetail(result) {
    let team = result;
    let squad = team.squad;
    delete team.squad;

    $(".name-lihat-tim").html(team.name);
    $(".detail-lihat-tim").html(`${team.founded} - ${team.venue}`);
    $(".img-lihat-tim").attr("src", this.changeImageProtocol(team.crestUrl));

    let coach = squad.find( data => {
        return data.role.toLowerCase() === 'coach';
    });
    
    if(coach !== undefined){
        $(".coach-name-lihat-tim").html(coach.name);
    }

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
                    </tr>`;
            $(".players-list table tbody").append(setHTML);
    }
}

// klasemen
tableStandings (season=def_seasion_competition, id_competition=def_id_competition) {
    const urlAPI = `${url}/v2/competitions/${id_competition}/standings?season=${season}&standingType=TOTAL`;
    
    if ('caches' in window) {
        caches.match(urlAPI)
            .then( (response) => {
                if (response) {
                    response.json().then( (result) => {
                        $('#year-season').html(season);
                        this.renderTableStandingSection(result);
                    })
                }
            })
    }

    this.fetchAPI(urlAPI)
            .then( result => {
            $('#year-season').html(season);
            this.renderTableStandingSection(result);
        })
        .catch(error => {
            console.log(`Error in rendering : ${error}`);
        });
}

renderTableStandingSection(result) {
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
            
            imgUrl = this.changeImageProtocol(tableStandings[i].team.crestUrl);
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
data_competition(id_competition=def_id_competition) {
    const urlAPI = `${url}/v2/competitions/${id_competition}`;
    
    if ('caches' in window) {
        caches.match(urlAPI)
            .then( (response) => {
                if (response) {
                    response.json().then( (result) => {
                        this.renderTableChampionSection(result);
                    })
                }
            })
    }

    this.fetchAPI(urlAPI)
            .then( result => {
            this.renderTableChampionSection(result);
        })
        .catch(error => {
            console.log(`Error in rendering : ${error}`);
        });
}

renderTableChampionSection(result) {
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
                imgUrl = this.changeImageProtocol(winnerData.crestUrl);
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

// klub favorit
favorite() {
    getFavorite()
        .then( result => {
            this.renderFavorite(result);
        });
}

renderFavorite(result) {
    let setHTML = `<div class="row">
            <table class="responsive-table striped bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Logo</th>
                        <th>Nama</th>
                        <th>Singkatan</th>
                        <th>Terbentuk</th>
                        <th>Stadion</th>
                        <th>Warna Klub</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>`;
    if(result.length > 0) {
        for (let i = 0; i < result.length; i++) {
            let team = result[i];

            setHTML += `<tr>
                        <td>${i+1}</td>
                        <td><img src="${this.changeImageProtocol(team.crestUrl)}" class="img-team-standings" alt="Logo ${team.name}"></td>
                        <td>${team.name}</td>
                        <td>${team.shortName}</td>
                        <td>${team.founded}</td>
                        <td>${team.venue}</td>
                        <td>${team.clubColors}</td>
                        <td>
                            <a href="javascript:;" class="btn btn-small white btn-favorite" data-id=${result[i].id}><i class="material-icons red-text">favorite</i></a>
                        </td>
                    </tr>`;    
        }
    }else{

        setHTML += `<tr>
                    <td colspan="8" class="center">Anda tidak memiliki klub favorit</td>
                </tr>`;    
        
    }
    setHTML += `</tbody>
            </table>
            </div>`;

    $(".table-favorite-klub").html(setHTML);

    $(".btn-favorite").on("click", (event) => {
        const favIcon = event.currentTarget.children[0];
        const idPlayer = event.currentTarget.dataset.id;
        
        if(favIcon.classList.contains("red-text")){
            if(confirm("Anda akan membatalkan sebagai data Favorit?")){
                deleteFavorite(idPlayer)
                    .then(()=>{
                        window.location = './index.html?page=klub_favorit';
                    });
            }

        }else{
            
        }
    });
}
}

export default ApiFootballData;