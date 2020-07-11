module.exports = {
  name: 'territory-offline',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/territory-offline',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
