export function stringToUint8Array(data: string)
{
  const arr = [];
  for(let i = 0; i < data.length; i++)
  {
    arr.push(parseInt(data.charAt(i)));
  }

  return new Uint8Array(arr);
}
