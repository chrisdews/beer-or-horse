class QuizzesController < ApplicationController
  before_action :find_quiz, only: [:show, :edit, :update, :destroy]

  def index
    quizzes = Quiz.all
    render json: quizzes, except: [:updated_at, :created_at]
  end

  def create
    @quiz = Quiz.create quiz_params
    render json: @quiz, except: [:updated_at, :created_at]
  end


  def show
    render json: @quiz, except: [:updated_at, :created_at]
  end

  def update
    @quiz.update quiz_params
    render json: @quiz, except: [:updated_at, :created_at]
  end

  def destroy
  end

  private

  def find_quiz
    @quiz = Quiz.find params[:id]
  end

  def quiz_params
    params.require(:quiz).permit(:id, :user_id, :score)
  end
end
