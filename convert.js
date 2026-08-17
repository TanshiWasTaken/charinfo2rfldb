const fs = require('fs');
const path = require('path');
const { Mii, MiiFormats } = require('miijs');

function calculateWiiCRC(buffer) {
    let crc = 0x0000;
    for (let i = 0; i < buffer.length; i++) {
        crc ^= (buffer[i] << 8);
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = (crc << 1);
            }
        }
    }
    return crc & 0xFFFF;
}

async function convertAndBuild() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage: node convert.js <input.charinfo> [output.dat]');
        process.exit(1);
    }

    const inputPath = path.resolve(args[0]);
    const outputPath = args[1] ? path.resolve(args[1]) : path.resolve('RFL_DB.dat');

    if (!fs.existsSync(inputPath)) {
        console.error(`File not found: ${inputPath}`);
        process.exit(1);
    }

    try {
        const fileBuffer = fs.readFileSync(inputPath);

        const switchMii = new Mii(fileBuffer);
        const wiiMiiBuffer = switchMii.encode(MiiFormats.RCD);

        if (wiiMiiBuffer.length !== 74) {
            console.error(`Invalid byte length: expected 74, got ${wiiMiiBuffer.length}`);
            process.exit(1);
        }

        const rfldb = Buffer.alloc(0x1F1E0, 0);
        rfldb.write('RNOD', 0x0000, 4, 'ascii');
        Buffer.from(wiiMiiBuffer).copy(rfldb, 0x0004);
        rfldb.write('RNHD', 0x1D00, 4, 'ascii');

        const dataToCrc = rfldb.subarray(0, 0x1F1DE);
        const crc16 = calculateWiiCRC(dataToCrc);
        rfldb.writeUInt16BE(crc16, 0x1F1DE);

        fs.writeFileSync(outputPath, rfldb);
        console.log(`Generated database: ${outputPath}`);
    } catch (err) {
        console.error('Conversion failed:', err.message);
        process.exit(1);
    }
}

convertAndBuild();