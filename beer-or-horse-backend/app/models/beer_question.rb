class BeerQuestion < ApplicationRecord
  belongs_to :beer
  belongs_to :quiz

  def self.createBeerQuestion(quiz)
    random_number = rand(Beer.all.length)
    answer = Beer.find_by_id(random_number)
    @beer_question = BeerQuestion.create(beer_id: answer.id, quiz_id: quiz.id)
  end

end
