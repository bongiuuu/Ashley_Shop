import moment from 'moment';
import numeral from 'numeral';

const DATE_TIME_FORMAT_YMD = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT_DMY = 'DD/MM/YYYY';
const DATE_FORMAT_YMD = 'YYYY/MM/DD';
const TIME_WITH_SECOND_FORMAT = 'HH:mm:ss';
const TIME_WITHOUT_SECOND_FORMAT = 'HH:mm';
const PRICE_FORMAT = '0,0.00';

export const generateCode = (number = 'V000000000', step = 1, expand = false) => {
  number = number.toString();

  let next = 0;
  let index = -1;
  let prefix = number;
  let length = number.length;

  const filter = new RegExp('(\\d+$)');
  const match = number.match(filter);

  if (match) {
    index = number.lastIndexOf(match[1]);
    prefix = number.substring(0, index);
    next = parseInt(match[1]);
  }

  next = next + step;

  if ((prefix + next).length > length) {
    if (expand) {
      length++;
    } else {
      throw new Error("[Numerator] Parameter 'number' achieved its maximum");
    }
  }

  next = next.toString().padStart(length, prefix + "0000000000000000000000000000000000000");

  return next;
}

export const atob = (input) => {
  return new Buffer(input, 'base64').toString('ascii');
}

export const btoa = (input) => {
  if (Buffer.byteLength(str) !== str.length)
    throw new Error('bad string!');
  return new Buffer(str, 'binary').toString('base64');
}

export const toNumber = (str) => {
  const number = parseInt(str);
  return !isNaN(number) ? number : 0;
}

export const toFloat = (str) => {
  const number = parseFloat(str);
  return !isNaN(number) ? number : 0;
}

export const toSQLDateTime = (date) => {
  return moment.utc(date).format();
}

export const formatDate = (date, format = DATE_FORMAT_DMY) => {
  return date ? moment.utc(date).format(format) : '';
}

export const formatTime = (date, format = TIME_WITHOUT_SECOND_FORMAT) => {
  return date ? moment.utc(date).format(format) : '';
}

export const formatPrice = (number, format = PRICE_FORMAT) => {
  return number ? numeral(number).format(format) : 0.00;
}
