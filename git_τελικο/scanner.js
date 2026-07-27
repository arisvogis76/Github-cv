const ping = require('ping');
const dns = require('dns').promises;
const sql = require('mssql');
const cron = require('node-cron');
const { exec } = require('child_process');

const dbConfig = {
    user: 'network_monitor', 
    password: 'aris1914', 
    server: '127.0.0.1', 
    database: 'network_monitor',
    port: 1433,          
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};

function getMacAddress(ip) {
    return new Promise((resolve) => {
        exec(`arp -a ${ip}`, (error, stdout) => {
            if (error) {
                resolve(null);
                return;
            }
            const macRegex = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/;
            const match = stdout.match(macRegex);
            resolve(match ? match[0].replace(/-/g, ':') : null);
        });
    });
}

const baseIP = '192.168.3.';
const startRange = 1;
const endRange = 254; 

let pool; 

async function scanNetwork() {
    console.log(`[${new Date().toLocaleTimeString()}] Ξεκινάει η σάρωση δικτύου ...`);
    
    const batchSize = 25; // Σκανάρει 25 συσκευές ταυτόχρονα για να μην μπουκώνει
    let scanPromises = [];

    for (let i = startRange; i <= endRange; i++) {
        const currentIP = baseIP + i;
        
        scanPromises.push((async () => {
            try {
                // Επαναφορά του timeout στα 2 δευτερόλεπτα
                const res = await ping.promise.probe(currentIP, { timeout: 2 });
                const status = res.alive ? 'Online' : 'Offline';
                const latency = res.alive ? Math.round(res.time) : null;

                if (res.alive) {
                    let hostname = null;
                    let macAddress = null;

                    try {
                        const hostnames = await dns.reverse(currentIP);
                        if (hostnames.length > 0) hostname = hostnames[0];
                    } catch (e) {} 

                    try {
                        macAddress = await getMacAddress(currentIP);
                    } catch (e) {} 

                    const checkReq = pool.request();
                    checkReq.input('ip', sql.VarChar, currentIP);
                    const checkRes = await checkReq.query('SELECT id FROM Devices WHERE ip_address = @ip');
                    
                    let deviceId;

                    if (checkRes.recordset.length === 0) {
                        const insertReq = pool.request();
                        insertReq.input('ip', sql.VarChar, currentIP);
                        insertReq.input('hostname', sql.VarChar, hostname);
                        insertReq.input('mac', sql.VarChar, macAddress);
                        const insertResult = await insertReq.query(`
                            INSERT INTO Devices (ip_address, hostname, mac_address) 
                            OUTPUT inserted.id 
                            VALUES (@ip, @hostname, @mac)
                        `);
                        deviceId = insertResult.recordset[0].id;
                    } else {
                        deviceId = checkRes.recordset[0].id;
                        const updateReq = pool.request();
                        updateReq.input('hostname', sql.VarChar, hostname);
                        updateReq.input('mac', sql.VarChar, macAddress);
                        updateReq.input('id', sql.Int, deviceId);
                        await updateReq.query(`
                            UPDATE Devices 
                            SET hostname = @hostname, mac_address = @mac, last_discovered = GETDATE() 
                            WHERE id = @id
                        `);
                    }

                    const logReq = pool.request();
                    logReq.input('id', sql.Int, deviceId);
                    logReq.input('status', sql.VarChar, status);
                    logReq.input('latency', sql.Int, latency);
                    await logReq.query(`
                        INSERT INTO Active_Logs (device_id, status, latency_ms) 
                        VALUES (@id, @status, @latency)
                    `);
                }
            } catch (error) {
                console.error(`Σφάλμα στην IP ${currentIP}:`, error.message);
            }
        })());

        // Αν γεμίσει η ομάδα των 25, περιμένουμε να τελειώσουν πριν συνεχίσουμε
        if (scanPromises.length >= batchSize || i === endRange) {
            await Promise.all(scanPromises);
            scanPromises = []; // Άδειασμα της ομάδας για τις επόμενες IP
        }
    }

    console.log(`[${new Date().toLocaleTimeString()}] Η σάρωση ολοκληρώθηκε!`);
}

async function archiveOldLogs() {
    console.log(`[${new Date().toLocaleTimeString()}] Εκκίνηση διαδικασίας αρχειοθέτησης...`);
    try {
        await pool.request().query(`
            INSERT INTO Archive_Logs (id, device_id, status, latency_ms, checked_at)
            SELECT id, device_id, status, latency_ms, checked_at 
            FROM Active_Logs 
            WHERE checked_at < DATEADD(hour, -48, GETDATE())
        `);
        
        const deleteResult = await pool.request().query(`
            DELETE FROM Active_Logs 
            WHERE checked_at < DATEADD(hour, -48, GETDATE())
        `);

        console.log(`Αρχειοθετήθηκαν ${deleteResult.rowsAffected[0]} παλιές εγγραφές.`);
    } catch (error) {
        console.error('Σφάλμα αρχειοθέτησης:', error.message);
    }
}

sql.connect(dbConfig).then(connectedPool => {
    pool = connectedPool;
    console.log('Συνδέθηκε επιτυχώς στον SQL Server!');
    
    cron.schedule('* * * * *', () => scanNetwork());
    cron.schedule('0 2 * * *', () => archiveOldLogs());

    scanNetwork(); 
}).catch(err => console.error('Αποτυχία σύνδεσης στον SQL Server:', err));