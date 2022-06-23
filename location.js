const body = document.body

//https://www.movable-type.co.uk/scripts/latlong.html
function distance (lon1, lat1, lon2, lat2) { 
    if ((lat1 == lat2) && (long1 == long2)) {
        return 0;
    }
    else {
        const R = 6371e3;
        const phi1 = lat1 * Math.PI/180;
        const phi2 = lat2 * Math.PI/180;
        const cphi = (lat2-lat1) * Math.PI/180;
        const lamb = (lon2-lon1) * Math.PI/180;
        const a = Math.sin(cphi/2) * Math.sin(cphi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(lamb/2) * Math.sin(lamb/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        const d = R * c; // in metres
        return d;
    }

}
function ip () {
    //api for location
    var request = new XMLHttpRequest()
    request.open('GET', 'https://ipgeolocation.abstractapi.com/v1/?api_key=8ade0693a0184a31a17fc0edaaa0f2ce&fields=longitude,latitude', true)
    request.onload = function () {
        let data = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            let long = data.longitude;
            let lat = data.latitude;

            //api for king county open data
            var request_crime = new XMLHttpRequest()
            request_crime.open('GET', 'https://data.seattle.gov/resource/tazs-3rd5.json?$order=report_datetime%20DESC&$limit=25', true)
            request_crime.onload = function () {
                let data_c = JSON.parse(this.response)

                if (request_crime.status >= 200 && request_crime.status < 400) {
                    let min_dis = 50000;
                    let min_dis_off = 'error';
                    let min_dis_dat = 'error';
                    let min_dis_pp = 'error';
                    const distances = [];
                    const offenses = [];
                    const dates = [];
                    const mcpp = [];

                    let count = 0;
                    data_c.forEach(incident => {
                        
                        let c_name = incident.offense;
                        let c_date = incident.report_datetime;
                        let c_lon = incident.longitude;
                        let c_lat = incident.latitude;
                        let c_pp = incident.mcpp;
                        distances[count] = distance(c_lon, c_lat, long, lat);
                        offenses[count] = c_name;
                        dates[count] = c_date;
                        mcpp[count] = c_pp;
                        count++;
                    })
                    
                    for (let i = 0; i < 25; i++){
                        if (distances[i] < min_dis) {
                            min_dis = distances[i];
                            min_dis_off = offenses[i];
                            min_dis_dat = dates[i];
                            min_dis_pp = mcpp[i];
                            
                        }
                        
                    }

                    //sends to index.html
                    document.getElementById('offense').innerHTML = 'The nearest recent crime to you: ' + min_dis_off;
                    document.getElementById('distance').innerHTML = 'Distance from you: ' + min_dis/1000 + ' km';
                    document.getElementById('date').innerHTML = 'Date and time of offense: ' + min_dis_dat;
                    document.getElementById('location').innerHTML = 'General Location: ' + min_dis_pp;
                
                }
                else {
                    console.log('error crime')
                }

            }
            request_crime.send()

        }
        else {
            console.log('error')
        }

    }
    request.send()
}

const addy = document.getElementById('addy');
const btn = document.getElementById('btn');
btn.addEventListener('click', geo)

//api for address to long/lat (geocoding)
function geo() {
    var request_geo = new XMLHttpRequest()
    request_geo.open('GET', 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + addy.value, true)
    request_geo.onload = function () {
        let data_g = JSON.parse(this.response)
        
        if (request_geo.status >= 200 && request_geo.status < 400) {
            let long = data_g[0].lon;
            let lat = data_g[0].lat;
            console.log(long)
            console.log(lat)

            //api for king county open data
            var request_crime = new XMLHttpRequest()
            request_crime.open('GET', 'https://data.seattle.gov/resource/tazs-3rd5.json?$order=report_datetime%20DESC&$limit=25', true)
            request_crime.onload = function () {
                let data_c = JSON.parse(this.response)

                if (request_crime.status >= 200 && request_crime.status < 400) {
                    let min_dis = 50000;
                    let min_dis_off = 'error';
                    let min_dis_dat = 'error';
                    let min_dis_pp = 'error';
                    const distances = [];
                    const offenses = [];
                    const dates = [];
                    const mcpp = [];

                    let count = 0;
                    data_c.forEach(incident => {
                        
                        let c_name = incident.offense;
                        let c_date = incident.report_datetime;
                        let c_lon = incident.longitude;
                        let c_lat = incident.latitude;
                        let c_pp = incident.mcpp;
                        distances[count] = distance(c_lon, c_lat, long, lat);
                        offenses[count] = c_name;
                        dates[count] = c_date;
                        mcpp[count] = c_pp;
                        count++;
                    })
                    
                    for (let i = 0; i < 25; i++){
                        if (distances[i] < min_dis) {
                            min_dis = distances[i];
                            min_dis_off = offenses[i];
                            min_dis_dat = dates[i];
                            min_dis_pp = mcpp[i];
                            
                        }
                        
                    }

                    //sends to index.html
                    document.getElementById('offense').innerHTML = 'The nearest recent crime to you: ' + min_dis_off;
                    document.getElementById('distance').innerHTML = 'Distance from you: ' + min_dis/1000 + ' km';
                    document.getElementById('date').innerHTML = 'Date and time of offense: ' + min_dis_dat;
                    document.getElementById('location').innerHTML = 'General Location: ' + min_dis_pp;
                
                }
                else {
                    console.log('error crime')
                }

            }
            request_crime.send()

        }
        else {
            console.log('error in geocoding')
        }

    }
    request_geo.send()
}
    






