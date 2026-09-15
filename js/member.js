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


/* =====================================================
   ELEMENTS
===================================================== */

const listSection =
    document.getElementById("memberListSection");

const formSection =
    document.getElementById("memberFormSection");

const showListBtn =
    document.getElementById("showListBtn");

const showAddBtn =
    document.getElementById("showAddBtn");

const formBackBtn =
    document.getElementById("formBackBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const memberForm =
    document.getElementById("memberForm");

const tableBody =
    document.getElementById("memberTableBody");

const loading =
    document.getElementById("loading");

const noData =
    document.getElementById("noData");

const memberCount =
    document.getElementById("memberCount");

const searchMember =
    document.getElementById("searchMember");

const message =
    document.getElementById("message");

const formTitle =
    document.getElementById("formTitle");

const formSubtitle =
    document.getElementById("formSubtitle");

const saveMemberBtn =
    document.getElementById("saveMemberBtn");


/* =====================================================
   VARIABLES
===================================================== */

let members = [];

let editingMemberId = null;


/* =====================================================
   SHOW LIST
===================================================== */

function showList() {

    listSection.style.display = "block";

    formSection.style.display = "none";

    editingMemberId = null;

    clearMessage();

    loadMembers();

}


/* =====================================================
   SHOW ADD FORM
===================================================== */

function showAddForm() {

    listSection.style.display = "none";

    formSection.style.display = "block";

    editingMemberId = null;


    formTitle.textContent =
        "➕ Add Member";


    formSubtitle.textContent =
        "புதிய உறுப்பினர் பதிவு";


    saveMemberBtn.textContent =
        "➕ Add Member";


    memberForm.reset();

    clearMessage();

}


/* =====================================================
   SHOW EDIT FORM
===================================================== */

function showEditForm(member) {

    listSection.style.display = "none";

    formSection.style.display = "block";

    editingMemberId = member.id;


    formTitle.textContent =
        "✏️ Edit Member";


    formSubtitle.textContent =
        "உறுப்பினர் தகவல் மாற்றம்";


    saveMemberBtn.textContent =
        "💾 Update Member";


    document.getElementById(
        "memberName"
    ).value =
        member.memberName || "";


    document.getElementById(
        "category"
    ).value =
        member.category || "";


    document.getElementById(
        "wifeName"
    ).value =
        member.wifeName || "";


    document.getElementById(
        "sonOrDaughterName1"
    ).value =
        member.sonOrDaughterName1 ||
        member.sonOrDaughterName ||
        "";


    document.getElementById(
        "sonOrDaughterName2"
    ).value =
        member.sonOrDaughterName2 || "";


    document.getElementById(
        "phone"
    ).value =
        member.phone || "";


    document.getElementById(
        "address"
    ).value =
        member.address || "";


    clearMessage();

}


/* =====================================================
   LOAD MEMBERS
===================================================== */

async function loadMembers() {

    try {

        loading.style.display =
            "block";

        loading.textContent =
            "பதிவுகள் ஏற்றப்படுகிறது...";

        loading.style.color =
            "#666";


        tableBody.innerHTML = "";

        noData.style.display =
            "none";


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "members"
                )
            );


        members = [];


        snapshot.forEach(
            (memberDoc) => {

                members.push({

                    id:
                        memberDoc.id,

                    ...memberDoc.data()

                });

            }
        );


        /* =========================================
           NEWEST FIRST
        ========================================= */

        members.sort(
            (a, b) => {

                const aTime =
                    a.createdAt?.seconds || 0;

                const bTime =
                    b.createdAt?.seconds || 0;

                return bTime - aTime;

            }
        );


        loading.style.display =
            "none";


        updateCount(
            members.length
        );


        displayMembers(
            members
        );


    }

    catch (error) {

        console.error(
            "❌ Firebase Load Error:",
            error
        );


        loading.style.display =
            "block";

        loading.textContent =
            "❌ Member loading failed";

        loading.style.color =
            "#dc2626";

    }

}


/* =====================================================
   DISPLAY MEMBERS
===================================================== */

