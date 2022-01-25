require 'name_generator'
require 'nft/collection/seed_picker'
require 'nft/traits/criteria_checker'
require 'nft/utils/progress'

module Nft
  module Collection
    class GenerateSeed
      def initialize(seed_size, collection_name, traits, dnp, edp)
        raise RuntimeError.new("Seed size must be defined") if seed_size.to_i == 0

        @seed_size = seed_size.to_i
        @traits = traits
        @dnp = dnp
        @edp = edp
        @collection = {}
        @trait_count_table = {}
        @progress = Nft::Utils::Progress.new("Generating seed", @seed_size)
        @name_generator = NameGenerator::Main.new
        @criteria_checker = Nft::Traits::CriteriaChecker.new(dnp, edp)
      end

      def run
        picker = SeedPicker.new(@traits)

        i = 1
        while i <= @seed_size
          traits = picker.pick_traits
          name = @name_generator.next_name
          item = {
            seed_number: i,
            name: name,
            traits: traits,
            dna: Digest::MD5.hexdigest(traits.join)
          }

          if !is_looser?(item) && !@collection.has_key?(item[:dna])
            @collection[item[:dna]] = item 
            item[:traits].map { |p| count_pick(p) }
            @progress.increment if @progress
            i += 1
          end
        end

        {
          seed: @collection,
          trait_count_table: @trait_count_table
        }
      end

      private

        def count_pick(pick)
          @trait_count_table[pick] =\
            @trait_count_table.has_key?(pick) ? @trait_count_table[pick] + 1 : 1
        end

        def is_looser? item
          @criteria_checker.you_shall_not_pass?(item[:traits])
        end
    end
  end
end