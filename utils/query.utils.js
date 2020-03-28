
class QueryUtils {
  static whereEqual(options, condition) {
    for (let key of Object.keys(condition)) {
      if (condition[key]) {
        options.where = options.where ? options.where : {};
        options.where[key] = condition[key];
      }
    }
    return options;
  }

  static whereEqualOrLessThan(options, condition) {
    for (let key of Object.keys(condition)) {
      if (condition[key]) {
        options.where[key] = {
          $or: {
            $lt: condition[key],
            $eq: condition[key]
          }
        }
      }
    }
    return options;
  }

  static whereEqualOrGreaterThan(options, condition) {
    for (let key of Object.keys(condition)) {
      if (condition[key]) {
        options.where[key] = {
          $or: {
            $gt: condition[key],
            $eq: condition[key]
          }
        }
      }
    }
    return options;
  }

  static whereLike(options, condition) {
    for (let key of Object.keys(condition)) {
      if (condition[key]) {
        options.where[key] = { $like: '%' + condition[key] + '%' }
      }
    }
    return options;
  }

  static whereNotEqual(options, condition) {
    for (let key of Object.keys(condition)) {
      if (condition[key]) {
        options.where[key] = { $notIn: [condition[key]] }
      }
    }
    return options;
  }

  static whereLikeMultipleFields(options, condition) {
    let or = [];
    for (let key of Object.keys(condition)) {
      if (condition[key]) {
        let obj = {};
        obj[key] = { $like: '%' + condition[key] + '%' }
        or.push(obj);
      }
    }
    if (or && or.length > 0) {
      options.where.$or = {
        $or: or
      }
    }
    return options;
  }

  static whereIn(options, condition) {
    for (let key of Object.keys(condition)) {
      if (condition[key]) {
        options.where[key] = { $in: [condition[key]] };
      }
    }
    return options;
  }
}

export default QueryUtils;
