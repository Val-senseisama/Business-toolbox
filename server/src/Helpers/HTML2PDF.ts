
// const puppeteer = require('puppeteer');
// const ThrowError = require('./ThrowError');

// const HTML2PDF = async ({ htmlContent, filePath }) => {
//     try {
//         const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

//         const page = await browser.newPage();
//         await page.setContent(htmlContent);
//         await page.pdf({ path: filePath, format: 'A4' });

//         await browser.close();
//     } catch (error) {
//         if (!error.message) ThrowError(error);
//         else ThrowError(error.message);
//         return false;
//     }
//     return true;
// };

// export default HTML2PDF;

const puppeteer = require('puppeteer');
const ThrowError = require('../Helpers/ThrowError');
const HTML2PDF = async ({ htmlContent, filePath }: { htmlContent: string, filePath: string | Buffer }) => {
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

        const page = await browser.newPage();
        await page.setContent(htmlContent);
        await page.pdf({ path: filePath, format: 'A4' });

        await browser.close();
    } catch (error) {
        if (!error) ThrowError(error);
        else ThrowError((error as Error).message);
        // else ThrowError(error?.message);
        return false;
    }
    return true;
};

export default HTML2PDF;