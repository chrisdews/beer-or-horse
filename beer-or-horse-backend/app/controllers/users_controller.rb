class UsersController < ApplicationController
  before_action :find_user, only: [:show, :edit, :update, :destroy]

  def index
    @users = User.all
  end

  def create
    @user = User.create user_params
    if @user.valid?
      redirect_to login_path
    else
      flash[:errors] = @user.errors.full_messages
      redirect_to new_user_path
    end
  end

  def new
    @user = User.new
  end

  def edit
  end

  def show
  end

  def update
    @user.update user_params
    redirect_to user_path(@user)
  end

  def destroy
  end

  private

  def find_user
    @user = User.find params[:id]
  end

  def user_params
    params.require(:user).permit(:name, :email, :password)
  end
end
