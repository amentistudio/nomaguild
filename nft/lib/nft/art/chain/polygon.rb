module Nft
  module Art
    module Chain
      class PolygonMetadata

        def self.serialize(name, symbol, collection, file_name, traits, ipfs_hash = "")
          { 
            name: name,
            description: collection[:collection_description],
            image: "ipfs://#{ipfs_hash}/#{file_name}.png",
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