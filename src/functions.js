// ATTRIBUTE VALUES
const formatAttributeValue = (traitType, attributeValue, modifier = null) => {
  try {
    switch (traitType) {
      case "Background":
        switch (attributeValue) {
          case "rosa":
            return "Pink";
          case "morado":
            return "Purple";
          case "azul":
            return "Blue";
          case "celeste":
          case "celeste2":
            return "Sky Blue";
          case "celeste_verdoso":
            return "Cyan";
          case "verde":
            return "Green";
          case "verde_moho":
            return "Lime";
          case "amarillo":
            return "Yellow";
          case "naranja":
            return "Orange";
          case "rojo":
            return "Red";
          case "verde_oscuro": // negro verde
            return "Dark Green";
          case "rosa_oscuro": // rosa
            return "Dark Fuchsia";
          case "morado_oscuro": // morado
            return "Dark Purple";
          case "lila": // azul
            return "Dark Blue";
          case "celeste_oscuro": // celeste
            return "Dark Cyan";
          case "turquesa":
            return "Dark Green";
          case "rojo_oscuro": // rojo
            return "Dark Red";
          case "naranja_oscuro": // naranja
            return "Dark Orange";
          case "verdoso":
            return "Dark Yellow";
          case "verde_oscuro": // verde
            return "Dark Lime";
          default:
            const improved = attributeValue.replace(/_/g, " ");
            const titledCased = improved.replace(/\b\w/g, (char) => char.toUpperCase());
            return titledCased;
        }
      case "Eyes":
        switch (attributeValue) {
          case "blancos":
          case "ojos_blancos":
            return "Whites";
          case "enojado":
          case "ojos_enojado":
            return "Angry";
          case "laser_amarillo":
          case "ojos_laser_amarillo":
            return "Yellow Laser";
          case "laser_azul":
          case "ojos_laser_azul":
            return "Blue Laser";
          case "laser_naranja":
          case "ojos_laser_naranja":
            return "Red Laser";
          case "laser_rojo":
          case "ojos_laser_rojo":
            return "Red Laser";
          case "laser_rosa":
          case "ojos_laser_rosa":
            return "Pink Laser";
          case "laser_verde":
          case "ojos_laser_verde":
            return "Green Laser";
          case "lentes_futbol":
          case "ojos_lentes_futbol":
            return "Fútbol Goggles";
          case "lentes_pixel":
          case "ojos_lentes_pixel":
            return "Pixel Glasses";
          case "lentes_sol":
          case "ojos_lentes_sol":
            return "Sunglasses";
          case "morado":
          case "ojos_morado":
            return "Purple Eye";
          case "regulares":
          case "ojos_regulares":
            return "Regular Eyes";
          case "rojos":
          case "ojos_rojos":
            return "Wasted";
          case "sospecha1":
          case "ojos_sospecha1": // character right
            return "Suspicious Eyes (Right)";
          case "sospecha2":
          case "ojos_sospecha2": // character left
            return "Suspicious Eyes (Left)";
          default:
            const improved = attributeValue.replace(/_/g, " ");
            const titledCased = improved.replace(/\b\w/g, (char) => char.toUpperCase());
            return titledCased;
        }
      case "Head":
        const prefix = (() => {
          switch (attributeValue) {
            case "lacio":
              return "Straight";
            case "engominado":
              return "Slicked-Back";
            case "afro":
              return "Afro";
            case "gorra":
              return "Cap";
            case "rapado":
              return "Buzz Cut";
            case "bald":
              return "Bald";
            case "rulos":
              return "Curly";
            case "rul_aur":
              return "Tuft";
            case "punk":
              return "Punk";
            case "corona":
              return "Crown";
            case "flecha_avatar":
              return "Avatar";
            case "pasamontana":
              return "Balaclava";
            default:
              if (attributeValue.startsWith("bandana_")) {
                return `Bandana ${getCountryName(countryLongToShort(attributeValue.slice(8)))}`;
              } else if (attributeValue.startsWith("piluso_")) {
                return `Piluso ${getCountryName(countryLongToShort(attributeValue.slice(7)))}`;
              } else {
                throw new Error(`Unknown attribute: ${attributeValue}`);
              }
          }
        })();
        const suffix = (() => {
          switch (attributeValue) {
            case "lacio":
              switch (modifier) {
                case "1":
                  return "Black";
                case "2":
                  return "Blonde";
                case "3":
                  return "Green";
                case "4":
                  return "Pink";
              }
              break;
            case "engominado":
              switch (modifier) {
                case "1":
                  return "Brown";
                case "2":
                  return "Blonde";
                case "3":
                  return "Black";
                case "4":
                  return "Green";
              }
              break;
            case "afro":
              switch (modifier) {
                case "1":
                  return "Black";
                case "2":
                  return "Brown";
                case "3":
                  return "Purple";
                case "4":
                  return "Chestnut";
              }
              break;
            case "gorra":
              switch (modifier) {
                case "1":
                  return "White";
                case "2":
                  return "Gray";
                case "3":
                  return "Black & White";
                case "4":
                  return "Black";
              }
              break;
            case "rapado":
              switch (modifier) {
                case "1":
                  return "Brown";
                case "2":
                  return "Black";
                case "3":
                  return "Blonde";
                case "4":
                  return "Purple";
              }
              break;
            case "rulos":
              switch (modifier) {
                case "1":
                  return "Black";
                case "2":
                  return "Brown";
                case "3":
                  return "Red";
                case "4":
                  return "Orange";
              }
              break;
            case "rul_aur":
              switch (modifier) {
                case "1":
                  return "Red / Blue";
                case "2":
                  return "Black / Yellow";
                case "3":
                  return "Purple / Green";
                case "4":
                  return "Cyan / Yellow";
                case "5":
                  return "Green / Dark Yellow";
                case "6":
                  return "Pink / Cyan";
              }
              break;
            case "punk":
              switch (modifier) {
                case "1":
                  return "Pink";
                case "2":
                  return "Blonde";
                case "3":
                  return "Green";
                case "4":
                  return "Blue";
                case "5":
                  return "Red";
                case "6":
                  return "Brown";
              }
              break;
            default:
              return "";
          }
        })();
        return `${prefix} ${suffix ? "/ " + suffix : ""}`.trim();
      case "Mouth":
        switch (attributeValue) {
          case "contento":
            return "Happy";
          case "contento_chiva":
            return "Happy / Goatee Beard";
          case "triste":
            return "Sad";
          case "triste_barba":
            return "Sad / Van Dyke Beard";
          case "tapaboca":
            return "Covered";
          case "sin_dientes":
            return "Toothless";
          case "sin_dientes_chiva":
            return "Toothless / Goatee Beard";
          case "regular":
            return "Neutral";
          case "regular_barba":
            return "Regular / Van Dyke Beard";
          case "silbato":
            return "Whistling";
          case "gritando":
            return "Shouting";
          case "gritando_chiva":
            return "Shouting / Goatee Beard";
          case "fumando_porro":
            return "420";
          case "fumando_porro_barba":
            return "420 / Van Dyke Beard";
          case "fumando_cigarro":
          case "fumando_gigarro":
            return "Smoking Cigarette";
          case "fumando_cigarro_barba":
          case "fumando_cirarro_barba":
            return "Smoking Cigarette / Van Dyke Beard";
          case "fuerza":
            return "Rage";
          case "fuerza_barba":
            return "Rage / Van Dyke Beard";
          case "burlona":
            return "No Dental Plan";
          case "burlona_barba":
            return "No Dental Plan / Van Dyke Beard";
          default:
            const improved = attributeValue.replace(/_/g, " ");
            const titledCased = improved.replace(/\b\w/g, (char) => char.toUpperCase());
            return titledCased;
        }
      case "Object":
        switch (attributeValue) {
          case "dedo_espuma":
            return `Foam Finger / ${{
              "1": "Red",
              "2": "Yellow",
              "3": "Blue",
              "4": "Green"
            }[modifier]}`;
          case "guante":
            return "Goalkeeper's Glove";
          case "vaso_rojo":
            return "Red Cup";
          case "yellowcard":
            return "Yellow Card";
          case "worldcup":
            return "World Cup";
          case "redcard":
            return "Red Card";
          case "mate":
            return "Mate";
          case "bubuzela":
            return "Vuvuzela";
          case "beer":
            return "Beer";
          case "uefa":
            return "Ball / UEFA";
          case "tango78":
            return "Ball / Tango 78";
          case "old":
            return "Ball / Vintage";
          case "normal":
            return "Ball / Regular";
          default:
            const improved = attributeValue.replace(/_/g, " ");
            const titledCased = improved.replace(/\b\w/g, (char) => char.toUpperCase());
            return titledCased;
        }
      case "Jersey":
        // National teams
        switch (attributeValue) {
          case "vnz":
          case "venezuela":
            return "Venezuela";
          case "uy":
          case "uruguay":
            return "Uruguay";
          case "tur":
          case "turquia":
            return "Turkey";
          case "sui":
          case "suiza":
            return "Switzerland";
          case "sue":
          case "suecia":
            return "Sweden";
          case "smn":
          case "san marino":
            return "San Marino";
          case "rus":
          case "rusia":
            return "Russia";
          case "por":
          case "portugal":
            return "Portugal";
          case "per":
          case "perú":
            return "Peru";
          case "pb":
          case "países bajos":
            return "Netherlands";
          case "nig":
          case "nigeria":
            return "Nigeria";
          case "mex":
          case "mexico":
            return "Mexico";
          case "jap":
          case "japon":
            return "Japan";
          case "ita":
          case "italia":
            return "Italy";
          case "eng":
          case "inglaterra":
            return "England";
          case "frc":
          case "francia":
            return "France";
          case "usa":
            return "United States";
          case "esp":
          case "españa":
            return "Spain";
          case "elv":
          case "eslovenia":
            return "Slovenia";
          case "esv":
          case "eslovaquia":
            return "Slovakia";
          case "col":
          case "colombia":
            return "Colombia";
          case "ks":
          case "korea del sur":
            return "South Korea";
          case "cnd":
          case "canadá":
            return "Canada";
          case "bra":
          case "brasil":
            return "Brazil";
          case "bel":
          case "bélgica":
            return "Belgium";
          case "arg":
          case "argentina":
            return "Argentina";
          case "ger":
          case "alemania":
            return "Germany";
          case "cro":
          case "croa":
          case "croacia":
            return "Croatia";
          // Clubs (changed to normal, commonly used names)
          case "0x":
            return "0xFútbol";
          case "fls":
          case "fluminense":
            return "Fluminense";
          case "ami":
          case "mineiro":
            return "Atlético Mineiro";
          case "grm":
          case "gremio":
            return "Grêmio";
          case "flm":
          case "flamengo":
            return "Flamengo";
          case "crz":
          case "cruzeiro":
            return "Cruzeiro";
          case "cth":
          case "corinthians":
            return "Corinthians";
          case "intr":
          case "internacional":
            return "Internacional";
          case "palm":
          case "palmeiras":
            return "Palmeiras";
          case "saopaulo":
          case "sao paulo":
            return "São Paulo";
          case "santos":
            return "Santos";
          case "vascodagama":
          case "vasco da gama":
            return "Vasco da Gama";
          case "cabj":
          case "boca juniors":
            return "Boca Juniors";
          case "carp":
          case "river plate":
            return "River Plate";
          case "brc":
          case "barcelona":
            return "Barcelona";
          case "atm":
          case "aleti":
          case "atlético de madrid":
            return "Atlético Madrid";
          case "realmadrid":
          case "real madrid":
            return "Real Madrid";
          case "realsoc":
          case "real sociedad":
            return "Real Sociedad";
          case "psg":
            return "Paris Saint-Germain";
          case "port":
          case "porto":
            return "Porto";
          case "bfc":
          case "benfica":
            return "Benfica";
          case "pen":
          case "peñ":
          case "peñarol":
            return "Peñarol";
          case "nac":
          case "nacional":
            return "Nacional";
          case "milan":
            return "Milan";
          case "juv":
          case "juventus":
            return "Juventus";
          case "intm":
          case "inter de milán":
            return "Inter";
          case "unt":
          case "manchester united":
            return "Manchester United";
          case "city":
          case "manchester city":
          case "manchester city (cambiar)":
            return "Manchester City";
          case "liv":
          case "liverpool":
            return "Liverpool";
          case "chs":
          case "chelsea":
            return "Chelsea";
          case "ars":
          case "arsenal":
            return "Arsenal";
          case "inm":
          case "inter miami":
            return "Inter Miami";
          case "brr":
          case "borussia dortmound":
            return "Borussia Dortmund";
          case "bym":
          case "bayern munich":
            return "Bayern Munich";
          case "glsy":
          case "galatasaray":
            return "Galatasaray";
          case "fnb":
          case "fenerbache":
            return "Fenerbahçe";
          case "blz":
          case "fc balzers":
            return "Balzers";
          case "aln":
          case "al nassr":
            return "Al Nassr";
          case "ajx":
          case "ajax":
            return "Ajax";
          case "ms":
            return "MetaSoccer";
          case "mss":
            return "Meta Soccer / 2nd Kit";
          // Default
          default:
            const improved = attributeValue.replace(/_/g, " ");
            const titledCased = improved.replace(/\b\w/g, (char) => char.toUpperCase());
            return titledCased;
        }
      default:
        const improved = attributeValue.replace(/_/g, " ");
        const titledCased = improved.replace(/\b\w/g, (char) => char.toUpperCase());
        return titledCased;
    }
  } catch (err) {
    console.error("Error mapping attribute value:", traitType, attributeValue, modifier);
    throw err;
  }
};

