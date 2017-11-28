import $ from 'jquery';
import _ from 'underscore';

import 'foundation-sites/dist/css/foundation.css';
import './style.css';

import Book from './models/book';
import BookList from './collections/book_list';

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

const codingInterview = new Book({
  title: 'Cracking the Coding Interview',
  author: 'Gale',
  publication_year: 1900,
  illustrator: 'Bob Ross',
})

rawBookData.push(codingInterview.attributes);
codingInterview.set('title', 'The Lord of the Flies');

const bookList = new BookList(rawBookData);
bookList.add(codingInterview);
console.log(bookList);
console.log(bookList.at(2));
console.log(bookList.get('c2'));

bookList.forEach((book) => console.log(`${book.get('title')} by ${book.get('author')}`));
// Backbone has a bunch of built in methods for collections: http://backbonejs.org/#Collection
const authors = bookList.pluck('author');
console.log(authors);

const newBooks = bookList.filter((book) => book.get('publication_year') > 1900);
console.log(newBooks);

// Starts undefined - we'll set this in $(document).ready
// once we know the template is available
let bookTemplate;

const render = function render(list) {
  const $bookList = $('#book-list');
  $bookList.empty();
  list.forEach((book) => $bookList.append(bookTemplate(book.attributes)));
};

$(document).ready(() => {
  bookTemplate = _.template($('#book-template').html());
  render(bookList);
  render(bookList);
});
