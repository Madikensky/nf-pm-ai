const containsJSON = (s: string): string => {
  if (s.includes('[') && s.includes(']') && s.includes('action')) {
    const openBraceIndex = s.indexOf('[');
    const closeBraceIndex = s.lastIndexOf(']');
    const ans = s.slice(openBraceIndex, closeBraceIndex + 1);
    return ans;
  } else if (s.includes('{') && s.includes('}') && s.includes('action')) {
    const openBraceIndex = s.indexOf('{');
    const closeBraceIndex = s.lastIndexOf('}');
    const ans = s.slice(openBraceIndex, closeBraceIndex + 1);
    return ans;
  } else {
    return '';
  }
};

export { containsJSON };
