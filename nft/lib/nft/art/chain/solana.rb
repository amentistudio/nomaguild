module Nft
  module Art
    module Chain
      class SolanaMetadata

        def self.serialize(name, symbol, collection, file_name, traits, ipfs_hash = "")
          { 
            name: name,
            symbol: symbol,
            description: collection[:collection_description],
            collection: {
              name: collection[:collection_name],
              family: collection[:collection_family]
            },
            seller_fee_basis_points: (collection[:seller_fee] * 100).to_i, # 250 = 2.5% (eg 1000 = 100%)
            image: "ipfs://#{ipfs_hash}/#{file_name}.png",
            external_url: "",
            properties: {
              files: [
                {
                  uri: "#{file_name}.png",
                  type: "image/png"
                }
              ],
              category: "image",
              creators: [
                {
                  address: collection[:seller_wallet],
                  share: 100 #%
                }
              ]
            },
            attributes: traits.map { |trait|
              type, *value = *trait.to_s.split("_")
              {
                trait_type: type,
                value: value.join("_")
              }
            }
          }
        end

      end
    end
  end
end