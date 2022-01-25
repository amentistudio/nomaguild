module Nft
  module Traits
    class CriteriaChecker

      def initialize(dnp, edp)
        @dnp = dnp
        @edp = edp
      end

      def you_shall_not_pass? traits
        rejection_list = traits.map do |trait| 
          @dnp[trait]
        end.flatten.compact.uniq
        accept_list = traits.map do |trait|
          @edp[trait]
        end.flatten.compact.uniq

        return false if rejection_list.empty? && accept_list.empty?
  
        rejected = traits.any? do |trait|
          rejection_list.include?(trait)
        end || rejection_list.empty?
        accepted = accept_list.any? do |trait|
          traits.include?(trait)
        end || accept_list.empty?
  
        rejected || !accepted
      end

    end
  end
end