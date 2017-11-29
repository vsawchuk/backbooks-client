import Backbone from 'backbone';

const Book = Backbone.Model.extend({
  defaults: {
    author: 'Unknown',
  },
  // initialize(attributes) {
  //   console.log(`Book initialized: ${ this.get('title') } by ${ this.get('author') }`);
  // },
  validate(attributes) {
    const errors = {};

    if (!attributes.title) {
      errors['title'] = ['Title cannot be blank'];
    }

    if (!attributes.author) {
      errors['author'] = ['Author cannot be blank']
    }

    if (!attributes.publication_year) {
      errors['publication_year'] = ['Publication year cannot be blank']
    }

    if (Number.isNaN(parseInt(attributes.publication_year))) {
      errors['publication_year'] = ['Publication year must be a number']
    } else if (parseInt(attributes.publication_year) < 1001 || parseInt(attributes.publication_year) > 2018) {
      errors['publication_year'] = ['Publication year must be a valid year']
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  },
  age() {
    const currentYear = (new Date()).getFullYear();
    return currentYear - this.get('publication_year');
  },
  toString() {
    return `${this.get('title')} by ${this.get('author')}, published ${this.get('publication_year')} is ${this.age()} years old`
  },
});

export default Book;
