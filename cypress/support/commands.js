// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('login', ($email, $password) => {
    cy.get("input#txt-username")
        .clear()
        .type($email)

    cy.get("input#txt-password")
        .clear()
        .type($password, {sensitive : true})

    cy.get('#btn-login').click()
})

Cypress.Commands.add('pickDate', ($objData) => {
    const currentDate = new Date()
    let getMonthNow = currentDate.getMonth + 1

    cy.get("#txt_visit_date").click()

    if($objData.month == getMonthNow && $objData.year == currentDate.getFullYear()){
        cy.get("td.day")
            .not("td.old.day,td.new.day")
            .contains($objData.date)
            .click()
    }else{
        if($objData.year != currentDate.getFullYear()){
            cy.get(".datepicker-days .datepicker-switch").click()
            cy.switchYear($objData)
        }
        else{
            if($objData.month != getMonthNow){
                cy.get(".datepicker-days .datepicker-switch").click()
                cy.get(".datepicker-months td[colspan='7'] :nth-child(" + $objData.month + ")").click()

                cy.get("td.day")
                    .not("td.old.day,td.new.day")
                    .contains($objData.date)
                    .click()
            }
        }
    }

})

Cypress.Commands.add('switchYear', ($objData) => {
    cy.get(".datepicker-months .datepicker-switch").invoke('text').then(($year) => {
        let year = parseInt($year)

        if(year > $objData.year){
            cy.get(".datepicker-months .prev").click()

            cy.wait(800)
            .then(() => {cy.switchYear($objData)})
        }else if(year < $objData.year){
            cy.get(".datepicker-months .next").click()

            cy.wait(800)
            .then(() => {cy.switchYear($objData)})
        }else{
            cy.get(".datepicker-months td[colspan='7'] :nth-child(" + $objData.month + ")").click()

            cy.get("td.day").not("td.old.day,td.new.day")
            .contains($objData.date)
            .click()

        }
    })
})