// =====================================================
// PKV EAST CHIT
// TOUR MANAGEMENT
// Firebase Firestore Version
//
// Collection:
//     tours
//
// Fields:
//     tourName
//     date
//     place
//     expense
//     note
//     createdAt
//
// NO MEMBER COLLECTION
// NO MEMBER DATA
// =====================================================

import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";


// =====================================================
// ELEMENTS
// =====================================================

const tourFormSection =
    document.getElementById("tourFormSection");

const addTourBtn =
    document.getElementById("addTourBtn");

const cancelTourBtn =
    document.getElementById("cancelTourBtn");

const tourForm =
    document.getElementById("tourForm");

const saveTourBtn =
    document.getElementById("saveTourBtn");

const tourFormTitle =
    document.getElementById("tourFormTitle");

const tourTableBody =
    document.getElementById("tourTableBody");

const tourLoading =
    document.getElementById("tourLoading");

const tourNoData =
    document.getElementById("tourNoData");

const searchTour =
    document.getElementById("searchTour");

const tourMessage =
    document.getElementById("tourMessage");

const tourCount =
    document.getElementById("tourCount");


// =====================================================
// DASHBOARD
// =====================================================

const totalTours =
    document.getElementById("totalTours");

const totalTourExpense =
    document.getElementById("totalTourExpense");


// =====================================================
// VARIABLES
// =====================================================

let tours = [];

let editingTourId = null;


// =====================================================
// INITIAL LOAD
// =====================================================

loadTours();


// =====================================================
// ADD TOUR BUTTON
// =====================================================

if (addTourBtn) {

    addTourBtn.addEventListener("click", () => {

        editingTourId = null;

        if (tourForm) {
            tourForm.reset();
        }

        if (tourFormTitle) {

            tourFormTitle.textContent =
                "➕ Add Tour";

        }

        if (saveTourBtn) {

            saveTourBtn.textContent =
                "💾 Save Tour";

            saveTourBtn.disabled =
                false;

        }

        if (tourFormSection) {

            tourFormSection.style.display =
                "block";

        }

        clearTourMessage();

        tourFormSection?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}


// =====================================================
// CANCEL BUTTON
// =====================================================

if (cancelTourBtn) {

    cancelTourBtn.addEventListener("click", () => {

        hideTourForm();

    });

}


// =====================================================
// HIDE FORM
// =====================================================

function hideTourForm() {

    if (tourFormSection) {

        tourFormSection.style.display =
            "none";

    }

    editingTourId = null;

    if (tourForm) {

        tourForm.reset();

    }

    if (saveTourBtn) {

        saveTourBtn.disabled =
            false;

        saveTourBtn.textContent =
            "💾 Save Tour";

    }

    if (tourFormTitle) {

        tourFormTitle.textContent =
            "➕ Add Tour";

    }

    clearTourMessage();

}


// =====================================================
// SAVE / UPDATE TOUR
// =====================================================

if (tourForm) {

    tourForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // =================================================
            // GET FORM VALUES
            // =================================================

            const tourName =
                document
                    .getElementById("tourName")
                    ?.value
                    .trim() || "";


            const date =
                document
                    .getElementById("tourDate")
                    ?.value || "";


            const place =
                document
                    .getElementById("tourPlace")
                    ?.value
                    .trim() || "";


            const expenseValue =
                document
                    .getElementById("tourExpense")
                    ?.value;


            const expense =
                Number(expenseValue) || 0;


            const note =
                document
                    .getElementById("tourNote")
                    ?.value
                    .trim() || "";


            // =================================================
            // VALIDATION
            // =================================================

            if (!tourName) {

                showTourMessage(
                    "❌ Tour Name required",
                    "error"
                );

                return;

            }


            if (!date) {

                showTourMessage(
                    "❌ Date required",
                    "error"
                );

                return;

            }


            if (!place) {

                showTourMessage(
                    "❌ Place required",
                    "error"
                );

                return;

            }


            if (expense < 0) {

                showTourMessage(
                    "❌ Expense cannot be negative",
                    "error"
                );

                return;

            }


            // =================================================
            // FIREBASE DATA
            // =================================================

            const tourData = {

                tourName:
                    tourName,

                date:
                    date,

                place:
                    place,

                expense:
                    expense,

                note:
                    note

            };


            try {

                if (saveTourBtn) {

                    saveTourBtn.disabled =
                        true;

                }


                // =================================================
                // UPDATE EXISTING TOUR
                // =================================================

                if (editingTourId) {

                    await updateDoc(

                        doc(
                            db,
                            "tours",
                            editingTourId
                        ),

                        tourData

                    );


                    showTourMessage(
                        "✅ Tour Updated Successfully",
                        "success"
                    );

                }


                // =================================================
                // ADD NEW TOUR
                // =================================================

                else {

                    await addDoc(

                        collection(
                            db,
                            "tours"
                        ),

                        {

                            ...tourData,

                            createdAt:
                                serverTimestamp()

                        }

                    );


                    showTourMessage(
                        "✅ Tour Added Successfully",
                        "success"
                    );

                }


                // =================================================
                // RELOAD
                // =================================================

                setTimeout(
                    async () => {

                        hideTourForm();

                        await loadTours();

                    },
                    700
                );

            }


            catch (error) {

                console.error(
                    "❌ Tour Save Error:",
                    error
                );


                if (saveTourBtn) {

                    saveTourBtn.disabled =
                        false;

                }


                showTourMessage(
                    "❌ Tour save failed. Check Firebase Rules.",
                    "error"
                );

            }

        }
    );

}


