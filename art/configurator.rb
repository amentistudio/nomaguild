require 'insensitive_hash'

class Configurator
  class << self
    def traits
      read_json('config/traits.json')
    end

    def dnp # do not pair
      read_json(File.join(config_dir, 'dnp.json'))
    end

    def edp # explusively do pair
      read_json(File.join(config_dir, 'edp.json'))
    end

    def distribution # what should the final distribution be like?
      read_json(File.join(config_dir, 'distribution.json'))
    end

    def elimination
      read_json(File.join(config_dir, 'eliminate.json'))
    end

    def seed
      read_json(File.join(config_dir, 'seed.json'))
    end

    def seed= seed
      write_json(File.join(config_dir, "seed.json"), seed)
    end

    def trait_count_table
      read_json(File.join(config_dir, 'trait_count_table.json'))
    end

    def trait_count_table= tct
      write_json(File.join(config_dir, "trait_count_table.json"), tct)
    end

    def collection
      read_json(File.join(config_dir, 'collection.json'))
    end

    def collection= col
      write_json(File.join(config_dir, "collection.json"), col)
    end

    def final_distribution
      read_json(File.join(config_dir, 'final_distribution.json'))
    end

    def final_distribution= col
      write_json(File.join(config_dir, "final_distribution.json"), col)
    end

    def ensure_collection_dirs! collection_name
      collection_dir = File.join("assets", "collections", collection_name)
      ["images", "metadata", "config"].each do |subdir|
        FileUtils.mkdir_p File.join(collection_dir, subdir)
      end
    end
    
    def metadata_dir
      ensure_collection_dirs! ENV["COLLECTION_NAME"]
      collection_subdir_for(ENV["COLLECTION_NAME"], "metadata")
    end

    def images_dir
      ensure_collection_dirs! ENV["COLLECTION_NAME"]
      collection_subdir_for(ENV["COLLECTION_NAME"], "images")
    end

    def config_dir
      ensure_collection_dirs! ENV["COLLECTION_NAME"]
      collection_subdir_for(ENV["COLLECTION_NAME"], "config")
    end

    private

      def collection_subdir_for(collection_name, subdir_name)
        File.join("assets", "collections", collection_name, subdir_name)
      end

      def read_json(file_path)
        data = JSON.parse(File.read(file_path))
        if data.instance_of? Hash
          data.insensitive
        else
          data.map { |item| item.instance_of?(Hash) ? item.insensitive : item }
        end
      end

      def write_json(file_name, payload)
        File.write(file_name, JSON.pretty_generate(payload))
      end
  end
end