// Utility Functions
import {applyBlurEffect, removeBlurEffect, showLoader, hideLoader } from "../helper/utils.js";

// Sample Data Array
const cardsData = [
    {
        personId: "12345",
        bedroomId: "A-101",
        residentScore: 35,
        time: "March 18th, 2024, at 3:15 PM"
    },
    {
        personId: "12346",
        bedroomId: "B-102",
        residentScore: 45,
        time: "March 19th, 2024, at 4:15 PM"
    },
    {
        personId: "12347",
        bedroomId: "C-103",
        residentScore: 55,
        time: "March 20th, 2024, at 5:15 PM"
    },
    {
        personId: "12348",
        bedroomId: "D-104",
        residentScore: 65,
        time: "March 21st, 2024, at 6:15 PM"
    },
    {
        personId: "12349",
        bedroomId: "E-105",
        residentScore: 75,
        time: "March 22nd, 2024, at 7:15 PM"
    }
];

// Function to generate cards dynamically
function generateCards(cardsData) {
    const cardsContainer = $("#cards .row");
    cardsContainer.empty(); // Clear existing content

    cardsData.forEach((card, index) => {
        const cardHTML = `
            <div class="col-xl-4 col-md-6 col-sm-12 mb-4">
                <div class="card border-0 shadow-lg rounded-3" data-bs-toggle="modal" data-bs-target="#criteriaModal" data-index="${index}">
                    <div class="card-body text-center">
                        <div class="row mb-3">
                            <div class="col">
                                <i class="fas fa-user person-icon fs-3 text-primary mb-2"></i>
                                <p class="card-text mb-0">ID: ${card.personId}</p>
                            </div>
                            <div class="col-auto align-self-center">
                                <div class="connector"></div>
                            </div>
                            <div class="col">
                                <i class="fas fa-bed bedroom-icon fs-3 text-primary mb-2"></i>
                                <p class="card-text mb-0">Room: ${card.bedroomId}</p>
                            </div>
                        </div>
                        <p class="card-text mb-0">
                            <i class="bi bi-award me-2"></i>Resident Score: ${card.residentScore}
                        </p>
                        <p class="card-text mb-0">
                            <i class="bi bi-clock me-2"></i>Time: ${card.time}
                        </p>
                    </div>
                </div>
            </div>
        `;
        cardsContainer.append(cardHTML);
    });
}

// Document Ready Function
$(document).ready(function () {
    applyBlurEffect();
    showLoader();

    // Simulate fetching data after a delay
    setTimeout(() => {
        generateCards(cardsData);
        hideLoader();
        removeBlurEffect();
    }, 1000); // Simulate 3 seconds delay for fetching data

    $(document).on('click', '#cards .card', function () {
        const cardIndex = $(this).data("index");
        console.log(`Card Index: ${cardIndex}`);
        // Here you can handle what happens when a card is clicked
        // For example, you might want to show more details in a modal
    });
});
