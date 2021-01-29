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
    "ts-jest": {
      tsconfig: "./tsconfig.spec.json",
      stringifyContentPathRegex: "\\.html$",
      astTransformers: {
        "before": [
          "jest-preset-angular/build/InlineFilesTransformer",
          "jest-preset-angular/build/StripStylesTransformer"
        ]
      }
    }
  },
  setupFilesAfterEnv: [
    "./src/test-setup.ts"
  ]
};
