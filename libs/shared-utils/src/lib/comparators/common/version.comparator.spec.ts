import { compareVersions } from '@territory-offline-workspace/shared-utils';

describe('version.comparator.spec', () => {
  it('should compare versions', () => {
    expect(compareVersions('0.0.1', '0.0.0')).toBe(true);
    expect(compareVersions('0.1.0', '0.0.0')).toBe(true);
    expect(compareVersions('1.0.0', '0.0.0')).toBe(true);

    expect(compareVersions('0.0.1', '0.0.1')).toBe(false);
    expect(compareVersions('0.1.0', '0.1.0')).toBe(false);
    expect(compareVersions('1.0.0', '1.0.0')).toBe(false);

    expect(compareVersions('0.1.1', '1.0.0')).toBe(false);
  });
});
