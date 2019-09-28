class PlacesController < ApplicationController
   def show
     # render json: { latitud: params[:lat], longidtu: params[:lng], types: types}.to_json

     places = types.each_with_object([]) do |type, collection|
       collection << client.spots(52.4284881, 12.8873288,
                                  radius: 2500,
                                  types: [type],
                                  exclude: ['cafe', 'restaurant', 'department_store'])
     end.flatten

     render json: places
   end

   private

   def client
     @client ||= ::GooglePlaces::Client.new(
       Rails.application.credentials.dig(:google, :api_key)
     )
   end

   def types
     [
       'amusement_park',
       'museum',
       'park',
       'tourist_attraction'
     ]
   end
end
