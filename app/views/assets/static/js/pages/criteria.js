// Utility Functions
import { confirmAction, handleFailure, handleSuccess, applyBlurEffect, removeBlurEffect, showLoader, hideLoader, postDataDB, deleteDataDB, getDataDB } from "../helper/utils.js";

let criteria = [];
let criteriaFields = [];

async function fetchCriteria(criteriaOnly = false) {
    if(criteriaOnly){
        criteria = await getDataDB('reservation/getCriteria');
    }else{
        criteriaFields = await getDataDB('reservation/getCriteriaFields');
        criteria = await getDataDB('reservation/getCriteria');
        await generateFieldCard();
        populateModalDropdownFieldSelect();
    }
}

async function generateFieldCard() {
    const fieldsContainer = $("#cards .row");
    fieldsContainer.empty(); // Clear existing content

    const iconMapping = {
        'cgpa': 'bi-award', // Cumulative GPA (Numerical) - Score Icon
        'gender': 'bi-gender-female', // Gender (Categorical)
        'academicLevel': 'bi-people', // Academic Level (Categorical)
        'hasSibling': 'bi-person-plus', // Has Sibling (Categorical)
        'previouslyLivedInAccommodation': 'bi-house-door', // Previously Lived in Accommodation (Categorical)
        'familyResidesOutsideEgypt': 'bi-globe', // Family Resides Outside Egypt (Categorical)
        'highSchoolGrade': 'bi-clipboard-check', // High School Grade (Numerical) - Grade Icon
        'governorate': 'bi-geo-alt' // Governorate (Categorical)
    };

    criteriaFields.forEach((field, index) => {
        // Get the icon based on the field name
        const iconClass = iconMapping[field.name] || 'bi-question-circle'; // Default icon if not found

        const fieldCard = `
            <div class="col-xl-4 col-md-6 col-sm-12" data-id="${field.id}" data-index="${index}">
                <div class="card border-0 shadow-lg rounded-3" data-bs-toggle="modal" data-bs-target="#criteriaModal">
                    <div class="card-content">
                        <div class="card-body text-center">
                            <i class="bi ${iconClass} fs-3 mb-3 text-primary"></i> <!-- Icon above title -->
                            <h5 class="card-title mb-1 fw-bold text-primary">${field.name}</h5>
                            <p class="card-text mb-2">
                                <i class="bi bi-info-circle me-2"></i>${field.type}
                            </p>
                            <p class="card-text mb-0">
                                <i class="bi bi-clock me-2"></i>Last Edited: ${field.lastEdited}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        fieldsContainer.append(fieldCard);
    });
}



async function generateCriteriaCard(fieldId) {
    const criteriaContainer = $("#criteriaModal .modal-body .row");
    criteriaContainer.empty(); // Clear existing content

    const specifiedCriteria = criteria.filter(criteria => criteria.fieldId == fieldId);
    console.log(specifiedCriteria);

    if (specifiedCriteria) {
        specifiedCriteria.forEach(criteria => {
            const criteriaCard = `
                <div class="col-md-4">
                    <div class="card card-custom">
                        <div class="card-body">
                            <h5 class="card-title card-title-custom">Criteria</h5>
                            <div class="mb-1">
                                <p class="card-text mb-1"><span class="text-primary">Description</span></p>
                                <p class="card-text mb-0 card-text-custom">${criteria.criteria}</p>
                            </div>
                            <div class="mb-1">
                                <p class="card-text mb-1"><span class="text-primary">Weight</span></p>
                                <p class="card-text mb-0 card-text-custom">${criteria.weight}</p>
                            </div>
                            <div class="mb-1">
                                <p class="card-text mb-1"><span class="text-primary">Time Added</span></p>
                                <p class="card-text mb-0 card-text-custom">${criteria.timeAdded}</p>
                            </div>
                        </div>
                        <div class="card-footer d-flex justify-content-end">
                            <button type="button" class="btn btn-danger btn-sm btn-custom" id="deleteCriteriaBtn" data-id="${criteria.id}">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            criteriaContainer.append(criteriaCard);
        });
    }
}

function populateModalDropdownFieldSelect() {
    var fieldSelect = document.getElementById("modalFieldSelection");
    fieldSelect.innerHTML = '';
    var defaultOption = document.createElement('option');
    defaultOption.text = 'Select Field';
    fieldSelect.appendChild(defaultOption);

    criteriaFields.forEach( (field)=>{
        const option = document.createElement('option');
        option.value = field.id;
        option.text = field.name;
        option.setAttribute('data-type', field.type);
        fieldSelect.appendChild(option);
    }
     );
}



document.getElementById("modalFieldSelection").addEventListener('change', function() {
    let selectedField = this.selectedOptions;
    let fieldType = selectedField[0].getAttribute('data-Type')
    if(fieldType === 'numerical'){
        document.getElementById("numericalSection").style.display = "block";
        document.getElementById("categoricalSection").style.display = "none";
    }
    else if(fieldType === 'categorical'){
        document.getElementById("numericalSection").style.display = "none";
        document.getElementById("categoricalSection").style.display = "block";
    }
})


