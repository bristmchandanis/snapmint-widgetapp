// Shared helper utilities for widget configuration and calculation

export const ALLOWED_PERCENT_TENURES = new Set([2, 3, 4, 5, 6, 9, 12]);
export const ALLOWED_PIE_TENURES = new Set([2, 3]);
export const ALLOWED_FIXED_DP_TENURES = new Set([1, 2, 3]);

export function getAllowedStyles(plans) {
  if (plans.length > 1) {
    const isMultiBox =
      plans.length <= 4 &&
      plans.every((p) => p.type === 'percentage' && ALLOWED_PERCENT_TENURES.has(p.tenure));
    return isMultiBox ? ['box'] : [];
  }

  const plan = plans[0];
  if (!plan) return [];

  if (plan.type === 'fixed') {
    const isValid =
      ([0, 1].includes(plan.dp) && ALLOWED_FIXED_DP_TENURES.has(plan.tenure)) ||
      (plan.dp === 19 && [2, 3].includes(plan.tenure));
    return isValid ? ['fixed-dp'] : [];
  }

  const allowed = [];
  if (ALLOWED_PIE_TENURES.has(plan.tenure)) allowed.push('pie');
  if (ALLOWED_PERCENT_TENURES.has(plan.tenure)) allowed.push('box');
  return allowed;
}

export function computePriceBands(plans) {
  const validPlans = (plans || []).filter((p) => p.min > 0 && p.max >= p.min);
  if (!validPlans.length) return [];

  const boundaries = validPlans.flatMap((p) => [p.min, p.max + 1]);
  const edges = [...new Set(boundaries)].sort((a, b) => a - b);

  const bands = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const min = edges[i];
    const max = edges[i + 1] - 1;

    const activePlans = validPlans.filter((p) => p.min <= min && p.max >= max);

    const grouped = {};
    for (const plan of activePlans) {
      const key = `${plan.type}:${plan.dp}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(plan);
    }

    const groups = Object.entries(grouped).map(([dpKey, groupPlans]) => {
      groupPlans.sort((a, b) => a.tenure - b.tenure);
      const allowed = getAllowedStyles(groupPlans);
      return {
        key: `${min}-${max}-${dpKey}`,
        plans: groupPlans,
        allowed,
        defaultStyle: allowed.includes('pie') ? 'pie' : allowed[0] || '',
      };
    });

    bands.push({ min, max, groups });
  }

  return bands;
}

// Color extraction helpers for uploaded images and JSON/CSS/text files
export const extractColorsFromImage = (file, fallbackColors = []) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const width = 80;
        const height = 80;
        canvas.width = width;
        canvas.height = height;
        context.drawImage(img, 0, 0, width, height);

        const imageData = context.getImageData(0, 0, width, height).data;
        const colorFrequencyMap = new Map();

        for (let index = 0; index < imageData.length; index += 4) {
          const red = imageData[index];
          const green = imageData[index + 1];
          const blue = imageData[index + 2];
          const alpha = imageData[index + 3];

          if (alpha < 128) continue;

          // Quantize to groups of 20 to cluster similar pixels together
          const quantRed = Math.round(red / 20) * 20;
          const quantGreen = Math.round(green / 20) * 20;
          const quantBlue = Math.round(blue / 20) * 20;
          const colorKey = `${quantRed},${quantGreen},${quantBlue}`;

          colorFrequencyMap.set(colorKey, (colorFrequencyMap.get(colorKey) || 0) + 1);
        }

        const sortedColors = Array.from(colorFrequencyMap.entries()).sort(
          (firstEntry, secondEntry) => secondEntry[1] - firstEntry[1]
        );

        const extractedHexColors = [];
        const toHex = (colorValue) =>
          Math.min(255, Math.max(0, colorValue)).toString(16).padStart(2, '0').toUpperCase();

        for (const [colorKey] of sortedColors) {
          const [red, green, blue] = colorKey.split(',').map(Number);
          const hexColor = `#${toHex(red)}${toHex(green)}${toHex(blue)}`;

          // Ensure color is visually distinct from already picked colors (Euclidean distance >= 38)
          const isDistinct = extractedHexColors.every((existingHex) => {
            const existRed = parseInt(existingHex.slice(1, 3), 16);
            const existGreen = parseInt(existingHex.slice(3, 5), 16);
            const existBlue = parseInt(existingHex.slice(5, 7), 16);
            const distance = Math.sqrt(
              (red - existRed) ** 2 + (green - existGreen) ** 2 + (blue - existBlue) ** 2
            );
            return distance >= 38;
          });

          if (isDistinct) {
            extractedHexColors.push(hexColor);
          }

          if (extractedHexColors.length >= 8) break;
        }

        resolve(extractedHexColors.length > 0 ? extractedHexColors : fallbackColors);
      };

      img.onerror = () => resolve(fallbackColors);
      img.src = readerEvent.target.result;
    };

    reader.onerror = () => resolve([]);
    reader.readAsDataURL(file);
  });
};

export const extractColorsFromText = (file, fallbackColors = []) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const text = String(readerEvent.target.result || '');
      const hexList = [];

      try {
        const parsedJson = JSON.parse(text);
        const extractStrings = (nestedObj) => {
          if (!nestedObj) return;
          if (typeof nestedObj === 'string') {
            const matches = nestedObj.match(/#?[0-9A-Fa-f]{6}\b|#?[0-9A-Fa-f]{3}\b/g);
            if (matches) {
              matches.forEach((matchedHex) =>
                hexList.push(matchedHex.startsWith('#') ? matchedHex : `#${matchedHex}`)
              );
            }
          } else if (Array.isArray(nestedObj)) {
            nestedObj.forEach(extractStrings);
          } else if (typeof nestedObj === 'object') {
            Object.values(nestedObj).forEach(extractStrings);
          }
        };
        extractStrings(parsedJson);
      } catch {
        // Not JSON, continue to raw regex match
      }

      const rawMatches = text.match(/#?[0-9A-Fa-f]{6}\b|#?[0-9A-Fa-f]{3}\b/g) || [];
      rawMatches.forEach((matchedHex) =>
        hexList.push(matchedHex.startsWith('#') ? matchedHex : `#${matchedHex}`)
      );

      const normalizedHexColors = hexList.map((hexValue) => {
        const cleanHex = hexValue.startsWith('#') ? hexValue : `#${hexValue}`;
        // Expand 3-digit hex like #FFF to #FFFFFF
        if (cleanHex.length === 4) {
          return `#${cleanHex[1]}${cleanHex[1]}${cleanHex[2]}${cleanHex[2]}${cleanHex[3]}${cleanHex[3]}`.toUpperCase();
        }
        return cleanHex.toUpperCase();
      });

      const uniqueHexColors = Array.from(new Set(normalizedHexColors)).filter((hexCode) =>
        /^#[0-9A-F]{6}$/i.test(hexCode)
      );

      resolve(uniqueHexColors.length > 0 ? uniqueHexColors.slice(0, 16) : fallbackColors);
    };

    reader.onerror = () => resolve([]);
    reader.readAsText(file);
  });
};
