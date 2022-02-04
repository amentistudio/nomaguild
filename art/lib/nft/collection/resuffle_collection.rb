require 'nft/utils/progress'

module Nft
  module Collection
    class ResuffleCollection

      def initialize(collection)
        @collection = collection
      end

      def run
        puts "Size: #{@collection.length}"
        progress = Nft::Utils::Progress.new("Resuffleling", @collection.length)
        i = 1
        @collection.shuffle.map do |item|
          item[:number] = i
          progress.increment
          i = i + 1
          item
        end
      end

    end
  end
end