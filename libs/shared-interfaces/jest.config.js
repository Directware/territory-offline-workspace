module.exports = {
  name: 'shared-interfaces',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/shared-interfaces',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
