import { faker } from "@faker-js/faker";

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function generateLevel1(length = 20) {
  return new Array(length).fill(0).map((_, i) => {
    return {
      id: i + "l1" + (2025 - length + i),
      $is_group_root: true,
      $group_level: 0,
      $group_by: "Year",
      "Year": 2025 - length + i,
      "Month": "-",
      "First Name": "",
      "Last Name": "",
      "Birth Date": "",
      "Company": "",
      "Job title": "",
      "Hourly Rate": "",
      "Country": "",
      "City ": "",
    };
  });
}

function generateLevel2(length = 12) {
  return new Array(length).fill(0).map((_, i) => {
    return {
      id: i + "l2" + month[i],
      $is_group_root: true,
      $group_level: 1,
      $group_by: "Month",
      "Year": "-",
      "Month": month[i],
      "First Name": "",
      "Last Name": "",
      "Birth Date": "",
      "Company": "",
      "Job title": "",
      "Hourly Rate": "",
      "Country": "",
      "City ": "",
    };
  });
}

function generateLevel3(length = 10) {
  return new Array(length).fill(0).map((_, i) => {
    return {
      id: i + "L3",
      $is_group_root: false,
      $group_level: 2,
      $group_by: "Company",
      "Year": "-",
      "Month": "-",
      "First Name": faker.person.firstName(),
      "Last Name": faker.person.lastName(),
      "Birth Date": faker.date.between({
        from: new Date(0),
        to: new Date(new Date().setFullYear(2010)),
      }).toISOString(),
      "Company": faker.company.name(),
      "Job title": faker.person.jobTitle(),
      "Hourly Rate": faker.finance.amount(),
      "Country": faker.location.countryCode(),
      "City ": faker.location.city(),
    };
  });
}

export function generateRows() {
  const result = [];
  for (const l1 of generateLevel1()) {
    result.push(l1);
    for (const l2 of generateLevel2()) {
      l2.id = l2.id + l1.id;
      l2.$parent_id = [l1.id];
      l2.Year = l1.Year;
      result.push(l2);
      for (const l3 of generateLevel3()) {
        l3.$parent_id = [l1.id, l2.id];
        l3.Year = l1.Year;
        l3.Month = l2.Month;
        result.push(l3);
      }
    }
  }
  return result;
}

export const generate = () => {
  console.log("Generating 1M rows...");
  Deno.writeTextFileSync(
    "./group-1m-rows.json",
    JSON.stringify(generateRows()),
  );
  console.log("Done");
};
