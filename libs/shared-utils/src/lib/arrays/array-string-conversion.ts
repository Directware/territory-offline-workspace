export function stringToUint8Array(data: string)
{
  return new Uint8Array(data.split(",").map(entry => parseInt(entry, 10)));
}
