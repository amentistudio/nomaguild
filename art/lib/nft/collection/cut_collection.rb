require 'nft/utils/progress'

module Nft
  module Collection
    class CutCollection

      def initialize(collection, total)
        @collection = collection
        @total = total
      end

      def run
        cut_collection
        reorder
      end

      private

        def cut_collection
          ordered_collection = @collection.sort_by { |item| -item[:score] }
          @collection = ordered_collection.slice(0, @total.to_i)
        end


        def reorder
          progress = Nft::Utils::Progress.new("Reordering", @collection.length)
          i = 1
          @collection.sort_by { |item| item[:number] }.map do |item|
            item[:number] = i
            progress.increment
            i = i + 1
            item
          end
        end

    end
  end
end