export const environment = {
  production: false,
  AssetRoute: 'http://lateral.solutions:8888/assets/dist',
  ImageRoute: 'http://lateral.solutions:8888/assets/dist/images',
  ApiEndpoint: 'http://lateral.solutions:7777/api/v1.0',
  ApiBackgroundImages: 'http://lateral.solutions:7777/api/v1.0/public/images/background',
  ApiProfileImages: 'http://lateral.solutions:7777/api/v1.0/public/images/profile',
  ApiDocuments: 'http://lateral.solutions:7777/api/v1.0/public/document',
  appRoute: 'http://lateral.solutions:8888',
  Sessions: {
    CaptureData: '69c58eaa-ccfb-4fba-97ad-8672ded5ad33',
    ClaimReportData: '3393945f-b088-4d83-a263-6b9029df64ee',
    PermitTypeData: '8584a11d-c605-4b41-ae94-4cefa43c0d96',
    PermitData: '780f766e-8d4b-43f8-a067-059a82b7da13',
    BOMData: '3ba86905-764b-44ce-9e8c-6363187bd864',
    ROEData: 'b539e189-5db3-4a69-a793-aa081755129c',
    itemData: '7f539ac4-3f99-428f-a04c-5ba2d4bd1172',
    companyData: '41d516a5-9339-4b7c-a810-be1ce3150722',
    transactionData: 'fb27c30c-958f-4aee-ba9d-7a0aee6256a7',
    attachmentData: '7c949dd9-aff3-45a8-9bb5-fca466bf15e5',
    companyOEMData: 'f0e77e12-2f52-4a5b-ac12-c88bf6d4c2dc',
    companyClaimData: 'f16d7f8c-279c-4c87-8919-09e91d15d209',
    companyLocalReceiptData: '0184b65f-d9d2-4627-8777-2558035617c5',
    localTransactionData: 'a0773d39-9112-4bd7-a320-ad5ba0f85b6d'
  },
  firebase: {
    apiKey: 'AIzaSyA-eGQMsoiNn30kqeVClYCYTkWr0SpAlb0',
    authDomain: 'sasfingts.firebaseapp.com',
    databaseURL: 'https://sasfingts.firebaseio.com',
    projectId: 'sasfingts',
    storageBucket: 'sasfingts.appspot.com',
    messagingSenderId: '919526667324',
    appId: '1:919526667324:web:a6cd295797c17aeba7bf39',
    measurementId: 'G-S1QRVH7XLV'
  },
  // We should consider doing this for api endpoints -- Ashton
  api: {
    users: {
      list: 'http://lateral.solutions:7777/api/v1.0/users/list',
      create: 'http://lateral.solutions:7777/api/v1.0/users/add',
      update: 'http://lateral.solutions:7777/api/v1.0/users/update',
      upload: 'http://lateral.solutions:7777/api/v1.0/users/upload',
      hub: 'http://lateral.solutions:7777/Communication/Hub'
    }
  }
};
