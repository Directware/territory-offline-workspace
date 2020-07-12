module.exports = {
  name: 'field-companion',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/field-companion',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
