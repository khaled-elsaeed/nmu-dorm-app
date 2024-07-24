// Utility Functions
import { confirmAction, handleFailure, handleSuccess, applyBlurEffect, removeBlurEffect, showLoader, hideLoader, postDataDB, deleteDataDB, getDataDB, updateDataDB } from "../helper/utils.js";

// Sample Data Array
let reservations = [];

async function fetchReservations() {
    reservations = await getDataDB('reservation/getReservations');
        await generateCards();
}



// Function to generate cards dynamically
async function generateCards() {
    const cardsContainer = $("#cards .row");
    cardsContainer.empty(); 

    reservations.forEach((reservation, index) => {
        const cardHTML = `
            <div class="col-xl-4 col-md-6 col-sm-12 mb-4">
                <div class="card border-0 shadow-lg rounded-3" data-bs-toggle="modal" data-bs-target="#criteriaModal" data-index="${index}">
                    <div class="card-body text-center">
                        <div class="row mb-3">
                            <div class="col">
                                <i class="fas fa-user person-icon fs-3 text-primary mb-2"></i>
                                <p class="card-text mb-0">ID: ${reservation.residentId}</p>
                            </div>
                            <div class="col-auto align-self-center">
                                <div class="connector"></div>
                            </div>
                            <div class="col">
                                <i class="fas fa-bed bedroom-icon fs-3 text-primary mb-2"></i>
                                <p class="card-text mb-0">Room: ${reservation.roomId}</p>
                            </div>
                        </div>
                        <p class="card-text mb-0">
                            <i class="bi bi-award me-2"></i>Resident Score: ${reservation.score}
                        </p>
                        <p class="card-text mb-0">
                            <i class="bi bi-clock me-2"></i>Time: ${reservation.reservationDate}
                        </p>
                    </div>
                </div>
            </div>
        `;
        cardsContainer.append(cardHTML);
    });
}

document.getElementById('reservationStartBtn').addEventListener('click', () => {
    confirmAction("Confirm Start Reservation", "Are you sure you want to start the reservation process?")
        .then(async () => {
            applyBlurEffect();
            showLoader();
            try {
                await updateDataDB('reservation/reservationProcess');
                await fetchReservations();
                handleSuccess('Reservation Done Successfully!');
            } catch (error) {
                console.error('Error during reservation process:', error);
                handleFailure('An error occurred while starting the reservation process. Please try again.');
            } finally {
                hideLoader();
                removeBlurEffect();
            }
        })
        .catch((error) => {
            console.error('Error during confirmation:', error);
            handleFailure('An error occurred during confirmation. Please try again.');
        });
});




// Document Ready Function
$(document).ready(function () {
    applyBlurEffect();
    showLoader();

    setTimeout(async () => {
        await fetchReservations();
        hideLoader();
        removeBlurEffect();
    }, 7000);
});
