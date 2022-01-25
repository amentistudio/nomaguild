require 'tmpdir'
require 'nft/collection/generate_metadata'

RSpec.describe Nft::Collection::GenerateMetadata do
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

  context "#process" do
    it "creates new colleciton of 1 metadata" do
      Dir.mktmpdir do |dir|
        Nft::Collection::GenerateMetadata.new(
          :solana,
          "collection name",
          "collection description",
          "collection family",
          250,
          "sellerwallet",
          collection,
          dir,
          ""
        ).run

        expect(File.directory?(File.join(dir, "collection name", "metadata"))).to be_truthy
        expect(File.exists?(File.join(dir, "collection name", "metadata", "0.json"))).to be_truthy
      end
    end

    it "creates new colleciton of 1 asset for small" do
      Dir.mktmpdir do |dir|
        Nft::Collection::GenerateMetadata.new(
          :solana,
          "collection name",
          "collection description",
          "collection family",
          250,
          "sellerwallet",
          collection,
          dir,
          "",
          true
        ).run

        expect(File.directory?(File.join(dir, "collection name", "metadata"))).to be_truthy
        expect(File.exists?(File.join(dir, "collection name", "metadata", "0.json"))).to be_truthy
      end
    end
  end
end