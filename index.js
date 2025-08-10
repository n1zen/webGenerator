// load application
window.addEventListener('load', () => {
    // Initialize barcodes JSON from localStorage or create a new one
    clearUrlStorage();
    barcodes = JSON.parse(localStorage.getItem('barcodes')) || [];
    barcodeURL = JSON.parse(localStorage.getItem('barcodeURL')) || [];
    console.log('Loaded barcodes:', barcodes);
    console.log('Loaded barcode URLs:', barcodeURL);

    // Display existing barcodes
    displayBarcodeList();
});

function clearUrlStorage() {
    // Clear the barcode URL storage
    localStorage.removeItem('barcodeURL');
    console.log('Barcode URL storage cleared.');
}

const clearAllBtn = document.querySelector('.clear-btn');
clearAllBtn.addEventListener('click', function() {
    // Clear the barcodes JSON
    barcodes = [];
    localStorage.setItem('barcodes', JSON.stringify(barcodes));
    console.log('All barcodes cleared.');

    // Clear the barcode URL storage
    clearUrlStorage();

    // Reset the barcode display
    resetGeneratedBarcodes();

    // Refresh the barcode list display
    displayBarcodeList();
});

// Add item to the list
const addItemBtn = document.getElementById('add-btn');
addItemBtn.addEventListener('click', function() {

    // Get the input fields
    const nameTxtBox = document.getElementById('barcode-name');
    const itemCodeTxtBox = document.getElementById('itemcode-input');
    const barcodeTypeSelect = document.getElementById('barcode-type');

    // Get the values from the input fields
    let barcodeName = nameTxtBox.value.trim();
    let barcodeValue = itemCodeTxtBox.value.trim();
    let barcodeType = barcodeTypeSelect.value;

    // Validate if the inputs are not empty
    if(barcodeName == '' || barcodeName == null) {
        alert('Please enter a name for the barcode.');
        return;
    }
    if(barcodeValue == '' || barcodeValue == null) {
        alert('Please enter a value for the barcode.');
        return;
    }
    if(barcodeType == '' || barcodeType == null) {
        alert('Please select a barcode type.'); 
        return;
    }

    // Validate the barcode value based on the selected type
    if (!validateBarcodeValue(barcodeValue, barcodeType)) {
        alert('Invalid barcode value for the selected type. Please check the format.');
        // Display an error message
        const errorMessage = document.getElementById('error-message');
        errorMessage.classList.remove('disable'); // Show the error message
        switch (barcodeType) {
            case 'CODE128':
                errorMessage.textContent = 'CODE128 requires alphanumeric characters.';
                break;
            case 'EAN13':
                errorMessage.textContent = 'EAN13 requires exactly 13 digits.';
                break;
            case 'UPC':
                errorMessage.textContent = 'UPC requires exactly 12 digits.';
                break;
            case 'CODE39':
                errorMessage.textContent = 'CODE39 allows alphanumeric characters and some special characters (- . $ / + %).';
                break;
            case 'ITF14':
                errorMessage.textContent = 'ITF14 requires exactly 14 digits.';
                break;
            case 'CODE93':
                errorMessage.textContent = 'CODE93 allows alphanumeric characters and some special characters (- . $ / + %).';
                break;
            case 'MSI':
                errorMessage.textContent = 'MSI requires digits only.';
                break;
            case 'EAN8':
                errorMessage.textContent = 'EAN8 requires exactly 8 digits.';
                break;
            case 'PHARMA':
                errorMessage.textContent = 'PHARMA allows alphanumeric characters and some special characters (-    . $ / + %).';
                break;
            default:
                errorMessage.textContent = 'Invalid barcode type selected.';
                break;
        }
        return;
    } else {
        // Hide the error message if validation passes
        const errorMessage = document.getElementById('error-message');
        errorMessage.classList.add('disable'); // Hide the error message
        errorMessage.textContent = ''; // Clear the message
    }

    // Check if barcode already exists
    const existingBarcode = barcodes.find(barcode => barcode.value === barcodeValue && barcode.format === barcodeType);
    if (existingBarcode) {
        alert('This barcode already exists. Please enter a different value or type.');
        return;
    }

    // Create a new barcode item
    const barcodeItem = {
        name: barcodeName,
        value: barcodeValue,
        format: barcodeType
    };

    // Add the new barcode item to the barcodes JSON
    barcodes.push(barcodeItem);

    // Update the localStorage with the new barcodes JSON
    localStorage.setItem('barcodes', JSON.stringify(barcodes));
    console.log('Barcode added:', barcodeItem);

    // Reset the input fields
    nameTxtBox.value = '';
    itemCodeTxtBox.value = '';
    barcodeTypeSelect.value = 'CODE128'; // Reset to default type

    // Refresh the barcode list display
    displayBarcodeList();
});

