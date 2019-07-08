class BeerQuestionsController < ApplicationController
  def index
    @beer_questions = BeerQuestion.all
    render json: @beer_questions, except: [:created_at, :updated_at]
  end

  def create
    # pull a random beer
    quiz = Quiz.find_by(id: params[:quiz])
    beer_question = BeerQuestion.createBeerQuestion(quiz)
    render json: beer_question, except: [:created_at, :updated_at]
  end
end
