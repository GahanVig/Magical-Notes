// Targeting HTML Elements
const addNote = document.getElementById("addNote");
const notesContainer = document.getElementById("notesContainer");
const noteContent = document.getElementById("noteContent");
const noteTitle = document.getElementById("noteTitle");
const searchInput = document.getElementById("searchInput");
const editNoteTitle = document.getElementById("editNoteTitle");
const editNoteContent = document.getElementById("editNoteContent");
const addEditedNote = document.getElementById("addEditedNote");

// Accessing notes from the local storage
let notes = localStorage.getItem("notes");
let noOfNotes = 0; // Total No. of notes

if (notes == null) {
    localStorage.setItem("notes", JSON.stringify([]));
    notes = JSON.parse(localStorage.getItem("notes"));
}
else {
    notes = JSON.parse(localStorage.getItem("notes"))
}

showNotes(notes)
noteTitle.focus()

setInterval(() => {
    addNote.disabled = noteContent.value == '' || noteTitle.value == '';
    addEditedNote.disabled = editNoteContent.value == '' || editNoteTitle == ''
}, 1);
function showNotes(notes) {
    noteHTML = ``;
    notes.forEach((element, index) => {
        noteHTML += `
        <div class="card border note bg-dark my-2 card-${index}">
        
            <div style="position: absolute; width: 100%;">
            </div>
            <div class="card-body">
                <h5 class="cardTitle noteTitle title-${index}"></h5>
                <p class="card-text noteContent content-${index}"></p>
            </div>
            <div class="d-flex align-items-center w-100 justify-content-end mx-2 my-2">
                <div class="d-flex justify-content-evenly w-25">
                    <i class="fa fa-pen fa-lg icon rounded-circle" data-bs-toggle="modal" data-bs-target="#editModal" onclick="editNote(${index})"></i>
                    <i class="fa fa-trash-can fa-lg icon rounded-circle" id="showToast" onclick="deleteNote(${index})"></i>
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
}
async function displayClearSearchButton() {
    // This function will show the clear button when the search area is not empty
    let clearSearchInput = document.getElementById("clearSearchInput");
    if (searchInput.value != "") {
        clearSearchInput.classList.remove("d-none");
    }
    else {
        clearSearchInput.classList.add("d-none");
    }
}
async function deleteNote(noteIndex) {
    notes.splice(noteIndex, 1);
    if (notes.length > 0) {
        localStorage.setItem("notes", JSON.stringify(notes))
    }
    else {
        localStorage.setItem("notes", "[]")
    }
    showNotes(notes)
    // Showing message to the user that the note is deleted
    document.getElementById("msg").innerHTML = "Note Deleted Successfully"
    toast = new bootstrap.Toast(document.getElementById("liveToast"))
    toast.show()
    setTimeout(() => {
        toast.hide()
    }, 5000)
}
async function editNote(noteIndex) {
    editNoteTitle.value = notes[noteIndex].title;
    editNoteTitle.title = `${noteIndex} note`;
    editNoteContent.value = notes[noteIndex].content;
}
async function saveEditedNote() {
    notes[parseInt(editNoteTitle.title)] = {
        title: editNoteTitle.value,
        content: editNoteContent.value,
    }
    localStorage.setItem("notes", JSON.stringify(notes))
    showNotes(notes)
}
async function search() {
    let query = searchInput.value;
    let searchedNotes = [];
    notes.forEach(element => {
        if (String(element.title).includes(query) || String(element.content).includes(query)) {
            searchedNotes.push({
                title: element.title,
                content: element.content
            })
        }
    })
    showNotes(searchedNotes);
}
editNoteContent.oninput = saveEditedNote;
editNoteTitle.oninput = saveEditedNote;
addNote.addEventListener("click", () => {
    noOfNotes += 1;
    notes.push({
        title: noteTitle.value,
        content: noteContent.value
    })
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes(notes);
        noteContent.value = null;
        noteTitle.value = null;
})

searchInput.addEventListener("input", () => {
    // Adding the clear button when the user start searching
    displayClearSearchButton()
    search()
})

// Checking that whether note content field is not empty