// COUNTRIES
const countryLongToShort = (jerseyName) => {
  switch (jerseyName.toLowerCase()) { // Case-insensitive matching
    case "alemania":
      return "ger";
    case "argentina":
      return "arg";
    case "belgica":
    case "bélgica":
      return "bel";
    case "brasil":
      return "bra";
    case "canada":
    case "canadá":
      return "cnd";
    case "colombia":
      return "col";
    case "croacia":
      return "croa";
    case "eslovaquia":
      return "esv";
    case "eslovenia":
      return "elv";
    case "espana":
    case "españa":
      return "esp";
    case "francia":
      return "frc";
    case "inglaterra":
      return "eng";
    case "italia":
      return "ita";
    case "japon":
      return "jap";
    case "korea del sur":
    case "ks":
      return "ks";
    case "mexico":
      return "mex";
    case "nigeria":
      return "nig";
    case "paisesbajos":
    case "países bajos":
      return "pb";
    case "peru":
    case "perú":
      return "per";
    case "portugal":
      return "por";
    case "rusia":
      return "rus";
    case "sanmarino":
    case "san marino":
      return "smn";
    case "suecia":
      return "sue";
    case "suiza":
      return "sui";
    case "turquia":
      return "tur";
    case "united states": // Adding English name for consistency
    case "usa":
      return "usa";
    case "uruguay":
      return "uy";
    case "venezuela":
      return "vnz";
    default:
      return jerseyName; // Return original if no match (could also return null)
  }
};

