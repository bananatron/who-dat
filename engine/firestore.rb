# WE'RE HAVING A FIRE...
# ...SALE!

require 'firebase'
# $fb_listing_url = 'https://##.firebaseio.com/listings'
puts "Whoah there - put a firebase url in firestore.rb!" if !$fb_listing_url

$fb_listing = Firebase::Client.new($fb_listing_url)


def firestore(object, path="/")
  response = $fb_listing.push(path, object)
end
