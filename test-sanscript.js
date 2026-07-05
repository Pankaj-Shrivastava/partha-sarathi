import Sanscript from '@indic-transliteration/sanscript';

const text1 = "na ca tasmān manuṣyeṣu kaścin me priya-kṛttamaḥ";
console.log('pure iast:', Sanscript.t(text1, 'iast', 'devanagari'));

// Preprocessor for mixed IAST
const sanitizeIast = (text) => {
  return text
    .replace(/śh/g, 'ṣ')
    .replace(/sh/g, 'ṣ')
    .replace(/ch/g, 'c') 
    .replace(/chh/g, 'ch');
}

const text2 = "na ca tasmāt manuṣyeśhu kaścin me priya-kṛttamaḥ";
console.log('sanitized:', Sanscript.t(sanitizeIast(text2), 'iast', 'devanagari'));
