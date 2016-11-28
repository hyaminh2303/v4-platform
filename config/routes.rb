require 'sidekiq/web'
require 'sidekiq/cron/web'

Rails.application.routes.draw do
  mount Sidekiq::Web, at: '/sidekiq'

  get '/analytic' => 'home#analytic'
  get '/status' => 'home#status'

  namespace :api, defaults: {format: :json} do
    namespace :v1 do
      get 'auth_status' => 'api#auth_status'
      post 'login' => 'sessions#create'

      post 'profile/update_password', to: 'profiles#update_password'
      get '/get-running-campaigns' => 'rawdata#campaigns'
      get '/get-rawdata' => 'rawdata#events'

      resources :recoveries

      resources :roles

      resources :users do
        member do
          put 'toggle_status' => 'users#toggle_status', as: :toggle_status
          post 'reset_user_password' => 'users#reset_user_password'
        end
      end

      resources :campaigns do
        resources :ad_groups
        collection do
          get 'options' => 'campaigns#options', as: :options
        end
        member do
          get 'generate_location_report' => 'campaigns#generate_location_report'
        end
      end

      resources :ad_groups do
        resources :creatives, only: [:create, :index]
        resources :device_trackings, only: [:index]
        resources :os_trackings, only: [:index]
        resources :date_trackings, only: [:index]
        resources :location_trackings, only: [:index]
        resources :language_trackings, only: [:index]
        resources :app_name_trackings, only: [:index]
        resources :carrier_name_trackings, only: [:index]
        resources :exchange_trackings, only: [:index]
        member do
          get 'export_raw_data'
        end
      end
      post 'locations/check_locations'

      resources :creatives do
        member do
          get '/preview', to: 'creatives#preview', as: :preview
          post '/enqueue', to: 'creatives#enqueue', as: :enqueue
          get 'export_raw_data'
        end
      end

      resource :profile, only: [:update, :show]
      resources :campaign_categories

      resources :passwords, only: [:create, :update]
      patch :reset_password, to: 'passwords#update', path: 'passwords/reset_password'

      resources :campaign_reports, only: [] do
        member do
          get 'export_device_ids'
          get 'export_raw_data'
          get 'export_analytic'
        end
      end

      resources :nationalities

      post '/vast_generator', to: 'vast#create'
      get '/vast_data', to: 'vast#index'
      get '/fonts', to: 'fonts#index', as: :fonts
      get '/time_formats', to: 'time_formats#index', as: :time_formats
      get '/dashboard' => 'dashboard#index', as: :dashboard

      resources :audience_profiles do
        collection do
          get :fetch_campaigns
          get :fetch_events
        end
      end
    end
  end
end
