require 'arweave'

module Nft
  module Storage
    class ArweaveUpload
      attr_reader :tx

      def initialize(wallet_key)
        @wallet = Arweave::Wallet.new(wallet_key)
      end

      def upload(data, type, name)
        transaction = Arweave::Transaction.new(data: data)
        transaction.add_tag(name: 'type', value: type)
        transaction.add_tag(name: 'name', value: name)
        transaction.sign(wallet)
        @tx = transaction.commit
      end

      def get_uri
        "https://www.arweave.net/#{tx.attributes[:id]}?ext=png"
      end
    end
  end
end