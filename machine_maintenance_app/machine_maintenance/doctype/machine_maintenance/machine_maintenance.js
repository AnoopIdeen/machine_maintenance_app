// Copyright (c) 2025, Anoop and contributors
// For license information, please see license.txt

frappe.ui.form.on("Machine Maintenance", {
    onload: function (frm) {
        if (frm.is_new()) {
            // frm.set_value('maintenance_date', frappe.datetime.get_today());
            frm.doc.maintenance_date = frappe.datetime.get_today();
            frm.refresh_field('maintenance_date');
        }
    },
    refresh(frm) {
        // frm.trigger("show_notes")

        if (frm.doc.status === 'Scheduled') {
            // frm.toggle_display('notes', false);
            frm.set_df_property('notes', 'hidden', true);
        } else {
            // frm.toggle_display('notes', true);
            frm.set_df_property('notes', 'hidden', false);

        }
    },
    show_notes(frm) {
        // if (this.frm.doc.docstatus == 1) return;

        const crm_notes = new erpnext.utils.CRMNotes({
            frm: frm,
            notes_wrapper: $(frm.fields_dict.notes_html.wrapper),
        });
        crm_notes.refresh();
    }
});
frappe.ui.form.on('Parts Used', {
    quantity: function (frm, cdt, cdn) { compute_amount(frm, cdt, cdn); },
    rate: function (frm, cdt, cdn) { compute_amount(frm, cdt, cdn); },
});
function compute_amount(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    let qty = flt(row.quantity, 1);
    let rate = flt(row.rate, 2);
    let amt = qty * rate;
    row.amount = amt;
    row.currency = frm.doc.currency
    frm.refresh_field("parts_used");
    let cost = 0
    frm.doc.parts_used.forEach(element => {
        cost += element.amount
    });
    frm.doc.cost = cost
    frm.refresh()
}