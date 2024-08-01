// Function utilized by AG Charts to get the character count of each note from local storage.
// The 'readNoteCharacterCount' function returns the countData object containing dada (subject: , note:)

const countData = [
    {
        name: "Character Counts",
        children: [],
    },
];

function readNoteCharacterCount() {
    const data = JSON.parse(localStorage.getItem('notes'));
    for (entry in data) {
        editNoteEditor.setContents(data[entry]['note']);
        let text = editNoteEditor.getText();
        countData[0]['children'].push({
            name: data[entry]['subject'],
            chr_count: text.length
        });
    }
    return countData;
}
const data = readNoteCharacterCount();