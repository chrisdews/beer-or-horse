class HorseQuestionsController < ApplicationController

  def index
    @questions = Question.all
    render json: @questions, except: [:created_at, :updated_at]
  end

  def create
    quiz_id = quiz_id
    random = [0, 1].sample
    if random == 0
      # pull a random beer
      random_number = rand(Beer.all.length) + 1
      answer = Beer.find_by_id(random_number)
      @question = Question.create(beer_id: answer.id, horse_id: 1)

    else
      # pull a random horse
      random_number = rand(Horse.all.length) + 1
      answer = Horse.find_by_id(random_number)
      @question = Question.create(horse_id: answer.id, beer_id: 1)
    end
  end
end