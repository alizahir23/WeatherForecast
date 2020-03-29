window.addEventListener('load', () => {
    let long;
    let lat;


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {



            long = position.coords.longitude;
            lat = position.coords.latitude;



            // location fetch

            fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`)
                .then(response => {
                    console.log("location fetched");
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    document.querySelector('.place').innerHTML = `${data.locality}, ${data.countryCode}`;
                })

            // weather fetch

            fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/525fd27e1831e878478e1c391ac2bed7/${lat},${long}?units=auto`)
                .then(response => {
                    console.log("weather fetched");
                    return response.json();
                })
                .then(data => {
                    console.log(data);


                    document.querySelector('.temperatureDegree').innerHTML = Math.round(`${data.currently.temperature}`);
                    document.querySelector('.summary').innerHTML = data.currently.summary;
                    document.querySelector('span').innerHTML = 'ºC';
                    setIcons(data.currently.icon, document.querySelector('.icon'));
                    let d = new Date;
                    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    data.daily.data.forEach((data, index) => {
                        if (index !== 0) {
                            d.setTime(data.time * 1000);
                            var dayName = days[d.getDay()]
                            document.querySelector(`.day${index}`).innerHTML = dayName;
                            setIcons(data.icon, document.querySelector(`.icon${index}`));
                            let min = Math.round(data.temperatureMin);
                            let max = Math.round(data.temperatureMax);
                            document.querySelector(`.dayTemp${index}`).innerHTML = `${min}↓ ${max}↑`;
                        }


                    });

                })
                .catch(err => {
                    alert(err);
                })
        });
    }

    function setIcons(icon, iconId) {
        const skycons = new Skycons({ color: 'white' });
        const currentIcon = icon.replace(/-/g, '_').toUpperCase();
        skycons.play();
        return skycons.set(iconId, Skycons[currentIcon]);
    }
});



