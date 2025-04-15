export const humanJoin = (iter: Array<any>): string => {
  if (iter.length < 2) {
    return iter.join(" and ");
  }

  return iter.slice(0, -1).join(", ") + " and " + iter.slice(-1);
};

export const toTenPointDecimal = (percentage: number): string => {
  const stars = +(percentage / 10).toFixed(1);

  return stars % 1 === 0 ? stars.toFixed(0) : stars.toFixed(1);
}