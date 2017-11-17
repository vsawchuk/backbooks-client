import $ from 'jquery';
import _ from 'underscore';

import './css/foundation.css';
import './css/style.css';


console.log('it loaded!');

$(document).ready( () => {
  $('main').html('<h1>Welcome to Webpack!</h1>');
});
