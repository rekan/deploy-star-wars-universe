function requestData(requestURL, requestType){
    $.getJSON(requestURL, function(data){
        if (requestType === 'planets'){
            var allPlanets = [];
            for (var i in data.results){
                allPlanets.push(new Planet(data.results[i]));
            };
            displayPlanets(allPlanets);
            pagination(data.next, 'next');
            pagination(data.previous, 'previous');
        } else {
            document.getElementById('resident_table').appendChild(displayResident(new Resident(data)));
        }
    });
};

function pagination(link, buttonID){
    if (link === null){
        document.getElementById(buttonID).disabled = true;
    } else {
        document.getElementById(buttonID).disabled = false;
        document.getElementById(buttonID).setAttribute('onclick', 'requestData("' + link + '", "planets")');
    };
};

function Planet(planetObject){
    this.name = planetObject.name;
    this.diameter = planetObject.diameter;
    this.climate = planetObject.climate;
    this.gravity = planetObject.gravity;
    this.terrain = planetObject.terrain;
    this.water = planetObject.surface_water;
    this.population = planetObject.population;
    this.residents = planetObject.residents;
};

function Resident(residentObject){
    this.name = residentObject.name;
    this.height = residentObject.height;
    this.mass = residentObject.mass;
    this.hair_color = residentObject.hair_color;
    this.skin_color = residentObject.skin_color;
    this.eye_color = residentObject.eye_color;
    this.birth_year = residentObject.birth_year;
    this.gender = residentObject.gender;
}

function displayPlanets(planetList){
    document.getElementById('planet_table').innerHTML = '';
    for (var i in planetList){
        var row = document.createElement('tr');
        for (var j in planetList[i]){
            var cell = document.createElement('td');
            if (j === 'residents' && planetList[i][j].length > 0){
                var button = document.createElement('button');
                button.type = 'button';
                button.className = 'btn btn-default btn-xs';
                button.innerHTML = planetList[i][j].length.toString() + ' resident(s)';
                button.setAttribute('data-toggle', 'modal');
                button.setAttribute('data-target', '#residentModal');
                button.setAttribute('data-planet', planetList[i].name);
                button.setAttribute('data-residents', JSON.stringify(planetList[i][j]));
                cell.appendChild(button);
            } else if (j === 'residents' && planetList[i][j].length === 0) {
                cell.innerHTML = 'unknown';
            } else {
                cell.innerHTML = planetList[i][j];
            };
            row.appendChild(cell);
        };
        document.getElementById('planet_table').appendChild(row);
    };
};

function requestResidentData(linkList){
    for (var i in linkList){
        requestData(linkList[i], 'residents');
    };
};

function displayResident(resident){
    var row = document.createElement('tr');
    for (var i in resident){
        var cell = document.createElement('td');
        cell.innerHTML = resident[i];
        row.appendChild(cell);
    };
    return row;
}

$('#residentModal').on('show.bs.modal', function (event) {
    document.getElementById('resident_table').innerHTML = '';
    var button = $(event.relatedTarget); // Button that triggered the modal
    var modal = $(this);
    modal.find('.modal-title').text('Residents of ' + button.data('planet'));
    requestResidentData(button.data('residents'));
});

requestData('http://swapi.co/api/planets/', 'planets');
