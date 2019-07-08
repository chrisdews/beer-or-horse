class HorseQuestion < ApplicationRecord
  belongs_to :horse
  belongs_to :quiz

  def self.createHorseQuestion(quiz)
    random_number = rand(Horse.all.length)
    answer = Horse.find_by_id(random_number)
    @horse_question = HorseQuestion.create(horse_id: answer.id, quiz_id: quiz.id)
  end
end