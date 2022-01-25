require 'tmpdir'
require 'nft/art/compose_metadata'

RSpec.describe Nft::Art::ComposeMetadata do
  context "#process" do
    let!(:traits) {
      [
          :background_ash,
          :eyes_black_eye
      ]
    }
    
    it "creates new file from 2 traits regular size" do
      Dir.mktmpdir do |dir|
        Nft::Art::ComposeMetadata.new(
          :solana,
          1,
          traits,
          "Ash",
          dir,
          "art",
          {
            collection_name: 'Collection name',
            collection_description: 'Collection description',
            collection_family: 'Collection family',
            seller_fee: 2.5,
            seller_wallet: 'walletaddress'
          },
          ""
        ).process

        expect(File.exists?(File.join(dir, "art.json"))).to be_truthy
        metadata = JSON.parse(File.read(File.join(dir, "art.json")))
        expect(metadata['name']).to eq("Ash")
        expect(metadata['description']).to eq("Collection description")
        expect(metadata['collection']['name']).to eq("Collection name")
        expect(metadata['collection']['family']).to eq("Collection family")
        expect(metadata['seller_fee_basis_points']).to eq(250)
        expect(metadata['image']).to eq("ipfs:///art.png")
        expect(metadata['external_url']).to eq("")
        expect(metadata['properties']['files'][0]['uri']).to eq("art.png")
        expect(metadata['properties']['creators'][0]['address']).to eq("walletaddress")
      end
    end

  end
end