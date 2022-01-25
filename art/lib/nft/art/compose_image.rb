require 'chunky_png'

module Nft
  module Art
    class ComposeImage

      def initialize(traits_dir, traits, item, images_dir, use_thumbs = false)
        @traits_dir = traits_dir
        @traits = traits
        @item = item
        @images_dir = images_dir
        @use_thumbs = use_thumbs
      end

      def process
        avatar = nil
        ordered_trait_names.each_with_index do |trait_name, i|
          trait = @item[:traits][i]
          next if /none/.match(trait)
          trait_png = load_image_trait_from_png(trait_name, trait)
          if avatar
            avatar.compose!(trait_png)
          else
            avatar = trait_png
          end
        end
        save_image_to_collection_as_png(avatar, @item[:number])
      end

      private

        def ordered_trait_names
          @ordered_traits ||= @traits.sort_by do |k, v|
            v[:layer]
          end.map(&:first)
        end

        def load_image_trait_from_png(trait_name, avatar_trait)
          file_name = @use_thumbs ? "#{avatar_trait}_small" : avatar_trait
          ChunkyPNG::Image.from_file(
            File.join(@traits_dir, trait_name.to_s, "#{file_name}.png")
          )
        end
    
        def save_image_to_collection_as_png(png, name)
          png.save(File.join(@images_dir, "#{name}.png"), :fast_rgba)
        end

    end
  end
end