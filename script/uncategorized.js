// const fs = require('fs');

const input = []
const herond_wallet_locale_array = Object.keys(input)

console.log(herond_wallet_locale_array)

// convert the object to the specified format
function convertcamelcasetoreadable(str) {
  // use a regular expression to insert spaces before uppercase letters
  const formattedstring = str
    .replace(/([a-z])([a-z])/g, "$1 $2")
    .replace(/([a-z]+)/g, " $1") // handle consecutive uppercase letters
    .trim(); // remove leading/trailing spaces

  // capitalize the first letter of each word
  return formattedstring.replace(/\b\w/g, (char) => char.touppercase());
}

const localizedstrings = object.entries(input).map(
  ([key, value]) => {
    const test = key
      .replace(/([a-z])([a-z])/g, "$1 $2")
      .replace(/([a-z]+)/g, " $1") // handle consecutive uppercase letters
      .trim(); // remove leading/trailing spaces

    const messagename = `ids_${test.touppercase()}`.replace(/_/g, ""); // remove underscores for xml names
    return `  <message name="${messagename}" desc="${value}">${value}</message>`;
  }
);

const localizedstrings2 = object.entries(input).map(
  ([key, value]) => {
    const test = key
      .replace(/([a-z])([a-z])/g, "$1 $2")
      .replace(/([a-z]+)/g, "$1") // handle consecutive uppercase letters
      .trim(); // remove leading/trailing spaces

    const messagename = `ids_${test.touppercase()}`.replace(/ /g, "_"); // remove underscores for xml names

    return `{"${key}", ${messagename}},`;
    // return `  <message name="${messagename}" desc="${value}">${value}</message>`;
  }
);

// compose the final output
// const output = localizedstrings.join("\n");
// const output2 = localizedstrings2.join("\n");

// write the output to a file
// console.log(output2);
// fs.writefile('localized_strings.xml', output, (err) => {
//     if (err) {
//         console.error('error writing to file', err);
//     } else {
//         console.log('output successfully written to localized_strings.xml');
//     }
// });
