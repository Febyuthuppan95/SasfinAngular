import { UUID } from 'angular2-uuid';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  AssetRoute: 'http://localhost:4200/assets/dist',
  ImageRoute: 'http://localhost:4200/assets/dist/images',
  ApiEndpoint: 'https://localhost:44397/api/v1.0',
  ApiBackgroundImages: 'https://localhost:44397/api/v1.0/public/images/background',
  ApiProfileImages: 'https://localhost:44397/api/v1.0/public/images/profile',
  ApiDocuments: 'https://localhost:44397/api/v1.0/public/document',
  WebSocketConnection: 'https://localhost:44397/api/v1.0/chat',
  Sessions: {
    CaptureData: '69c58eaa-ccfb-4fba-97ad-8672ded5ad33',
    ClaimReportData: '3393945f-b088-4d83-a263-6b9029df64ee',
    PermitTypeData: '8584a11d-c605-4b41-ae94-4cefa43c0d96',
    PermitData: '780f766e-8d4b-43f8-a067-059a82b7da13',
    BOMData: '3ba86905-764b-44ce-9e8c-6363187bd864',
    itemData: '7f539ac4-3f99-428f-a04c-5ba2d4bd1172',
    companyData: '41d516a5-9339-4b7c-a810-be1ce3150722',
    transactionData: 'fb27c30c-958f-4aee-ba9d-7a0aee6256a7',
    attachmentData: '7c949dd9-aff3-45a8-9bb5-fca466bf15e5',
    companyOEMData: 'f0e77e12-2f52-4a5b-ac12-c88bf6d4c2dc',
    companyClaimData: 'f16d7f8c-279c-4c87-8919-09e91d15d209',
    companyLocalReceiptData: '0184b65f-d9d2-4627-8777-2558035617c5',
    localTransactionData: 'a0773d39-9112-4bd7-a320-ad5ba0f85b6d'
  },

  // We should consider doing this for api endpoints -- Ashton
  api: {
    users: {
      list: 'https://localhost:44397/api/v1.0/users/list',
      create: 'https://localhost:44397/api/v1.0/users/add',
      update: 'https://localhost:44397/api/v1.0/users/update',
      upload: 'https://localhost:44397/api/v1.0/users/upload',
      hub: 'https://localhost:44397/Communication/Hub'
    }
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
