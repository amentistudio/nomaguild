require 'bundler'; Bundler.setup; nil


require 'pickup'
require 'chunky_png'
require 'fileutils'
require 'byebug'
require 'ruby-progressbar'
require 'awesome_print'
require 'json'
require 'aws-sdk-s3'

class Main
  COLLECTION_NAME = "No Mummy Allowed Guild"
  COLLECTION_DESCRIPTION = "NoMA Guild"
  COLLECTION_FAMILY = "NoMA Guild"
  SELLER_WALLET = "3KLxgYLJV6aN6ySv7r9Ci8Nd3tU2ELMaCwnfwqSBi8S4"
  SELLER_FEE = 2.5 #%
  PB_FORMAT = "%t: |%B| %e"
  NUMBER_OF_VARIATIONS = 1_000_000
  NUMBER_OF_PICKS = 10_000

  ASSETS = File.join(__dir__, "assets")

  def initialize(collection_id)
    
    @trait_count_table = {}
    @trait_score_table = {}
    @trait_scores = {}
    @collection_dir = File.join(ASSETS, "collections", collection_id)
    FileUtils.mkdir_p @collection_dir unless File.directory?(@collection_dir)
    @log = File.open(File.join(@collection_dir, "log.txt"), 'a')
    @collection = []
    @winners = []
    @background = Pickup.new(Main::BACKGROUND)
    @skin = Pickup.new(Main::SKIN)
    @clothes = Pickup.new(Main::CLOTHES)
    @mouth = Pickup.new(Main::MOUTH)
    @eyes = Pickup.new(Main::EYES)
    @accessories = Pickup.new(Main::ACCESSORIES)
    @head = Pickup.new(Main::HEAD)
  end

  def run
    #generate_thumbs(true)
    generate_collection
    remove_loosers
    calculate_score
    pick_winners
    calculate_final_distribution
    generate_avatars(small: true)
    close
  end

  private

    # def log(i, name, traits, score, level)
    #   output = {
    #     number: i,
    #     level: level,
    #     name: name,
    #     score: score,
    #     traits: traits.map { |trait|
    #       type, *value = *trait.to_s.split("_")
    #       {
    #         trait_type: type,
    #         value: value.join("_")
    #       }
    #     }
    #   }
    #   @log.write(output.to_json)
    # end

    # def close
    #   @log.close
    # end

    # def generate_thumbs(regenerate = false)
    #   [:background, :skin, :clothes, :mouth, :eyes, :accessories, :head].each do |name|
    #     trait_list = ALL_TRAITS[name]
    #     progressbar = ProgressBar.create(title: "Regenerating thumbs for #{name}", total: trait_list.length, format: PB_FORMAT)
    #     trait_list.each_pair do |trait, _|
    #       progressbar.increment
    #       next if /none/.match(trait.to_s)
    #       dir = File.join(ASSETS, "traits", name.to_s)
    #       next if File.exists?(File.join(dir, "#{trait}_small.png")) && !regenerate
    #       trait_png = load_png(name, trait)
    #       trait_png = trait_png.resize((trait_png.width * 0.25).floor, (trait_png.height * 0.25).floor)
    #       trait_png.save(File.join(dir, "#{trait}_small.png"), :fast_rgba)
    #     end
    #   end
    # end

    # def generate_collection
    #   progressbar = ProgressBar.create(title: "Generating collection", total: NUMBER_OF_VARIATIONS, format: PB_FORMAT)
    #   NUMBER_OF_VARIATIONS.times.each do |i|
    #     name = @generator.next_name
    #     traits = pick_traits
    #     item = {
    #       number: i,
    #       name: name,
    #       traits: traits,
    #       score: 0,
    #     }
    #     @collection << item
    #     progressbar.increment
    #   end
    # end

    # def remove_loosers
    #   return if @collection.empty?

    #   progressbar = ProgressBar.create(title: "Removing loosers", total: @collection.length, format: PB_FORMAT)
    #   @new_collection = @collection.reject do |item|
    #     progressbar.increment
    #     is_looser?(item)
    #   end
    #   puts "Rejected: #{@collection.length - @new_collection.length}"
    #   @collection = @new_collection
    # end

    # def is_looser? item
    #   rejection_list = item[:traits].map do |trait| 
    #     REJECTION_MAP[trait]
    #   end
    #   accept_list = item[:traits].map do |trait|
    #     ACCEPT_MAP[trait]
    #   end
    #   rejection_list = rejection_list.flatten.compact.uniq
    #   accept_list = accept_list.flatten.compact.uniq
    #   return if rejection_list.empty? && accept_list.empty?

    #   rejected = item[:traits].any? do |trait|
    #     rejection_list.include?(trait)
    #   end
    #   accepted = accept_list.any? do |trait|
    #     item[:traits].include?(trait)
    #   end

    #   rejected || !accepted
    # end

    # def calculate_score
    #   return if @collection.empty?
    #   calculate_all_traits_scores

    #   progressbar = ProgressBar.create(title: "Calculating score", total: @collection.length, format: PB_FORMAT)
    #   @collection.each do |item|
    #     item[:score] = calculate_item_score(item[:traits])
    #     progressbar.increment
    #   end
    # end

    # def calculate_all_traits_scores
    #   @trait_count_table.each_pair do |trait, number_of_items_with_trait|
    #     trait_score = 1.to_f / (number_of_items_with_trait.to_f / @collection.length.to_f)
    #     @trait_scores[trait] = trait_score
    #   end
    # end

    # def calculate_item_score(traits)
    #   traits.reduce(0) { |acc, trait| acc += @trait_scores[trait] }.to_f
    # end

    # def pick_winners
    #   minmax = @collection.map { |i| i[:score] }.minmax
    #   range = minmax.first..minmax.last
    #   step = (minmax.last.to_f / DISTRIBUTION.length.to_f).to_i

    #   @pick_range = {}
    #   k = 0
    #   last_step = 0
    #   range.step(step) do |i|
    #     @pick_range[last_step..i] = DISTRIBUTION[k]
    #     last_step = i
    #     k = k + 1
    #   end

    #   distribution_picker = Pickup.new(@pick_range)
      
    #   progressbar = ProgressBar.create(title: "Picking #{NUMBER_OF_PICKS}", total: NUMBER_OF_PICKS, format: PB_FORMAT)
    #   tick = 0
    #   while tick < NUMBER_OF_PICKS
    #     range = distribution_picker.pick
    #     collection_in_range = @collection.find_all { |item| range.member?(item[:score]) }
    #     item = collection_in_range.sample
    #     byebug if item.nil?
    #     unless (@winners.any? { |i| i[:traits] == item[:traits] })
    #       progressbar.increment
    #       tick += 1
    #       @winners << item
    #     end
    #   end
    # end

    # def calculate_final_distribution
    #   @final_disribution = {}

    #   @winners.map do |item|
    #     @pick_range.each_pair do |range, _|
    #       if range.member?(item[:score])
    #         @final_disribution[range] = { count: 0 } unless @final_disribution.has_key?(range)
    #         @final_disribution[range] = { count: @final_disribution[range][:count] + 1 }
    #         level = @pick_range.find_index { |k,_| k == range }
    #         item[:level] = level
    #         next
    #       end
    #     end
    #   end

    #   @final_disribution.each_pair do |range, value|
    #     @final_disribution[range] = (@final_disribution[range][:count].to_f / @winners.length.to_f) * 100
    #   end

    #   ap @pick_range
    #   ap @final_disribution
    # end

    # def generate_avatars(small: false)
    #   progressbar = ProgressBar.create(title: "Generating avatars", total: @winners.length, format: PB_FORMAT)
    #   @winners.shuffle.each_with_index do |item, index|
    #     file_name = "#{index+1}__#{item[:level]}__#{item[:score].to_i}_#{item[:name]}"
    #     log(index+1, item[:name], item[:traits], item[:score], item[:level])
    #     generate_avatar(index+1, item[:traits], file_name, small)
    #     generate_meta(index+1, item[:traits], item[:name], file_name)
    #     progressbar.increment
    #   end
    # end


    # def pick_traits
    #   [@background, @skin, @clothes, @mouth, @eyes, @accessories, @head].map do |picker|
    #     count_pick(picker.pick)
    #   end
    # end

    # def count_pick(pick)
    #   @trait_count_table[pick] =\
    #     @trait_count_table.has_key?(pick) ? @trait_count_table[pick] + 1 : 1
    #   pick
    # end

    # def generate_avatar(i, traits, name, small = false)
    #   bg_trait = small ? "#{traits[0]}_small" : traits[0]
    #   png = load_png("background", bg_trait)
    #   [:skin, :clothes, :mouth, :eyes, :accessories, :head].each_with_index do |name, i|
    #     next if /none/.match(traits[i+1])
    #     trait = small ? "#{traits[i+1]}_small" : traits[i+1]
    #     trait_png = load_png(name, trait)
    #     png.compose!(trait_png)
    #   end
    #   save_png(png, name)
    # end

    def generate_meta(number, traits, name, file_name)
      data = { 
        name: "#{number} - #{name}",
        symbol: "",
        description: COLLECTION_DESCRIPTION,
        collection: {
          name: COLLECTION_NAME,
          family: COLLECTION_FAMILY
        },
        seller_fee_basis_points: (SELLER_FEE * 100).to_i, # 250 = 2.5% (eg 1000 = 100%)
        image: "#{file_name}.png",
        external_url: "",
        properties: {
          files: [
            {
              uri: "#{file_name}.png",
              type: "image/png"
            }
          ],
          category: "image",
          creators: [
            {
              address: SELLER_WALLET,
              share: 100 #%
            }
          ]
        },
        attributes: traits.map { |trait|
          type, *value = *trait.to_s.split("_")
          {
            trait_type: type,
            value: value.join("_")
          }
        }
      }
      save_metadata(data, file_name)
    end

    # def load_png(trait, name)
    #   ChunkyPNG::Image.from_file(
    #     File.join(ASSETS, "traits", trait.to_s, "#{name}.png")
    #   )
    # end

    # def save_png(png, name)
    #   png.save(File.join(@collection_dir, "#{name}.png"), :fast_rgba)
    # end
    
    def save_metadata(data, name)
      File.write(File.join(@collection_dir, "#{name}.json"), JSON.pretty_generate(data)) 
    end
end

main = Main.new(Time.now.to_i.to_s)
main.run
