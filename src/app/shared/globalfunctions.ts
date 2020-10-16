import * as moment from "moment";
/**
 * Restricts user to enter except alpha charactors
 *
 * @param {object} event entered key object
 * @returns boolean
 * @memberof PersonalInformationComponent
 */
export const textValidator = (event) => {
  let key = event.keyCode;
  return (
    (key >= 65 && key <= 90) ||
    key == 8 ||
    key == 9 ||
    key == 37 ||
    key == 39 ||
    key === 32
  );
};

/**
 *
 * Restricts user to enter except numbers
 * @param {object} event entered key object
 * @returns boolean
 * @memberof PersonalInformationComponent
 */
export const numericValidator = (event) => {
  let key = event.which ? event.which : event.keyCode;
  if (
    event.keyCode == 8 ||
    event.keyCode == 46 ||
    event.keyCode == 37 ||
    event.keyCode == 39
  ) {
    return true;
  } else if (key < 48 || (key > 57 && key < 96) || key > 105) {
    return false;
  } else return true;
  // var charCode = event.which ? event.which : event.keyCode;
  // if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
  // return true;
};

/**
 *
 * Restricts user to enter except numbers
 * @param {object} event entered key object
 * @returns boolean
 * @memberof PersonalInformationComponent
 */
export const numericFloatValidator = (event) => {
  let charCode = event.which ? event.which : event.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;

  return true;
};

export const dateValidation = (startDate, endDate) => {
  const startDateConverted = moment(startDate).format("ll");
  const endDateConverted = moment(endDate).format("ll");
  if (startDateConverted > endDateConverted) {
    return true;
  }

  if (endDateConverted < startDateConverted) return true;
};

export const minDateRange = (date) => {
  let newRange = {
    year: date.year,
    month: date.month,
    day: date.day + 1,
  };
  return newRange;
};

export const maxDateRange = (date) => {
  let newRange = {
    year: date.year,
    month: date.month,
    day: date.day - 1,
  };
  return newRange;
};

export const removeDuplicates = (myArr, prop) => {
  return myArr.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};
