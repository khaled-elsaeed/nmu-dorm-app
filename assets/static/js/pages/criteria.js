// Utility Functions
import { downloadExcel, applyBlurEffect, removeBlurEffect, showLoader, hideLoader } from "../helper/utils.js";

let criteriaByField = [
    {
        icon: "bi-person",
        title: "CGPA",
        id: 1,
        description: "This field represents GPA.",
        lastEdited: "March 18th, 2024, at 3:15 PM",
        criteria: [
            {
                description: "GPA > 15",
                weight: 15,
                timeAdded: "March 15, 12:35 PM"
            },
            {
                description: "25 < GPA > 15",
                weight: 35,
                timeAdded: "March 15, 12:35 PM"
            }
        ]
    },
    {
        icon: "bi-geo-alt",
        title: "Governorate",
        id: 3,
        description: "This field represents governorate information.",
        lastEdited: "March 18th, 2024, at 3:15 PM",
        criteria: [
            {
                description: "GPA > 12",
                weight: 20,
                timeAdded: "March 15, 12:35 PM"
            }
        ]
    },
    {
        icon: "bi-journal",
        title: "Level of Study",
        id: 2,
        description: "This field represents the level of study.",
        lastEdited: "March 18th, 2024, at 3:15 PM",
        criteria: [
            {
                description: "GPA > 18",
                weight: 25,
                timeAdded: "March 15, 12:35 PM"
            }
        ]
    }
];

function generateFieldCard() {
    const fieldsContainer = $("#cards .row");
    fieldsContainer.empty(); // Clear existing content

    criteriaByField.forEach((field, index) => {
        const fieldCard = `
            <div class="col-xl-4 col-md-6 col-sm-12" data-id="${field.id}" data-index="${index}">
                <div class="card border-0 shadow-lg rounded-3" data-bs-toggle="modal" data-bs-target="#criteriaModal">
                    <div class="card-content">
                        <div class="card-body text-center">
                            <i class="bi ${field.icon} fs-3 mb-3 text-primary"></i> <!-- Icon above title -->
                            <h5 class="card-title mb-1 fw-bold text-primary">${field.title}</h5>
                            <p class="card-text mb-2">
                                <i class="bi bi-info-circle me-2"></i>${field.description}
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

// Function to show the criteria based on the selected field
function generateCriteriaCard(fieldId) {
    const criteriaContainer = $("#criteriaModal .modal-body .row");
    criteriaContainer.empty(); // Clear existing content

    const field = criteriaByField.find((field) => field.id == fieldId);
    console.log(field);

    if (field) {
        field.criteria.forEach(criteria => {
            const criteriaCard = `
                <div class="col-md-4">
                    <div class="card card-custom">
                        <div class="card-body">
                            <h5 class="card-title card-title-custom">Criteria</h5>
                            <div class="mb-1">
                                <p class="card-text mb-1"><span class="text-primary">Description</span></p>
                                <p class="card-text mb-0 card-text-custom">${criteria.description}</p>
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
                            <button type="button" class="btn btn-danger btn-sm btn-custom delete-criteria" data-criteria-id="${criteria.weight}">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            criteriaContainer.append(criteriaCard);
        });
    }
}

// Document Ready Function
$(document).ready(function () {
    applyBlurEffect();
    showLoader();

    // Simulate fetching data after a delay
    setTimeout(() => {
        generateFieldCard();
        hideLoader();
        removeBlurEffect();
    }, 1000); // Simulate 3 seconds delay for fetching data

    $(document).on('click', '#cards .card', function () {
        const fieldId = $(this).parent().data("id");
        generateCriteriaCard(fieldId);
    });

});
