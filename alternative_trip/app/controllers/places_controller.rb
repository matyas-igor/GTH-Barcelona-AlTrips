# frozen_string_literal: true

# ..
class PlacesController < ApplicationController

  def show
    place = client.spot(params[:id])

    render json: place
  end


  private

  def client
    @client ||= ::GooglePlaces::Client.new(
      Rails.application.credentials.dig(:google, :api_key)
    )
  end
end
