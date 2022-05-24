import Chart from 'chart.js/auto/auto.js';

// ========= FORMATAGE ===============

// todo => formatage des données par période : tout / 1 an / 1 mois / 1 semaine / 1 jour / 1h / plage date

// todo => pour les périodes d'une durée >= 1 jour proposer le groupement des data par :
//  - heures (0-23) = grouper les jours ensemble
//  - jour (lun-dim) = grouper les heures de chaque jour ensemble

// todo => pour toutes les périodes :
//  - non = pas de groupement, données brutes ordonnées par date

// ============ OPTIONS DL ==============

// todo => proposer les données affichées en téléchargement aux formats : json/csv/pdf(print graph + tableau de données)

// ==================================

async function fetchData() {
    const res = await fetch('http://localhost:3000/speedtest/data');
    return await res.json();
}

fetchData().then(speedtestData => {

});

function renderChart() {

    // todo => refacto avec période et groupement

    const mappedData = speedtestData.data.map(speedTest => {
        return {
            download: speedTest.download,
            upload: speedTest.upload,
            timestamp: new Date(speedTest.timestamp)
        }
    });

    const hourlyMappedData = {
        download: [],
        upload: []
    };

    for (let i = 0; i <= 23; i++) {

        const filtered = mappedData.filter(speedtest => {
            return speedtest.timestamp.getHours() === i;
        });
        hourlyMappedData.download[i] = {
            x: i + 'h-' + ((i + 1 > 23) ? '0h' : i + 1 + 'h'),
            y: `${ (filtered.reduce((sum, speedtest) => { return sum + speedtest.download }, 0) / filtered.length  / 1048576).toFixed(2) }`
        };
        hourlyMappedData.upload[i] = {
            x: i + 'h-' + ((i + 1 > 23) ? '0h' : i + 1 + 'h'),
            y: `${ (filtered.reduce((sum, speedtest) => { return sum + speedtest.upload }, 0) / filtered.length / 1048576).toFixed(2) }`
        };
    }

    //const labels = mappedData.slice(-60).map(speedtest => speedtest.timestamp.toLocaleString('fr-FR'));
    const labels = [...Array(24).keys()].map(i => i + 'h-' + ((i + 1 > 23) ? '0h' : i + 1 + 'h'));
    console.log(labels);

    const data = {
        labels: labels,
        datasets: [
            // DOWNLOAD
            /*
            {
                label: 'Download',
                backgroundColor: 'rgba(76,187,0, 0.1)',
                borderColor: 'rgb(76,187,0)',
                data: mappedData.slice(-60).map(speedtest => { return { x: speedtest.timestamp.toLocaleString('fr-FR'), y: (speedtest.download / 1048576).toFixed(2) } })
            },
            */

            {
                label: 'Download',
                backgroundColor: 'rgba(76,187,0, 0.1)',
                borderColor: 'rgb(76,187,0)',
                data: hourlyMappedData.download,
            },

            {
                display: false,
                label: 'DL min',
                backgroundColor: 'rgba(76,187,0, 0.1)',
                borderColor: 'rgb(76,187,0)',
                fill: '-1',
                data: [
                    {
                        //x: new Date((Math.min.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.timestamp })))).toLocaleString('fr-FR'),
                        x: '0h-1h',
                        y: ( (Math.min.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.download }))) / 1048576).toFixed(2)
                    },
                    {
                        //x: new Date((Math.max.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.timestamp })))).toLocaleString('fr-FR'),
                        x: '23h-0h',
                        y: ( (Math.min.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.download }))) / 1048576).toFixed(2)
                    }
                ]
            },
            {
                display: false,
                label: 'DL max',
                backgroundColor: 'rgba(76,187,0, 0.1)',
                borderColor: 'rgb(76,187,0)',
                fill: false,
                data: [
                    {
                        //x: new Date((Math.min.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.timestamp })))).toLocaleString('fr-FR'),
                        x: '0h-1h',
                        y: ( (Math.max.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.download }))) / 1048576).toFixed(2)
                    },
                    {
                        //x: new Date((Math.max.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.timestamp })))).toLocaleString('fr-FR'),
                        x: '23h-0h',
                        y: ( (Math.max.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.download }))) / 1048576).toFixed(2)
                    }
                ]
            },

            // UPLOAD
            {
                label: 'Upload',
                backgroundColor: 'rgba(0,59,187, 0.1)',
                borderColor: 'rgb(0,59,187)',
                data: hourlyMappedData.upload
            },
            {
                display: false,
                label: 'UP min',
                backgroundColor: 'rgba(0,59,187, 0.1)',
                borderColor: 'rgb(0,59,187)',
                fill: '-1',
                data: [
                    {
                        //x: new Date((Math.min.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.timestamp })))).toLocaleString('fr-FR'),
                        x: '0h-1h',
                        y: ( (Math.min.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.upload }))) / 1048576).toFixed(2)
                    },
                    {
                        //x: new Date((Math.max.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.timestamp })))).toLocaleString('fr-FR'),
                        x: '23h-0h',
                        y: ( (Math.min.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.upload }))) / 1048576).toFixed(2)
                    }
                ]
            },
            {
                display: false,
                label: 'UP max',
                backgroundColor: 'rgba(0,59,187, 0.1)',
                borderColor: 'rgb(0,59,187)',
                fill: false,
                data: [
                    {
                        //x: new Date((Math.min.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.timestamp })))).toLocaleString('fr-FR'),
                        x: '0h-1h',
                        y: ( (Math.max.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.upload }))) / 1048576).toFixed(2)
                    },
                    {
                        //x: new Date((Math.max.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.timestamp })))).toLocaleString('fr-FR'),
                        x: '23h-0h',
                        y: ( (Math.max.apply(null, mappedData.slice(-60).map(speedtest => { return speedtest.upload }))) / 1048576).toFixed(2)
                    }
                ]
            }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date'
                    },
                },
                y: {
                    display: true,
                    type: 'linear',
                    min: 0,
                    max: 1000,
                    title: {
                        display: true,
                        text: 'débit (Mbits/s)'
                    },
                    beginAtZero: true
                }
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 0.6,
                    to: 0.2,
                    delay: 1,
                    loop: false
                }
            },
        }
    };

    const chart = new Chart(document.querySelector('#chart'), config);
    document.querySelector('.wrapper').style.display = 'block';
}

document.querySelector('#1d').onclick = () => {};
document.querySelector('#7d').onclick = () => {};
document.querySelector('#1m').onclick = () => {};
document.querySelector('#3m').onclick = () => {};
document.querySelector('#1y').onclick = () => {};
document.querySelector('#ytd').onclick = () => {};
document.querySelector('#all').onclick = () => {};
document.querySelector('#calendar').onclick = () => {};