# This is to scrape the hired about page to seed the company profile pictures
# URLS entered into the data store (firebase) will be url links to the profile pictures
# IDeally, everyone would log in eventually and upload their own to prevent broken images and stuff, but whatevs.

require 'nokogiri'
require 'open-uri'
require 'firebase'

$base_uri = 'https://who-is-dat.firebaseio.com'
$fb_root = Firebase::Client.new($base_uri)

def syncHiredEmployees 
  getHiredEmployees.each do |employee|
    $fb_root.push('/hired/people', employee)
  end
end

# def addEmployee(org, name, position, image, gender=false)
#   employee = {'name'=>name, 'position'=>position, 'image'=>image }
#   employee['gender'] = gender if gender
#   $fb_root.push("/#{org}/employees", employee)
# end


def getHiredEmployees
  employees = [] #All employees
  about_url = 'https://hired.com/about'
  doc = Nokogiri::HTML(open(about_url))
  
  doc.css(".responsive.xs-mbh0")

  doc.css('.layout__item').each do | lli |
    puts lli.css('img')
    if (lli.children.count == 5) && (lli.css('img').length != 0)
      ehh = {}
      puts lli.css('img')
      ehh[:photo] = lli.css('img').attr('src')
      ehh[:name] = lli.children[2].text
      ehh[:position] = lli.children[4].text
      employees << ehh 
    end
  end
  
  return employees
end


syncHiredEmployees()
