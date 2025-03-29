const basePath = process.cwd();
const { NETWORK } = require(`${basePath}/constants/network.js`);
const fs = require("fs");
const sha1 = require(`${basePath}/node_modules/sha1`);
const { createCanvas, loadImage } = require(`${basePath}/node_modules/canvas`);
const buildDir = `${basePath}/build`;
const layersDir = `${basePath}/layers`;
const {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
} = require(`${basePath}/src/config.js`);
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = format.smoothing;
var metadataList = [];
var attributesList = [];
var dnaList = new Set();
const DNA_DELIMITER = "-";
const HashlipsGiffer = require(`${basePath}/modules/HashlipsGiffer.js`);

const {
  HEAD_TO_HAIR_COLOR_MAP,
  MATE_DRINKERS,
  WORLD_CUP_CHAMPIONS,
  VIP_DNA,
} = require(`${basePath}/src/constants.js`);

const {
  countryShortToLong,
  formatAttributeValue,
  mapSkinColor,
} = require(`${basePath}/src/functions.js`);

let hashlipsGiffer = null;

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(`${buildDir}/json`);
  fs.mkdirSync(`${buildDir}/images`);
  if (gif.export) {
    fs.mkdirSync(`${buildDir}/gifs`);
  }
};

const getRarityWeight = (_str) => {
  let nameWithoutExtension = _str.slice(0, -4);
  var nameWithoutWeight = Number(
    nameWithoutExtension.split(rarityDelimiter).pop()
  );
  if (isNaN(nameWithoutWeight)) {
    nameWithoutWeight = 1;
  }
  return nameWithoutWeight;
};

const cleanDna = (_str) => {
  const withoutOptions = removeQueryStrings(_str);
  var dna = Number(withoutOptions.split(":").shift());
  return dna;
};

const cleanName = (_str) => {
  let nameWithoutExtension = _str.slice(0, -4);
  var nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();
  return nameWithoutWeight;
};

const getElements = (path) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      if (i.includes("-")) {
        throw new Error(`layer name can not contain dashes, please fix: ${i}`);
      }
      return {
        id: index,
        name: cleanName(i),
        filename: i,
        path: `${path}${i}`,
        weight: getRarityWeight(i),
      };
    });
};

const layersSetup = (layersOrder) => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    name:
      layerObj.options?.["displayName"] != undefined
        ? layerObj.options?.["displayName"]
        : layerObj.name,
    blend:
      layerObj.options?.["blend"] != undefined
        ? layerObj.options?.["blend"]
        : "source-over",
    opacity:
      layerObj.options?.["opacity"] != undefined
        ? layerObj.options?.["opacity"]
        : 1,
    bypassDNA:
      layerObj.options?.["bypassDNA"] !== undefined
        ? layerObj.options?.["bypassDNA"]
        : false,
  }));
  return layers;
};

