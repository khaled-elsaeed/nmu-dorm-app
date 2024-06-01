const fieldsData = [
    {
        icon: "bi-person",
        title: "CGPA",
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

// Function to generate the fields cards
function generateFields() {
    const fieldsContainer = $("#cards .row");
    fieldsContainer.empty(); // Clear existing content

    fieldsData.forEach((field, index) => {
        const fieldCard = `
            <div class="col-xl-4 col-md-6 col-sm-12">
                <div class="card border-0 shadow-lg rounded-3" data-bs-toggle="modal" data-bs-target="#criteriaModal" data-index="${index}">
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

// Function to show the criteria in the modal
function showCriteria(fieldIndex) {
    const criteriaContainer = $("#criteriaModal .modal-body .row");
    criteriaContainer.empty(); // Clear existing content

    const criteria = fieldsData[fieldIndex].criteria;

    criteria.forEach(criteriaItem => {
        const criteriaCard = `
            <div class="col-md-4">
                <div class="card card-custom">
                    <div class="card-body">
                        <h5 class="card-title card-title-custom">Criteria</h5>
                        <div class="mb-1">
                            <p class="card-text mb-1"><span class="text-primary">Description</span></p>
                            <p class="card-text mb-0 card-text-custom">${criteriaItem.description}</p>
                        </div>
                        <div class="mb-1">
                            <p class="card-text mb-1"><span class="text-primary">Weight</span></p>
                            <p class="card-text mb-0 card-text-custom">${criteriaItem.weight}</p>
                        </div>
                        <div class="mb-1">
                            <p class="card-text mb-1"><span class="text-primary">Time Added</span></p>
                            <p class="card-text mb-0 card-text-custom">${criteriaItem.timeAdded}</p>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-end">
                        <button type="button" class="btn btn-danger btn-sm btn-custom delete-criteria" data-field-index="${fieldIndex}" data-criteria-index="${criteria.indexOf(criteriaItem)}">Delete</button>
                    </div>
                </div>
            </div>
        `;
        criteriaContainer.append(criteriaCard);
    });
}

// Function to delete criteria
function deleteCriteria(fieldIndex, criteriaIndex) {
    fieldsData[fieldIndex].criteria.splice(criteriaIndex, 1);
    showCriteria(fieldIndex); // Update the modal content
}

// Call the function to populate the fields on page load
$(document).ready(function() {
    generateFields();

    // Event listener for showing criteria modal
    $("#cards .card").on("click", function() {
        const index = $(this).data("index");
        showCriteria(index);
    });

    // Event listener for deleting criteria
    $("#criteriaModal .modal-body").on("click", ".delete-criteria", function() {
        const fieldIndex = $(this).data("field-index");
        const criteriaIndex = $(this).data("criteria-index");
        deleteCriteria(fieldIndex, criteriaIndex);
    });
});
