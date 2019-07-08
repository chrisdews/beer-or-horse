class Question < ApplicationRecord
  belongs_to :beer
  belongs_to :horse
  belongs_to :quiz
end
