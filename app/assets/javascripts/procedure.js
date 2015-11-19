var ready = function () {
    $("#add_type_de_champ_procedure").on('click', function (e) {
        add_new_type_de('champ');
    });

    $("#add_type_de_piece_justificative_procedure").on('click', function (e) {
        add_new_type_de('piece_justificative');
    });

    add_delete_listener_on_click_for_type_de("champ", "#liste_champ .btn-danger");
    add_delete_listener_on_click_for_type_de("champ", "#new_type_de_champ .btn-danger");

    add_delete_listener_on_click_for_type_de("piece_justificative", "#liste_piece_justificative .btn-danger");
    add_delete_listener_on_click_for_type_de("piece_justificative", "#new_type_de_piece_justificative .btn-danger");

    config_up_and_down_button();

    add_action_listener_on_click_for_button_up(".button_up");
    add_action_listener_on_click_for_button_down(".button_down");
};

$(document).ready(ready);
$(document).on('page:load', ready);

function add_delete_listener_on_click_for_type_de(type_libelle, node_id) {
    $(node_id).on('click', function (e) {
        var index = (e.target.id).replace('delete_type_de_' + type_libelle + '_', '').replace('_procedure', '');

        delete_type_de(type_libelle, index);
    });
}

function add_new_type_de(type_libelle) {
    var CHAMPS = 0,
        PJ = 1,
        ERROR = -1;

    if (is_champ_or_pj() == ERROR) return false;

    function is_champ_or_pj() {
        if (type_libelle == 'champ') return CHAMPS;
        else if (type_libelle == 'piece_justificative') return PJ;
        else return ERROR;
    }

    function which_index() {
        return (is_champ_or_pj() == CHAMPS ? types_de_champ_index : types_de_piece_justificative_index)
    }

    $("#liste_" + type_libelle).append($("#type_de_" + type_libelle + "_" + which_index()));
    $("#new_type_de_" + type_libelle).append($("#type_de_" + type_libelle + "_" + which_index()).clone());

    $("#delete_type_de_" + type_libelle + "_" + which_index() + "_button").show();

    if (is_champ_or_pj() == CHAMPS) {
        types_de_champ_index++;
        add_new_type_de_champ_params(which_index());
    }
    else if (is_champ_or_pj() == PJ) {
        types_de_piece_justificative_index++;
        add_new_type_de_piece_justificative_params(which_index());
    }

    $("#new_type_de_" + type_libelle + " .form-inline").attr('id', 'type_de_' + type_libelle + '_' + which_index());

    $("#new_type_de_" + type_libelle + " #id_type_de_" + type_libelle + "").attr('name', 'type_de_' + type_libelle + '[' + which_index() + '][id_type_de_' + type_libelle + ']');
    $("#new_type_de_" + type_libelle + " #id_type_de_" + type_libelle + "").val('');

    $("#new_type_de_" + type_libelle + " #delete").attr('name', 'type_de_' + type_libelle + '[' + which_index() + '][delete]');
    $("#new_type_de_" + type_libelle + " #delete").val('false');

    $("#new_type_de_" + type_libelle + " #delete_type_de_" + type_libelle + "_" + (which_index() - 1) + "_button").attr('id', "delete_type_de_" + type_libelle + "_" + which_index() + "_button");
    $("#new_type_de_" + type_libelle + " #delete_type_de_" + type_libelle + "_" + (which_index() - 1) + "_procedure").attr('id', "delete_type_de_" + type_libelle + "_" + which_index() + "_procedure");

    if (is_champ_or_pj() == CHAMPS)
        add_delete_listener_on_click_for_type_de("champ", "#delete_type_de_champ_" + which_index() + "_procedure");
    else if (is_champ_or_pj() == PJ)
        add_delete_listener_on_click_for_type_de("piece_justificative", "#delete_type_de_piece_justificative_" + which_index() + "_procedure");

    $("#new_type_de_" + type_libelle + " #add_type_de_" + type_libelle + "_button").remove();
    $("#new_type_de_" + type_libelle + " .form-inline").append($("#add_type_de_" + type_libelle + "_button"))

    add_action_listener_on_click_for_button_up("#new_type_de_" + type_libelle + " .button_up")
    add_action_listener_on_click_for_button_down("#new_type_de_" + type_libelle + " .button_down")

    config_up_and_down_button();
}

