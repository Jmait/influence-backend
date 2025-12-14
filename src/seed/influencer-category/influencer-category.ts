export const INFLUENCER_CATEGORIES = [
  {
    categoryId: '7b4c2f2c-9dc5-4f26-b3d6-1d9cf672a101', 
    categoryName: 'Beauté et soins',
  },
  { categoryId: '53d43b60-5f4a-4cd1-9c82-8e6062ad4012', categoryName: 'Mode' },
  {
    categoryId: 'df41ef8c-5a1b-4251-8f9e-403e77b90b13',
    categoryName: 'Lifestyle',
  },
  {
    categoryId: 'ba8d6515-8b47-46fc-9bcd-4ce0e95e4d14',
    categoryName: 'Sport & Fitness',
  },
  {
    categoryId: '4e3cf3ab-8c73-451c-b3d1-33b5c3473c15',
    categoryName: 'Famille',
  },
  {
    categoryId: 'ce6a2029-0c0d-4c45-8f27-7db09be93116',
    categoryName: 'Voyage',
  },
  { categoryId: 'de1a5f52-7c76-4b6d-b0ba-f26dc366ba17', categoryName: 'Food' },
  {
    categoryId: '22e8e7ae-5af5-487b-814d-c471ead64118',
    categoryName: 'Maison & déco',
  },
  { categoryId: '39a019c0-bc35-4a63-b616-2cb4745fb119', categoryName: 'Tech' },
  {
    categoryId: 'e6686323-8eea-4498-98df-6e3513ec1820',
    categoryName: 'Gaming & streaming',
  },
];

export const INFLUENCER_SERVICE_CATEGORIES = [
  {
    serviceCategoryId: '7b4c2f2c-9dc5-4f26-b3d6-1d9cf672a101', // keep original
    name: 'Instagram',
  },

  {
    serviceCategoryId: '1f7c3a6b-8e5d-4a9b-a7f4-2c3d6e1f5012',
    name: 'Youtube',
  },

  {
    serviceCategoryId: '2e8d4b7c-9f6a-4b8c-b8e5-3d4f7a2f5023',
    name: 'Tiktok',
  },

  {
    serviceCategoryId: '34959da3-4ed7-4be2-a1ee-68ba7b7824ca',
    name: 'Facebook',
  },

  {
    serviceCategoryId: 'f3b6245d-d309-4e02-8844-76859097be39',
    name: 'X',
  },
];

