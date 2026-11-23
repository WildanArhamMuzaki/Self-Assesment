export function isVisible(cond, answers) {
  if (!cond) return true;
  if (cond.any) return cond.any.some((c) => isVisible(c, answers));
  if (cond.all) return cond.all.every((c) => isVisible(c, answers));

  const v = answers[cond.question];
  const filled =
    v !== undefined &&
    v !== null &&
    v !== '' &&
    !(Array.isArray(v) && v.length === 0);

  if ('equals' in cond) return v === cond.equals;
  if ('in' in cond) return Array.isArray(cond.in) && cond.in.includes(v);
  if ('includes' in cond) return Array.isArray(v) && v.includes(cond.includes);
  if ('filled' in cond) return filled === cond.filled;

  return true;
}