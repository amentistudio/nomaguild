require 'tmpdir'
require 'nft/art/compose_image'

RSpec.describe Nft::Art::ComposeImage do
  context "#process" do
    let!(:traits) {
      {
        background: {
          layer: 0,
          options: {
            background_ash: 1
          }
        },
        eyes: {
          layer: 1,
          options: {
            eyes_black_eye: 1
          }
        }
      }
    }

    let!(:avatar_traits) {
      [
        :background_ash, :eyes_black_eye
      ]
    }
    
    it "creates new file from 2 traits regular size" do
      Dir.mktmpdir do |dir|
        Nft::Art::ComposeImage.new(
          File.join(File.dirname(__FILE__), "../../../fixtures/traits"),
          traits,
          avatar_traits,
          dir,
          "combined"
        ).process

        expect(File.exists?(File.join(dir, "combined.png"))).to be_truthy
      end
    end

    it "creates new file from 2 traits small size" do
      Dir.mktmpdir do |dir|
        Nft::Art::ComposeImage.new(
          File.join(File.dirname(__FILE__), "../../../fixtures/traits"),
          traits,
          avatar_traits,
          dir,
          "combined_small",
          true
        ).process

        expect(File.exists?(File.join(dir, "combined_small.png"))).to be_truthy
      end
    end
  end
end