// Utility Functions
export function getRootUrl() {
    const currentUrl = window.location.href;
    const index = currentUrl.indexOf("nmu-dorm-app");
    const rootUrl = currentUrl.substring(0, index + "nmu-dorm-app".length);
    return `${rootUrl}/app/api/?action=`;
}

export function getText(titleText, inputLabel) {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title: titleText,
            input: "text",
            inputLabel: inputLabel,
            showCancelButton: true,
            inputAttributes: {
                autocapitalize: 'off'
            },
            preConfirm: (text) => {
                if (!text) {
                    Swal.showValidationMessage(`Please enter a ${inputLabel}`);
                }
                return text;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(result.value);
            } else {
                reject('Input canceled');
            }
        });
    });
}

export function confirmAction(title, text) {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, proceed'
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(true);
            } else {
                reject('User cancelled the action');
            }
        });
    });
}

export function downloadExcel(entity, data, headers) {
    const csvRows = [headers];

    data.forEach(item => {
        const row = headers.map(header => item[header.toLowerCase().replace(/ /g, '')]);
        csvRows.push(row);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(csvRows);
    XLSX.utils.book_append_sheet(wb, ws, entity.charAt(0).toUpperCase() + entity.slice(1));

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const filename = `${entity.charAt(0).toUpperCase() + entity.slice(1)}_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.xlsx`;

    XLSX.writeFile(wb, filename);
}

export function handleSuccess(message) {
    Swal.fire({
        title: "Success!",
        text: message,
        icon: "success"
    });
}

export function handleFailure(message) {
    Swal.fire({
        title: "Error!",
        text: message,
        icon: "error"
    });
}

export function handleWarning(message) {
    Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: message,
        confirmButtonText: 'OK'
    });
}

export function clearInputFields(inputFieldIds) {
    inputFieldIds.forEach(id => {
        $(`#${id}`).val('');
    });
}

export function applyBlurEffect() {
    const pageContent = document.querySelector('#app');
    pageContent.classList.add('blur');
}

export function removeBlurEffect() {
    const pageContent = document.querySelector('#app');
    pageContent.classList.remove('blur');
}

export function showLoader() {
    const loaderContainer = document.getElementById('preloader');
    loaderContainer.className = 'preloader';
    document.body.appendChild(loaderContainer);

    const rootUrl = window.location.origin; // Get the root URL dynamically
    const animData = {
        container: loaderContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: `${rootUrl}/project/nmu-dorm-app/app/views/assets/static/loader/loader.json` // Construct the full path to the Lottie JSON file
    };

    lottie.loadAnimation(animData);
}

export function hideLoader() {
    const loaderContainer = document.querySelector('.preloader');
    const app = document.getElementById('app');
    app.style.display = 'block';
    if (loaderContainer) {
        loaderContainer.remove();
    }
}

// Promisified AJAX Request Functions
function ajaxRequest(method, url, data, successCallback, errorCallback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                    successCallback(response.data || null);
                } else {
                    errorCallback(response.error);
                }
            } else {
                errorCallback('HTTP Error: ' + xhr.status);
            }
        }
    };
    xhr.send(JSON.stringify(data));
}

function getData(url) {
    return new Promise((resolve, reject) => {
        ajaxRequest('GET', url, null, resolve, reject);
    });
}

function postData(url, data) {
    return new Promise((resolve, reject) => {
        ajaxRequest('POST', url, data, resolve, reject);
    });
}


function putData(url, data) {
    return new Promise((resolve, reject) => {
        ajaxRequest('PUT', url, data, resolve, reject);
    });
}

function deleteData(url, data) {
    return new Promise((resolve, reject) => {
        ajaxRequest('DELETE', url, data, resolve, reject);
    });
}

// Hashing and Encoding Functions
async function hashAction(action) {
    const encoder = new TextEncoder();
    const data = encoder.encode(action);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return btoa(hashHex);
}

function encodeData(data) {
    const jsonString = JSON.stringify(data);
    const encodedData = btoa(jsonString);
    return encodeURIComponent(encodedData);
}

// Database Interaction Functions
export async function getDataDB(action) {

        const encodedAction = await hashAction(action);
        const rootUrl = getRootUrl();
        const url = `${rootUrl}${encodedAction}`;
        const response = await getData(url);
        return response;

}

export async function postDataDB(action, data) {
        const encodedAction = await hashAction(action);
        const encodedData = encodeData(data);
        const rootUrl = getRootUrl();
        const url = `${rootUrl}${encodedAction}`;
        const response = await postData(url, encodedData);
        return response;
}

export async function updateDataDB(action, data) {
        const encodedAction = await hashAction(action);
        const encodedData = encodeData(data);
        const rootUrl = getRootUrl();
        const url = `${rootUrl}${encodedAction}`;
        const response = await putData(url, encodedData);
        return response;

}

export async function deleteDataDB(action, data) {
        const encodedAction = await hashAction(action);
        const encodedData = encodeData(data);
        const rootUrl = getRootUrl();
        const url = `${rootUrl}${encodedAction}`;
        const response = await deleteData(url, encodedData);
        return response;
}
