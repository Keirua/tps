class Pipedrive::PersonAdapter
  PIPEDRIVE_POSTE_ATTRIBUTE_ID = '33a790746f1713d712fe97bcce9ac1ca6374a4d6'
  PIPEDRIVE_SOURCE_ATTRIBUTE_ID = '2fa7864f467ffa97721cbcd08df5a3d591b15f50'
  PIPEDRIVE_ROBOT_ID = '2748449'

  def self.get_demandes_from_persons_owned_by_robot
    Pipedrive::API.get_persons_owned_by_user(PIPEDRIVE_ROBOT_ID).map do |datum|
      {
        person_id: datum['id'],
        nom: datum['name'],
        poste: datum[PIPEDRIVE_POSTE_ATTRIBUTE_ID],
        email: datum.dig('email', 0, 'value'),
        tel: datum.dig('phone', 0, 'value'),
        organisation: datum['org_name']
      }
    end
  end

  def self.update_person_owner(person_id, owner_id)
    params = { owner_id: owner_id }

    Pipedrive::API.put_person(person_id, params)
  end

  def self.add_person(email, phone, name, organization_id, poste, source)
    params = {
      email: email,
      phone: phone,
      name: name,
      org_id: organization_id,
      owner_id: PIPEDRIVE_ROBOT_ID,
      "#{PIPEDRIVE_POSTE_ATTRIBUTE_ID}": poste,
      "#{PIPEDRIVE_SOURCE_ATTRIBUTE_ID}": source
    }

    response = Pipedrive::API.post_person(params)

    JSON.parse(response.body)['data']['id']
  end
end
