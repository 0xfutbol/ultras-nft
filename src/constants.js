// HEAD
const HEAD_TO_HAIR_COLOR_MAP = {
  "afro1": "negro",
  "afro2": "castano",
  "engominado1": "castano",
  "engominado2": "rubio",
  "engominado3": "negro",
  "lacio1": "negro",
  "lacio2": "rubio",
  "punk2": "rubio",
  "punk6": "castano",
  "rapado1": "castano",
  "rapado2": "negro",
  "rapado3": "rubio",
  "rulos1": "negro",
  "rulos2": "castano",
  "rul_aur2": "negro"
}

// OBJECTS
const MATE_DRINKERS = ["arg", "uy"];
const WORLD_CUP_CHAMPIONS = ["ger", "arg", "bra", "esp", "frc", "eng", "ita", "uy"];

// VIP DNA
const VIP_DNA = [
  // Agu 1
  [
    "5:naranja.png",
    "399:uy3#59.png",
    "30:bandana_uruguay#980.png",
    "43:rojos_negro#266.png",
    "30:triste#750.png",
    "15:worldcup#300.png"
  ].join("-"),
  // Agu 2
  [
    "4:morado.png",
    "280:nac4#8.png",
    "86:rul_aur1#133.png",
    "31:lentes_sol_negro#333.png",
    "14:fumando_porro_barba_negro#83.png",
    "0:beer#1025.png"
  ].join("-"),
  // Iván
  [
    "4:morado.png",
    "32:arg2#58.png",
    "47:pasamontana#500.png",
    "16:laser_rojo_negro#22.png",
    "4:fuerza#750.png",
    "15:worldcup#300.png"
  ].join("-"),
  // Pedro
  [
    "4:morado.png",
    "197:glsy5#11.png",
    "77:punk2#166.png",
    "13:laser_naranja_castano#22.png",
    "18:gritando_chiva_negro#83.png",
    "7:mate#700.png"
  ].join("-"),
  // Eze
  [
    "5:naranja.png",
    "31:arg1#58.png",
    "43:lacio1#200.png",
    "30:lentes_sol_castano#333.png",
    "12:fumando_porro#750.png",
    "10:old#281.png"
  ].join("-"),
];

module.exports = {
  HEAD_TO_HAIR_COLOR_MAP,
  MATE_DRINKERS,
  VIP_DNA,
  WORLD_CUP_CHAMPIONS,
};
