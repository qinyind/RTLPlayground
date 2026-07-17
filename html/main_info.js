document.addEventListener("DOMContentLoaded", function () {
    fetch('/information.json')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('infoTable').querySelector('tbody');
            tableBody.innerHTML = '';

            // Create table rows
            for (const [key, value] of Object.entries(data)) {
                const row = document.createElement('tr');
                const cellKey = document.createElement('td');
                const cellValue = document.createElement('td');

                cellKey.textContent = key;
                cellValue.textContent = value;

                row.appendChild(cellKey);
                row.appendChild(cellValue);
                tableBody.appendChild(row);
            }

            const entries = Object.entries(data);
            function findValue(words) {
                for (let i = 0; i < entries.length; i++) {
                    const key = entries[i][0].toLowerCase();
                    for (let j = 0; j < words.length; j++) {
                        if (key.indexOf(words[j]) !== -1)
                            return entries[i][1];
                    }
                }
                return '—';
            }

            const ip = document.getElementById('summaryManagementIp');
            const firmware = document.getElementById('summaryFirmware');
            const hardware = document.getElementById('summaryHardware');
            if (ip) ip.textContent = data.ip_address || findValue(['ip address', 'ip_address', 'address']);
            if (firmware) firmware.textContent = data.sw_ver || findValue(['software', 'firmware', 'version']);
            if (hardware) hardware.textContent = data.hw_ver || findValue(['hardware', 'machine', 'model']);
        })
        .catch(error => console.error('Error fetching the data:', error));
});
