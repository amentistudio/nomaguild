require 'nft/traits/criteria_checker'

RSpec.describe Nft::Traits::CriteriaChecker do
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

  subject { Nft::Traits::CriteriaChecker.new(dnp, dp)  }
    
  describe "#you_shall_not_pass?" do
    context "dnp" do
      it "green background and white head is ok" do
        expect(subject.you_shall_not_pass?([:background_green, :head_white])).to eq(false)
      end
      it "green background and green head is no-no" do
        expect(subject.you_shall_not_pass?([:background_green, :head_green])).to eq(true)
      end
      it "white background and white head is no-no" do
        expect(subject.you_shall_not_pass?([:background_white, :head_white])).to eq(true)
      end
      it "green background and white eye is ok" do
        expect(subject.you_shall_not_pass?([:background_green, :eye_white])).to eq(false)
      end
      it "blue background and white eye is ok" do
        expect(subject.you_shall_not_pass?([:background_blue, :eye_white])).to eq(false)
      end
      it "blue background and white eye is ok" do
        expect(subject.you_shall_not_pass?([:background_blue, :head_white])).to eq(false)
      end
    end

    context "edp" do
      it "green background and toxic eyes is ok" do
        expect(subject.you_shall_not_pass?([:background_green, :eye_toxic])).to eq(false)
      end
      it "white background and toxic eyes is no-no" do
        expect(subject.you_shall_not_pass?([:background_white, :eye_toxic])).to eq(true)
      end
      it "blue background and green eyes is ok" do
        expect(subject.you_shall_not_pass?([:background_blue, :eye_green])).to eq(false)
      end
    end
  end
end