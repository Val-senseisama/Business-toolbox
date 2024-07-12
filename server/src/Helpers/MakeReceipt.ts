const HTML2PDF = require('./HTML2PDF');
const Num2Word = require('./Num2Word');
const { DateTime } = require('luxon');
const fs = require('fs');
const receiptTemplate = fs.readFileSync(__dirname + '/../config/receiptTemplate.html', { encoding: 'utf8' });
const imageDataURI = require('image-data-uri');

const MakeReceipt = async ({ tx, school, pupil, filePath }) => {
    const currency = (JSON.parse(school.accountSettings))['currency'];
    tx.amount = Math.abs(tx.amount);
    tx.word = Num2Word(tx.amount);
    tx.amount = currency + tx.amount.toLocaleString('en-GB');
    tx.date = DateTime.fromISO(tx.date).toFormat('LLL dd, yyyy');
    let receipt = receiptTemplate;

    // eslint-disable-next-line no-undef
    let logo = __dirname + '/../httpdocs/resources/' + school.logo;
    try {
        school.logo = await imageDataURI.encodeFromFile(logo);
    } catch (error) {
        school.logo = '';
    }


    Object.keys(tx).map(key => {
        receipt = receipt.split(`[tx.${key}]`).join(tx[key]);
    });
    Object.keys(school).map(key => {
        receipt = receipt.replace(`[school.${key}]`, school[key]);
    });

    Object.keys(pupil).map(key => {
        receipt = receipt.replace(`[pupil.${key}]`, pupil[key]);
    });

    const bool = HTML2PDF({ htmlContent: receipt, filePath });
    return bool;

};


export default MakeReceipt;