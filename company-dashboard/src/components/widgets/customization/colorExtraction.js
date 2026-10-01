// Color extraction helpers for uploaded images and JSON/CSS/text files

export const extractColorsFromImage = (file, fallbackColors = []) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const w = 80;
        const h = 80;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;

        const colorMap = new Map();
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 128) continue;
          const qr = Math.round(r / 20) * 20;
          const qg = Math.round(g / 20) * 20;
          const qb = Math.round(b / 20) * 20;
          const key = `${qr},${qg},${qb}`;
          colorMap.set(key, (colorMap.get(key) || 0) + 1);
        }

        const sorted = Array.from(colorMap.entries()).sort((a, b) => b[1] - a[1]);
        const results = [];
        const toHex = (n) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, '0').toUpperCase();

        for (const [key] of sorted) {
          const [r, g, b] = key.split(',').map(Number);
          const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

          const isDistinct = results.every((existing) => {
            const er = parseInt(existing.slice(1, 3), 16);
            const eg = parseInt(existing.slice(3, 5), 16);
            const eb = parseInt(existing.slice(5, 7), 16);
            const dist = Math.sqrt((r - er) ** 2 + (g - eg) ** 2 + (b - eb) ** 2);
            return dist >= 38;
          });

          if (isDistinct) {
            results.push(hex);
          }
          if (results.length >= 8) break;
        }

        resolve(results.length > 0 ? results : fallbackColors);
      };
      img.onerror = () => resolve(fallbackColors);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve([]);
    reader.readAsDataURL(file);
  });
};

export const extractColorsFromText = (file, fallbackColors = []) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target.result || '');
      const hexList = [];

      try {
        const json = JSON.parse(text);
        const extractStrings = (obj) => {
          if (!obj) return;
          if (typeof obj === 'string') {
            const matches = obj.match(/#?[0-9A-Fa-f]{6}\b|#?[0-9A-Fa-f]{3}\b/g);
            if (matches) {
              matches.forEach((m) => hexList.push(m.startsWith('#') ? m : `#${m}`));
            }
          } else if (Array.isArray(obj)) {
            obj.forEach(extractStrings);
          } else if (typeof obj === 'object') {
            Object.values(obj).forEach(extractStrings);
          }
        };
        extractStrings(json);
      } catch {
        // Not JSON
      }

      const rawMatches = text.match(/#?[0-9A-Fa-f]{6}\b|#?[0-9A-Fa-f]{3}\b/g) || [];
      rawMatches.forEach((m) => hexList.push(m.startsWith('#') ? m : `#${m}`));

      const normalized = hexList.map((h) => {
        const clean = h.startsWith('#') ? h : `#${h}`;
        if (clean.length === 4) {
          return `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`.toUpperCase();
        }
        return clean.toUpperCase();
      });

      const uniqueHex = Array.from(new Set(normalized)).filter((h) => /^#[0-9A-F]{6}$/i.test(h));
      resolve(uniqueHex.length > 0 ? uniqueHex.slice(0, 16) : fallbackColors);
    };
    reader.onerror = () => resolve([]);
    reader.readAsText(file);
  });
};
