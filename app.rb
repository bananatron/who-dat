require 'sinatra'
require 'json'
require 'nokogiri'
require 'open-uri'
require 'active_support/all'
require 'sinatra/activerecord'
require 'sanitize'
require 'pry'
require_relative 'engine/firelog'

# require_relative 'engine/models'
# require_relative 'engine/helpers'
# require_relative 'engine/skills'
#
# require_relative 'engine/scraper'
# require_relative 'engine/firestore'
# require_relative 'engine/airtable'


#############$
## DATABASE #$
############$
# set :database, {adapter: "sqlite3", database: "gdd.sqlite3"}
# configure :development do
#   set :bind, '0.0.0.0'
#   set :port, 3000
# end


##############$
## WEB VIEW #$
############$

get '/' do
  erb :index, layout: true
end

get '/play' do
  erb :play, layout: true
end

get '/login' do
  erb :login, layout: true
end
