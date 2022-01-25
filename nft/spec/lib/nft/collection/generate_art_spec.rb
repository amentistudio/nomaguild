require 'tmpdir'
require 'nft/collection/generate_art'

RSpec.describe Nft::Collection::GenerateArt do
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
  let!(:collection) {
    [
      { 
        level: 2,
        score: 700,
        name: "Ash",
        traits: [:background_ash, :eyes_black_eye]
      }
    ]
  }

  context "#new" do
    it "creates new directory for collection name" do
      Dir.mktmpdir do |dir|
        Nft::Collection::GenerateArt.new(
          "christmas",
          collection,
          traits,
          File.join(File.dirname(__FILE__), "../../../fixtures/traits"),
          dir
        )

        expect(File.directory?(File.join(dir, "christmas", "images"))).to be_truthy
      end
    end

    it "creates new directory for collection name and backup the old", :time_stop do
      Dir.mktmpdir do |dir|
        Nft::Collection::GenerateArt.new(
          "christmas",
          collection,
          traits,
          File.join(File.dirname(__FILE__), "../../../fixtures/traits"),
          dir
        )

        expect(File.directory?(File.join(dir, "christmas", "images"))).to be_truthy

        Nft::Collection::GenerateArt.new(
          "christmas",
          collection,
          traits,
          File.join(File.dirname(__FILE__), "../../../fixtures/traits"),
          dir
        )

        expect(File.directory?(File.join(dir, "christmas", "images"))).to be_truthy
        expect(File.directory?(File.join(dir, "christmas/images.#{Time.now.to_i}"))).to be_truthy
      end
    end
  end

  context "#process" do
    it "creates new colleciton of 1 asset" do
      Dir.mktmpdir do |dir|
        Nft::Collection::GenerateArt.new(
          "christmas",
          collection,
          traits,
          File.join(File.dirname(__FILE__), "../../../fixtures/traits"),
          dir
        ).run

        expect(File.directory?(File.join(dir, "christmas", "images"))).to be_truthy
        expect(File.exists?(File.join(dir, "christmas", "images", "0.png"))).to be_truthy
      end
    end
    it "creates new colleciton of 1 asset for small" do
      Dir.mktmpdir do |dir|
        Nft::Collection::GenerateArt.new(
          "christmas",
          collection,
          traits,
          File.join(File.dirname(__FILE__), "../../../fixtures/traits"),
          dir,
          true
        ).run

        expect(File.directory?(File.join(dir, "christmas", "images"))).to be_truthy
        expect(File.exists?(File.join(dir, "christmas", "images", "0.png"))).to be_truthy
      end
    end
  end
end