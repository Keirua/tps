require 'spec_helper'

feature 'The routing' do
  let(:procedure) { create(:procedure, :with_service, :for_individual) }
  let(:administrateur) { create(:administrateur, procedures: [procedure]) }
  let(:scientifique_user) { create(:user) }
  let(:litteraire_user) { create(:user) }

  before { Flipper.enable_actor(:routage, administrateur.user) }

  scenario 'works' do
    login_as administrateur.user, scope: :user

    visit admin_procedure_path(procedure.id)
    click_on "Groupe d'instructeurs"

    # rename routing criteria to spécialité
    fill_in 'procedure_routing_criteria_name', with: 'spécialité'
    click_on 'Renommer'
    expect(procedure.reload.routing_criteria_name).to eq('spécialité')

    # rename defaut groupe to littéraire
    click_on 'voir'
    fill_in 'groupe_instructeur_label', with: 'littéraire'
    click_on 'Renommer'

    # add victor to littéraire groupe
    fill_in 'instructeur_email', with: 'victor@inst.com'
    perform_enqueued_jobs { click_on 'Affecter' }
    victor = User.find_by(email: 'victor@inst.com').instructeur

    click_on "Groupes d’instructeurs"

    # add scientifique groupe
    fill_in 'groupe_instructeur_label', with: 'scientifique'
    click_on 'Ajouter le groupe'

    # add marie to scientifique groupe
    fill_in 'instructeur_email', with: 'marie@inst.com'
    perform_enqueued_jobs { click_on 'Affecter' }
    marie = User.find_by(email: 'marie@inst.com').instructeur

    # publish
    publish_procedure(procedure)
    log_out

    # 2 users fill a dossier in each group
    user_send_dossier(scientifique_user, 'scientifique')
    user_send_dossier(litteraire_user, 'littéraire')

    # the litteraires instructeurs only manage the litteraires dossiers
    register_instructeur_and_log_in(victor.email)
    click_on procedure.libelle
    expect(page).to have_text(litteraire_user.email)
    expect(page).not_to have_text(scientifique_user.email)

    # the search only show litteraires dossiers
    fill_in 'q', with: scientifique_user.email
    click_on 'Rechercher'
    expect(page).to have_text('0 dossier trouvé')

    fill_in 'q', with: litteraire_user.email
    click_on 'Rechercher'
    expect(page).to have_text('1 dossier trouvé')

    ## and the result is clickable
    click_on litteraire_user.email
    expect(page).to have_current_path(instructeur_dossier_path(procedure, litteraire_user.dossiers.first))

    log_out

    # the scientifiques instructeurs only manage the scientifiques dossiers
    register_instructeur_and_log_in(marie.email)
    click_on procedure.libelle
    expect(page).not_to have_text(litteraire_user.email)
    expect(page).to have_text(scientifique_user.email)
    log_out

    # TODO: notifications tests
  end

  def publish_procedure(procedure)
    click_on procedure.libelle
    find('#publish-procedure').click
    within '#publish-modal' do
      fill_in 'lien_site_web', with: 'http://some.website'
      click_on 'publish'
    end

    expect(page).to have_text('Démarche publiée')
  end

  def user_send_dossier(user, groupe)
    login_as user, scope: :user
    visit commencer_path(path: procedure.reload.path)
    click_on 'Commencer la démarche'

    fill_in 'individual_nom',    with: 'Nom'
    fill_in 'individual_prenom', with: 'Prenom'
    click_button('Continuer')

    select(groupe, from: 'dossier_groupe_instructeur_id')

    click_on 'Déposer le dossier'

    log_out
  end

  def register_instructeur_and_log_in(email)
    confirmation_email = emails_sent_to(email)
      .filter { |m| m.subject == 'Activez votre compte instructeur' }
      .first
    token_params = confirmation_email.body.match(/token=[^"]+/)

    visit "users/activate?#{token_params}"
    fill_in :user_password, with: 'démarches-simplifiées-pwd'

    click_button 'Définir le mot de passe'

    expect(page).to have_content 'Mot de passe enregistré'
  end

  def log_out
    click_on 'Se déconnecter'
  end
end