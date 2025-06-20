document.addEventListener('DOMContentLoaded', function() {
  // Step 1: Get the form element using getElementById
  const form = document.getElementById('journal-form');

  // Step 2: Get each form field (title, entry, mood, date)
  const titleField = document.getElementById('title');
  const entryField = document.getElementById('entry');
  const moodField = document.getElementById('mood');
  const dateField = document.getElementById('date');

  // Step 3: Get the container where entries will be shown
  const entriesContainer = document.getElementById('entries');

  const moodFilter = document.getElementById('filter-mood');
  const startDateFilter = document.getElementById('filter-start');
  const endDateFilter = document.getElementById('filter-end');
  const keywordFilter = document.getElementById('filter-search');



  // Load saved entries from localStorage and show them ON PAGE LOAD
  const saved = localStorage.getItem('journalEntries');
  const entries = saved ? JSON.parse(saved) : [];

  function renderEntries(filterCriteria, filterValue, customList = null) {
  entriesContainer.innerHTML = ``;

  const listToRender = customList || entries;

  listToRender.forEach((e, index) => {
    if (!filterCriteria || e[filterCriteria] === filterValue || filterValue === "All") {
      const newEntry = document.createElement('div');
      newEntry.classList.add(e.mood);

      newEntry.innerHTML = `
        <div class="entry-content">
          <h3>${e.title}</h3>
          <p>${e.entry}</p>
          <p>${e.mood}</p>
          <p>${e.date}</p>
          <button data-index="${index}">🗑️ Delete</button>
        </div>
      `;
      entriesContainer.appendChild(newEntry);
            }
        });
    }


  renderEntries()

  // Add a submit event listener to the form
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the page from refreshing

    //  Get values from each input field
    const title = titleField.value;
    const entry = entryField.value;
    const mood = moodField.value;
    const date = dateField.value;

    entries.push({title, entry, mood, date})
    localStorage.setItem('journalEntries', JSON.stringify(entries))

    // Fill the new div with HTML using innerHTML
    renderEntries()

    // Step 9: Clear the form using form.reset();
    form.reset();
  });

    entriesContainer.addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            const index = event.target.getAttribute('data-index');

            entries.splice(index, 1)

            localStorage.setItem('journalEntries', JSON.stringify(entries))
            renderEntries()
        }
    })
    
    moodFilter.addEventListener('change', function(event){
        if(event.target.value =='All'){
            renderEntries('mood', 'All')
        }
        else if(event.target.value =='Happy'){
            renderEntries('mood', 'Happy')
        }
        else if(event.target.value =='Excited'){
            renderEntries('mood', 'Excited')
        }
        else if(event.target.value =='Neutral'){
            renderEntries('mood', 'Neutral')
        }
        else if(event.target.value =='Sad'){
            renderEntries('mood', 'Sad')
        }
        else if(event.target.value =='Anxious'){
            renderEntries('mood', 'Anxious')
        }
    })

    keywordFilter.addEventListener('input', function(event) {
    const keyword = event.target.value.trim().toLowerCase();

    // Filter entries where title or entry text includes the keyword
    const filtered = entries.filter(e =>
        e.title.toLowerCase().includes(keyword) ||
        e.entry.toLowerCase().includes(keyword)
    );

    renderEntries(null, null, filtered);
    });


    startDateFilter.addEventListener('change', applyDateFilter);
endDateFilter.addEventListener('change', applyDateFilter);

function applyDateFilter() {
  const startDate = startDateFilter.value;
  const endDate = endDateFilter.value;

  // Filter entries by date range (inclusive)
  const filtered = entries.filter(e => {
    if (!startDate && !endDate) return true; // no filter if both empty

    const entryDate = e.date;

    if (startDate && endDate) {
      return entryDate >= startDate && entryDate <= endDate;
    } else if (startDate) {
      return entryDate >= startDate;
    } else if (endDate) {
      return entryDate <= endDate;
    }
  });

  renderEntries(null, null, filtered);
}


})
