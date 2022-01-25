require 'nft/utils/progress'

module Nft
  module Collection
    class EliminateCollection

      def initialize(collection, elimination_set)
        @collection = collection
        @new_collection = collection
        @elimination_set = elimination_set
      end

      def run
        progress = Nft::Utils::Progress.new("Eliminating", @collection.length)
        @collection.reject do |item|
          progress.increment
          @elimination_set.include?(item[:number])
        end
      end

    end
  end
end