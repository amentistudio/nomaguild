require 'nft/collection/generate_seed'

RSpec.describe Nft::Collection::GenerateSeed do
  let!(:dnp) do
    {
      background_green: [:head_green],
      head_white: [:background_white]
    }
  end

  let!(:dp) do
    {
      eye_toxic: [:background_green],
    }
  end

  let!(:traits) do
    {
      background: {
        layer: 1,
        options: {
          background_green: 1,
          background_white: 1
        }
      },
      head: {
        layer: 2,
        options: {
          head_green: 1,
          head_white: 1
        }
      },
      eye: {
        layer: 3,
        options: {
          eye_toxic: 1,
          eye_white: 1
        }
      }
    }
  end

  let(:seed_size) { 100 }

  subject { Nft::Collection::GenerateSeed.new(seed_size, traits, dnp, dp) }

  context "#run" do
    it "sum of all traits counted should be # of traits multiplied with seed size" do
      result = subject.run
      expect(
        result[:trait_count_table].reduce(0) { |sum, (_,v)| sum+=v }
      ).to eq(traits.keys.length * seed_size)
    end
    it "final set of seeds should be seed size" do
      result = subject.run
      expect(
        result[:seed].length
      ).to eq(seed_size)
    end
  end
end