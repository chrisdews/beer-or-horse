class HorseQuestion < ApplicationRecord
  belongs_to :horse
  belongs_to :quiz
end
