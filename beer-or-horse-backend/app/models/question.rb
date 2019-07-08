class Question < ApplicationRecord
  belongs_to :beer
  belongs_to :horse
  belongs_to :quiz

  def create
    random = [0, 1].sample
    if random == 0
      # pull a random beer
      question.beer = Beer.order('RANDOM()').first
    else
      # pull a random horse
      question.horse = Horse.order('RANDOM()').first
    end
  end



    # trainer = Trainer.find_by(id: params[:trainer])
    # pokemon = Pokemon.createPokemon(trainer)
    # if pokemon
    #     render json: pokemon, only: [:id, :species, :nickname, :trainer_id]
    # else
    #     render :json => { :error => 'oh no' }
    # end
end
