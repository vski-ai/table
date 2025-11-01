import { faker } from "@faker-js/faker";

export function generateRows(length = 1000000) {
  return new Array(length).fill(0).map((_, i) => {
    return {
      id: i,
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

console.log("Generating 1M rows...");
Deno.writeTextFileSync(
  "./flat-1m-rows.json",
  JSON.stringify(generateRows(100000)),
);
console.log("Done");