const saveImage = (_editionCount) => {
  const jerseyAttribute = attributesList.find(attr => attr.trait_type === "Jersey");
  const jerseyPrefix = jerseyAttribute ? jerseyAttribute.value.replace(/\s+/g, "") : "";

  fs.writeFileSync(
    `${buildDir}/images/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, ${background.brightness})`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = background.static ? background.default : genColor();
  ctx.fillRect(0, 0, format.width, format.height);
};

const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    name: `${namePrefix} #${_edition}`,
    description: description,
    // image: `${baseUri}/${_edition}.png`,
    image: `${_edition}.png`,
    dna: sha1(_dna),
    edition: _edition,
    date: dateTime,
    ...extraMetadata,
    attributes: attributesList,
    author: "0xFútbol",
  };
  if (network == NETWORK.sol) {
    tempMetadata = {
      //Added metadata for solana
      name: tempMetadata.name,
      symbol: solanaMetadata.symbol,
      description: tempMetadata.description,
      //Added metadata for solana
      seller_fee_basis_points: solanaMetadata.seller_fee_basis_points,
      image: `${_edition}.png`,
      //Added metadata for solana
      external_url: solanaMetadata.external_url,
      edition: _edition,
      ...extraMetadata,
      attributes: tempMetadata.attributes,
      properties: {
        files: [
          {
            uri: `${_edition}.png`,
            type: "image/png",
          },
        ],
        category: "image",
        creators: solanaMetadata.creators,
      },
    };
  }
  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element) => {
  let selectedElement = _element.layer.selectedElement;

  if (_element.layer.name === "Jersey") {
    const jerseyName = selectedElement.name.slice(0, selectedElement.name.length - 1);
    const skinColor = selectedElement.name.slice(-1);
    attributesList.push({
      trait_type: "Jersey",
      value: formatAttributeValue("Jersey", jerseyName),
    });
    attributesList.push({
      trait_type: "Skin",
      value: mapSkinColor(skinColor),
    });
  }

  else if (_element.layer.name === "Eyes") {
    const parts = selectedElement.name.split("_");
    const eyes = parts.slice(0, parts.length - 1).join("_");
    const eyesMod = parts[parts.length - 1];

    attributesList.push({
      trait_type: "Eyes",
      value: formatAttributeValue("Eyes", eyes, eyesMod),
    });
  }

  else if (_element.layer.name === "Head") {
    let head = selectedElement.name.slice(0, selectedElement.name.length - 1);
    let headMod = selectedElement.name.slice(-1);

    if (isNaN(Number(headMod))) {
      head = selectedElement.name;
      headMod = null;
    }

    attributesList.push({
      trait_type: "Head",
      value: formatAttributeValue("Head", head, headMod),
    });
  }

  else if (_element.layer.name === "Mouth") {
    let mouth = selectedElement.name.replace("_castano", "").replace("_negro", "").replace("_rubio", "");

    attributesList.push({
      trait_type: "Mouth",
      value: formatAttributeValue("Mouth", mouth),
    });
  }

  else if (_element.layer.name === "Object") {
    if (selectedElement.name.startsWith("dedo_espuma")) {
      const objectName = selectedElement.name.slice(0, selectedElement.name.length - 1);
      const objectColor = selectedElement.name.slice(-1);
  
      attributesList.push({
        trait_type: _element.layer.name,
        value: formatAttributeValue(_element.layer.name, objectName, objectColor),
      });
    } else if (selectedElement.name !== "no_item") {
      attributesList.push({
        trait_type: _element.layer.name,
        value: formatAttributeValue(_element.layer.name, selectedElement.name),
      });
    }
  }

  else {
    attributesList.push({
      trait_type: _element.layer.name,
      value: formatAttributeValue(_element.layer.name, selectedElement.name),
    });
  }
};

const loadLayerImg = async (_layer) => {
  try {
    return new Promise(async (resolve) => {
      const image = await loadImage(`${_layer.selectedElement.path}`);
      resolve({ layer: _layer, loadedImage: image });
    });
  } catch (error) {
    console.error("Error loading image:", error);
  }
};

const addText = (_sig, x, y, size) => {
  ctx.fillStyle = text.color;
  ctx.font = `${text.weight} ${size}pt ${text.family}`;
  ctx.textBaseline = text.baseline;
  ctx.textAlign = text.align;
  ctx.fillText(_sig, x, y);
};

const drawElement = (_renderObject, _index, _layersLen) => {
  ctx.globalAlpha = _renderObject.layer.opacity;
  ctx.globalCompositeOperation = _renderObject.layer.blend;
  text.only
    ? addText(
        `${_renderObject.layer.name}${text.spacer}${_renderObject.layer.selectedElement.name}`,
        text.xGap,
        text.yGap * (_index + 1),
        text.size
      )
    : ctx.drawImage(
        _renderObject.loadedImage,
        0,
        0,
        format.width,
        format.height
      );

  addAttributes(_renderObject);
};

/**
 * Constructs layer to DNA mapping and applies skin color distribution balancing
 * @param {string} _dna - The DNA string
 * @param {Array} _layers - The layers array
 * @returns {Array} - Updated DNA and mapped layers
 */
const constructLayerToDna = (_dna = "", _layers = []) => {
  let dna = _dna;

  let mappedDnaToLayers = _layers.map((layer, index) => {
    let selectedElement = layer.elements.find(
      (e) => e.id == cleanDna(_dna.split(DNA_DELIMITER)[index])
    );

    return {
      name: layer.name,
      blend: layer.blend,
      opacity: layer.opacity,
      selectedElement: selectedElement,
    };
  });
  
  return [dna, mappedDnaToLayers];
};

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna New DNA string
 * @returns new DNA string with any items that should be filtered, removed.
 */
