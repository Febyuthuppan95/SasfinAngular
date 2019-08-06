// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  AssetRoute: 'http://localhost:4200/assets/dist',
  ImageRoute: 'http://localhost:4200/assets/dist/images',
  ApiEndpoint: 'https://localhost:44397/api/v1.0',
  ApiBackgroundImages: 'https://localhost:44397api/v1.0/public/images/background',
  ApiProfileImages: 'https://localhost:44397/api/v1.0/public/images/profile'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
