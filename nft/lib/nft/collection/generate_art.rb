require 'pickup'
require 'fileutils'
require 'nft/utils/progress'
require 'nft/art/compose_image'

module Nft
  module Collection
    class GenerateArt

      def initialize(images_dir, collection, traits, traits_dir, use_thumbs = false)
        @images_dir = images_dir
        @collection = collection
        @traits = traits
        @traits_dir = traits_dir
        @use_thumbs = use_thumbs
      end

      def run
        progress = Nft::Utils::Progress.new("Generating avatars", @collection.length)
        @collection.each do |item|
          Nft::Art::ComposeImage.new(
            @traits_dir,
            @traits,
            item,
            @images_dir,
            @use_thumbs
          ).process
          progress.increment
        end
      end

    end
  end
end