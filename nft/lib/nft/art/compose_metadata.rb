require 'json'
require_relative 'chain/solana'
require_relative 'chain/polygon'
require 'active_support/inflector'

module Nft
  module Art
    class ComposeMetadata

      def initialize(chain, number, traits, name, metadata_dir, file_name, collection_data = {}, ipfs_hash)
        @klass = "Nft::Art::Chain::#{chain.to_s.camelize}Metadata".constantize
        @number = number
        @traits = traits
        @name = name
        @symbol = ""
        @metadata_dir = metadata_dir
        @file_name = file_name
        @collection_data = collection_data
        @ipfs_hash = ipfs_hash
      end

      def process
        metadata = @klass.serialize(@name, @symbol, @collection_data, @file_name, @traits, @ipfs_hash)
        save_metadata(metadata, @file_name)
      end

      private

        def save_metadata(data, name)
          File.write(File.join(@metadata_dir, "#{name}.json"), JSON.pretty_generate(data)) 
        end

    end
  end
end