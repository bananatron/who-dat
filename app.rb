require 'sinatra'
require 'json'
# require 'nokogiri'
# require 'open-uri'
# require 'active_support/all'
# require 'sinatra/activerecord'
require 'sanitize'
require 'pry'



##############$
## WEB VIEW #$
############$

get '/' do
  erb :index, layout: true
end

get '/login' do
  erb :login, layout: true
end

get '/play' do
  erb :play, layout: true
end

get '/scores' do
  erb :scores, layout: true
end

get '/login' do
  erb :login, layout: true
end


# Add a new person
get '/face/new' do
  erb :new, layout: true
end

# Edit existing person
get '/face/:name_key' do
  erb :face, layout: true, :locals => {:name_key => params[:name_key]}
end
