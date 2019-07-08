class BeerQuestion < ApplicationRecord
  belongs_to :beer
  belongs_to :quiz
end
