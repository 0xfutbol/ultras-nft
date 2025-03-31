const basePath = process.cwd();
const fs = require("fs");
const jsonDir = `${basePath}/build/json`;

// Read all JSON files from build/json directory
let data = [];
const files = fs.readdirSync(jsonDir).filter(file => file.endsWith('.json'));
files.forEach(file => {
  const rawdata = fs.readFileSync(`${jsonDir}/${file}`);
  const parsedData = JSON.parse(rawdata);
  data.push(parsedData);
});
let editionSize = data.length;

let rarityData = {};

// Initialize rarity data from attributes
data.forEach((element) => {
  let attributes = element.attributes;
  attributes.forEach((attribute) => {
    const traitType = attribute.trait_type;
    const value = attribute.value;

    // If trait type doesn't exist, create it
    if (!rarityData[traitType]) {
      rarityData[traitType] = [];
    }

    // Check if trait value already exists
    const existingTrait = rarityData[traitType].find(t => t.trait === value);
    if (!existingTrait) {
      rarityData[traitType].push({
        trait: value,
        occurrence: 0 // initialize at 0
      });
    }
  });
});

// Count occurrences
data.forEach((element) => {
  let attributes = element.attributes;
  attributes.forEach((attribute) => {
    const traitType = attribute.trait_type;
    const value = attribute.value;

    const rarityDataTraits = rarityData[traitType];
    const traitEntry = rarityDataTraits.find(t => t.trait === value);
    if (traitEntry) {
      traitEntry.occurrence++;
    }
  });
});

// Convert occurrences to occurrence string and sort traits
for (var layer in rarityData) {
  // Sort traits alphabetically
  rarityData[layer].sort((a, b) => a.trait.localeCompare(b.trait));
  
  for (var attribute in rarityData[layer]) {
    // get chance
    let chance =
      ((rarityData[layer][attribute].occurrence / editionSize) * 100).toFixed(2);

    // show two decimal places in percent
    rarityData[layer][attribute].occurrence =
      `${rarityData[layer][attribute].occurrence} in ${editionSize} (${chance} %)`;
  }
}

// Print out rarity data for sorted trait types
const sortedLayers = Object.keys(rarityData).sort();
for (const layer of sortedLayers) {
  console.log(`Trait type: ${layer}`);
  for (var trait in rarityData[layer]) {
    console.log(rarityData[layer][trait]);
  }
  console.log();
}