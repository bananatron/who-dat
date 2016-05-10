
#                        (
#             (  .          )
#              )          (          )
#             .  '   .    '  .  '  .
#         (    , )         (.   )  (   ',   )
#        .' ) ( . )    ,    ( ,     )   ( .
#       ). , ( .   (  )   ( , ')  .' (  ,    )
#     (_,) . ), ) _) _,'  )  (, ) '. )  ,. (' )
# ███████╗██╗██████╗ ███████╗██╗      ██████╗  ██████╗
# ██╔════╝██║██╔══██╗██╔════╝██║     ██╔═══██╗██╔════╝
# █████╗  ██║██████╔╝█████╗  ██║     ██║   ██║██║  ███╗
# ██╔══╝  ██║██╔══██╗██╔══╝  ██║     ██║   ██║██║   ██║
# ██║     ██║██║  ██║███████╗███████╗╚██████╔╝╚██████╔╝
# ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝  ╚═════╝

require 'firebase'
# $base_uri = 'https://##.firebaseio.com'
puts "Whoah there - put a firebase url in firestore.rb!" if !$base_uri

# $fb_root = Firebase::Client.new($base_uri) # Re-enable if this is used obv

def firelog(data, options={})
  default_options = { priority: 0 }
  options = options.reverse_merge(default_options)
  dd = {
    :time => Time.new.to_i,
    :priority => options[:priority],
    :status => options[:status],
    :data => data.to_s
  }
  response = $fb_root.push("/log/#{Date.today.to_s}", dd)
  #something if response.success? SYNCHRONOUS
end
