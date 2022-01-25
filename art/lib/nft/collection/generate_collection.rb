require 'pickup'
require 'digest'
require 'nft/utils/progress'

module Nft
  module Collection
    class GenerateCollection
      attr_reader :set_size

      def initialize(set_size, seed, trait_count_table, distribution)
        @set_size = set_size.to_i
        @distribution = distribution["tiers"]
        @seed = seed
        @trait_count_table = trait_count_table
        @trait_score_table = {}
        @trait_scores = {}
        @winners = {}
        @pick_range = {}
        @final_distribution = {}
      end

      def run
        calculate_score
        pick_winners
        calculate_final_distribution

        {
          collection: @winners.values.shuffle,
          final_distribution: @final_distribution
        }
      end

      private

        def calculate_score
          calculate_all_traits_scores
    
          progress = Nft::Utils::Progress.new("Calculating score", @seed.values.length)
          @seed.values.each do |item|
            item[:score] = calculate_item_score(item[:traits])
            progress.increment
          end
        end
    
        def calculate_all_traits_scores
          @trait_count_table.each_pair do |trait, number_of_items_with_trait|
            trait_score = 1.to_f / (number_of_items_with_trait.to_f / @seed.keys.length.to_f)
            @trait_scores[trait] = trait_score
          end
        end

        def calculate_item_score(traits)
          traits.reduce(0) { |acc, trait| acc += @trait_scores[trait] }.to_f
        end

        def pick_winners
          minmax = @seed.values.map { |value| value[:score] }.minmax
          range = minmax.first..minmax.last
          interval = (minmax.last.to_f / @distribution.length.to_f).to_i
    
          k = 0
          range.step(interval).each do |start|
            stop = [range.last, start + (interval - 1)].min
            @pick_range[start..stop] = @distribution[k]
            k = k + 1
          end

          seed_sorted = {}
          progress = Nft::Utils::Progress.new("Sorting by distribution #{@seed.values.length}", @seed.values.length)
          @seed.values.each do |item|
            @pick_range.each do |range, value|
              if range.member?(item[:score])
                seed_sorted[range] ||= []
                seed_sorted[range] << item
                progress.increment
                next
              end
            end
          end
    
          progress = Nft::Utils::Progress.new("Picking #{set_size}", set_size)
          tick = 0
          distribution_picker = Pickup.new(@pick_range)
          while tick < set_size
            range = distribution_picker.pick
            item = seed_sorted[range].sample
            if item && !@winners.has_key?(item[:dna])
              tick += 1
              item[:number] = tick
              @winners[item[:dna]] = item
              progress.increment
            end
          end
        end

        def calculate_final_distribution
          progress = Nft::Utils::Progress.new("Calculateing distribution", @winners.length)
          @winners.values.map do |item|
            @pick_range.each_pair do |range, _|
              if range.member?(item[:score])
                @final_distribution[range] = { count: 0 } unless @final_distribution.has_key?(range)
                @final_distribution[range] = { count: @final_distribution[range][:count] + 1 }
                level = @pick_range.find_index { |k,_| k == range }
                item[:level] = level + 1
                next
              end
            end
          end
    
          @final_distribution.each_pair do |range, value|
            @final_distribution[range] = (@final_distribution[range][:count].to_f / @winners.length.to_f) * 100
          end
        end
    end
  end
end