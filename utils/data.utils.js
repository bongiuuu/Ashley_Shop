'use strict'

const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const PASSWORD_REGEX = /^[A-Za-z\d@$!%*#?&]{6,}$/
const USERNAME_REGEX = /^(?=.{4,32}$)[a-zA-Z0-9._@]+$/
const NAME_REGEX = new RegExp(
  /^[a-zA-Z0-9\ẮẰẲẴẶĂẤẦẨẪẬÂÁÀÃẢẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒÕỎỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴẮẰẲẴẶĂẤẦẨẪẬÂÁÀẢÃẠĐẾỀỂỄỆÊÉÈẺẼẸÍÌỈĨỊỐỒỔỖỘÔỚỜỞỠỢƠÓÒỎÕỌỨỪỬỮỰƯÚÙỦŨỤÝỲỶỸỴ\ ]+$/,
  'i'
)
const TIME_REGEX = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
const TIME_WITH_SECOND_REGEX = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/);
const PHONE_NUMBER_REGEX = /^[0-9\s- \+]{8,13}$/;

class DataUtils {
  static isValue(value) {
    return (
      (value || value === 0 || value instanceof Boolean) && value.toString().trim() !== ''
    );
  }

  static isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  static isJson(data) {
    try {
      JSON.parse(data);
    } catch (error) {
      return true;
    }
    return false;
  }

  static isValidEmailAddSyntax(emailAdd) {
    return EMAIL_REGEX.test(emailAdd);
  }

  static isValidPasswordSyntax(password) {
    return PASSWORD_REGEX.test(password);
  }

  static isValidUsernameSyntax(username) {
    return USERNAME_REGEX.test(username);
  }

  static isValidNameSyntax(name) {
    return NAME_REGEX.test(name);
  }

  static isTimeValid(time) {
    return TIME_REGEX.test(time);
  }

  static isTimeWithSecondValid(time) {

    return TIME_WITH_SECOND_REGEX.test(time);
  }

  static isValidPhoneNumber(number) {
    return PHONE_NUMBER_REGEX.test(number);
  }
}

export default DataUtils;
