require 'chunky_png'
require 'nft/utils/progress'

module Nft
  module Traits
    class GenerateThumbs

      def initialize(thumb_ratio, traits_path, traits)
        @thumb_ratio = thumb_ratio.to_f
        @traits_path = traits_path
        @traits = traits
      end

      def run
        ordered_traits.each do |name, trait_values|
          options = trait_values[:options]
          progress = Nft::Utils::Progress.new("Regenerating thumbs for #{name}", options.length)
          options.each_pair do |option, _weight|
            progress.increment
            next if /none/.match(option.to_s)
            dir = File.join(@traits_path, name.to_s)
            #next if File.exists?(File.join(dir, "#{option}_small.png"))
            option_png = load_png(name, option)
            option_png = option_png.resize((option_png.width * @thumb_ratio).floor, (option_png.height * @thumb_ratio).floor)
            option_png.save(File.join(dir, "#{option}_small.png"), :fast_rgba)
          end
        end
      end

      private

        def load_png(trait, option)
          ChunkyPNG::Image.from_file(
            File.join(@traits_path, trait.to_s, "#{option}.png")
          )
        end

        def ordered_traits
          @ordered_traits ||= @traits.sort_by do |k, v|
            v[:layer]
          end
        end
    end
  end
end