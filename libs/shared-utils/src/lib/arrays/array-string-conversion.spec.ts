import { stringToUint8Array } from './array-string-conversion';

describe('array-string-conversion.spec', () => {
  it('should convert string to Uint8Array', () => {
    const result = stringToUint8Array('012345');

    expect(result.length).toBe(6);
    expect(result[0]).toBe(0);
    expect(result[3]).toBe(3);
  });
});
