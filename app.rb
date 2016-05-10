require 'sinatra'
require 'json'
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
  erb :face, layout: true
end

# Edit existing person
get '/face/:name_key' do
  erb :face, layout: true, :locals => {:name_key => params[:name_key]}
end
