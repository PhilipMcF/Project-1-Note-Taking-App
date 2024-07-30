const countData = [
    {
      name: "Character Counts",
      children: [],
    },
  ];
  
  function readNoteCharacterCount() {
      const data = JSON.parse(localStorage.getItem('notes'));
      for (entry in data) {
          countData[0]['children'].push({
              name: data[entry]['subject'],
              chr_count: data[entry]['note'].length
          });
      }
      return countData;
  }
  const data = readNoteCharacterCount();