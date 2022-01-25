require 'ruby-progressbar'

module Nft
  module Utils
    class Progress
      PB_FORMAT = "%t: |%B| %e"

      def initialize(title, total, format = PB_FORMAT)
        if ENV.fetch('APP_ENV') != 'test'
          @progressbar = ProgressBar.create(title: title, total: total, format: PB_FORMAT)
        end
      end

      def increment
        if @progressbar
          @progressbar.increment
        end
      end
    end
  end
end