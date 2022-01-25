require 'fileutils'
require 'nft/utils/progress'

module Nft
  module Collection
    class CheckTraitsUsage

      def initialize(collection_name, collection, traits, output_dir)
        @collection = collection
        @traits = traits
        @output_dir = output_dir

        @collection_dir = File.join(output_dir, collection_name, "info")
        unless File.directory?(@collection_dir)
          FileUtils.mkdir_p @collection_dir
        end
      end

      def run
        progress = Nft::Utils::Progress.new("Generating traits usage", @collection.length)
        @collection.each_with_index do |item, index|
          item[:traits].each do |trait|
            type, *value = *trait.to_s.split("_")
            @traits[type][:real] ||= {}
            curr_count = @traits[type][:real][trait] || 0
            @traits[type][:real][trait] = curr_count + 1
          end
          progress.increment
        end
        @traits.values.each do |trait|
          trait[:options].each_pair do |name, count|
            trait[:diffs] ||= {}
            trait[:diffs][name] = trait[:real][name] - count
          end
        end

        save_real_traits(@traits)
      end

      private

        def save_real_traits(data)
          File.write(File.join(@output_dir, "real_traits.json"), JSON.pretty_generate(data)) 
        end

    end
  end
end