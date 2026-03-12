export function validCoordinates(coordinates: number[]): boolean {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) return false;

  const [longitude, latitude] = coordinates;

  const longitudeRegex =
    /^-?(180(\.0{1,8})?|1[0-7]\d(\.\d{1,8})?|[1-9]?\d(\.\d{1,8})?)$/;

  const latitudeRegex =
    /^-?(90(\.0{1,8})?|[1-8]\d(\.\d{1,8})?|[1-9](\.\d{1,8})?|\d(\.\d{1,8})?)$/;

  const isValidLongitude = longitudeRegex.test(String(longitude));
  const isValidLatitude = latitudeRegex.test(String(latitude));

  return isValidLongitude && isValidLatitude;
}
