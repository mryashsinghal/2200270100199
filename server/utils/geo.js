import geoip from 'geoip-lite';

export function getGeoLocation(ip) {
  const geo = geoip.lookup(ip);
  if (!geo) return 'Unknown';
  return `${geo.city || 'Unknown'}, ${geo.country}`;
}
