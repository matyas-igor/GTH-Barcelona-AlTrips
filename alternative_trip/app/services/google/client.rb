module Google
  # Google client
  class Client
    def initialize
      GooglePlaces::Client.new(
        Rails.application.credentials.dig(:google, :api_key)
      )
      super
    end
  end
end