// Function to display the barcodes list
function displayBarcodeList() {

    if (barcodes.length === 0) {
        // If no barcodes, show a message
        const barcodeList = document.querySelector('.barcode-items');
        barcodeList.innerHTML = '<li class="no-items">No barcodes to display.</li>';
        return;
    }

    // Get the barcode list ul container
    const barcodeList = document.querySelector('.barcode-items');
    barcodeList.innerHTML = ''; // Clear existing items

    // Loop through the barcodes and create list items
    barcodes.forEach(barcode => {
        // Create a new list item for each barcode
        const barcodeItem = document.createElement('li');
        barcodeItem.classList.add('barcode-item');

        // Create elements for barcode data
        const dataContainer = document.createElement('div');
        const barcodeNameSpan = document.createElement('span');
        const barcodeTextSpan = document.createElement('span');
        const barcodeTypeSpan = document.createElement('span');
        const optionsDiv = document.createElement('div');
        const deleteBtn = document.createElement('button');

        // Set the content and classes for the elements
        barcodeNameSpan.classList.add('barcode-name');
        barcodeNameSpan.textContent = barcode.name;
        barcodeTextSpan.classList.add('barcode-text');
        barcodeTextSpan.textContent = barcode.value;
        barcodeTypeSpan.classList.add('barcode-type');
        barcodeTypeSpan.textContent = barcode.format;
        dataContainer.classList.add('data-container');

        optionsDiv.classList.add('options');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';

        // Append the elements to the barcode item
        dataContainer.appendChild(barcodeNameSpan);
        dataContainer.appendChild(barcodeTextSpan);
        dataContainer.appendChild(barcodeTypeSpan);
        optionsDiv.appendChild(deleteBtn);

        // Append the data container and options to the barcode item
        barcodeItem.appendChild(dataContainer);
        barcodeItem.appendChild(optionsDiv);

        // Append the barcode item to the list
        barcodeList.appendChild(barcodeItem);

        // Add event listener for the delete button
        // This will remove the barcode from the list and localStorage
        deleteBtn.addEventListener('click', function() {
            // Remove the barcode from the barcodes JSON
            barcodes = barcodes.filter(b => b.value !== barcode.value || b.format !== barcode.format);
            localStorage.setItem('barcodes', JSON.stringify(barcodes));
            console.log('Barcode deleted:', barcode);
            displayBarcodeList(); // Refresh the list display
        });
    });
}

function resetGeneratedBarcodes() {
    // Reset the barcode display
    const barcodeDisplayContainer = document.querySelector('.barcode-display-container');
    barcodeDisplayContainer.innerHTML = ''; // Clear existing barcodes
    barcodeDisplayContainer.classList.add('disable'); // Disable the display
}

