# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Beer.delete_all
Horse.delete_all
Question.delete_all
Quiz.delete_all
User.delete_all

beer_name = [
    'Oak Aged Ebenezer',
    'Hocus Pocus',
    'Grimbergen Blonde',
    'Winter Warmer',
    'JuJu Ginger',
    'Ultrablonde',
    'Grotten Flemish',
    'Houblon',
    'Jack of Spades',
    'Chazz Cat Rye',
    'Kilt Lifter',
    'Yule Tide',
    'Warka Strong',
    'Penalty Shot',
    'Jeremiah Red',
    'Nutty Brewnette',
    'Bully!',
    'Planet Porter',
    'Old Growler',
    'Super',
    'Monkey Wrench',
    'Old Legover',
    'Session Premium Lager',
    'Nostradamus',
    'Moonraker',
    'Criminally Bad Elf',
    'Double Bastard Ale'
]

horse_name = [
    'A Little Chaos',
    'Aaron Lad',
    'Ace Ventura',
    'Armageddon',
    'Barton Knoll',
    'Battle Of Pembroke',
    'Bay Watch',
    'Be My Sea',
    'Beautiful Gesture',
    'Bee Crossing',
    'Cucklington',
    'Curious Fox',
    'Cyrius Moriviere',
    'Daffy Jane',
    'Dangerous Ends',
    'Dawn Dancer',
    'Driftwood Haze',
    'Drinks Interval',
    'Beer With The Boys',
    'Takbeer',
    'Tales Of The Tweed',
    'Swiss Pride',
    'Surrey Thunder',
    'Sunshine Coast',
    'Sultans Hero',
    'Stars In The Night',
    'Space Oddity',
    'Satchville Flyer',
    'Russian Royale'
]

beer_name.each do |name|
    Beer.create(name: name) 
end

horse_name.each do |name|
    Horse.create(name: name) 
end

testuser = User.create(email: 'test@test.com', name: 'test')

testquiz = Quiz.create(user_id: testuser, score: 0)

testquestion = Question.create(beer_id: 1, horse_id: 1, quiz_id: testquiz)