document.getElementById("modalFieldSelection").addEventListener('change', function() {
    const selectedField = this.selectedOptions;
    const fieldType = selectedField[0].getAttribute('data-Type')
    if(fieldType === 'numerical'){
        document.getElementById("numericalSection").style.display = "block";
        document.getElementById("categoricalSection").style.display = "none";
    }
    else if(fieldType === 'categorical'){
        document.getElementById("numericalSection").style.display = "none";
        document.getElementById("categoricalSection").style.display = "block";
    }
})


document.getElementById('criteriaInequalityType').addEventListener('change', function(){
    let criteriaInequalityType = this.value;
    if (criteriaInequalityType === "simple") {
        document.getElementById("simpleCriteriaSection").style.display = "block";
        document.getElementById("compoundCriteriaSection").style.display = "none";
    } else if (criteriaInequalityType === "compound") {
        document.getElementById("simpleCriteriaSection").style.display = "none";
        document.getElementById("compoundCriteriaSection").style.display = "block";
    }
})


document.getElementById('addCriteriaBtn').addEventListener('click', async () => {
    const selectedField = document.getElementById("modalFieldSelection");
    const selectedOption = selectedField.selectedOptions;
    const fieldType = selectedOption[0].getAttribute('data-type'); // Corrected attribute name
    const fieldId = selectedOption[0].value;
    const fieldName = selectedOption[0].textContent; // Use textContent or innerText
    const criteriaInequalityType = document.getElementById("criteriaInequalityType").value;
    
    let criteria = buildCriteria(fieldType, criteriaInequalityType);
    criteria.fieldId = fieldId;
    const message = `
    New Criteria Created Successfully

    Field: ${fieldName}
    Equation: ${criteria.criteria.replace(/x/g, fieldName)}

    Do you want to proceed with these details?
    `;

    
    
    confirmAction("Confirm Add", message)
    .then(() => {
        postDataDB("reservation/addNewCriteria", criteria)
            .then(async () => {
                await fetchCriteria(true);
                handleSuccess(`Criteria has been removed successfully.`);
            })
            .catch(() => {
                handleFailure(`Failed to remove Criteria. Please try again later.`);
            });
    })
    .catch(() => {
        console.log('Complete action canceled');
    });



    
});


function buildCriteria(fieldType, criteriaInequalityType) {
    let criteria;
    if (fieldType === 'numerical') {
        if (criteriaInequalityType === "simple") {
            criteria = buildSimpleCriteria();
        } else if (criteriaInequalityType === "compound") {
            criteria = buildCompoundCriteria();
        }
    } else {
        criteria = buildCategoricalCriteria();
    }
    return criteria;
}

function buildSimpleCriteria() {
    var operator = document.getElementById("simpleOperator").value;
    var value = document.getElementById("simpleValue").value;
    var weight = document.getElementById("simpleCriteriaWeight").value;
    return {
        type: "simple",
        criteria: `x ${operator} ${value}`,
        weight: weight
    };
}

function buildCompoundCriteria() {
    var firstOperator = document.getElementById("firstOperator").value;
    var firstValue = document.getElementById("firstValue").value;
    var connective = document.getElementById("connective").value;
    var secondOperator = document.getElementById("secondOperator").value;
    var secondValue = document.getElementById("secondValue").value;
    var weight = document.getElementById("compoundCriteriaWeight").value;
    return {
        type: "compound",
        criteria: `x ${firstOperator} ${firstValue} ${connective} x ${secondOperator} ${secondValue}`,
        weight: weight
    };
}

function buildCategoricalCriteria() {
    var newCriteria = document.getElementById('CriteriaSelect').value;
    var value = document.getElementById('valueInput').value;
    var weight = document.getElementById("categoricalCriteriaWeight").value;
    return {
        type: "categorical",
        criteria: `x ${newCriteria} ${value}`,
        weight: weight
    };
}



$('#searchInput-card').on('input', function() {
    var searchTerm = $(this).val().trim().toLowerCase();
    $(".card").each(function() {
        var cardTitle = $(this).find('.card-title').text().trim().toLowerCase();
        var cardText = $(this).find('.card-text').text().trim().toLowerCase();
        
        if (cardTitle.includes(searchTerm) || cardText.includes(searchTerm)) {
            $(this).parent().show();
        } else {
            $(this).parent().hide();
        }
    });
});

// Document Ready Function
$(document).ready(function () {
    // Apply initial UI effects
    applyBlurEffect();
    showLoader();

    // Simulate fetching data with a delay
    setTimeout(async () => {
        await fetchCriteria();
        hideLoader();
        removeBlurEffect();
    }, 1000); // 1 second delay for data fetching

    // Event listener for card clicks
    $(document).on('click', '#cards .card', function () {
        const fieldId = $(this).parent().data("id");
        generateCriteriaCard(fieldId);
    });

    // Event listener for delete criteria button
    $(document).on('click', '#deleteCriteriaBtn', async function() {
        const criteriaId = $(this).data('id');
        // Confirm delete action
        confirmAction("Confirm Delete", "Are you sure you want to delete this criteria?")
        .then(async () => {
            try {
                await postDataDB("reservation/deleteCriteria", { criteriaId : criteriaId });
                await fetchCriteria(true);
                handleSuccess("Criteria has been successfully removed.");
            } catch (error) {
                handleFailure("Failed to remove criteria. Please try again later.");
            }
        })
        .catch(() => {
            console.log('Action was canceled.');
        });
    });
});

