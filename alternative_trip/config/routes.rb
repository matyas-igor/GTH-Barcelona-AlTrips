Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  # get 'places/:lat/:lng', to: 'places#show'

  get '/places/:id', to: 'places#show'
  get '/near_places', to: 'near_places#index'
end
