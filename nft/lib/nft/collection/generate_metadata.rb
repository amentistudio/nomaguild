require 'pickup'
require 'fileutils'
require 'nft/utils/progress'
require 'nft/art/compose_metadata'

module Nft
  module Collection
    class GenerateMetadata

      def initialize(chain, collection_name, collection_description, collection_family, seller_fee, seller_wallet, collection, metadata_dir, ipfs_hash, use_thumbs = false)
        @chain = chain
        @collection_name = collection_name
        @collection_description = collection_description
        @collection_family = collection_family
        @seller_fee = seller_fee
        @seller_wallet = seller_wallet
        @collection = collection
        @metadata_dir = metadata_dir
        @use_thumbs = use_thumbs
        @ipfs_hash = ipfs_hash
      end

      def run
        progress = Nft::Utils::Progress.new("Generating metadata", @collection.length)
        @collection.each do |item|
          Nft::Art::ComposeMetadata.new(
            @chain,
            item[:number],
            item[:traits], 
            item[:name],
            @metadata_dir,
            item[:number].to_s,
            {
              collection_description: @collection_description,
              collection_name: @collection_name,
              collection_family: @collection_family,
              seller_fee: @seller_fee,
              seller_wallet: @seller_wallet
            },
            @ipfs_hash
          ).process
          progress.increment
        end
      end

    end
  end
end