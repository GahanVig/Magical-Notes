// Targeting HTML Elements
const addNote = document.getElementById("addNote");
const notesContainer = document.getElementById("notesContainer");
const noteContent = document.getElementById("noteContent");
const noteTitle = document.getElementById("noteTitle");
const searchInput = document.getElementById("searchInput");
const cancelBtn = document.getElementById("cancelBtn");
const deleteAll = document.getElementById("deleteAll");
// Accessing notes from the local storage
let notes = localStorage.getItem("notes");

if (notes == null) {
    localStorage.setItem("notes", JSON.stringify([]));
    notes = JSON.parse(localStorage.getItem("notes"));
}
else notes = JSON.parse(localStorage.getItem("notes"));
// Background colors of the notes
const bgClasses = [
    'bg-red-800',
    'bg-green-900',
    'bg-cyan-900',
    'bg-purple-900',
    'bg-rose-900',
    'bg-yellow-900'
];
showNotes(notes)

// Adding focus to the note title when the page loads.
noteTitle.focus()
// Function for adding masonry layout to the NoteContainer
function masonry() {
    const masonryGrid = new Masonry(notesContainer)
}
setInterval(() => {
    addNote.disabled = noteContent.value == '' || noteTitle.value == '';
    addNote.classList.remove("hover:bg-neutral-700")
}, 1);

// The main showNotes function which will display all the notes in the notecontainer.
function showNotes(notes) {
    noteHTML = ``;
    notes.forEach((element, index) => {
        noteHTML += `
        <div class="px-3 py-4 ${element.background} my-3 mx-3 rounded-lg shadow-sm shadow-black w-72">
            <div style="position: absolute; width: 100%;">
            </div>
            <div class="card-body mb-3">
                <h5 class="noteTitle font-semibold text-lg title-${index}"></h5>
                <p class="noteContent text-md content-${index}"></p>
            </div>
            <div class="flex items-center w-full justify-end mx-2 mt-6 mb-1">
                <div class="flex justify-evenly w-1/4">
                    <i class="fa fa-pen fa-lg rounded-full cursor-pointer hover:bg-opacity-50 hover:bg-neutral-700" data-bs-toggle="modal" data-bs-target="#editModal" onclick="editNote(${index})"></i>
                    <i class="fa fa-trash-can fa-lg rounded-full cursor-pointer hover:bg-opacity-50 hover:bg-neutral-700" onclick="deleteNote(${index})"></i>
                </div>
            </div>
        </div>
        `
    });
    notesContainer.innerHTML = noteHTML;
    notes.forEach((element, index) => {
        document.querySelector(`.title-${index}`).innerText = element.title;
        document.querySelector(`.content-${index}`).innerText = element.content;
    })
    setTimeout(() => {
        masonry();
    }, 1);

    // Hiding the delete all notes button if there is no note present 
    if (notes.length <= 0) deleteAll.classList.add("hidden");
}
async function displayClearSearchButton() {
    // This function will show the clear button when the search area is not empty
    let clearSearchInput = document.getElementById("clearSearchInput");
    if (searchInput.value != "") clearSearchInput.classList.remove("opacity-0");
    else clearSearchInput.classList.add("opacity-0");
}
// Function for deleting note
async function deleteNote(noteIndex) {
    notes.splice(noteIndex, 1);
    if (notes.length > 0) localStorage.setItem("notes", JSON.stringify(notes))
    else localStorage.setItem("notes", "[]")
    showNotes(notes)
    // Showing message to the user that the note is deleted
}
cancelBtn.addEventListener("click", () => {
    addNote.innerText = 'Add note';
    noteContent.value = null;
    noteTitle.value = null;
    cancelBtn.classList.add("hidden");
})
// Function for editing the note
async function editNote(noteIndex) {
    addNote.innerText = 'Save Edits';
    cancelBtn.classList.remove('hidden');
    noteTitle.value = notes[noteIndex].title;
    noteContent.value = notes[noteIndex].content;
    addNote.addEventListener("click", () => {
        if (addNote.innerText === "Save Edits") {
            notes[noteIndex] = {
                title: noteTitle.value,
                content: noteContent.value,
                background: notes[noteIndex].background
            };
            localStorage.setItem("notes", JSON.stringify(notes));
            showNotes(notes);
            cancelBtn.classList.add("hidden");
        }
    })

}
// Function for searching for notes

async function search() {
    let query = searchInput.value;
    let searchedNotes = [];
    notes.forEach(element => {
        if (String(element.title).toLowerCase().includes(query.toLowerCase()) || String(element.content).toLowerCase().includes(query.toLowerCase())) {
            searchedNotes.push({
                title: element.title,
                content: element.content,
                background: element.background
            })
        }
    })
    showNotes(searchedNotes);
}
// function for adding the notes
addNote.addEventListener("click", () => {
    let randomNum = Math.floor(Math.random() * bgClasses.length);
    if (addNote.innerText === "Add Note") {
        notes.push({
            title: noteTitle.value,
            content: noteContent.value,
            background: bgClasses[randomNum]
        })
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes(notes);
        noteContent.value = null;
        noteTitle.value = null;
    }
})
// Function for delete all notes.
deleteAll.addEventListener("click", () => {
    localStorage.removeItem('notes');
    notes = [];
    showNotes(notes);
})
searchInput.addEventListener("input", () => {
    // Adding the clear button when the user start searching
    displayClearSearchButton()
    search()
})
