// Constants
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;

let categories = [];

/** Fetch random category IDs */
async function getCategoryIds() {
  console.log('Fetching mock category IDs...');
  return [1, 2, 3, 4, 5, 6];
}

/** Fetch data for a single category */
async function getCategory(catId) {
  console.log(`Using mock data for category ID: ${catId}`);
  return {
    title: `Category ${catId}`,
    clues: Array.from({ length: NUM_QUESTIONS_PER_CAT }, (_, i) => ({
      question: `Mock Question ${i + 1} for Category ${catId}`,
      answer: `Mock Answer ${i + 1}`,
      showing: null,
    })),
  };
}

/** Fill the HTML table with categories and questions */
async function fillTable() {
  console.log('Filling the table...');
  const thead = $("#jeopardy thead");
  const tbody = $("#jeopardy tbody");
  thead.empty();
  tbody.empty();

  // Add category titles to the table header
  const headerRow = $("<tr>");
  for (let category of categories) {
    headerRow.append($(`<th>${category.title}</th>`));
  }
  thead.append(headerRow);

  // Add rows for each question
  for (let i = 0; i < NUM_QUESTIONS_PER_CAT; i++) {
    const row = $("<tr>");
    for (let category of categories) {
      const safeTitle = category.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const cellId = `${safeTitle}-${i}`;
      row.append($(`<td id="${cellId}">?</td>`));
    }
    tbody.append(row);
  }
  console.log('Table filled.');
}

/** Handle clue click: show question or answer */
function handleClick(evt) {
  console.log('Clue clicked:', evt.target.id);
  const [categoryTitle, clueIdx] = evt.target.id.split('-');
  const category = categories.find(cat => cat.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-') === categoryTitle);
  if (!category) {
    console.error('Category not found for title:', categoryTitle);
    return;
  }
  const clue = category.clues[clueIdx];
  if (!clue) {
    console.error('Clue not found for index:', clueIdx);
    return;
  }

  if (clue.showing === null) {
    evt.target.innerText = clue.question;
    clue.showing = 'question';
  } else if (clue.showing === 'question') {
    evt.target.innerText = clue.answer;
    clue.showing = 'answer';
  }
}

/** Show loading spinner */
function showLoadingView() {
  console.log('Showing loading view...');
  $('#loading').show();
  $('#start').text('Loading...');
}

/** Hide loading spinner */
function hideLoadingView() {
  console.log('Hiding loading view...');
  $('#loading').hide();
  $('#start').text('Restart Game');
}

/** Setup game: fetch categories and fill table */
async function setupAndStart() {
  console.log('Starting game setup...');
  showLoadingView();

  const categoryIds = await getCategoryIds();
  if (categoryIds.length === 0) {
    console.error('No category IDs fetched.');
    hideLoadingView();
    return;
  }

  categories = await Promise.all(categoryIds.map(id => getCategory(id)));
  await fillTable();
  hideLoadingView();
}

/** Add event listeners on page load */
$(async function() {
  console.log('Page loaded. Initializing event listeners...');
  $('#start').on('click', setupAndStart);
  $('#jeopardy').on('click', 'td', handleClick);

  // Initial setup
  setupAndStart();
});
