// load application
window.addEventListener('load', () => {
    // Initialize barcodes JSON from localStorage or create a new one
    barcodes = JSON.parse(localStorage.getItem('barcodes')) || [];
    console.log('Loaded barcodes:', barcodes);

    // Display existing barcodes
    displayBarcodeList();
});

const clearAllBtn = document.querySelector('.clear-btn');
clearAllBtn.addEventListener('click', function() {
    // Clear the barcodes JSON
    barcodes = [];
    localStorage.setItem('barcodes', JSON.stringify(barcodes));
    console.log('All barcodes cleared.');

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

    // Validate inputs
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

    barcodes.forEach(barcode => {
        const barcodeItem = document.createElement('li');
        barcodeItem.classList.add('barcode-item');

        const dataContainer = document.createElement('div');
        const barcodeNameSpan = document.createElement('span');
        const barcodeTextSpan = document.createElement('span');
        const barcodeTypeSpan = document.createElement('span');
        const optionsDiv = document.createElement('div');
        const deleteBtn = document.createElement('button');

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

        dataContainer.appendChild(barcodeNameSpan);
        dataContainer.appendChild(barcodeTextSpan);
        dataContainer.appendChild(barcodeTypeSpan);
        optionsDiv.appendChild(deleteBtn);

        barcodeItem.appendChild(dataContainer);
        barcodeItem.appendChild(optionsDiv);

        barcodeList.appendChild(barcodeItem);

        deleteBtn.addEventListener('click', function() {
            // Remove the barcode from the barcodes JSON
            barcodes = barcodes.filter(b => b.value !== barcode.value || b.format !== barcode.format);
            localStorage.setItem('barcodes', JSON.stringify(barcodes));
            console.log('Barcode deleted:', barcode);
            displayBarcodeList(); // Refresh the list display
        });
    });
}