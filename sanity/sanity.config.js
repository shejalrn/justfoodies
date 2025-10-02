import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schema'

export default defineConfig({
  name: 'justfoodie',
  title: 'JustFoodies Cloud Kitchen',
  
  projectId: 'ybaq07b6',
  dataset: 'production',

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Categories')
              .child(
                S.documentTypeList('category')
                  .title('Categories')
                  .filter('_type == "category"')
              ),
            S.listItem()
              .title('Menu Items')
              .child(
                S.documentTypeList('menuItem')
                  .title('Menu Items')
                  .filter('_type == "menuItem"')
              ),
            S.listItem()
              .title('Add-ons')
              .child(
                S.documentTypeList('addon')
                  .title('Add-ons')
                  .filter('_type == "addon"')
              ),
            S.listItem()
              .title('Special Offers')
              .child(
                S.documentTypeList('special')
                  .title('Special Offers')
                  .filter('_type == "special"')
              ),
          ])
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },

  // Brand colors
  theme: {
    '--brand-primary': '#4BA3A8',
    '--brand-secondary': '#DE925B',
    '--gray-base': '#111111',
    '--component-bg': '#E5E7DF'
  }
})