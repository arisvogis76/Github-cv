const express = require('express');
const sql = require('mssql');
const path = require('path');
const app = express();
const port = 3000;

// ==========================================
// 1. Ρυθμίσεις σύνδεσης με τον SQL Server Express (127.0.0.1)
// ==========================================
const dbConfig = {
    user: 'network_monitor',               
    password: 'aris1914',                  
    server: '127.0.0.1',                   
    database: 'network_monitor',           
    options: {
        encrypt: false,
        trustServerCertificate: true       
    }
};

// ==========================================
// 2. Σύνδεση με τον SQL Server
// ==========================================
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('✅ Επιτυχής σύνδεση με τον SQL Server');
        return pool;
    })
    .catch(err => console.error('❌ Αποτυχία σύνδεσης στη βάση:', err));


// ==========================================
// 3. Δρομολογήσεις (Routes)
// ==========================================

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Το API που τροφοδοτεί το Dashboard με δεδομένα
app.get('/api/devices', async (req, res) => {
    try {
        const pool = await poolPromise;
        
        // Χρησιμοποιούμε το CONVERT για να έρθει η ώρα ως απλό κείμενο (π.χ. 23/07/2026 09:14:48)
        const result = await pool.request().query(`
            SELECT 
                d.ip_address, 
                d.mac_address, 
                CONVERT(VARCHAR, d.last_discovered, 103) + ' ' + CONVERT(VARCHAR, d.last_discovered, 108) AS last_discovered,
                al.latency_ms AS ping,
                ISNULL(al.status, 'Offline') AS status
            FROM Devices d
            LEFT JOIN active_logs al ON d.id = al.device_id
        `);
        
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ Σφάλμα κατά την εκτέλεση του query:', err);
        res.status(500).send("Σφάλμα κατά την ανάκτηση δεδομένων");
    }
});

// ==========================================
// 4. Εκκίνηση Server
// ==========================================
app.listen(port, () => {
    console.log(`🚀 Ο server ξεκίνησε! Άνοιξε τον browser στο: http://localhost:${port}`);
});