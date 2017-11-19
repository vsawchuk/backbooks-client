import Backbone from 'backbone';
import Book from '../models/book';

const BookList = Backbone.Collection.extend({
  model: Book
});

export default BookList;
