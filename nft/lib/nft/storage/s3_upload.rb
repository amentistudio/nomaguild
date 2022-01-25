require 'aws-sdk-s3'

module Nft
  module Storage
    class AWSS3Upload

      def initialize(access_key_id, secret_access_key, region, bucket_name)
        bucket_name = 'doc-example-bucket'
        region = 'us-east-1'
        s3_client = Aws::S3::Client.new(
          access_key_id: access_key_id,
          secret_access_key: secret_access_key,
          region: region,
          bucket_name: bucket_name,
        )
      end

      def upload(data, type, name)

      end

      private

      def object_uploaded?(s3_client, bucket_name, object_key)
        response = s3_client.put_object(
          bucket: bucket_name,
          key: object_key
        )
        if response.etag
          return true
        else
          return false
        end
      rescue StandardError => e
        puts "Error uploading object: #{e.message}"
        return false
      end

    end
  end
end