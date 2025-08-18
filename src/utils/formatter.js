export function currencyFormatter(inputNum) {
  const str = inputNum.toString().split(".");
  const intPart = str[0];
  const decimalPart = str[1] ? "." + str[1] : "";

  const lastThree = intPart.slice(-3);
  const otherNumbers = intPart.slice(0, -3);

  const formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherNumbers ? "," : "") +
    lastThree;

  return formatted + decimalPart;
}

export function dateFormatter(inputDate) {
  const date = new Date(inputDate);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
}

export function getDateWithoutTime(inputDate) {
  const dateObj = new Date(inputDate);
  const formattedDate = dateObj.toLocaleDateString("en-CA");

  return formattedDate;
}

export function getTime(inputDate) {
  const dateObj = new Date(inputDate);
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formattedTime;
}
