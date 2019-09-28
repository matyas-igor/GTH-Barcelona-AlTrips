Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  # get 'places/:lat/:lng', to: 'places#show'

  resource :places, only: [:show], path: '/places/:lat/:lng'
end