function displayMembers(data) {

    tableBody.innerHTML = "";


    if (
        !data ||
        data.length === 0
    ) {

        noData.style.display =
            "block";

        return;

    }


    noData.style.display =
        "none";


    data.forEach(
        (member, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            const child1 =
                member.sonOrDaughterName1 ||
                member.sonOrDaughterName ||
                "-";


            const child2 =
                member.sonOrDaughterName2 ||
                "-";


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td class="member-name">
                    ${escapeHTML(
                        member.memberName || "-"
                    )}
                </td>

                <td>

                    <span
                        class="category-badge"
                    >
                        ${escapeHTML(
                            member.category || "-"
                        )}
                    </span>

                </td>

                <td>
                    ${escapeHTML(
                        member.wifeName || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        child1
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        child2
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        member.phone || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        member.address || "-"
                    )}
                </td>

                <td>

                    <div
                        class="member-actions"
                    >

                        <button
                            type="button"
                            class="edit-btn"
                            data-id="${member.id}"
                        >
                            ✏️ Edit
                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            data-id="${member.id}"
                        >
                            🗑️ Delete
                        </button>

                    </div>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );


    /* =================================================
       EDIT BUTTON
    ================================================= */

    document
        .querySelectorAll(".edit-btn")
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const member =
                            members.find(
                                (item) =>
                                    item.id ===
                                    button.dataset.id
                            );


                        if (member) {

                            showEditForm(
                                member
                            );

                        }

                    }
                );

            }
        );


    /* =================================================
       DELETE BUTTON
    ================================================= */

    document
        .querySelectorAll(".delete-btn")
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteMember(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


/* =====================================================
   ADD / UPDATE MEMBER
===================================================== */

memberForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const memberName =
            document.getElementById(
                "memberName"
            ).value.trim();


        const category =
            document.getElementById(
                "category"
            ).value;


        const wifeName =
            document.getElementById(
                "wifeName"
            ).value.trim();


        const sonOrDaughterName1 =
            document.getElementById(
                "sonOrDaughterName1"
            ).value.trim();


        const sonOrDaughterName2 =
            document.getElementById(
                "sonOrDaughterName2"
            ).value.trim();


        const phone =
            document.getElementById(
                "phone"
            ).value.trim();


        const address =
            document.getElementById(
                "address"
            ).value.trim();


        /* =========================================
           VALIDATION
        ========================================= */

        if (!memberName) {

            showMessage(
                "❌ Member Name required",
                "error"
            );

            return;

        }


        if (!category) {

            showMessage(
                "❌ Category தேர்வு செய்யவும்",
                "error"
            );

            return;

        }


        if (
            phone &&
            !/^[0-9]{10}$/.test(phone)
        ) {

            showMessage(
                "❌ Phone Number 10 digits இருக்க வேண்டும்",
                "error"
            );

            return;

        }


        /* =========================================
           DATA
        ========================================= */

        const memberData = {

            memberName,

            category,

            wifeName,

            sonOrDaughterName1,

            sonOrDaughterName2,

            phone,

            address

        };


        try {


            /* =====================================
               UPDATE
            ===================================== */

            if (editingMemberId) {

                const memberRef =
                    doc(
                        db,
                        "members",
                        editingMemberId
                    );


                await updateDoc(
                    memberRef,
                    memberData
                );


                showMessage(
                    "✅ Member Updated Successfully",
                    "success"
                );

            }


            /* =====================================
               ADD
            ===================================== */

            else {

                await addDoc(

                    collection(
                        db,
                        "members"
                    ),

                    {

                        ...memberData,

                        createdAt:
                            serverTimestamp()

                    }

                );


                showMessage(
                    "✅ Member Added Successfully",
                    "success"
                );

            }


            /* =====================================
               AFTER SAVE
            ===================================== */

            setTimeout(
                () => {

                    memberForm.reset();

                    showList();

                },
                800
            );


        }

        catch (error) {

            console.error(
                "❌ Firebase Save Error:",
                error
            );


            showMessage(
                "❌ Save failed. Firebase Rules check செய்யவும்.",
                "error"
            );

        }

    }
);


/* =====================================================
   DELETE MEMBER
===================================================== */

async function deleteMember(id) {

    const member =
        members.find(
            (item) =>
                item.id === id
        );


    if (!member) {

        alert(
            "Member not found"
        );

        return;

    }


    const confirmDelete =
        confirm(
            `Delete Member "${member.memberName}"?`
        );


    if (!confirmDelete) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "members",
                id
            )
        );


        alert(
            "✅ Member Deleted Successfully"
        );


        await loadMembers();


    }

    catch (error) {

        console.error(
            "❌ Delete Error:",
            error
        );


        alert(
            "❌ Member delete failed"
        );

    }

}


/* =====================================================
   SEARCH
===================================================== */

searchMember.addEventListener(
    "input",
    () => {

        const search =
            searchMember.value
                .trim()
                .toLowerCase();


        if (!search) {

            displayMembers(
                members
            );

            updateCount(
                members.length
            );

            return;

        }


        const filtered =
            members.filter(
                (member) => {


                    const name =
                        String(
                            member.memberName ||
                            ""
                        ).toLowerCase();


                    const category =
                        String(
                            member.category ||
                            ""
                        ).toLowerCase();


                    const wife =
                        String(
                            member.wifeName ||
                            ""
                        ).toLowerCase();


                    const child1 =
                        String(
                            member.sonOrDaughterName1 ||
                            member.sonOrDaughterName ||
                            ""
                        ).toLowerCase();


                    const child2 =
                        String(
                            member.sonOrDaughterName2 ||
                            ""
                        ).toLowerCase();


                    const phone =
                        String(
                            member.phone ||
                            ""
                        ).toLowerCase();


                    const address =
                        String(
                            member.address ||
                            ""
                        ).toLowerCase();


                    return (

                        name.includes(search) ||

                        category.includes(search) ||

                        wife.includes(search) ||

                        child1.includes(search) ||

                        child2.includes(search) ||

                        phone.includes(search) ||

                        address.includes(search)

                    );

                }
            );


        displayMembers(
            filtered
        );


        memberCount.textContent =
            `Showing ${filtered.length} / ${members.length} Members`;

    }
);


/* =====================================================
   COUNT
===================================================== */

function updateCount(count) {

    memberCount.textContent =
        `Total Members: ${count}`;

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    text,
    type
) {

    message.textContent =
        text;

    message.className =
        type;


    setTimeout(
        () => {

            clearMessage();

        },
        3000
    );

}


function clearMessage() {

    message.textContent =
        "";

    message.className =
        "";

}


/* =====================================================
   ESCAPE HTML
===================================================== */

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


/* =====================================================
   BUTTON EVENTS
===================================================== */

showListBtn.addEventListener(
    "click",
    showList
);


showAddBtn.addEventListener(
    "click",
    showAddForm
);


formBackBtn.addEventListener(
    "click",
    showList
);


cancelBtn.addEventListener(
    "click",
    showList
);


/* =====================================================
   URL VIEW
===================================================== */

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const requestedView =
    urlParams.get("view");


if (requestedView === "add") {

    showAddForm();

}

else {

    showList();

}