const countryShortToLong = (shortCode) => {
  switch (shortCode.toLowerCase()) { // Case-insensitive matching
    case "arg":
      return "argentina";
    case "bel":
      return "belgica";
    case "bra":
      return "brasil";
    case "cnd":
      return "canada";
    case "col":
      return "colombia";
    case "cro":
      return "croacia";
    case "elv":
      return "eslovenia";
    case "esv":
      return "eslovaquia";
    case "esp":
      return "espana";
    case "eng":
      return "inglaterra";
    case "frc":
      return "francia";
    case "ger":
      return "alemania";
    case "ita":
      return "italia";
    case "jap":
      return "japon";
    case "ks":
      return "ks";
    case "mex":
      return "mexico";
    case "nig":
      return "nigeria";
    case "pb":
      return "paisesbajos";
    case "per":
      return "peru";
    case "por":
      return "portugal";
    case "rus":
      return "rusia";
    case "smn":
      return "sanmarino";
    case "sue":
      return "suecia";
    case "sui":
      return "suiza";
    case "tur":
      return "turquia";
    case "usa":
      return "usa"; // Can be either "united states" or "usa"
    case "uy":
      return "uruguay";
    case "vnz":
      return "venezuela";
    default:
      return shortCode; // Return original if no match
  }
};

