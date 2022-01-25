require 'nft/collection/seed_picker'

RSpec.describe Nft::Collection::SeedPicker do
  context "#pick_traits" do
    it "initiates pickers in the right order" do
      traits = {
        background: {
          layer: 2,
          options: {
            bg_option1: 1,
            bg_option2: 2
          }
        },
        head: {
          layer: 1,
          options: {
            h_option1: 1,
            h_option2: 2
          }
        }
      }

      seed_picker = Nft::Collection::SeedPicker.new(traits)
      selection = seed_picker.pick_traits
      expect(selection.first).to match(/h_/)
      expect(selection.last).to match(/bg_/)
    end
  end
end