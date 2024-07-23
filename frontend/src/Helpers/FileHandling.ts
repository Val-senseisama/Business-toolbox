
const dataURLtoBlob = (dataURL: string) => {
    let byteString;
    if (dataURL.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURL.split(',')[1]);
    else byteString = unescape(dataURL.split(',')[1]);
    let mimeString = dataURL
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
};


export const readBase64 = (file: any): Promise<any> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
        };
        reader.readAsDataURL(file);
    });
};

export const readAsText = (file: any): Promise<any> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            const readData = reader.result;
            resolve(readData);
        };
    });
};


export const resizeImage = (file: any) => {
    const max = 2048;//max Width Or Height in px
    const maxSizeInKb = 200;
    // Create a promise
    return new Promise((resolve, reject) => {
        // Create a new image object
        let img = new Image();
        // Make sure the image file is valid
        if (!file || !file.type.match(/image.*/)) reject('Not an image file!');
        // Load the image object
        img.src = URL.createObjectURL(file);
        // When the image is loaded, resize it
        img.onload = () => {
            // Get the original width and height of the image
            let width = img.naturalWidth;
            let height = img.naturalHeight;
            // Calculate the new width and height of the image

            if (width > height) {
                if (width > max) {
                    height *= max / width;
                    width = max;
                }
            } else {
                if (height > max) {
                    width *= max / height;
                    height = max;
                }
            }
            // Create a canvas to draw the resized image
            let canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
            } else {
                // Handle the case when ctx is null
                resolve(null);
            }
            // Convert the canvas image to a data URL
            let dataUrl = canvas.toDataURL('image/png');
            // Convert the data URL to a Blob
            let blob = dataURLtoBlob(dataUrl);
            // Calculate the file size of the Blob
            let fileSize = Math.round(blob.size / 1024);
            // If the file size is bigger than 120kb, resize it further
            while (fileSize > maxSizeInKb + 20) {
                const reduction = 0.8;
                // Create a new canvas to draw the resized image
                let newCanvas = document.createElement('canvas');
                width = width * reduction;
                height = height * reduction;
                newCanvas.width = width;
                newCanvas.height = height;
                let newCtx = newCanvas.getContext('2d');
                if (newCtx) {
                    newCtx.drawImage(img, 0, 0, width, height);
                }

                // Convert the new canvas image to a data URL
                dataUrl = newCanvas.toDataURL('image/png');

                blob = dataURLtoBlob(dataUrl);
                // Calculate the file size of the Blob
                fileSize = Math.round(blob.size / 1024);
            }
            // Resolve the promise with the original image data URL
            resolve(dataUrl);


        };
    });
};
