import { presetDaisy } from '@ameinhardt/unocss-preset-daisy'
import { defineConfig, presetAttributify, presetIcons, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetDaisy(),
    presetWind4(),
    presetIcons(),
  ],
})