// Generate barcodes and display them
const generateBtn = document.querySelector('.generate-btn');
generateBtn.addEventListener('click', function() {

    clearUrlStorage(); // Clear the barcode URL storage
    barcodeURL = []; // Reset the barcode URL array

    // Get the containers for displaying barcodes
    const barcodeDisplayContainer = document.querySelector('.barcode-display-container');
    barcodeDisplayContainer.innerHTML = ''; // Clear existing barcodes
    const barcodeDisplay = document.createElement('div');
    barcodeDisplay.classList.add('barcode-display');
    barcodeDisplayContainer.appendChild(barcodeDisplay);

    // Check if there are any barcodes to generate
    // If there are no barcodes, show an alert and disable the display
    if (barcodes.length === 0) {
        alert('No barcodes to generate. Please add some barcodes first.');
        barcodeDisplayContainer.classList.add('disable');
        return;
    }

    // Loop through each barcode and generate the barcode image
    barcodes.forEach(barcode => {
        // Create elements for displaying the barcode
        const barcodeContainer = document.createElement('div');
        const barcodeTitle = document.createElement('span');
        const barcodeImg = document.createElement('canvas');

        // Set attributes and classes for the elements
        barcodeContainer.classList.add('barcode-container');
        barcodeTitle.classList.add('barcode-title');
        barcodeTitle.textContent = barcode.name;
        barcodeImg.id = 'barcode-img';

        // Generate the barcode using JsBarcode
        JsBarcode(barcodeImg, barcode.value, {
            format: barcode.format,
            displayValue: true,
            fontSize: 16
        });

        // Convert the canvas to a data URL and store it in localStorage
        // This allows the barcode to be downloaded later
        let link = barcodeImg.toDataURL('image/png');
        barcodeURL.push({ name: barcode.name, dataURL: link });
        localStorage.setItem('barcodeURL', JSON.stringify(barcodeURL));
        console.log('Barcode URL stored:', barcodeURL);

        // Create a download link for the barcode image
        const downloadSingleLink = document.createElement('a');
        downloadSingleLink.href = link;
        downloadSingleLink.download = `${barcode.name}Barcode.png`;

        // Create a button to download the barcode image
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download';
        downloadBtn.classList.add('download-btn');
        downloadBtn.addEventListener('click', function() {
            downloadSingleLink.click();
        });

        // Append the elements to the barcode container
        barcodeContainer.appendChild(barcodeTitle);
        barcodeContainer.appendChild(barcodeImg);
        barcodeContainer.appendChild(downloadBtn);
        barcodeDisplay.appendChild(barcodeContainer);
        console.log('Generated barcode:', barcode);
    });

    // Create download all button
    const downloadAllBtn = document.createElement('button');
    downloadAllBtn.textContent = 'Download All Barcodes';
    downloadAllBtn.classList.add('download-btn');
    downloadAllBtn.id = 'download-all-btn';
    downloadAllBtn.addEventListener('click', async function() {
        // Create a new JSZip instance
        const zip = new JSZip();
        // Loop through all barcode URLs and add them to the zip
        barcodeURL.forEach(barcode => {
            const base64Data = barcode.dataURL.split(',')[1]; // Get the base64 part of the data URL
            zip.file(`${barcode.name}Barcode.png`, base64Data, { base64: true });
        });
        // Generate the zip file
        const zipBlob = await zip.generateAsync({type: 'blob'});
        // Create a download link for the zip file
        const zipLink = document.createElement('a');
        zipLink.href = URL.createObjectURL(zipBlob);
        zipLink.download = 'barcodes.zip';
        // Trigger the download
        zipLink.click();
        // Clean up the URL object
        URL.revokeObjectURL(zipLink.href);
        // Log the completion
        console.log('All barcodes downloaded as a zip file.');
    });
    // Append the download all button to the barcode display
    barcodeDisplayContainer.appendChild(downloadAllBtn);

    // Show the barcode display section
    if(barcodes.length > 0) {
        barcodeDisplayContainer.classList.remove('disable');
    }
    console.log('All barcodes generated and displayed.', barcodeURL);
});


function validateBarcodeValue(barcodeValue, barcodeType) {
    // Add validation logic based on the barcode type
    switch (barcodeType) {
        case 'CODE128':
            return /^[A-Za-z0-9]+$/.test(barcodeValue); // Alphanumeric characters
        case 'EAN13':
            return /^\d{13}$/.test(barcodeValue); // 13 digits
        case 'UPC':
            return /^\d{12}$/.test(barcodeValue); // 12 digits
        case 'CODE39':
            return /^[A-Za-z0-9\-\. $\/+%]+$/.test(barcodeValue); // Alphanumeric and some special characters
        case 'ITF14':
            return /^\d{14}$/.test(barcodeValue); // 14 digits
        case 'CODE93':
            return /^[A-Za-z0-9\-\. $\/+%]+$/.test(barcodeValue); // Alphanumeric and some special characters
        case 'MSI':
            return /^\d+$/.test(barcodeValue); // Digits only
        case 'EAN8':
            return /^\d{8}$/.test(barcodeValue); // 8 digits
        case 'PHARMA':
            return /^[A-Za-z0-9\-\. $\/+%]+$/.test(barcodeValue); // Alphanumeric and some special characters
        default:
            return false; // Invalid type
    }
}