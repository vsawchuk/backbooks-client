// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Our Modules
import BookList from 'collections/book_list';

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
  const bookListElement = $('#book-list');
  bookListElement.empty();

  bookList.forEach((book) => {
    console.log(`Rendering book ${ book.get('title') }`);
    let bookHTML = bookTemplate(book.attributes);
    bookListElement.append($(bookHTML));
  });
};

$(document).ready(() => {
  bookTemplate = _.template($('#book-template').html());

  const bookList = new BookList(rawBookData);
  render(bookList);
});
