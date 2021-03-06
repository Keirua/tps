class ProcedureSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attribute :libelle, key: :label

  attributes :id,
    :description,
    :organisation,
    :direction,
    :archived_at,
    :geographic_information,
    :total_dossier,
    :link,
    :state

  has_one :geographic_information, serializer: ModuleApiCartoSerializer
  has_many :types_de_champ, serializer: TypeDeChampSerializer
  has_many :types_de_champ_private, serializer: TypeDeChampSerializer
  has_many :types_de_piece_justificative

  def archived_at
    object.archived_at&.in_time_zone('UTC')
  end

  def link
    if object.path.present?
      if object.brouillon_avec_lien?
        commencer_test_url(path: object.path)
      else
        commencer_url(path: object.path)
      end
    end
  end

  def state
    object.aasm_state
  end

  def geographic_information
    if object.expose_legacy_carto_api?
      object.module_api_carto
    else
      ModuleAPICarto.new(procedure: object)
    end
  end

  def types_de_champ
    object.types_de_champ.reject { |c| c.old_pj.present? }
  end

  def types_de_piece_justificative
    ActiveModelSerializers::SerializableResource.new(object.types_de_piece_justificative).serializable_hash +
      PiecesJustificativesService.serialize_types_de_champ_as_type_pj(object)
  end
end
