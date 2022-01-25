require 'pickup'

module Nft
  module Collection
    class SeedPicker

      def initialize(traits)
        @traits = traits
      end

      def pick_traits
        pickers.map do |picker|
          picker.pick
        end
      end

      private

        def pickers
          @pickers ||= ordered_traits.reduce([]) do |memo, (k, v)|
            memo << Pickup.new(v[:options])
          end
        end

        def ordered_traits
          @ordered_traits ||= @traits.sort_by do |k, v|
            v[:layer]
          end
        end

    end
  end
end