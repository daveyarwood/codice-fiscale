import assert from 'assert';

type Gender = "M" | "F";

type PersonData = {
  name: string,
  surname: string,
  gender: Gender,
  dob: string // Would probably want to model this better
};

type FiscalCode = string;

function isVowel(c: string): boolean {
  assert(c.length == 1, `Expected a 1-character string, got ${c}`)

  // This doesn't account for accented characters, but it's good enough for this
  // exercise.
  return "aeiouAEIOU".indexOf(c[0]) > -1;
}

function vowels(str: string): string[] {
  return str.split('').filter(isVowel);
}

function consonants(str: string): string[] {
  return str.split('').filter(x => !isVowel(x));
}

function surnamePortion(surname: string): string {
  return consonants(surname)
    .concat(vowels(surname))
    .concat("xxx".split(''))
    .slice(0, 3)
    .join('')
    .toUpperCase();
}

function namePortion(name: string): string {
  const cs = consonants(name);

  const nameConsonants = cs.length > 3
    ? [cs[0], cs[2], cs[3]]
    : cs;

  return nameConsonants
    .concat(vowels(name))
    .concat("xxx".split(''))
    .slice(0, 3)
    .join('')
    .toUpperCase();
}

// In a real application, I would probably use a library for this. For the
// purposes of this exercise, the format is predictable and straightforward, so
// I can just do it by hand.
function parseDate(str: string): Date {
  const match = str.match(/(\d+)\/(\d+)\/(\d+)/)
  assert(match, `Invalid date string: ${str}`);
  const [_, day, month, year] = match;

  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
  )
}

function dobYearPortion(dob: Date): string {
  return `${dob.getFullYear().toString().substring(2, 4)}`;
}

function dobMonthPortion(dob: Date): string {
  return "ABCDEHLMPRST"[dob.getMonth()];
}

function dobDayPortion(dob: Date, gender: Gender): string {
  const date = dob.getDate();

  switch(gender) {
    case "M":
      return `${date < 10 ? "0" : ""}${date}`;
    case "F":
      return `${date + 40}`;
  }
}

function fiscalCode(data: PersonData): FiscalCode {
  const parsedDob = parseDate(data.dob);

  return surnamePortion(data.surname) +
    namePortion(data.name) +
    dobYearPortion(parsedDob) +
    dobMonthPortion(parsedDob) +
    dobDayPortion(parsedDob, data.gender);
}

////////////////////////////////////////////////////////////////////////////////

type TestCase = {
  data: PersonData,
  expectedResult: FiscalCode
};

const testCases: TestCase[] = [
  {
    data: {
      name: "Matt",
      surname: "Edabit",
      gender: "M",
      dob: "1/1/1900"
    },
    expectedResult: "DBTMTT00A01"
  },
  {
    data: {
      name: "Helen",
      surname: "Yu",
      gender: "F",
      dob: "1/12/1950"
    },
    expectedResult: "YUXHLN50T41"
  },
  {
    data: {
      name: "Mickey",
      surname: "Mouse",
      gender: "M",
      dob: "16/1/1928"
    },
    expectedResult: "MSOMKY28A16"
  },
];

for (const {data, expectedResult} of testCases) {
  assert.equal(fiscalCode(data), expectedResult);
}
