import $ from 'jquery';
import _ from 'underscore';

import 'foundation-sites/dist/css/foundation.css';
import './style.css';

import Book from './models/book';
import BookList from './collections/book_list';

const bookList = new BookList();
let bookTemplate;

const render = function render(list) {
  const $bookList = $('#book-list');
  $bookList.empty();
  list.forEach((book) => $bookList.append(bookTemplate(book.attributes)));
};

const fields = ['title', 'author', 'publication_year'];

const events = {
  addBook(event) {
    event.preventDefault();
    const bookData = {};
    fields.forEach((field) => {
      let val = $(`input[name=${field}]`).val()
      if (val === '') {
        val = undefined;
      }
      bookData[field] = val;
      $(`input[name=${field}]`).val('');
    });
    const book = new Book(bookData);
    if (book.isValid()) {
      bookList.add(book);
      book.save({}, {
        success: events.successfulSave,
        error: events.failedSave,
      });
    } else {
      $('#status-messages ul').empty();
      for (let error in book.validationError) {
        book.validationError[error].forEach((message) => $('#status-messages ul').append(`<li>${message}</li>`));
      }
      $('#status-messages').show();
    }
  },
  successfulSave(book) {
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${book.get('title')} added!</li>`);
    $('#status-messages').show();
  },
  failedSave(book, response) {
    book.destroy();
    $('#status-messages ul').empty();
    const errors = response.responseJSON.errors;
    for (let key in errors) {
      errors[key].forEach((issue) => {
        $('#status-messages ul').append(`<li>${key}: ${issue}</li>`);
      })
    }
    $('#status-messages').show();
  },
  sortBooks() {
    const classes = $(this).attr('class').split(/\s+/);
    let sortClass;
    for (let i = 0; i < classes.length; i += 1) {
      if (fields.includes(classes[i])) {
        sortClass = classes[i];
      }
    }
    bookList.comparator = sortClass;
    if (classes.includes('desc')) {
      const descModels = bookList.models.reverse();
      render(descModels);
      $(this).removeClass('desc');
    } else {
      bookList.sort();
      $(this).addClass('desc').siblings().removeClass('desc');
      render(bookList);
    }
    $(this).addClass('current-sort-field').siblings().removeClass('current-sort-field');
  },
};

$(document).ready(() => {
  bookTemplate = _.template($('#book-template').html());
  $('#add-book-form').on('submit', events.addBook);
  bookList.on('update', render, bookList);
  $('.sort').on('click', events.sortBooks);
  bookList.fetch();
});
