class Etablissement < ActiveRecord::Base
  belongs_to :dossier
  belongs_to :entreprise

  has_many :exercices, dependent: :destroy

  validates_uniqueness_of :dossier_id

  def geo_adresse
    [numero_voie, type_voie, nom_voie, complement_adresse, code_postal, localite].join(' ')
  end

  def inline_adresse
    #squeeze needed because of space in excess in the data
    "#{numero_voie} #{type_voie} #{nom_voie}, #{complement_adresse}, #{code_postal} #{localite}".squeeze(' ')
  end
end