function add_new_type_de_champ_params() {
    $("#new_type_de_champ #libelle").attr('name', 'type_de_champ[' + types_de_champ_index + '][libelle]');
    $("#new_type_de_champ #libelle").val('');

    $("#new_type_de_champ #description").attr('name', 'type_de_champ[' + types_de_champ_index + '][description]');
    $("#new_type_de_champ #description").val('');

    $("#new_type_de_champ #type_champs").attr('name', 'type_de_champ[' + types_de_champ_index + '][type]');

    $("#new_type_de_champ .order_place").attr('name', 'type_de_champ[' + types_de_champ_index + '][order_place]');
    $("#new_type_de_champ .order_place").val(parseInt($("#liste_champ .order_place").last().val()) + 1);

    $("#new_type_de_champ .order_type_de_champ_button").attr('id', 'order_type_de_champ_' + types_de_champ_index + '_button')
    $("#new_type_de_champ .order_type_de_champ_button .button_up").attr('id', 'order_type_de_champ_' + types_de_champ_index + '_up_procedure')
    $("#new_type_de_champ .order_type_de_champ_button .button_down").attr('id', 'order_type_de_champ_' + types_de_champ_index + '_down_procedure')
}

function add_new_type_de_piece_justificative_params() {
    $("#new_type_de_piece_justificative #libelle").attr('name', 'type_de_piece_justificative[' + types_de_piece_justificative_index + '][libelle]');
    $("#new_type_de_piece_justificative #libelle").val('');

    $("#new_type_de_piece_justificative #description").attr('name', 'type_de_piece_justificative[' + types_de_piece_justificative_index + '][description]');
    $("#new_type_de_piece_justificative #description").val('');
}

function delete_type_de(type_libelle, index) {
    var delete_node = $("#type_de_" + type_libelle + "_" + index).hide();

    $("#liste_delete_" + type_libelle).append(delete_node);
    $("#type_de_" + type_libelle + "_" + index + " #delete").val('true');

    if (type_libelle == 'champ') {
        var next_order_place = parseInt($("#type_de_" + type_libelle + "_" + index + " .order_place").val());
        var type_de_champ_to_change_order_place = $("#liste_champ .order_place");

        type_de_champ_to_change_order_place.each(function () {
            if ($(this).val() > next_order_place) {
                $(this).val(next_order_place++);
            }
        });
        $("#new_type_de_champ .order_place").val(next_order_place);

        config_up_and_down_button();
    }
}

function config_up_and_down_button() {
    if ($("#liste_champ .order_place").size() > 0) {
        var first_index = $("#liste_champ .order_place").first()
            .attr('name')
            .replace('type_de_champ[', '')
            .replace('][order_place]', '');

        var last_index = $("#liste_champ .order_place").last()
            .attr('name')
            .replace('type_de_champ[', '')
            .replace('][order_place]', '');

        $(".button_up").show();
        $(".button_down").show();
        $("#liste_champ .order_type_de_champ_button").show();

        $("#order_type_de_champ_" + first_index + "_up_procedure").hide();
        $("#order_type_de_champ_" + last_index + "_down_procedure").hide();
    }
}

function add_action_listener_on_click_for_button_up(node_id) {
    $(node_id).on('click', function (e) {
        var index = (e.target.id).replace('order_type_de_champ_', '').replace('_up_procedure', '');
        var order_place = parseInt($("#type_de_champ_" + index + " .order_place").val());
        var order_place_before = order_place - 1;

        var node_before = $("input[class='order_place'][value='" + order_place_before + "']").parent();

        var index_before = (node_before.attr('id')).replace('type_de_champ_', '');

        $("#type_de_champ_" + index).insertBefore("#type_de_champ_" + index_before);
        $("#type_de_champ_" + index_before);

        $("#type_de_champ_" + index_before + " .order_place").val(order_place);
        $("#type_de_champ_" + index + " .order_place").val(order_place_before);

        config_up_and_down_button();
    });
}

function add_action_listener_on_click_for_button_down(node_id) {
    $(node_id).on('click', function (e) {
        var index = (e.target.id).replace('order_type_de_champ_', '').replace('_down_procedure', '');
        var order_place = parseInt($("#type_de_champ_" + index + " .order_place").val());
        var order_place_after = order_place + 1;

        var node_after = $("input[class='order_place'][value='" + order_place_after + "']").parent();

        var index_after = (node_after.attr('id')).replace('type_de_champ_', '');

        $("#type_de_champ_" + index).insertAfter("#type_de_champ_" + index_after);
        $("#type_de_champ_" + index_after);

        $("#type_de_champ_" + index_after + " .order_place").val(order_place);
        $("#type_de_champ_" + index + " .order_place").val(order_place_after);

        config_up_and_down_button();
    });
}
