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

const render = function render(bookList) {
  let bookListElement = $('#book-list');
  bookListElement.empty();

  bookList.forEach((book) => {
    console.log(`Rendering book ${ book.get('title') }`);
    let bookHTML = bookTemplate(book.attributes);
    bookListElement.append($(bookHTML));
  });
};

$(document).ready(() => {
  bookTemplate = _.template($('#book-template').html());

  // Build a collection from our seed data
  let bookList = new BookList(rawBookData);

  // Do an initial render so that seed data appears on screen
  render(bookList);
});
