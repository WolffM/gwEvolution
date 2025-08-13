// Easing helpers (normalized t: 0..1)
// Exports: expo.out, back.out, cubic.inOut

export const expo = {
  out: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};

export const back = {
  out: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};

export const cubic = {
  inOut: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};
