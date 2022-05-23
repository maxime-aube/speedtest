import Chart from 'chart.js/auto/auto.js';

async function fetchData() {
    const res = await fetch('http://localhost:3000/speedtest/data');
    return await res.json();
}

fetchData().then(speedtestData => {

    console.log('speedtestData', speedtestData);

    const mappedData = speedtestData.data.map(speedTest => {
        return {
            download: speedTest.download,
            upload: speedTest.upload,
            timestamp: speedTest.timestamp
        }
    });

    console.log('mapped data', mappedData);

    const labels = mappedData.slice(-60).map(speedtest => speedtest.timestamp);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Download',
                backgroundColor: 'rgb(76,187,0)',
                borderColor: 'rgb(76,187,0)',
                data: mappedData.slice(-60).map(speedtest => { return { x: speedtest.timestamp, y: (speedtest.download / 1048576).toFixed(2) } })
            },
            {
                label: 'Upload',
                backgroundColor: 'rgb(0,59,187)',
                borderColor: 'rgb(0,59,187)',
                data: mappedData.slice(-60).map(speedtest => { return { x: speedtest.timestamp, y: (speedtest.upload / 1048576).toFixed(2) } })
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
                    from: 1,
                    to: 0,
                    delay: 1,
                    loop: false
                }
            },
        }
    };

    const chart = new Chart(document.querySelector('#chart'), config);
});
