import 'foundation-sites/dist/css/foundation.css';
import './style.css';

import $ from 'jquery';
import _ from 'underscore';

import Book from './models/book.js';
import BookList from './collections/book_list.js';

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

const readForm = () => {
  let bookData = {};
  ['title', 'author', 'publication_year'].forEach((field) => {
    // Use jQuery to select the field in the form
    let inputElement = $(`#add-book-form input[name="${ field }"]`);

    // Grab the field's current value
    bookData[field] = inputElement.val();

    // Clear the field
    inputElement.val('');
  });

  console.log('Read book data:');
  console.log(bookData);

  return bookData;
};

const render = function render(bookList) {
  let bookListElement = $('#book-list');
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

  // Build a collection from our seed data
  let bookList = new BookList(rawBookData);

  // Do an initial render so that seed data appears on screen
  render(bookList);

  // Register render as an event handler for update, so that
  // when books are added or removed we will re-render the list
  bookList.on('update', render);

  // Also re-render on sort events
  bookList.on('sort', render);

  // Listen for submit events on the add book form
  // Note that we create a closure w/ bookList - if this callback
  // were defined with the helper methods above we would have to do
  // some extra work to get access.
  $('#add-book-form').on('submit', (event) => {
    event.preventDefault();
    let bookData = readForm();
    bookList.add(bookData);
  });

  // Build event handlers for each of the table headers
  ['title', 'author', 'publication_year'].forEach((field) => {
    let headerElement = $(`.sort.${ field }`);
    headerElement.on('click', () => {
      console.log(`Sorting by ${ field }`);
      bookList.comparator = field;
      bookList.sort();
    });
  });
});