export const INFLUENCER_SUBCATEGORIES = [
  // Beauté et soins
  {
    subCategoryId: 'c7b269be-8c40-4e2b-b17a-17cf7eaa5001',
    subCategoryName: 'Maquillage',
    categoryId: '7b4c2f2c-9dc5-4f26-b3d6-1d9cf672a101',
  },
  {
    subCategoryId: '6f1b7b2b-1dc9-4d79-b269-676f2a1e5002',
    subCategoryName: 'Skincare',
    categoryId: '7b4c2f2c-9dc5-4f26-b3d6-1d9cf672a101',
  },
  {
    subCategoryId: '2d422afc-35a2-4db0-92f6-5ae48cf85003',
    subCategoryName: 'Cheveux',
    categoryId: '7b4c2f2c-9dc5-4f26-b3d6-1d9cf672a101',
  },

  // Mode
  {
    subCategoryId: 'a91a7e73-19a2-4ea6-b44f-5bde58b85004',
    subCategoryName: 'Mode femme',
    categoryId: '53d43b60-5f4a-4cd1-9c82-8e6062ad4012',
  },
  {
    subCategoryId: '0f7ab7c3-e95b-4de0-9aeb-d2a3521f5005',
    subCategoryName: 'Mode homme',
    categoryId: '53d43b60-5f4a-4cd1-9c82-8e6062ad4012',
  },
  {
    subCategoryId: '8a6cf2ce-73a4-45df-bc83-258761945006',
    subCategoryName: 'Streetwear',
    categoryId: '53d43b60-5f4a-4cd1-9c82-8e6062ad4012',
  },

  // Lifestyle
  {
    subCategoryId: '91df04c9-29a1-49d3-9f50-fc3e3dcd5007',
    subCategoryName: 'Organisation',
    categoryId: 'df41ef8c-5a1b-4251-8f9e-403e77b90b13',
  },
  {
    subCategoryId: '4ef58c59-3f5c-4d73-b04e-1cc4d6fb5008',
    subCategoryName: 'Routine quotidienne',
    categoryId: 'df41ef8c-5a1b-4251-8f9e-403e77b90b13',
  },
  {
    subCategoryId: '367aef06-e2c8-4a50-97a4-2b697e675009',
    subCategoryName: 'Bien être',
    categoryId: 'df41ef8c-5a1b-4251-8f9e-403e77b90b13',
  },

  // Sport
  {
    subCategoryId: '395d7571-716c-43f1-9eb8-1fc1d7f95010',
    subCategoryName: 'Musculation',
    categoryId: 'ba8d6515-8b47-46fc-9bcd-4ce0e95e4d14',
  },
  {
    subCategoryId: 'f0ee1079-4f22-4a21-af18-bf1224765011',
    subCategoryName: 'Yoga',
    categoryId: 'ba8d6515-8b47-46fc-9bcd-4ce0e95e4d14',
  },
  {
    subCategoryId: 'c3b0a5ff-98de-4e50-8326-315d31705012',
    subCategoryName: 'Nutrition sportive',
    categoryId: 'ba8d6515-8b47-46fc-9bcd-4ce0e95e4d14',
  },

  // Famille
  {
    subCategoryId: 'ef3b4c20-1bcc-4e94-9fd0-3ad7cd775013',
    subCategoryName: 'Maman',
    categoryId: '4e3cf3ab-8c73-451c-b3d1-33b5c3473c15',
  },
  {
    subCategoryId: '4aaa2bf0-d143-455b-afc2-b299ca965014',
    subCategoryName: 'Bébé',
    categoryId: '4e3cf3ab-8c73-451c-b3d1-33b5c3473c15',
  },
  {
    subCategoryId: '82fa8b54-d44d-4a3f-9ef0-843e69105015',
    subCategoryName: 'Famille au quotidien',
    categoryId: '4e3cf3ab-8c73-451c-b3d1-33b5c3473c15',
  },

  // Voyage
  {
    subCategoryId: 'feba3b81-d842-4c41-8bd6-8e6860545016',
    subCategoryName: 'City guide',
    categoryId: 'ce6a2029-0c0d-4c45-8f27-7db09be93116',
  },
  {
    subCategoryId: '0dcbede8-fd52-4f67-8c74-c0d51c475017',
    subCategoryName: 'Aventures',
    categoryId: 'ce6a2029-0c0d-4c45-8f27-7db09be93116',
  },

  // Food
  {
    subCategoryId: 'eca8c905-4c5d-42a5-bb6c-5d9e5b845018',
    subCategoryName: 'Recettes',
    categoryId: 'de1a5f52-7c76-4b6d-b0ba-f26dc366ba17',
  },
  {
    subCategoryId: '90c114d8-40dc-4a39-8e1d-6f76bf925019',
    subCategoryName: 'Healthy food',
    categoryId: 'de1a5f52-7c76-4b6d-b0ba-f26dc366ba17',
  },
  {
    subCategoryId: '6fa00b4d-bab6-47bf-8d06-712a7d9b5020',
    subCategoryName: 'Restaurants',
    categoryId: 'de1a5f52-7c76-4b6d-b0ba-f26dc366ba17',
  },

  // Maison & déco
  {
    subCategoryId: 'a879c656-8799-4793-81d1-cb6ddc8c5021',
    subCategoryName: 'Décoration',
    categoryId: '22e8e7ae-5af5-487b-814d-c471ead64118',
  },
  {
    subCategoryId: '2ab2f6be-839b-4f87-8eaa-7cef8f4e5022',
    subCategoryName: 'Rangement',
    categoryId: '22e8e7ae-5af5-487b-814d-c471ead64118',
  },
  {
    subCategoryId: '7b1dfc2d-c419-4ed8-92be-a2f25b2c5023',
    subCategoryName: 'DIY',
    categoryId: '22e8e7ae-5af5-487b-814d-c471ead64118',
  },

  // Tech
  {
    subCategoryId: 'f4c31d9c-e0a0-4744-b1dd-4bcd27ae5024',
    subCategoryName: 'Smartphones',
    categoryId: '39a019c0-bc35-4a63-b616-2cb4745fb119',
  },
  {
    subCategoryId: '0de52a94-061c-4bbd-b7c6-2670e06d5025',
    subCategoryName: 'Tests produits',
    categoryId: '39a019c0-bc35-4a63-b616-2cb4745fb119',
  },

  // Gaming
  {
    subCategoryId: 'c4d4f0b0-8142-4bb8-9c32-064fa2b95026',
    subCategoryName: 'Gaming',
    categoryId: 'e6686323-8eea-4498-98df-6e3513ec1820',
  },
  {
    subCategoryId: 'f72a2b60-48b1-461c-86a7-5892d6af5027',
    subCategoryName: 'Streaming',
    categoryId: 'e6686323-8eea-4498-98df-6e3513ec1820',
  },
];
