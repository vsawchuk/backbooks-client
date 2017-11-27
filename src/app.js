// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Our Modules
import BookList from 'collections/book_list';

const BOOK_FIELDS = ['title', 'author', 'publication_year'];

// Starts undefined - we'll set this in $(document).ready
// once we know the template is available
let bookTemplate;
let statusMessageTemplate;

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

const reportStatus = function reportStatus(status, message) {
  console.log(`Reporting ${ status } message: ${ message }`);
  const generatedHTML = statusMessageTemplate({
    status: status,
    message: message,
  });

  $('#status-messages ul').append(generatedHTML);
  $('#status-messages').show();
}

const booksApiErrorHandler = function(model, response) {
  // Step 1, remove this book from our list (we added it earlier)
  // .destroy will also remove it from all collections
  model.destroy();

  // Step 2, report errors to the user
  if (response.responseJSON['errors']) {
    // Report errors from the server to the user
    const errors = response.responseJSON['errors'];
    for (const field in errors) {
      for (const problem of errors[field]) {
        reportStatus('error', `${ field }: ${ problem }`);
      }
    }

  } else {
    // Server did not give us errors - report a generic
    // failure and log the full response
    reportStatus('error', 'Could not save book');
    console.log('Got error response from server:');
    console.log(response);
  }
}

$(document).ready(() => {
  bookTemplate = _.template($('#book-template').html());
  statusMessageTemplate = _.template($('#status-message-template').html());

  // Build the collection from seed data
  const bookList = new BookList();

  // Get data from the API (will trigger an 'update' upon completion)
  bookList.fetch();

  // When a book is added or removed, or when the order changes,
  // redraw the table
  bookList.on('update', render);
  bookList.on('sort', render);

  // Listen for form submissions
  $('#add-book-form').on('submit', (event) => {
    event.preventDefault();

    const bookData = readForm();
    const book = bookList.add(bookData);
    book.save({}, {
      success: clearForm,
      error: booksApiErrorHandler
    });

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

  // Clear status messages when the user clicks the button
  $('#status-messages button.clear').on('click', (event) => {
    $('#status-messages ul').html('');
    $('#status-messages').hide();
  })
});