const filterDNAOptions = (_dna) => {
  const dnaItems = _dna.split(DNA_DELIMITER);
  const filteredDNA = dnaItems.filter((element) => {
    const query = /(\?.*$)/;
    const querystring = query.exec(element);
    if (!querystring) {
      return true;
    }
    const options = querystring[1].split("&").reduce((r, setting) => {
      const keyPairs = setting.split("=");
      return { ...r, [keyPairs[0]]: keyPairs[1] };
    }, []);

    return options.bypassDNA;
  });

  return filteredDNA.join(DNA_DELIMITER);
};

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param {String} _dna The entire newDNA string
 * @returns Cleaned DNA string without querystring parameters.
 */
const removeQueryStrings = (_dna) => {
  const query = /(\?.*$)/;
  return _dna.replace(query, "");
};

const isDnaUnique = (_DnaList = new Set(), _dna = "") => {
  const _filteredDNA = filterDNAOptions(_dna);
  return !_DnaList.has(_filteredDNA);
};

const createDna = (_layers) => {
  let randNum = [];
  let selectedElements = {};

  _layers.forEach((layer, index) => {
    let availableElements = [...layer.elements]; // Start with all elements
    const layerName = layer.name.toLowerCase();
    // Apply filters based on previous selections
    if (index > 0) {
      const prevSelections = randNum.slice(0, index).map(dna => {
        const [id, filename] = dna.split(':');
        return filename.split('?')[0]; // Remove query strings
      });

      if (layerName === "head") {
        const jersey = prevSelections[1].replace(".png", "").split("#").shift();
        const jerseyKey = jersey.slice(0, -1);
        const mappedJersey = countryShortToLong(jerseyKey) || jerseyKey;
        console.log(`Head layer filtering - Jersey: ${jerseyKey}, Mapped Jersey: ${mappedJersey}`);
        
        const removedElements = [];
        availableElements = availableElements.filter(e => {
          if (e.name.startsWith("bandana_")) {
            const match = e.name === `bandana_${mappedJersey}`;
            if (!match) {
              removedElements.push(e.name);
            } else {
              console.log(`Matched bandana for ${mappedJersey}: ${e.name}`);
            }
            return match;
          }
          if (e.name.startsWith("piluso_")) {
            const match = e.name === `piluso_${mappedJersey}`;
            if (!match) {
              removedElements.push(e.name);
            } else {
              console.log(`Matched piluso for ${mappedJersey}: ${e.name}`);
            }
            return match;
          }
          return true;
        });
        
        if (removedElements.length > 0) {
          console.log(`Head layer: Removed elements that don't match jersey ${mappedJersey}:`, removedElements);
        }
        console.log(`Available head elements after filtering: ${availableElements.length}`);
      }

      if (layerName === "eyes") {
        const jersey = prevSelections[1].replace(".png", "").split("#").shift();
        const jerseyKey = jersey.slice(0, -1);
        const head = prevSelections[2].replace(".png", "").split("#").shift();
        const headHasBlackHair = head.startsWith("bandana_") || head.startsWith("piluso_");
        const hairColor = headHasBlackHair ? "negro" : HEAD_TO_HAIR_COLOR_MAP[head];

        console.log(`Eyes layer filtering - Jersey: ${jerseyKey}, Head: ${head}`);

        if (jerseyKey === "jap" || jerseyKey === "ks") {
          console.log(`Eyes layer: Boosting weights for ${jerseyKey} jersey by 50x`);
          availableElements = availableElements.map(e => {
            console.log(`Boosting weight for ${e.name} from ${e.weight} to ${e.weight * 50}`);
            return {
              ...e,
              weight: e.name.startsWith("oriental_") ? e.weight * 50 : e.weight
            };
          });
          console.log(`Finished boosting weights for ${jerseyKey} jersey`);
        }
        
        if (head === "pasamontana") {
          console.log(`Applying pasamontana-specific eyes filtering`);
          const validEyeTypes = ["blancos", "enojado", "morado", "regulares", "rojos", "sospecha1", "sospecha2"];
          availableElements = availableElements.filter(e => {
            const eyeName = e.name;
            const isValid = validEyeTypes.some(type => eyeName.startsWith(type));
            if (!isValid) {
              console.log(`Filtered out eyes ${e.name} for pasamontana head`);
            }
            return isValid;
          });
          console.log(`Available eye elements after pasamontana filtering: ${availableElements.length}`);
        }

        if (hairColor) {
          const removedElements = [];
          availableElements = availableElements.filter(e => {
            const eyeName = e.name;
            const eyeParts = eyeName.split('_');
            const lastPart = eyeParts[eyeParts.length - 1];
            const isValid = !["negro", "castano", "rubio"].includes(lastPart) || lastPart === hairColor;
            if (!isValid) {
              removedElements.push(e.name);
              console.log(`Filtered out eyes ${e.name} due to hair color mismatch`);
            }
            return isValid;
          });
          if (removedElements.length > 0) {
            console.log(`Eyes layer: Removed elements with mismatched hair color:`, removedElements);
          }
          console.log(`Available eyes elements after hair color filtering: ${availableElements.length}`);
        }
      }

      if (layerName === "mouth") {
        const eyes = prevSelections[3].replace(".png", "").split("#").shift(); // Eyes is at index 3
        const head = prevSelections[2].replace(".png", "").split("#").shift(); // Head is at index 2
        const hairColor = eyes.split("_").pop();

        console.log(`Mouth layer filtering - Eyes: ${eyes}, Head: ${head}, Hair Color: ${hairColor || 'none'}`);

        if (eyes.startsWith("laser_")) {
          availableElements = availableElements.filter(e => {
            const mouthName = e.name.slice(0, -4);
            return !mouthName.startsWith("fumando_");
          });
        }

        if (head === "pasamontana") {
          console.log(`Applying pasamontana-specific mouth filtering`);
          const validMouthTypes = ["triste", "regular", "fuerza", "fumando_cigarro", "fumando_porro"];
          availableElements = availableElements.filter(e => {
            const mouthName = e.name;
            const isValid = validMouthTypes.includes(mouthName);
            if (!isValid) {
              console.log(`Filtered out mouth ${e.name} for pasamontana head`);
            }
            return isValid;
          });
          console.log(`Available mouth elements after pasamontana filtering: ${availableElements.length}`);
        }
        
        if (hairColor) {
          console.log(`Mouth layer filtering - Hair Color: ${hairColor}`);
          const removedElements = [];
          availableElements = availableElements.filter(e => {
            const mouthName = e.name;
            const mouthParts = mouthName.split('_');
            const lastPart = mouthParts[mouthParts.length - 1];
            const isValid = !["negro", "castano", "rubio"].includes(lastPart) || lastPart === hairColor;
            if (!isValid) {
              removedElements.push(e.name);
              console.log(`Filtered out mouth ${e.name} due to hair color mismatch`);
            }
            return isValid;
          });
          console.log(`Available mouth elements after hair color filtering: ${availableElements.length}`);
        }
      }

      if (layerName === "object") {
        const jersey = prevSelections[1].replace(".png", "").split("#").shift(); // Jersey is at index 1
        const jerseyKey = jersey.slice(0, -1); // Remove skin color digit

        if (!WORLD_CUP_CHAMPIONS.includes(jerseyKey)) {
          console.log(`Object layer: Removed worldcup.png because ${jerseyKey} is not a World Cup champion`);
          availableElements = availableElements.filter(e => e.name !== "worldcup");
        }

        if (!MATE_DRINKERS.includes(jerseyKey)) {
          console.log(`Object layer: Removed mate.png because ${jerseyKey} is not a mate drinker`);
          availableElements = availableElements.filter(e => e.name !== "mate");
        }
      }
    }

    // Calculate total weight of remaining elements
    var totalWeight = 0;
    availableElements.forEach((element) => {
      totalWeight += element.weight;
    });

    // If no elements are available, fallback to a default or skip (adjust as needed)
    if (totalWeight === 0) {
      console.warn(`No valid elements for layer ${layer.name} with current selections`);
      randNum.push(`${layer.elements[0].id}:${layer.elements[0].filename}${layer.bypassDNA ? "?bypassDNA=true" : ""}`);
      return;
    }

    // Select an element based on weight
    let random = Math.floor(Math.random() * totalWeight);
    for (var i = 0; i < availableElements.length; i++) {
      random -= availableElements[i].weight;
      if (random < 0) {
        const dnaEntry = `${availableElements[i].id}:${availableElements[i].filename}${layer.bypassDNA ? "?bypassDNA=true" : ""}`;
        randNum.push(dnaEntry);
        selectedElements[layerName] = availableElements[i];
        return;
      }
    }

    // Fallback in case loop fails (shouldn't happen with proper weights)
    const fallback = availableElements[0];
    randNum.push(`${fallback.id}:${fallback.filename}${layer.bypassDNA ? "?bypassDNA=true" : ""}`);
    selectedElements[layerName] = fallback;
  });

  return randNum.join(DNA_DELIMITER);
};

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount) => {
  let metadata = metadataList.find((meta) => meta.edition == _editionCount);
  debugLogs
    ? console.log(
        `Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`
      )
    : null;
  fs.writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(metadata, null, 2)
  );
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const startCreating = async () => {
  let layerConfigIndex = 0;
  let editionCount = 0;
  let failedCount = 0;
  let abstractedIndexes = [];
  for (
    let i = 0;
    i <= layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo;
    i++
  ) {
    abstractedIndexes.push(i);
  }
  if (shuffleLayerConfigurations) {
    abstractedIndexes = shuffle(abstractedIndexes);
  }
  debugLogs
    ? console.log("Editions left to create: ", abstractedIndexes)
    : null;
  while (layerConfigIndex < layerConfigurations.length) {
    const layers = layersSetup(
      layerConfigurations[layerConfigIndex].layersOrder
    );
    while (
      editionCount <= layerConfigurations[layerConfigIndex].growEditionSizeTo
    ) {
      let newDna = VIP_DNA[editionCount] || createDna(layers);
      console.log(`Creating edition ${editionCount} with DNA: ${newDna}`);
      if (isDnaUnique(dnaList, newDna)) {
        let [updatedDna, results] = constructLayerToDna(newDna, layers);
        let loadedElements = [];

        newDna = updatedDna;

        results.forEach((layer) => {
          loadedElements.push(loadLayerImg(layer));
        });

        await Promise.all(loadedElements).then((renderObjectArray) => {
          debugLogs ? console.log("Clearing canvas") : null;
          ctx.clearRect(0, 0, format.width, format.height);
          if (gif.export) {
            hashlipsGiffer = new HashlipsGiffer(
              canvas,
              ctx,
              `${buildDir}/gifs/${abstractedIndexes[0]}.gif`,
              gif.repeat,
              gif.quality,
              gif.delay
            );
            hashlipsGiffer.start();
          }
          if (background.generate) {
            drawBackground();
          }
          renderObjectArray.forEach((renderObject, index) => {
            drawElement(
              renderObject,
              index,
              layerConfigurations[layerConfigIndex].layersOrder.length
            );
            if (gif.export) {
              hashlipsGiffer.add();
            }
          });
          if (gif.export) {
            hashlipsGiffer.stop();
          }
          debugLogs
            ? console.log("Editions left to create: ", abstractedIndexes)
            : null;
          saveImage(abstractedIndexes[0]);
          addMetadata(newDna, abstractedIndexes[0]);
          saveMetaDataSingleFile(abstractedIndexes[0]);
          console.log(
            `Created edition: ${abstractedIndexes[0]}, with DNA: ${sha1(
              newDna
            )}`
          );
        });
        dnaList.add(filterDNAOptions(newDna));
        editionCount++;
        abstractedIndexes.shift();
      } else {
        console.log("DNA exists!");
        failedCount++;
        if (failedCount >= uniqueDnaTorrance) {
          console.log(
            `You need more layers or elements to grow your edition to ${layerConfigurations[layerConfigIndex].growEditionSizeTo} artworks!`
          );
          process.exit();
        }
      }
    }
    layerConfigIndex++;
  }
  writeMetaData(JSON.stringify(metadataList, null, 2));
};

module.exports = { startCreating, buildSetup, getElements };
