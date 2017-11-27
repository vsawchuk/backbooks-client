// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Our Modules
import BookList from 'collections/book_list';

const BOOK_FIELDS = ['title', 'author', 'publication_year'];
const rawBookData = [
  {
    title: 'Practical Object-Oriented Design in Ruby',
    author: 'Sandy Metz',
    publication_year: 2012
  }, {
    title: 'Parable of the Sower',
    author: 'Octavia Butler',
    publication_year: 1993
  }, {
    title: 'A Wizard of Earthsea',
    author: 'Ursula K. Le Guin',
    publication_year: 1969
  }
];

// Starts undefined - we'll set this in $(document).ready
// once we know the template is available
let bookTemplate;

const readForm = function readForm() {
  const bookData = {};
  BOOK_FIELDS.forEach((field) => {
    // Use jQuery to select the field in the form
    const inputElement = $(`#add-book-form input[name="${ field }"]`);

    // Grab the field's current value
    bookData[field] = inputElement.val();
  });

  return bookData;
};

const clearForm = function clearForm() {
  // Don't need to loop, instead we can use jQuery to
  // select all the inputs at once
  $('#add-book-form input[name]').val('');
};

const render = function render(bookList) {
  const bookListElement = $('#book-list');
  bookListElement.empty();

  bookList.forEach((book) => {
    console.log(`Rendering book ${ book.get('title') }`);
    let bookHTML = bookTemplate(book.attributes);
    bookListElement.append($(bookHTML));
  });

  // Apply styling to the current sort field
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ bookList.comparator }`).addClass('current-sort-field');
};

$(document).ready(() => {
  bookTemplate = _.template($('#book-template').html());

  // Build the collection from seed data
  const bookList = new BookList(rawBookData);

  // Do an initial render so seed data appears on screen
  render(bookList);

  // When a book is added or removed, or when the order changes,
  // redraw the table
  bookList.on('update', render);
  bookList.on('sort', render);

  // Listen for form submissions
  $('#add-book-form').on('submit', (event) => {
    event.preventDefault();

    const bookData = readForm();
    bookList.add(bookData);

    clearForm();
  });

  // Build event handlers for each of the table headers
  BOOK_FIELDS.forEach((field) => {
    const headerElement = $(`.sort.${ field }`);
    headerElement.on('click', () => {
      console.log(`Sorting by ${ field }`);
      bookList.comparator = field;
      bookList.sort();
    });
  });
});
