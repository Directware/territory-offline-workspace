module.exports = {
  name: 'territory-offline',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/territory-offline',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  globals: {
    "test-jest": {
      tsConfig: "./tsconfig.spec.ts"
    }
  },
  setupFilesAfterEnv: [
    "./src/test-setup.ts"
  ]
};