// =====================================================
// LOAD TOURS
// =====================================================

async function loadTours() {

    try {

        // =================================================
        // LOADING
        // =================================================

        if (tourLoading) {

            tourLoading.style.display =
                "block";

            tourLoading.textContent =
                "Loading tours...";

            tourLoading.style.color =
                "#6b7280";

        }


        if (tourNoData) {

            tourNoData.style.display =
                "none";

        }


        // =================================================
        // FIRESTORE
        // =================================================

        const snapshot =
            await getDocs(

                collection(
                    db,
                    "tours"
                )

            );


        tours = [];


        // =================================================
        // READ DATA
        // =================================================

        snapshot.forEach(
            (tourDoc) => {

                tours.push({

                    id:
                        tourDoc.id,

                    ...tourDoc.data()

                });

            }
        );


        // =================================================
        // SORT NEWEST FIRST
        // =================================================

        tours.sort(
            (a, b) => {

                const aTime =
                    getCreatedTime(a);

                const bTime =
                    getCreatedTime(b);

                return bTime - aTime;

            }
        );


        // =================================================
        // HIDE LOADING
        // =================================================

        if (tourLoading) {

            tourLoading.style.display =
                "none";

        }


        // =================================================
        // DISPLAY
        // =================================================

        displayTours(
            tours
        );


        // =================================================
        // DASHBOARD
        // =================================================

        updateTourDashboard(
            tours
        );

    }


    catch (error) {

        console.error(
            "❌ Tour Load Error:",
            error
        );


        if (tourLoading) {

            tourLoading.style.display =
                "block";

            tourLoading.textContent =
                "❌ Tour loading failed";

            tourLoading.style.color =
                "#dc2626";

        }

    }

}


// =====================================================
// GET CREATED TIME
// =====================================================

function getCreatedTime(tour) {

    if (!tour || !tour.createdAt) {

        return 0;

    }


    // Firebase Timestamp

    if (
        typeof tour.createdAt.toMillis ===
        "function"
    ) {

        return tour.createdAt.toMillis();

    }


    // Firebase Timestamp seconds

    if (
        typeof tour.createdAt.seconds ===
        "number"
    ) {

        return tour.createdAt.seconds * 1000;

    }


    // JavaScript Date

    if (
        tour.createdAt instanceof Date
    ) {

        return tour.createdAt.getTime();

    }


    return 0;

}


// =====================================================
// DISPLAY TOURS
// =====================================================

