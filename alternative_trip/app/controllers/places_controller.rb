class PlacesController < ApplicationController
   def show
     places = types.each_with_object([]) do |type, collection|
       collection << client.spots(params[:lat], params[:lng],
                                  radius: 3000,
                                  types: [type],
                                  exclude: exclude_types)
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

   def exclude_types
     [
       'bar',
       'cafe',
       'restaurant',
       'department_store',
       'moving_company',
       'store',
       'continent',
       'country',
       'finance',
       'floor',
       'food',
       'general_contractor',
       'geocode',
       'health',
       'intersection',
       'locality',
       'neighborhood',
       'place_of_worship',
       'political',
       'post_box',
       'place_of_worship',
       'political',
       'general_contractor'
     ]
   end
end