const getCountryName = (jerseyName) => {
  switch (jerseyName.toLowerCase()) { // Case-insensitive matching
    case "vnz":
      return "Venezuela";
    case "uy":
      return "Uruguay";
    case "tur":
      return "Turkey";
    case "sui":
      return "Switzerland";
    case "sue":
      return "Sweden";
    case "smn":
      return "San Marino";
    case "rus":
      return "Russia";
    case "por":
      return "Portugal";
    case "per":
      return "Peru";
    case "pb":
      return "Netherlands";
    case "nig":
      return "Nigeria";
    case "mex":
      return "Mexico";
    case "jap":
      return "Japan";
    case "ita":
      return "Italy";
    case "eng":
      return "England";
    case "frc":
      return "France";
    case "usa":
      return "United States";
    case "esp":
      return "Spain";
    case "elv":
      return "Slovenia";
    case "esv":
      return "Slovakia";
    case "col":
      return "Colombia";
    case "ks":
      return "South Korea";
    case "cnd":
      return "Canada";
    case "bra":
      return "Brazil";
    case "bel":
      return "Belgium";
    case "arg":
      return "Argentina";
    case "ger":
      return "Germany";
    case "cro":
      return "Croatia";
    default:
      return null; // Return null if no match (or could return jerseyName)
  }
};

// SKIN COLOR
const mapSkinColor = (skinColor) => {
  switch (skinColor) {
    case "1":
      return "Skin Tone 1";
    case "2":
      return "Skin Tone 2";
    case "3":
      return "Skin Tone 3";
    case "4":
      return "Skin Tone 4";
    case "5":
      return "Skin Tone 5";
    case "6":
      return "Skin Tone 6";
  }
};

// EXPORTS
module.exports = {
  countryLongToShort,
  countryShortToLong,
  formatAttributeValue,
  getCountryName,
  mapSkinColor,
};