function displayTours(data) {

    if (!tourTableBody) {

        console.error(
            "❌ #tourTableBody not found"
        );

        return;

    }


    tourTableBody.innerHTML =
        "";


    // =================================================
    // COUNT
    // =================================================

    if (tourCount) {

        tourCount.textContent =
            `Total Tours: ${data.length}`;

    }


    // =================================================
    // NO DATA
    // =================================================

    if (
        !data ||
        data.length === 0
    ) {

        if (tourNoData) {

            tourNoData.style.display =
                "block";

        }

        return;

    }


    if (tourNoData) {

        tourNoData.style.display =
            "none";

    }


    // =================================================
    // TABLE
    // =================================================

    data.forEach(
        (tour, index) => {

            const expense =
                Number(
                    tour.expense || 0
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td class="tour-name">
                    ${escapeHTML(
                        tour.tourName || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        formatDate(
                            tour.date
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        tour.place || "-"
                    )}
                </td>

                <td class="expense">
                    ₹${money(expense)}
                </td>

                <td>

                    <button
                        type="button"
                        class="edit-btn"
                        data-tour-id="${escapeHTML(tour.id)}"
                        title="Edit Tour"
                    >
                        ✏️
                    </button>

                    <button
                        type="button"
                        class="delete-btn"
                        data-tour-id="${escapeHTML(tour.id)}"
                        title="Delete Tour"
                    >
                        🗑️
                    </button>

                </td>

            `;


            tourTableBody.appendChild(
                row
            );

        }
    );


    // =================================================
    // BUTTON EVENTS
    // =================================================

    tourTableBody
        .querySelectorAll(
            ".edit-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.tourId;


                        const tour =
                            tours.find(
                                item =>
                                    item.id === id
                            );


                        if (tour) {

                            editTour(
                                tour
                            );

                        }

                    }
                );

            }
        );


    tourTableBody
        .querySelectorAll(
            ".delete-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.tourId;


                        deleteTour(
                            id
                        );

                    }
                );

            }
        );

}


// =====================================================
// EDIT TOUR
// =====================================================

function editTour(tour) {

    editingTourId =
        tour.id;


    const nameInput =
        document.getElementById(
            "tourName"
        );


    const dateInput =
        document.getElementById(
            "tourDate"
        );


    const placeInput =
        document.getElementById(
            "tourPlace"
        );


    const expenseInput =
        document.getElementById(
            "tourExpense"
        );


    const noteInput =
        document.getElementById(
            "tourNote"
        );


    // =================================================
    // SET VALUES
    // =================================================

    if (nameInput) {

        nameInput.value =
            tour.tourName || "";

    }


    if (dateInput) {

        dateInput.value =
            tour.date || "";

    }


    if (placeInput) {

        placeInput.value =
            tour.place || "";

    }


    if (expenseInput) {

        expenseInput.value =
            tour.expense ?? 0;

    }


    if (noteInput) {

        noteInput.value =
            tour.note || "";

    }


    // =================================================
    // FORM TITLE
    // =================================================

    if (tourFormTitle) {

        tourFormTitle.textContent =
            "✏️ Edit Tour";

    }


    // =================================================
    // SAVE BUTTON
    // =================================================

    if (saveTourBtn) {

        saveTourBtn.textContent =
            "💾 Update Tour";

        saveTourBtn.disabled =
            false;

    }


    // =================================================
    // SHOW FORM
    // =================================================

    if (tourFormSection) {

        tourFormSection.style.display =
            "block";

    }


    clearTourMessage();


    // =================================================
    // SCROLL
    // =================================================

    tourFormSection?.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

}


// =====================================================
// DELETE TOUR
// =====================================================

async function deleteTour(id) {

    const tour =
        tours.find(
            item =>
                item.id === id
        );


    if (!tour) {

        alert(
            "❌ Tour not found"
        );

        return;

    }


    const confirmDelete =
        confirm(
            `Delete Tour "${tour.tourName || ""}"?`
        );


    if (!confirmDelete) {

        return;

    }


    try {

        await deleteDoc(

            doc(
                db,
                "tours",
                id
            )

        );


        alert(
            "✅ Tour Deleted Successfully"
        );


        await loadTours();

    }


    catch (error) {

        console.error(
            "❌ Tour Delete Error:",
            error
        );


        alert(
            "❌ Tour delete failed. Check Firebase Rules."
        );

    }

}


// =====================================================
// SEARCH TOUR
// =====================================================

if (searchTour) {

    searchTour.addEventListener(
        "input",
        () => {

            const search =
                searchTour.value
                    .trim()
                    .toLowerCase();


            // =================================================
            // SHOW ALL
            // =================================================

            if (!search) {

                displayTours(
                    tours
                );

                return;

            }


            // =================================================
            // FILTER
            // =================================================

            const filtered =
                tours.filter(
                    (tour) => {

                        const name =
                            String(
                                tour.tourName || ""
                            )
                            .toLowerCase();


                        const place =
                            String(
                                tour.place || ""
                            )
                            .toLowerCase();


                        const date =
                            String(
                                tour.date || ""
                            )
                            .toLowerCase();


                        const note =
                            String(
                                tour.note || ""
                            )
                            .toLowerCase();


                        return (

                            name.includes(
                                search
                            ) ||

                            place.includes(
                                search
                            ) ||

                            date.includes(
                                search
                            ) ||

                            note.includes(
                                search
                            )

                        );

                    }
                );


            displayTours(
                filtered
            );

        }
    );

}


// =====================================================
// DASHBOARD
// =====================================================

function updateTourDashboard(data) {

    let expenseTotal =
        0;


    // =================================================
    // CALCULATE TOTAL EXPENSE
    // =================================================

    data.forEach(
        (tour) => {

            expenseTotal +=
                Number(
                    tour.expense || 0
                );

        }
    );


    // =================================================
    // TOTAL TOURS
    // =================================================

    if (totalTours) {

        totalTours.textContent =
            data.length;

    }


    // =================================================
    // TOTAL TOUR EXPENSE
    // =================================================

    if (totalTourExpense) {

        totalTourExpense.textContent =
            `₹${money(expenseTotal)}`;

    }

}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "-";

    }


    // Input normally comes as YYYY-MM-DD

    const parts =
        String(dateValue).split("-");


    if (parts.length === 3) {

        return `${parts[2]}-${parts[1]}-${parts[0]}`;

    }


    return String(dateValue);

}


// =====================================================
// MONEY FORMAT
// =====================================================

function money(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-IN"
    );

}


// =====================================================
// MESSAGE
// =====================================================

function showTourMessage(
    text,
    type
) {

    if (!tourMessage) {

        return;

    }


    tourMessage.textContent =
        text;


    tourMessage.className =
        type;


    setTimeout(
        clearTourMessage,
        3000
    );

}


// =====================================================
// CLEAR MESSAGE
// =====================================================

function clearTourMessage() {

    if (!tourMessage) {

        return;

    }


    tourMessage.textContent =
        "";

    tourMessage.className =
        "";

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}