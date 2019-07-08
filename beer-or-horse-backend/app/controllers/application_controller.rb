class ApplicationController < ActionController::API
  protect_from_forgery with: :exception
  include SessionsHelper

  before_action :current_user
  helper_method :logged_in?
  helper_method :authorize_user
  helper_method :current_user

  def hello
    redirect_to controller: 'sessions', action: 'new' unless session[:name]
  end

  def current_user
    @user = (User.find_by(id: session[:user_id]) || User.new)
  end

  def logged_in?
    !!session[:user_id]
  end

  def authorize_user
    unless logged_in?
      flash[:notice] = ['You must be logged in to view that page']
      redirect_to login_path
    end
  end
end
