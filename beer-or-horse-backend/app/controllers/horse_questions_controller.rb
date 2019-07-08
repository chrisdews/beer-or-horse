class HorseQuestionsController < ApplicationController
  def index
    @horse_questions = HorseQuestion.all
    render json: @horse_questions, except: [:created_at, :updated_at]
  end

  def create
    # pull a random horse
    quiz = Quiz.find_by(id: params[:quiz])
    horse_question = HorseQuestion.createHorseQuestion(quiz)
    render json: horse_question, except: [:created_at, :updated_at]
  end
end